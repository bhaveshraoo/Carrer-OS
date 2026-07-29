import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TargetButton } from "../target-button";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Code2,
  Sparkles,
  Layers,
  Award,
  ArrowRight,
  BookOpen,
  Target,
  Wand2,
  MapPin,
  IndianRupee,
  Briefcase,
  ShieldCheck,
  Building,
} from "lucide-react";

const TOPIC_LABELS: Record<string, string> = {
  arrays:              "Arrays",
  strings:             "Strings",
  dp:                  "Dynamic Programming",
  graphs:              "Graphs",
  trees:               "Trees",
  "linked-lists":      "Linked Lists",
  "stacks-queues":     "Stacks & Queues",
  greedy:              "Greedy",
  recursion:           "Recursion",
  sql:                 "SQL",
  "basic-programming": "Basic Programming",
  "oop-concepts":      "OOP Concepts",
  "math-number-theory":"Math & Number Theory",
  pseudocode:          "Pseudocode",
  "web-development":   "Web Development",
};

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: allCompanies } = await table(supabase, "companies").select("*").eq("slug", slug);
  const company = allCompanies?.[0];
  if (!company) notFound();

  const { data: intelRows } = await table(supabase, "company_intel")
    .select("*").eq("company_id", company.id);
  const intel = intelRows?.[0];

  const { data: targets } = await table(supabase, "user_company_targets")
    .select("*").eq("user_id", user.id).eq("company_id", company.id);
  const isTargeted = (targets?.length ?? 0) > 0;

  const { data: dsaTopics } = await table(supabase, "company_dsa_topics")
    .select("*").eq("company_id", company.id);

  const metadata = (company.metadata ?? {}) as {
    tier?: string;
    verified?: boolean;
    city?: string;
    ctc_range?: string;
    wlb?: string;
    work_policy?: string;
    networth?: string;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">
      {/* Back link + Heading */}
      <div>
        <Link
          href="/dashboard/companies"
          className="inline-flex items-center gap-1.5 text-xs font-semibold mb-4 text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to all companies
        </Link>

        <div className="surface border border-border rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="size-16 rounded-2xl flex items-center justify-center font-extrabold text-2xl"
                style={{
                  background: "var(--orange-glow)",
                  border: "1px solid rgba(249,115,22,0.3)",
                  color: "var(--orange)",
                }}
              >
                {company.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-primary">
                    {company.name}
                  </h1>
                  {metadata.verified ? (
                    <span
                      title="Researched against current public placement sources"
                      className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20"
                    >
                      <CheckCircle2 className="size-3.5" /> Verified Research Intel
                    </span>
                  ) : (
                    <span
                      title="General pattern — not yet individually verified"
                      className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    >
                      <AlertCircle className="size-3.5" /> General Pattern
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-secondary font-semibold flex-wrap">
                  {metadata.city && (
                    <span className="flex items-center gap-1 text-teal-400 font-bold">
                      <MapPin className="size-3.5" /> {metadata.city}
                    </span>
                  )}
                  {metadata.ctc_range && (
                    <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      <IndianRupee className="size-3" /> CTC Package: {metadata.ctc_range}
                    </span>
                  )}
                  {metadata.tier && (
                    <span className="text-muted">• {metadata.tier}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TargetButton companyId={company.id} companyName={company.name} initiallyTargeted={isTargeted} />
            </div>
          </div>

          {/* Quick AI Action Callout */}
          <div className="surface-2 border border-orange-500/30 bg-orange-500/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Wand2 className="size-5 text-orange-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-primary">Targeting {company.name}?</p>
                <p className="text-[11px] text-secondary">Tailor your Jake&apos;s Resume and practice high-frequency questions for this company.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                href="/dashboard/resume/rewrite"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 text-white hover:brightness-110 shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all text-center justify-center w-full sm:w-auto"
              >
                <Sparkles className="size-3.5" /> Optimize Resume
              </Link>
              <Link
                href="/dashboard/prep"
                className="px-4 py-2 rounded-xl text-xs font-bold surface border border-border text-secondary hover:text-primary flex items-center gap-1.5 transition-all text-center justify-center w-full sm:w-auto"
              >
                <Code2 className="size-3.5 text-orange-400" /> Practice DSA
              </Link>
            </div>
          </div>

          {/* Quick links & info bar */}
          <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted">
            <span className="flex items-center gap-1 font-semibold">
              <Award className="size-3.5 text-orange-500" /> Authentic Campus &amp; Off-Campus Placement Research
            </span>
            {company.career_page_url && (
              <a
                href={company.career_page_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:underline flex items-center gap-1 font-semibold"
              >
                Official Careers Page <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Unverified warning banner */}
      {!metadata.verified && (
        <div className="rounded-2xl p-4 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <AlertCircle className="size-4 text-amber-400" /> General Hiring Pattern Notice
          </p>
          <p className="leading-relaxed">
            This profile reflects a general IT-services hiring pattern. Confirm current company-specific round details on {company.name}&apos;s official portal before relying on this for live placement preparation.
          </p>
        </div>
      )}

      {/* Overview */}
      {intel?.overview && (
        <Card>
          <CardHeader><CardTitle className="text-base font-bold">Company Research &amp; Intelligence Overview</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-secondary whitespace-pre-line font-normal">
              {intel.overview}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Interactive Hiring Process Timeline */}
      {intel?.hiring_process && intel.hiring_process.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Layers className="size-4 text-orange-500" />
              Hiring Process &amp; Interview Rounds
            </CardTitle>
            <CardDescription>
              Step-by-step breakdown of screening, technical, and HR evaluation rounds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 space-y-6 border-l border-border">
              {intel.hiring_process.map((stage, i) => (
                <div key={i} className="relative group">
                  {/* Timeline node icon */}
                  <span
                    className="absolute -left-[37px] top-0 size-7 rounded-full text-xs font-bold flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: "linear-gradient(135deg, var(--orange) 0%, #fb923c 100%)",
                      color: "#fff",
                      borderColor: "var(--bg-base)",
                      boxShadow: "0 2px 8px rgba(249,115,22,0.35)",
                    }}
                  >
                    {i + 1}
                  </span>

                  <div className="surface-2 p-4 rounded-2xl border border-border space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm text-primary">{stage.stage}</p>
                      <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                        Round 0{i + 1}
                      </span>
                    </div>
                    <p className="text-xs text-secondary leading-relaxed pt-1">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mapped DSA Topics Preview Card */}
      {dsaTopics && dsaTopics.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Code2 className="size-4 text-orange-500" />
                  Required Technical &amp; DSA Topics
                </CardTitle>
                <CardDescription>
                  Topics prioritized in {company.name}&apos;s technical screening rounds.
                </CardDescription>
              </div>
              <Button asChild size="sm" variant="primary">
                <Link href="/dashboard/prep">
                  Practice Questions <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dsaTopics.map((topicRow) => (
                <div
                  key={topicRow.topic}
                  className="surface-2 p-3.5 rounded-2xl border border-border flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                      <Code2 className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">
                        {TOPIC_LABELS[topicRow.topic] ?? topicRow.topic}
                      </p>
                      <p className="text-[10px] text-muted font-mono">Emphasis Weight: {topicRow.emphasis}/10</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                    High Priority
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Required Skills */}
      {intel?.required_skills && intel.required_skills.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base font-bold">Core Technical Competencies</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {intel.required_skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5 rounded-2xl font-bold surface-2 border border-border text-secondary flex items-center gap-1.5"
                >
                  <Sparkles className="size-3 text-orange-500" />
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prep Roadmap */}
      {intel?.prep_roadmap && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <BookOpen className="size-4 text-orange-500" />
              Custom Prep Strategy Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-secondary surface-2 p-4 rounded-2xl border border-border font-normal">
              {intel.prep_roadmap}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Sources */}
      {intel?.source_urls && intel.source_urls.length > 0 && (
        <div className="pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Verified Reference Sources
          </p>
          <ul className="space-y-1">
            {intel.source_urls.map((url, i) => (
              <li key={i}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-teal-400 hover:underline inline-flex items-center gap-1 font-semibold"
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
