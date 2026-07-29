import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { CompanyList, CompanyData } from "@/components/companies/company-list";
import { CheckCircle2, ShieldCheck, Sparkles, Target } from "lucide-react";
import { redirect } from "next/navigation";

export default async function CompaniesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: rawCompanies } = await table(supabase, "companies").select("*");
  const { data: rawIntel } = await table(supabase, "company_intel").select("*");
  const { data: rawTopics } = await table(supabase, "company_dsa_topics").select("*");
  const { data: targets } = await table(supabase, "user_company_targets")
    .select("*")
    .eq("user_id", user.id);

  const targetedSet: Record<string, boolean> = {};
  (targets ?? []).forEach((t) => {
    targetedSet[t.company_id] = true;
  });

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

  const companies: CompanyData[] = (rawCompanies ?? [])
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--orange)" }}>
            Company Intelligence &amp; Roadmaps
          </p>
          <h1 className="font-display text-3xl font-extrabold text-primary flex items-center gap-2.5">
            <Target className="size-8 text-orange-500" /> Target Companies &amp; Intelligence
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Decode hiring rounds, technical competencies, DSA topic weights, and AI readiness scores across 70+ top tech firms.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="surface border border-border px-4 py-2.5 rounded-2xl text-center">
            <p className="text-[10px] font-bold uppercase text-muted tracking-wide">Total Companies</p>
            <p className="text-lg font-extrabold text-primary font-mono">{companies.length}</p>
          </div>
          <div className="surface border border-orange-500/30 bg-orange-500/5 px-4 py-2.5 rounded-2xl text-center">
            <p className="text-[10px] font-bold uppercase text-orange-400 tracking-wide">Targeted</p>
            <p className="text-lg font-extrabold text-orange-400 font-mono">{Object.keys(targetedSet).length}</p>
          </div>
        </div>
      </div>

      {/* Interactive Company List Component */}
      <CompanyList companies={companies} targetedSet={targetedSet} />

      {/* Legend */}
      <div className="surface p-4 rounded-2xl border border-border flex items-center gap-3 text-xs text-muted">
        <ShieldCheck className="size-5 shrink-0 text-teal-400" />
        <span>
          <strong className="text-primary">Verified Company Intel</strong> — Sourced and benchmarked against authentic placement records, TCS NQT, InfyTQ, and product engineering interview experiences.
        </span>
      </div>
    </div>
  );
}
