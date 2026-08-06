import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchActiveJobsWithDetails } from "@/lib/jobs/jobs";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const jobs = await fetchActiveJobsWithDetails(supabase, user?.id);

    return NextResponse.json({
      success: true,
      jobs,
      count: jobs.length,
    });
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
