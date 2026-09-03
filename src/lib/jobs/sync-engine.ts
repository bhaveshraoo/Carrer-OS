import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getReal30IndianJobs } from "./real-jobs-aggregator";
import { type JobWithCompany } from "./jobs";

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
 * 2. If DB is empty, loads live aggregated jobs and asynchronously seeds DB in background batch (0ms blocking delay).
 * 3. Correctly matches `job_wishlists` and `user_company_targets` table names.
 */
export async function syncAndFetchSupabaseJobs(
  userClient: SupabaseClient,
  userId?: string
): Promise<JobWithCompany[]> {
  const adminClient = getAdminSupabaseClient(userClient);
  const nowISO = new Date().toISOString();

  // 1. Fetch user wishlists & targeted company IDs in parallel with active jobs
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
      // Ignore if table queries fail
    }
  }

  // 2. Query active non-expired jobs from Supabase DB
  try {
    const { data: dbJobs, error } = await userClient
      .from("jobs")
      .select(`
        *,
        company:companies(id, name, slug, logo_url, metadata)
      `)
      .eq("status", "active")
      .gte("last_date", nowISO)
      .order("created_at", { ascending: false });

    if (!error && dbJobs && dbJobs.length >= 15) {
      const uniqueCompanies = new Set(dbJobs.map((j: any) => j.company?.name || j.company_name)).size;
      // If DB has at least 4 diverse companies, serve DB records. Otherwise, trigger multi-agent fresh fetch below!
      if (uniqueCompanies >= 4) {
        return dbJobs.map((j: any) => {
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

  // 3. Fallback to 30 Live Aggregated Jobs (Lever + Greenhouse + Remotive)
  const freshApiJobs = await getReal30IndianJobs();

  // Asynchronously seed/upsert jobs to Supabase DB in background batch without blocking client request
  if (freshApiJobs.length > 0) {
    (async () => {
      try {
        // Purge legacy numeric fallback IDs 1..35 from DB
        const legacyIds = Array.from({ length: 35 }, (_, i) => String(i + 1));
        await adminClient.from("jobs").delete().in("id", legacyIds);
        const companyBatch = freshApiJobs.map((job) => ({
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

        const jobBatch = freshApiJobs.map((job) => ({
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

  return freshApiJobs.map((j) => ({
    ...j,
    created_at: nowISO,
    is_wishlisted: wishlistedJobIds.has(j.id),
    is_company_targeted: targetedCompanyIds.has(j.company_id),
  }));
}
