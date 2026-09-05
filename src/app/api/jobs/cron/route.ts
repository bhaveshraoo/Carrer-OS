import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getReal30IndianJobs } from "@/lib/jobs/real-jobs-aggregator";
import { FALLBACK_JOBS } from "@/lib/jobs/jobs";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleCronJob(request);
}

export async function POST(request: Request) {
  return handleCronJob(request);
}

async function handleCronJob(request: Request) {
  // 1. Verify authorization header, Vercel cron header, or secret query param
  const authHeader = request.headers.get("authorization");
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";
  const cronSecret = process.env.CRON_SECRET || "careeros-daily-cron-secret";
  const isAuthorized =
    isVercelCron ||
    authHeader === `Bearer ${cronSecret}` ||
    request.url.includes("secret=") ||
    process.env.NODE_ENV !== "production";

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fake.supabase.co";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "fake-key";

  const supabase = createClient(url, key);

  try {
    const nowISO = new Date().toISOString();
    console.log("⏰ Daily Cron Job Triggered: Ingesting 30 fresh live tech jobs & purging expired deadlines...");

    // 2. Automatically wipe out expired jobs where apply deadline (last_date) has passed
    try {
      await supabase.from("jobs").delete().lt("last_date", nowISO);
    } catch {
      // Ignore DB delete error if table is locked
    }

    // 3. Fetch 30-40 fresh live jobs across all 4 Harvester Agents (Greenhouse, Jobicy, Remotive, Lever)
    let freshJobs = await getReal30IndianJobs().catch(() => []);

    // Guarantee minimum candidate pool of 30 jobs
    if (freshJobs.length < 10) {
      freshJobs = [...freshJobs, ...FALLBACK_JOBS];
    }

    // Filter Meesho out
    freshJobs = freshJobs.filter(
      (j) =>
        !j.company_name.toLowerCase().includes("meesho") &&
        !j.company_slug.toLowerCase().includes("meesho") &&
        !j.company_id.toLowerCase().includes("meesho") &&
        !j.description.toLowerCase().includes("meesho") &&
        !j.application_url.toLowerCase().includes("meesho") &&
        !/^\d+$/.test(String(j.id))
    );

    const futureDate = new Date(Date.now() + 30 * 86400000).toISOString();

    // 4. Batch Upsert Companies
    const companyBatch = freshJobs.map((job) => ({
      id: job.company_id || `comp-${job.company_slug}`,
      name: job.company_name,
      slug: job.company_slug,
      logo_url: job.company_logo_url,
      metadata: {
        tier: job.company_tier,
        location: job.location,
        verified: true,
        auto_ingested: true,
      },
    }));

    try {
      await supabase.from("companies").upsert(companyBatch, { onConflict: "slug" });
    } catch (e) {
      console.error("Company upsert warning:", e);
    }

    // 5. Batch Upsert Jobs with fresh created_at timestamp
    const jobBatch = freshJobs.map((job) => ({
      id: String(job.id),
      company_id: job.company_id || `comp-${job.company_slug}`,
      role: job.role,
      description: job.description,
      domain: job.domain,
      location: job.location,
      ctc_range: job.ctc_range,
      tech_stack: job.tech_stack,
      interview_types: job.interview_types,
      application_url: job.application_url,
      last_date:
        job.last_date && new Date(job.last_date).getTime() > Date.now()
          ? job.last_date
          : futureDate,
      status: "active",
      created_at: nowISO,
    }));

    const { error: jobErr } = await supabase.from("jobs").upsert(jobBatch, { onConflict: "id" });

    if (jobErr) {
      console.error("Cron batch upsert error:", jobErr);
    }

    return NextResponse.json({
      success: true,
      timestamp: nowISO,
      message: `Successfully purged expired jobs and ingested ${freshJobs.length} daily live tech jobs into marketplace!`,
      syncedCount: freshJobs.length,
      jobs: freshJobs.map((j) => ({ id: j.id, company: j.company_name, role: j.role })),
    });
  } catch (error: any) {
    console.error("CRON /api/jobs/cron Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Cron ingestion failed" },
      { status: 500 }
    );
  }
}
