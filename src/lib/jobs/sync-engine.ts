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
 * Daily Sync Engine:
 * 1. Automatically deletes/wipes out expired jobs (last_date < NOW()) from Supabase.
 * 2. Fetches 30 fresh real Indian jobs from Lever, Greenhouse, and Remotive APIs.
 * 3. Syncs and upserts these 30 fresh jobs into Supabase companies & jobs tables.
 */
export async function syncAndFetchSupabaseJobs(
  userClient: SupabaseClient,
  userId?: string
): Promise<JobWithCompany[]> {
  const adminClient = getAdminSupabaseClient(userClient);
  const nowISO = new Date().toISOString();

  // 1. Wipe out expired jobs from Supabase database table
  try {
    await adminClient.from("jobs").delete().lt("last_date", nowISO);
  } catch (err) {
    // Ignore if DB table or delete fails
  }

  // 2. Fetch 30 fresh live jobs (10 Lever + 10 Greenhouse + 10 Remotive)
  let freshApiJobs: JobWithCompany[] = [];
  try {
    freshApiJobs = await getReal30IndianJobs();
  } catch (err) {
    console.error("Error fetching fresh jobs from APIs:", err);
  }

  // 3. Sync & Upsert to Supabase DB table with Service Role / Admin Client
  if (freshApiJobs.length > 0) {
    for (const job of freshApiJobs) {
      try {
        // Upsert company
        const { data: comp } = await adminClient
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

        const companyId = comp?.id || job.company_id;

        // Upsert job into Supabase
        await adminClient.from("jobs").upsert(
          {
            id: job.id,
            company_id: companyId,
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
            created_at: nowISO, // Always stamp with today's ISO date
          },
          { onConflict: "id" }
        );
      } catch (err) {
        // Continue loop if single item fails
      }
    }
  }

  // 4. Fetch user wishlists & targeted company IDs
  let wishlistedJobIds = new Set<string>();
  let targetedCompanyIds = new Set<string>();

  if (userId) {
    try {
      const [wishlistsRes, targetsRes] = await Promise.all([
        userClient.from("user_job_wishlist").select("job_id").eq("user_id", userId),
        userClient.from("user_target_companies").select("company_id").eq("user_id", userId),
      ]);

      if (wishlistsRes.data) {
        wishlistedJobIds = new Set(wishlistsRes.data.map((w: any) => w.job_id));
      }
      if (targetsRes.data) {
        targetedCompanyIds = new Set(targetsRes.data.map((t: any) => t.company_id));
      }
    } catch {
      // Silent
    }
  }

  // 5. Query active non-expired jobs from Supabase
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

    if (!error && dbJobs && dbJobs.length > 0) {
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
  } catch (err) {
    // Fallback to fresh API jobs directly
  }

  // Fallback to fresh API jobs directly if DB query yields 0
  return freshApiJobs.map((j) => ({
    ...j,
    created_at: nowISO,
    is_wishlisted: wishlistedJobIds.has(j.id),
    is_company_targeted: targetedCompanyIds.has(j.company_id),
  }));
}
