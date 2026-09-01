import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getReal30IndianJobs } from "@/lib/jobs/real-jobs-aggregator";

export async function GET(request: Request) {
  // Verify authorization header for Vercel Cron or secret key
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "careeros-daily-cron-secret";

  if (authHeader !== `Bearer ${cronSecret}` && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json({ error: "Missing Supabase credentials" }, { status: 500 });
  }

  const supabase = createClient(url, serviceKey);

  try {
    const nowISO = new Date().toISOString();
    console.log("⏰ Daily Cron Job Triggered: Ingesting fresh 30-40 live tech jobs & purging expired deadlines...");

    // 1. Automatically wipe out expired jobs from DB where apply deadline (last_date) has passed
    await supabase.from("jobs").delete().lt("last_date", nowISO);

    // 2. Fetch 30-40 fresh live jobs across all 4 Harvester Agents (Greenhouse, Jobicy, Remotive, Lever)
    const freshJobs = await getReal30IndianJobs();

    if (freshJobs.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Cron completed: 0 new jobs returned",
        syncedCount: 0,
      });
    }

    // 3. Batch Upsert Companies
    const companyBatch = freshJobs.map((job) => ({
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

    await supabase.from("companies").upsert(companyBatch, { onConflict: "slug" });

    // 4. Batch Upsert Jobs with fresh created_at timestamp
    const jobBatch = freshJobs.map((job) => ({
      id: job.id,
      company_id: job.company_id,
      role: job.role,
      description: job.description,
      domain: job.domain,
      location: job.location,
      ctc_range: job.ctc_range,
      tech_stack: job.tech_stack,
      interview_types: job.interview_types,
      application_url: job.application_url,
      last_date: job.last_date,
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
      totalFetched: freshJobs.length,
    });
  } catch (error: any) {
    console.error("CRON /api/jobs/cron Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Cron ingestion failed" }, { status: 500 });
  }
}
