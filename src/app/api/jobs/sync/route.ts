import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchAllIndianJobs } from "@/lib/jobs/multi-source";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Fetch 15 Lever + 15 Greenhouse + 15 Remotive Indian Jobs
    const { jobs, sources } = await fetchAllIndianJobs();

    if (jobs.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No new jobs found from external sources",
        dbSyncCount: 0,
      });
    }

    // 1. Batch Upsert Companies
    const companyBatch = jobs.map((job) => ({
      name: job.company_name,
      slug: job.company_slug,
      logo_url: job.company_logo_url,
      metadata: {
        tier: job.company_tier,
        industry: "Technology",
        verified: true,
        location: job.location,
      },
    }));

    await (supabase as any)
      .from("companies")
      .upsert(companyBatch, { onConflict: "slug" });

    // 2. Batch Upsert Jobs
    const jobBatch = jobs.map((job) => ({
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
      created_at: job.created_at,
    }));

    await (supabase as any)
      .from("jobs")
      .upsert(jobBatch, { onConflict: "id" });

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${jobs.length} Indian jobs (Lever, Greenhouse, Remotive)`,
      sources,
      dbSyncCount: jobs.length,
      jobs,
    });
  } catch (error: any) {
    console.error("POST /api/jobs/sync error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to sync multi-source jobs" }, { status: 500 });
  }
}
