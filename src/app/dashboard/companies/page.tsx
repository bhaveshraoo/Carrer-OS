import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { CompanyList, CompanyData } from "@/components/companies/company-list";
import { SEED_COMPANIES } from "@/lib/companies/seed-data";
import { ShieldCheck, Target } from "lucide-react";
import { redirect } from "next/navigation";

// 🚀 High-Performance Server Cache: Cache static company intelligence for 5 mins across all requests (0ms DB latency)
const getCachedCompaniesData = unstable_cache(
  async () => {
    const publicSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [
      { data: rawCompanies },
      { data: rawIntel },
      { data: rawTopics },
    ] = await Promise.all([
      table(publicSupabase, "companies").select("id, name, slug, logo_url, career_page_url, metadata"),
      table(publicSupabase, "company_intel").select("company_id, hiring_process, required_skills, overview"),
      table(publicSupabase, "company_dsa_topics").select("company_id, topic"),
    ]);

    const intelMap: Record<string, { hiring_rounds_count: number; required_skills: string[]; overview?: string | null }> = {};
    (rawIntel ?? []).forEach((intel) => {
      intelMap[intel.company_id] = {
        hiring_rounds_count: (intel.hiring_process ?? []).length,
        required_skills: intel.required_skills ?? [],
        overview: intel.overview,
      };
    });

    const topicsMap: Record<string, string[]> = {};
    (rawTopics ?? []).forEach((t) => {
      if (!topicsMap[t.company_id]) topicsMap[t.company_id] = [];
      topicsMap[t.company_id].push(t.topic);
    });

    let list: CompanyData[] = (rawCompanies ?? [])
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((c) => {
        const intel = intelMap[c.id];
        return {
          id: c.id,
          name: c.name,
          slug: c.slug,
          logo_url: c.logo_url,
          career_page_url: c.career_page_url,
          metadata: (c.metadata ?? {}) as CompanyData["metadata"],
          hiring_rounds_count: intel?.hiring_rounds_count ?? 3,
          required_skills: intel?.required_skills ?? [],
          top_topics: topicsMap[c.id] ?? [],
        };
      });

    if (list.length === 0) {
      list = SEED_COMPANIES.map((sc) => ({
        id: sc.id,
        name: sc.name,
        slug: sc.slug,
        logo_url: sc.logo_url,
        career_page_url: sc.career_page_url,
        metadata: sc.metadata,
        hiring_rounds_count: sc.hiring_rounds_count,
        required_skills: sc.required_skills,
        top_topics: sc.top_topics,
      }));
    }

    return list;
  },
  ["global-companies-intelligence-cache-v1"],
  { revalidate: 300, tags: ["companies"] }
);

export default async function CompaniesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Execute cached static company fetch (0ms) & user target query simultaneously
  const [companies, { data: targets }] = await Promise.all([
    getCachedCompaniesData(),
    table(supabase, "user_company_targets").select("company_id").eq("user_id", user.id),
  ]);

  const targetedSet: Record<string, boolean> = {};
  (targets ?? []).forEach((t) => {
    targetedSet[t.company_id] = true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1 text-teal-600 dark:text-teal-400">
            Company Intelligence &amp; Roadmaps
          </p>
          <h1 className="font-display text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <Target className="size-8 text-teal-500" /> Target Companies &amp; Intelligence
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Decode hiring rounds, technical competencies, DSA topic weights, and AI readiness scores across top tech firms.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-card border border-border px-4 py-2.5 rounded-2xl text-center shadow-xs">
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wide">Total Companies</p>
            <p className="text-lg font-extrabold text-foreground font-mono">{companies.length}</p>
          </div>
          <div className="bg-teal-500/10 border border-teal-500/30 px-4 py-2.5 rounded-2xl text-center shadow-xs">
            <p className="text-[10px] font-bold uppercase text-teal-600 dark:text-teal-400 tracking-wide">Targeted</p>
            <p className="text-lg font-extrabold text-teal-600 dark:text-teal-400 font-mono">{Object.keys(targetedSet).length}</p>
          </div>
        </div>
      </div>

      {/* Interactive Company List Component */}
      <CompanyList companies={companies} targetedSet={targetedSet} />

      {/* Legend */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 flex items-center gap-3 text-xs text-muted-foreground shadow-xs">
        <ShieldCheck className="size-5 shrink-0 text-teal-500" />
        <span>
          <strong className="text-foreground">Verified Company Intel</strong> — Benchmarked against authentic placement records, campus hiring patterns, and product engineering interview experiences.
        </span>
      </div>
    </div>
  );
}
