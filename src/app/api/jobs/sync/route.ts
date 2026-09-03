import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getReal30IndianJobs } from "@/lib/jobs/real-jobs-aggregator";

export async function POST() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      return NextResponse.json({ error: "Missing Supabase credentials" }, { status: 500 });
    }

    const supabase = createClient(url, serviceKey);

    // Fetch 30-40 fresh live jobs across all 4 Harvester Agents (Greenhouse, Jobicy, Remotive, Lever)
    const freshJobs = await getReal30IndianJobs();

    if (freshJobs.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No new jobs found from external sources",
        dbSyncCount: 0,
      });
    }

    // 1. Wipe out stale old single-company jobs from DB
    const nowISO = new Date().toISOString();
    await supabase.from("jobs").delete().lt("last_date", nowISO);

    // 2. Batch Upsert Companies
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

    // 3. Batch Upsert Jobs
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
      console.error("Sync batch upsert error:", jobErr);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${freshJobs.length} live jobs across Roblox, Databricks, Rubrik, Stripe, Coinbase, Jobicy & Remotive!`,
      dbSyncCount: freshJobs.length,
      jobs: freshJobs,
    });
  } catch (error: any) {
    console.error("POST /api/jobs/sync error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to sync multi-source jobs" }, { status: 500 });
  }
}
