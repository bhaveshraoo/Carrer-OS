import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { autoExpireJobs, FALLBACK_JOBS } from "@/lib/jobs/jobs";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await autoExpireJobs(supabase);

    const { data: rawWishlists, error } = await (supabase as any)
      .from("job_wishlists")
      .select(`
        job_id,
        swiped_at,
        job:jobs(
          *,
          company:companies(id, name, slug, logo_url, metadata)
        )
      `)
      .eq("user_id", user.id)
      .order("swiped_at", { ascending: false });

    // Fetch user's company targets
    let targetedCompanyIds = new Set<string>();
    try {
      const { data: targets } = await table(supabase, "user_company_targets")
        .select("company_id")
        .eq("user_id", user.id);
      if (targets) {
        targetedCompanyIds = new Set(targets.map((t: any) => t.company_id));
      }
    } catch {
      // Ignore
    }

    if (error || !rawWishlists) {
      console.warn("Notice: Error or missing job_wishlists table, fallback to empty array");
      return NextResponse.json({ success: true, wishlist: [] });
    }

    const fallbackMap = new Map(FALLBACK_JOBS.map((j) => [j.id, j]));

    const wishlistedJobs = rawWishlists.map((w: any) => {
      if (w.job) {
        const j = w.job;
        const company = j.company || {};
        const metadata = company.metadata || {};
        const tier = metadata.tier || metadata.industry || "Product";

        return {
          id: j.id,
          company_id: j.company_id,
          company_name: company.name || "Unknown Company",
          company_slug: company.slug || "unknown",
          company_logo_url: company.logo_url || null,
          company_tier: tier,
          role: j.role,
          description: j.description,
          domain: j.domain,
          location: j.location,
          ctc_range: j.ctc_range,
          tech_stack: j.tech_stack || [],
          interview_types: j.interview_types || [],
          application_url: j.application_url,
          last_date: j.last_date,
          status: j.status,
          created_at: j.created_at,
          swiped_at: w.swiped_at,
          is_wishlisted: true,
          is_company_targeted: targetedCompanyIds.has(j.company_id),
        };
      }

      // Check fallback map
      const fb = fallbackMap.get(w.job_id);
      if (fb) {
        return {
          ...fb,
          swiped_at: w.swiped_at,
          is_wishlisted: true,
          is_company_targeted: targetedCompanyIds.has(fb.company_id),
        };
      }

      return null;
    }).filter(Boolean);

    return NextResponse.json({
      success: true,
      wishlist: wishlistedJobs,
    });
  } catch (error) {
    console.error("GET /api/jobs/wishlist error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json({ success: false, error: "Missing jobId" }, { status: 400 });
    }

    try {
      await (supabase as any)
        .from("job_wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("job_id", jobId);
    } catch {
      // Ignore if table not created
    }

    return NextResponse.json({ success: true, message: "Removed from Wishlist" });
  } catch (error) {
    console.error("DELETE /api/jobs/wishlist error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
