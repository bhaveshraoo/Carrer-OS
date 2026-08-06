import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { getReal30IndianJobs } from "../src/lib/jobs/real-jobs-aggregator";

config({ path: ".env.local" });

if (typeof globalThis.WebSocket === "undefined") {
  (globalThis as any).WebSocket = class DummyWebSocket {};
}

async function runDailySync() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error("❌ Missing Supabase environment variables in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey);

  console.log("🇮🇳 [DAILY SYNC] Fetching 30 real Indian tech jobs (10 Lever + 10 Greenhouse + 10 Remotive)...");

  const jobs = await getReal30IndianJobs();
  console.log(`✨ Received and AI-enriched ${jobs.length} real jobs!`);

  // Expire past deadline jobs
  const nowStr = new Date().toISOString();
  await supabase.from("jobs").update({ status: "expired" }).lt("last_date", nowStr);

  let successCount = 0;

  for (const job of jobs) {
    try {
      const { data: comp } = await supabase
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

      const compId = comp?.id || job.company_id;

      const { error } = await supabase.from("jobs").upsert(
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

      if (!error) {
        successCount++;
        console.log(`✅ [Job #${job.id}] ${job.role} @ ${job.company_name} (${job.location})`);
      }
    } catch (err) {
      // Ignore single item error
    }
  }

  console.log(`\n🎉 Daily sync complete! ${jobs.length} jobs processed (${successCount} active in DB).`);
}

runDailySync();
