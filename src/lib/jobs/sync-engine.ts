import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getReal30IndianJobs } from "./real-jobs-aggregator";
import { FALLBACK_JOBS, type JobWithCompany } from "./jobs";

/**
 * Gets an Admin Supabase Client using SUPABASE_SERVICE_ROLE_KEY if available
 * to bypass RLS for inserting and deleting jobs across company career pages.
 */
function getAdminSupabaseClient(fallbackClient: SupabaseClient): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && serviceKey) {
    return createClient(url, serviceKey);
  }
  return fallbackClient;
}

/**
 * Fast Job Fetch & Background Sync Engine:
 * 1. Parallel fetches wishlists, target companies, and active jobs from Supabase DB.
 * 2. If DB contains single-company clusters, streams capped multi-company jobs & seeds DB.
 */
export async function syncAndFetchSupabaseJobs(
  userClient: SupabaseClient,
  userId?: string
): Promise<JobWithCompany[]> {
  const adminClient = getAdminSupabaseClient(userClient);
  const nowISO = new Date().toISOString();

  // 1. Fetch user wishlists & targeted company IDs
  let wishlistedJobIds = new Set<string>();
  let targetedCompanyIds = new Set<string>();

  if (userId) {
    try {
      const [wishlistsRes, targetsRes] = await Promise.all([
        userClient.from("job_wishlists").select("job_id").eq("user_id", userId),
        userClient.from("user_company_targets").select("company_id").eq("user_id", userId),
      ]);

      if (wishlistsRes.data) {
        wishlistedJobIds = new Set(wishlistsRes.data.map((w: any) => w.job_id));
      }
      if (targetsRes.data) {
        targetedCompanyIds = new Set(targetsRes.data.map((t: any) => t.company_id));
      }
    } catch {
      // Ignore if wishlist queries fail
    }
  }

  // 2. Query active non-expired jobs from Supabase DB
  try {
    const { data: rawDbJobs, error } = await userClient
      .from("jobs")
      .select(`
        *,
        company:companies(id, name, slug, logo_url, metadata)
      `)
      .eq("status", "active")
      .gte("last_date", nowISO)
      .order("created_at", { ascending: false });

    // Filter out legacy numeric string IDs ("1", "2", ..., "35")
    const dbJobs = (rawDbJobs || []).filter((j: any) => !/^\d+$/.test(String(j.id)));

    if (!error && dbJobs && dbJobs.length >= 10) {
      const uniqueCompanies = new Set(dbJobs.map((j: any) => j.company?.name || j.company_name)).size;
      const top10Companies = new Set(dbJobs.slice(0, 10).map((j: any) => j.company?.name || j.company_name)).size;

      // If DB has at least 4 diverse companies AND the top 10 items contain at least 3 distinct companies, serve DB records.
      if (uniqueCompanies >= 4 && top10Companies >= 3) {
        const companyGroupMap = new Map<string, any[]>();
        for (const j of dbJobs) {
          const cName = j.company?.name || j.company_name || "Company";
          const list = companyGroupMap.get(cName) || [];
          list.push(j);
          companyGroupMap.set(cName, list);
        }

        const interleavedDbJobs: any[] = [];
        let added = true;
        let rIdx = 0;
        while (added) {
          added = false;
          for (const list of companyGroupMap.values()) {
            if (rIdx < list.length) {
              interleavedDbJobs.push(list[rIdx]);
              added = true;
            }
          }
          rIdx++;
        }

        return interleavedDbJobs.map((j: any) => {
          const company = j.company || {};
          const metadata = company.metadata || {};
          const tier = metadata.tier || metadata.industry || "Product";

          return {
            id: j.id,
            company_id: j.company_id,
            company_name: company.name || j.company_name || "Company",
            company_slug: company.slug || "company",
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
            is_wishlisted: wishlistedJobIds.has(j.id),
            is_company_targeted: targetedCompanyIds.has(j.company_id),
          };
        });
      }
    }
  } catch (err) {
    // Fallback below
  }

  // 3. Stream multi-agent jobs with strict per-company caps (Max 2 roles per company)
  const rawApiJobs = await getReal30IndianJobs();
  const companyCounts = new Map<string, number>();
  const cappedApiJobs: JobWithCompany[] = [];

  for (const j of rawApiJobs) {
    const cName = j.company_name || j.company_slug || "Company";
    const count = companyCounts.get(cName) || 0;
    if (count < 2) {
      companyCounts.set(cName, count + 1);
      cappedApiJobs.push(j);
    }
  }

  // If capped list is below 15 items, fill with diverse preset FALLBACK_JOBS (TCS, Infosys, Google, Microsoft, Stripe)
  if (cappedApiJobs.length < 15) {
    for (const fj of FALLBACK_JOBS) {
      const cName = fj.company_name;
      const count = companyCounts.get(cName) || 0;
      if (count < 2) {
        companyCounts.set(cName, count + 1);
        cappedApiJobs.push(fj);
      }
    }
  }

  // Asynchronously seed/upsert jobs to Supabase DB in background batch
  if (cappedApiJobs.length > 0) {
    (async () => {
      try {
        const companyBatch = cappedApiJobs.map((job) => ({
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

        await adminClient.from("companies").upsert(companyBatch, { onConflict: "slug" });

        const jobBatch = cappedApiJobs.map((job) => ({
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

        await adminClient.from("jobs").upsert(jobBatch, { onConflict: "id" });
      } catch (err) {
        // Background sync catch
      }
    })();
  }

  return cappedApiJobs.map((j) => ({
    ...j,
    created_at: nowISO,
    is_wishlisted: wishlistedJobIds.has(j.id),
    is_company_targeted: targetedCompanyIds.has(j.company_id),
  }));
}
