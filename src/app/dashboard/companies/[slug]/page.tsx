import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TargetButton } from "../target-button";
import { ArrowLeft, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: allCompanies } = await table(supabase, "companies").select("*").eq("slug", slug);
  const company = allCompanies?.[0];

  if (!company) {
    notFound();
  }

  const { data: intelRows } = await table(supabase, "company_intel")
    .select("*")
    .eq("company_id", company.id);
  const intel = intelRows?.[0];

  const { data: targets } = await table(supabase, "user_company_targets")
    .select("*")
    .eq("user_id", user.id)
    .eq("company_id", company.id);
  const isTargeted = (targets?.length ?? 0) > 0;

  const metadata = (company.metadata ?? {}) as { tier?: string; verified?: boolean };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/dashboard/companies"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 mb-3"
        >
          <ArrowLeft className="size-4" /> All companies
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl font-semibold text-navy-900">{company.name}</h1>
              {metadata.verified ? (
                <span
                  title="Researched against current public sources"
                  className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full"
                >
                  <CheckCircle2 className="size-3" /> Verified
                </span>
              ) : (
                <span
                  title="General pattern — not yet individually verified"
                  className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full"
                >
                  <AlertCircle className="size-3" /> General pattern
                </span>
              )}
            </div>
            {metadata.tier && <p className="text-slate-400 text-sm mt-1">{metadata.tier}</p>}
          </div>
        </div>
      </div>

      <TargetButton companyId={company.id} initiallyTargeted={isTargeted} />

      {!metadata.verified && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          This profile reflects a general IT-services hiring pattern, not company-specific research.
          Confirm current details on {company.name}&apos;s official careers page before relying on this for real prep.
        </div>
      )}

      {intel?.overview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 leading-relaxed">{intel.overview}</p>
          </CardContent>
        </Card>
      )}

      {intel?.hiring_process && intel.hiring_process.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hiring process</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {intel.hiring_process.map((stage, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 size-6 rounded-full bg-navy-900 text-white text-xs font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-navy-900 text-sm">{stage.stage}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{stage.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {intel?.required_skills && intel.required_skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">What they look for</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {intel.required_skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {intel?.prep_roadmap && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Prep roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 leading-relaxed">{intel.prep_roadmap}</p>
          </CardContent>
        </Card>
      )}

      {intel?.source_urls && intel.source_urls.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Sources</p>
          <ul className="space-y-1">
            {intel.source_urls.map((url, i) => (
              <li key={i}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-teal-700 hover:underline inline-flex items-center gap-1"
                >
                  {url} <ExternalLink className="size-3" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
