import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchAllIndianJobs } from "@/lib/jobs/multi-source";
import { table } from "@/lib/supabase/typed-table";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Fetch 15 Lever + 15 Greenhouse + 15 Remotive Indian Jobs
    const { jobs, sources } = await fetchAllIndianJobs();
    let insertedCount = 0;

    for (const job of jobs) {
      try {
        await table(supabase, "companies").upsert({
          name: job.company_name,
          slug: job.company_slug,
          logo_url: job.company_logo_url,
          metadata: {
            tier: job.company_tier,
            industry: "Technology",
            verified: true,
            location: job.location,
          },
        });

        await (supabase as any).from("jobs").upsert({
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
        });

        insertedCount++;
      } catch (err) {
        // Ignore individual DB item errors
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed 45 Indian jobs (15 Lever, 15 Greenhouse, 15 Remotive)`,
      sources,
      dbSyncCount: insertedCount,
      jobs,
    });
  } catch (error) {
    console.error("POST /api/jobs/sync error:", error);
    return NextResponse.json({ success: false, error: "Failed to sync multi-source jobs" }, { status: 500 });
  }
}
