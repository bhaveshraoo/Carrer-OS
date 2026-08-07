import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncAndFetchSupabaseJobs } from "@/lib/jobs/sync-engine";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const jobs = await syncAndFetchSupabaseJobs(supabase, user?.id);

    const uniqueCompanies = new Set(jobs.map((j) => j.company_id || j.company_name)).size;
    const internships = jobs.filter(
      (j) =>
        j.role.toLowerCase().includes("intern") ||
        j.domain.toLowerCase().includes("intern") ||
        j.description.toLowerCase().includes("intern")
    ).length;

    return NextResponse.json({
      success: true,
      jobs,
      count: jobs.length,
      stats: {
        totalJobs: jobs.length,
        totalCompanies: uniqueCompanies,
        totalInternships: internships,
        lastUpdated: "Just now",
      },
    });
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
