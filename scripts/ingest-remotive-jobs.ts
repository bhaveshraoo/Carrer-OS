import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { fetchAndEnrichRemotiveJobs } from "../src/lib/jobs/remotive";

config({ path: ".env.local" });

if (typeof globalThis.WebSocket === "undefined") {
  (globalThis as any).WebSocket = class DummyWebSocket {};
}

async function runIngestion() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey);
  console.log("🌐 Fetching real tech jobs from Remotive API & running AI enrichment...");

  const jobs = await fetchAndEnrichRemotiveJobs(15);
  console.log(`✨ Received and AI-enriched ${jobs.length} real jobs from Remotive!`);

  let dbSuccessCount = 0;
  for (const job of jobs) {
    try {
      const { data: comp } = await supabase
        .from("companies")
        .upsert({
          name: job.company_name,
          slug: job.company_slug,
          logo_url: job.company_logo_url,
          metadata: {
            tier: job.company_tier,
            verified: true,
            remotive_source: true,
          },
        })
        .select("id")
        .single();

      if (comp) {
        const { error } = await supabase.from("jobs").upsert({
          company_id: comp.id,
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
        });

        if (!error) {
          dbSuccessCount++;
          console.log(`✅ Persisted job: ${job.role} @ ${job.company_name}`);
        }
      }
    } catch (e) {
      console.warn(`Notice for ${job.role}:`, e);
    }
  }

  console.log(`\n🎉 Ingestion complete! ${jobs.length} jobs fetched and AI-enriched (${dbSuccessCount} saved to database).`);
}

runIngestion();
