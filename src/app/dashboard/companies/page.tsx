import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, ChevronRight, CheckCircle2 } from "lucide-react";

export default async function CompaniesPage() {
  const supabase = await createClient();
  const { data: companies } = await table(supabase, "companies").select("*");

  const sorted = (companies ?? []).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy-900">Target Companies</h1>
        <p className="text-slate-500 mt-1">
          Hiring process, required skills, and a prep roadmap for each company.
        </p>
      </div>

      {sorted.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-10 text-slate-500 text-sm">
            No companies added yet.
          </CardContent>
        </Card>
      ) : (
        <ul className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white">
          {sorted.map((c) => {
            const metadata = (c.metadata ?? {}) as { tier?: string; verified?: boolean };
            return (
              <li key={c.id}>
                <Link
                  href={`/dashboard/companies/${c.slug}`}
                  className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="size-9 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                    <Building2 className="size-4 text-teal-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-navy-900 truncate">{c.name}</p>
                      {metadata.verified && (
                        <span title="Researched against current public sources">
                          <CheckCircle2 className="size-3.5 text-teal-600 shrink-0" />
                        </span>
                      )}
                    </div>
                    {metadata.tier && <p className="text-xs text-slate-400">{metadata.tier}</p>}
                  </div>
                  <ChevronRight className="size-4 text-slate-300 shrink-0" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-xs text-slate-400">
        <CheckCircle2 className="size-3 inline mr-1 text-teal-600" />
        marks companies researched against current public sources. Others reflect general
        IT-services hiring patterns and should be verified before you rely on them for actual prep.
      </p>
    </div>
  );
}
