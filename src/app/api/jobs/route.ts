import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { syncAndFetchSupabaseJobs } from "@/lib/jobs/sync-engine";

export const dynamic = "force-dynamic";
export const runtime = "edge";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fake.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "fake-key";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const rawJobs = await syncAndFetchSupabaseJobs(supabase);

    // Bulletproof API Guard: Strictly filter out any Meesho or legacy numeric IDs
    const jobs = rawJobs.filter(
      (j) =>
        !j.company_name.toLowerCase().includes("meesho") &&
        !j.company_slug.toLowerCase().includes("meesho") &&
        !j.company_id.toLowerCase().includes("meesho") &&
        !j.description.toLowerCase().includes("meesho") &&
        !j.application_url.toLowerCase().includes("meesho") &&
        !/^\d+$/.test(String(j.id))
    );

    const uniqueCompanies = new Set(jobs.map((j) => j.company_id || j.company_name)).size;
    const internships = jobs.filter(
      (j) =>
        j.role.toLowerCase().includes("intern") ||
        j.domain.toLowerCase().includes("intern") ||
        j.description.toLowerCase().includes("intern")
    ).length;

    return NextResponse.json(
      {
        success: true,
        jobs,
        count: jobs.length,
        stats: {
          totalJobs: jobs.length,
          totalCompanies: uniqueCompanies,
          totalInternships: internships,
          lastUpdated: "Just now",
        },
        build_version: "v10-pure-edge-runtime",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "X-CareerOS-Build": "v10-pure-edge-runtime",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
