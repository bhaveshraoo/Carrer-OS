import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { CompanyList, CompanyData } from "@/components/companies/company-list";
import { CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";

export default async function CompaniesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: rawCompanies } = await table(supabase, "companies").select("*");
  const { data: targets } = await table(supabase, "user_company_targets")
    .select("*")
    .eq("user_id", user.id);

  const targetedSet: Record<string, boolean> = {};
  (targets ?? []).forEach((t) => {
    targetedSet[t.company_id] = true;
  });

  const companies: CompanyData[] = (rawCompanies ?? [])
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      logo_url: c.logo_url,
      career_page_url: c.career_page_url,
      metadata: (c.metadata ?? {}) as CompanyData["metadata"],
    }));

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--orange)" }}>
          Company Intelligence & Roadmaps
        </p>
        <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Target Companies
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Decode hiring stages, required technical competencies, and tailored DSA preparation.
        </p>
      </div>

      {/* Interactive Company List Component */}
      <CompanyList companies={companies} targetedSet={targetedSet} />

      {/* Legend */}
      <div className="surface p-4 rounded-2xl border border-border flex items-center gap-2 text-xs text-muted">
        <CheckCircle2 className="size-4 shrink-0 text-teal-400" />
        <span>
          <strong className="text-primary">Verified Intel</strong> = Researched against verified campus placement sources & hiring records.
        </span>
      </div>
    </div>
  );
}
