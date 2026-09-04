import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getReal30IndianJobs } from "./real-jobs-aggregator";
import { FALLBACK_JOBS, type JobWithCompany } from "./jobs";

/**
 * Gets an Admin Supabase Client using SUPABASE_SERVICE_ROLE_KEY if available
 * to bypass RLS for inserting and deleting jobs across company career pages.
 */
function getAdminSupabaseClient(fallbackClient: SupabaseClient): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && serviceKey) {
    return createClient(url, serviceKey);
  }
  return fallbackClient;
}

/**
 * Round-robin interleave helper so adjacent job cards in the UI always alternate company names.
 */
function interleaveByCompany(jobsList: JobWithCompany[]): JobWithCompany[] {
  const companyMap = new Map<string, JobWithCompany[]>();

  for (const j of jobsList) {
    const cName = (j.company_name || j.company_slug || "Company").toLowerCase();
    const list = companyMap.get(cName) || [];
    list.push(j);
    companyMap.set(cName, list);
  }

  const result: JobWithCompany[] = [];
  let added = true;
  let idx = 0;

  while (added) {
    added = false;
    for (const list of companyMap.values()) {
      if (idx < list.length) {
        result.push(list[idx]);
        added = true;
      }
    }
    idx++;
  }

  return result;
}

/**
 * Helper to process, filter Meesho, cap max 2 roles per company, and interleave.
 */
function processAndCapJobs(candidatePool: JobWithCompany[], maxCount = 30): JobWithCompany[] {
  const companyCounts = new Map<string, number>();
  const cappedJobs: JobWithCompany[] = [];

  for (const j of candidatePool) {
    const cName = (j.company_name || "").toLowerCase();
    const cSlug = (j.company_slug || "").toLowerCase();
    const cId = (j.company_id || "").toLowerCase();
    const cDesc = (j.description || "").toLowerCase();
    const cUrl = (j.application_url || "").toLowerCase();

    // Absolute Purge of Meesho across ALL attributes & Legacy Numeric Seed Rows
    if (
      cName.includes("meesho") ||
      cSlug.includes("meesho") ||
      cId.includes("meesho") ||
      cDesc.includes("meesho") ||
      cUrl.includes("meesho") ||
      /^\d+$/.test(String(j.id))
    ) {
      continue;
    }

    const keyName = cName || cSlug || "company";
    const count = companyCounts.get(keyName) || 0;
    if (count < 2) {
      companyCounts.set(keyName, count + 1);
      cappedJobs.push(j);
    }
  }

  // Deduplicate by ID
  const seenJobIds = new Set<string>();
  const deduplicatedJobs = cappedJobs.filter((j) => {
    if (seenJobIds.has(j.id)) return false;
    seenJobIds.add(j.id);
    return true;
  });

  // If capping reduced total below maxCount, relax capping slightly to reach target count
  if (deduplicatedJobs.length < maxCount) {
    for (const j of candidatePool) {
      if (deduplicatedJobs.length >= maxCount) break;
      if (!seenJobIds.has(j.id) && !j.company_name.toLowerCase().includes("meesho")) {
        seenJobIds.add(j.id);
        deduplicatedJobs.push(j);
      }
    }
  }

  return interleaveByCompany(deduplicatedJobs).slice(0, maxCount);
}

/**
 * Fast & Stable Job Fetch Engine:
 * 1. Queries Supabase DB first for active jobs -> Returns in < 30ms with ZERO fluctuation.
 * 2. If DB has < 15 jobs, triggers harvester aggregator + fallbacks to auto-seed DB.
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
      // Ignore wishlist errors
    }
  }

  // 2. DB-FIRST FAST PATH: Read active jobs directly from Supabase DB
  try {
    const { data: rawDbJobs } = await userClient
      .from("jobs")
      .select(`
        *,
        company:companies(id, name, slug, logo_url, metadata)
      `)
      .eq("status", "active")
      .gte("last_date", nowISO)
      .order("created_at", { ascending: false });

    if (rawDbJobs && rawDbJobs.length >= 15) {
      const dbCandidates: JobWithCompany[] = rawDbJobs.map((j: any) => {
        const company = j.company || {};
        const metadata = company.metadata || {};
        const tier = metadata.tier || metadata.industry || "Product Tier 1";
        const cName = company.name || j.company_name || "Company";

        return {
          id: String(j.id),
          company_id: j.company_id || "comp-unknown",
          company_name: cName,
          company_slug: company.slug || j.company_slug || "company",
          company_logo_url: company.logo_url || null,
          company_tier: tier,
          role: j.role,
          description: j.description || "",
          domain: j.domain || "Software Engineering",
          location: j.location || "India",
          ctc_range: j.ctc_range || "₹18L - ₹30L PA",
          tech_stack: j.tech_stack || [],
          interview_types: j.interview_types || [],
          application_url: j.application_url || "",
          last_date: j.last_date,
          status: j.status,
          created_at: j.created_at,
        };
      });

      const processedDbJobs = processAndCapJobs([...dbCandidates, ...FALLBACK_JOBS], 30);

      return processedDbJobs.map((j) => ({
        ...j,
        created_at: j.created_at || nowISO,
        is_wishlisted: wishlistedJobIds.has(j.id),
        is_company_targeted: targetedCompanyIds.has(j.company_id),
      }));
    }
  } catch {
    // Fall back to live harvesters if DB query fails
  }

  // 3. SEED PATH (Triggered only when DB has < 15 jobs): Aggregates live jobs and seeds DB
  const rawApiJobs = await getReal30IndianJobs().catch(() => []);
  const candidatePool: JobWithCompany[] = [...rawApiJobs, ...FALLBACK_JOBS];
  const finalProcessedJobs = processAndCapJobs(candidatePool, 30);

  // Background seed to DB
  if (finalProcessedJobs.length > 0) {
    (async () => {
      try {
        const companyBatch = finalProcessedJobs.map((job) => ({
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

        const jobBatch = finalProcessedJobs.map((job) => ({
          id: String(job.id),
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
      } catch {
        // Background sync catch
      }
    })();
  }

  return finalProcessedJobs.map((j) => ({
    ...j,
    created_at: nowISO,
    is_wishlisted: wishlistedJobIds.has(j.id),
    is_company_targeted: targetedCompanyIds.has(j.company_id),
  }));
}
