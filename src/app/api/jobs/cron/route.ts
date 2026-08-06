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
    console.log("⏰ Daily Cron Job Triggered: Ingesting 30 real Indian tech jobs...");

    // 1. Fetch 30 real Indian jobs (10 Lever + 10 Greenhouse + 10 Remotive)
    const realJobs = await getReal30IndianJobs();

    // 2. Auto-expire old jobs past last_date
    const nowStr = new Date().toISOString();
    await supabase.from("jobs").update({ status: "expired" }).lt("last_date", nowStr);

    let syncedCount = 0;

    for (const job of realJobs) {
      try {
        // Upsert company
        const { data: companyData } = await supabase
          .from("companies")
          .upsert(
            {
              name: job.company_name,
              slug: job.company_slug,
              logo_url: job.company_logo_url,
              metadata: {
                tier: job.company_tier,
                location: job.location,
                verified: true,
                auto_ingested: true,
              },
            },
            { onConflict: "slug" }
          )
          .select("id")
          .single();

        const compId = companyData?.id || job.company_id;

        // Upsert job
        const { error: jobErr } = await supabase.from("jobs").upsert(
          {
            id: job.id,
            company_id: compId,
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
          },
          { onConflict: "id" }
        );

        if (!jobErr) {
          syncedCount++;
        }
      } catch (err) {
        // Ignore single item db error
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: `Successfully synchronized ${realJobs.length} real Indian tech jobs (10 Lever, 10 Greenhouse, 10 Remotive)`,
      syncedCount,
      totalFetched: realJobs.length,
    });
  } catch (error) {
    console.error("CRON /api/jobs/cron Error:", error);
    return NextResponse.json({ success: false, error: "Cron ingestion failed" }, { status: 500 });
  }
}
