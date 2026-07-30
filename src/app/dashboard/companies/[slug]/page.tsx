import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TargetButton } from "../target-button";
import { ExpandableOverviewList, OverviewSection } from "@/components/companies/expandable-overview";
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
  Star,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Check,
  XCircle,
  FolderGit2,
  TrendingUp,
  Cpu,
  Brain,
  Zap,
  Globe,
  Compass,
  Scale,
} from "lucide-react";

const TOPIC_LABELS: Record<string, string> = {
  arrays:              "Arrays & Strings Data Processing",
  strings:             "Strings & Text Parsing",
  dp:                  "Dynamic Programming & Optimization",
  graphs:              "Graphs & Tree Networks",
  trees:               "Trees & Hierarchical Structures",
  "linked-lists":      "Linked Lists",
  "stacks-queues":     "Stacks & Queues",
  greedy:              "Greedy Algorithms",
  recursion:           "Recursion & Backtracking",
  sql:                 "SQL & Relational/NoSQL Database Optimization",
  "basic-programming": "Basic Programming Logic",
  "oop-concepts":      "Object-Oriented Programming (OOPs) & Clean Architecture",
  "math-number-theory":"Math & Number Theory",
  pseudocode:          "Pseudocode & Logic",
  "web-development":   "RESTful APIs & Full-Stack Web Frameworks",
  "system-design":     "System Architecture & Distributed Systems",
};

// Text Sanitizer Helper to fix LaTeX and raw markdown symbols
function sanitize(text: string): string {
  if (!text) return "";
  return text
    .replace(/\$\\rightarrow\$/g, "→")
    .replace(/\\rightarrow/g, "→")
    .replace(/^☑\s*/, "")
    .replace(/^🔹\s*/, "")
    .replace(/^◆\s*/, "")
    .replace(/^[•\s\d\.-]+\s*/, "")
    .trim();
}

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
    type?: string;
    scope?: string;
    verified?: boolean;
    category?: string;
    city?: string;
    ctc_range?: string;
    rating?: string;
    wlb?: string;
    work_policy?: string;
    pros?: string[];
    cons?: string[];
    suggested_projects?: string[];
    salary_tiers?: string[];
    interview_guidance?: string;
    annual_increment?: string;
    resume_branding?: string;
    career_trajectory?: string;
  };

  // ── CATEGORIZE SECTION 1 OVERVIEW INTO HOVER-EXPANDABLE SECTIONS ──
  const rawOverview = intel?.overview || "";

  // Buckets for grouping key-value pairs
  const profileItems: { key: string; val: string }[] = [];
  const locationItems: { key: string; val: string }[] = [];
  const rolesItems: { key: string; val: string }[] = [];
  const skillsItems: { key: string; val: string }[] = [];
  const trackItems: { key: string; val: string }[] = [];
  const legacyItems: { key: string; val: string }[] = [];
  const prosItems: { key: string; val: string }[] = [];
  const consItems: { key: string; val: string }[] = [];
  const otherItems: { key: string; val: string }[] = [];

  rawOverview.split("\n").forEach((line) => {
    const l = line.trim();
    if (!l || l.length < 4) return;

    // Filter out section headers and hiring round leaks
    if (/^\d+\.\s*(BASIC|HIRING|SALARY|WORK|FUTURE|INSIDER)/i.test(l)) return;
    if (/^🏢/i.test(l)) return;
    if (/^(ROUND|STAGE|PHASE)\s*\d+/i.test(l)) return;
    if (/^(FORMAT|FOCUS|QUESTION TYPES|PRIORITY TECH|TOTAL INTERVIEW ROUNDS)/i.test(l)) return;
    if (/^[◆🔹]\s*(STAGE|ROUND|PRIORITY)/i.test(l)) return;

    const parts = l.split(":");
    if (parts.length > 1) {
      const rawKey = parts[0].replace(/^[☑•🔹◆\s\d\.-]+/, "").trim();
      const rawVal = parts.slice(1).join(":").trim();
      const upperKey = rawKey.toUpperCase();

      // Skip redundant keys already shown in Hero or Section 2
      if (
        upperKey === "COMPANY NAME" ||
        upperKey === "COMPANY SLUG" ||
        upperKey === "TOTAL INTERVIEW ROUNDS" ||
        upperKey === "STAGE / ROUND BREAKDOWN"
      ) {
        return;
      }

      if (rawVal.length > 0) {
        const item = { key: sanitize(rawKey), val: sanitize(rawVal) };

        if (upperKey.includes("TYPE") || upperKey.includes("SCOPE") || upperKey.includes("TIER")) {
          profileItems.push(item);
        } else if (
          upperKey.includes("LOCATION") ||
          upperKey.includes("OFFICE") ||
          upperKey.includes("DELIVERY") ||
          upperKey.includes("OUTPOST") ||
          upperKey.includes("CENTER") ||
          upperKey.includes("CAMPUS") ||
          upperKey.includes("HEADQUARTERS")
        ) {
          locationItems.push(item);
        } else if (upperKey.includes("JOB POST") || upperKey.includes("TRAJECTORY") || upperKey.includes("ROLE")) {
          rolesItems.push(item);
        } else if (upperKey.includes("SKILL")) {
          skillsItems.push(item);
        } else if (upperKey.includes("TRACK")) {
          trackItems.push(item);
        } else if (
          upperKey.includes("FOUNDING") ||
          upperKey.includes("RATING") ||
          upperKey.includes("BRANDING") ||
          upperKey.includes("METRIC") ||
          upperKey.includes("LEADERSHIP")
        ) {
          legacyItems.push(item);
        } else if (upperKey === "PROS") {
          prosItems.push(item);
        } else if (upperKey === "CONS") {
          consItems.push(item);
        } else {
          otherItems.push(item);
        }
      }
    }
  });

  // Construct structured ExpandableOverviewSection list
  const expandableSections: OverviewSection[] = [];

  if (profileItems.length > 0) {
    expandableSections.push({
      id: "sec-profile",
      title: "Company Focus & Specialization",
      subtitle: profileItems[0]?.val.substring(0, 75) + "..." || "Industry specialization and global engineering scale",
      iconName: "building",
      accentColor: "orange",
      content: profileItems,
      textBlocks: [],
    });
  }

  if (locationItems.length > 0) {
    expandableSections.push({
      id: "sec-location",
      title: "Headquarters & Global Delivery Centers",
      subtitle: locationItems[0]?.val.substring(0, 75) + "..." || "Corporate HQ, regional offices, and R&D campuses",
      iconName: "map",
      accentColor: "teal",
      content: locationItems,
      textBlocks: [],
    });
  }

  if (rolesItems.length > 0) {
    expandableSections.push({
      id: "sec-roles",
      title: "Hiring Job Roles & Career Progression",
      subtitle: rolesItems[0]?.val.substring(0, 75) + "..." || "Freshers, mid-level developer posts, and promotion tracks",
      iconName: "briefcase",
      accentColor: "indigo",
      content: rolesItems,
      textBlocks: [],
    });
  }

  if (skillsItems.length > 0) {
    expandableSections.push({
      id: "sec-skills",
      title: "Core Demanded Tech Stack & Skill Match",
      subtitle: skillsItems[0]?.val.substring(0, 75) + "..." || "Most demanded programming languages, frameworks & cloud tools",
      iconName: "code",
      accentColor: "emerald",
      content: skillsItems,
      textBlocks: [],
    });
  }

  if (trackItems.length > 0) {
    expandableSections.push({
      id: "sec-track",
      title: "Best-Fit Career Tracks & Specializations",
      subtitle: trackItems[0]?.val.substring(0, 75) + "..." || "Engineering domain weightages (Full-Stack, Cloud, AI/ML, QA)",
      iconName: "track",
      accentColor: "purple",
      content: trackItems,
      textBlocks: [],
    });
  }

  if (legacyItems.length > 0) {
    expandableSections.push({
      id: "sec-legacy",
      title: "Founding Legacy, Leadership & Ratings",
      subtitle: legacyItems[0]?.val.substring(0, 75) + "..." || "Corporate metrics, founding history, and Glassdoor ratings",
      iconName: "star",
      accentColor: "amber",
      content: legacyItems,
      textBlocks: [],
    });
  }

  // ── COMBINE PROS AND CONS INTO ONE SINGLE TILE ──
  const allPros = (metadata.pros ?? []).length > 0 ? (metadata.pros ?? []) : prosItems.map(p => p.val);
  const allCons = (metadata.cons ?? []).length > 0 ? (metadata.cons ?? []) : consItems.map(c => c.val);

  if (allPros.length > 0 || allCons.length > 0) {
    expandableSections.push({
      id: "sec-pros-cons",
      title: "Work Culture Pros & Considerations",
      subtitle: "Employee growth advantages, team benefits, and project delivery expectations",
      iconName: "scale",
      accentColor: "emerald",
      content: [],
      textBlocks: [],
      prosCons: {
        pros: allPros.map(p => sanitize(p)),
        cons: allCons.map(c => sanitize(c)),
      },
    });
  }

  if (otherItems.length > 0 && expandableSections.length < 3) {
    expandableSections.push({
      id: "sec-other",
      title: "Additional Executive Intelligence",
      subtitle: "Supplementary placement & organizational metadata",
      iconName: "building",
      accentColor: "orange",
      content: otherItems,
      textBlocks: [],
    });
  }

  // ── PARSE SPRINT ROADMAP & INTERVIEW GUIDANCE ──
  const rawRoadmap = intel?.prep_roadmap || "";
  const hasRealRoadmap =
    rawRoadmap.length > 50 && !rawRoadmap.startsWith("Prioritize high-weight DSA topics ()");

  const sprintDays = hasRealRoadmap
    ? Array.from(rawRoadmap.matchAll(/(Days?\s*\d+[\d\s–\-–]*[^\n]*):\s*([^\n]+)/gi)).map((m) => ({
        days: sanitize(m[1]),
        task: sanitize(m[2]),
      }))
    : [];

  const guidanceSource = rawRoadmap.includes("DO ") ? rawRoadmap : (metadata.interview_guidance || "");
  const dosList = Array.from(guidanceSource.matchAll(/\bDO\s+([^\n]+)/g)).map((m) => sanitize(m[1]));
  const dontsList = Array.from(guidanceSource.matchAll(/\bDON'T\s+([^\n]+)/g)).map((m) => sanitize(m[1]));

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up pb-12">
      {/* ── Back Link ── */}
      <div>
        <Link
          href="/dashboard/companies"
          className="inline-flex items-center gap-1.5 text-xs font-semibold mb-4 text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to all companies
        </Link>

        {/* ── HERO HEADER CARD ── */}
        <div className="surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div
                className="size-16 sm:size-20 rounded-2xl flex items-center justify-center font-black text-3xl shadow-xl shrink-0"
                style={{
                  background: "linear-gradient(135deg, var(--orange) 0%, #fb923c 100%)",
                  color: "#fff",
                  boxShadow: "0 8px 24px rgba(249,115,22,0.35)",
                }}
              >
                {company.name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-2xl sm:text-3xl font-black text-primary">
                    {company.name}
                  </h1>
                  {metadata.verified ? (
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/25">
                      <CheckCircle2 className="size-3.5" /> Verified Research Intel
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <AlertCircle className="size-3.5" /> General Pattern
                    </span>
                  )}
                </div>

                <p className="text-xs text-secondary font-semibold max-w-2xl leading-relaxed">
                  {sanitize(metadata.type || "Enterprise Technology & Consulting Pioneer")}
                </p>

                <div className="flex items-center gap-3 text-xs font-semibold flex-wrap pt-1">
                  {metadata.city && (
                    <span className="flex items-center gap-1 text-teal-400 font-bold">
                      <MapPin className="size-3.5" /> {metadata.city}
                    </span>
                  )}
                  {metadata.rating && (
                    <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      <Star className="size-3 fill-amber-400" /> {metadata.rating}
                    </span>
                  )}
                  {metadata.tier && (
                    <span className="text-muted">• {sanitize(metadata.tier)}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <TargetButton companyId={company.id} companyName={company.name} initiallyTargeted={isTargeted} />
            </div>
          </div>

          {/* Quick AI Action Banner */}
          <div className="surface-2 border border-orange-500/30 bg-orange-500/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Wand2 className="size-5 text-orange-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-primary">Targeting {company.name}?</p>
                <p className="text-[11px] text-secondary font-medium">Tailor your Jake&apos;s Resume format and practice high-frequency interview questions for this company.</p>
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

          {/* Careers Link Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/80 text-xs text-muted">
            <span className="flex items-center gap-1 font-semibold">
              <Award className="size-3.5 text-orange-500" /> Authentic Placement &amp; Campus Research File
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

      {/* ── KEY STATS & COMPENSATION GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Salary Package */}
        <div className="surface border border-emerald-500/30 bg-emerald-500/5 rounded-2xl p-4 space-y-1">
          <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <IndianRupee className="size-3.5" /> Compensation Package
          </p>
          <p className="font-display text-lg font-extrabold text-primary font-mono">
            {metadata.ctc_range || "Market Competitive"}
          </p>
          <p className="text-[11px] text-secondary font-medium">Trainee to Senior Developer Tiers</p>
        </div>

        {/* Work Culture & Location */}
        <div className="surface border border-border rounded-2xl p-4 space-y-1">
          <p className="text-[11px] font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
            <Building className="size-3.5" /> Work Culture &amp; Policy
          </p>
          <p className="font-display text-sm font-extrabold text-primary truncate">
            {metadata.city || "On-site / Hybrid Hub"}
          </p>
          <p className="text-[11px] text-secondary font-medium truncate">
            {metadata.work_policy
              ? sanitize(metadata.work_policy).substring(0, 35)
              : `WLB: ${metadata.wlb || metadata.rating || "4.1/5.0"}`}
          </p>
        </div>

        {/* Resume Branding */}
        <div className="surface border border-border rounded-2xl p-4 space-y-1">
          <p className="text-[11px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="size-3.5" /> Resume Branding Value
          </p>
          <p className="font-display text-sm font-extrabold text-primary truncate">
            {metadata.resume_branding
              ? sanitize(metadata.resume_branding).substring(0, 25)
              : "Verified Tech Brand"}
          </p>
          <p className="text-[11px] text-secondary font-medium truncate">
            {metadata.tier
              ? sanitize(metadata.tier).substring(0, 30)
              : "Enterprise-Grade Company"}
          </p>
        </div>

        {/* Career Growth */}
        <div className="surface border border-border rounded-2xl p-4 space-y-1">
          <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="size-3.5" /> Career Growth Pace
          </p>
          <p className="font-display text-sm font-extrabold text-primary truncate">
            {metadata.career_trajectory
              ? sanitize(metadata.career_trajectory).substring(0, 30)
              : "Structured Growth Path"}
          </p>
          <p className="text-[11px] text-secondary font-medium truncate">
            {metadata.annual_increment ? sanitize(metadata.annual_increment).substring(0, 35) : "Annual Merit Increments"}
          </p>
        </div>
      </div>

      {/* ── 1. COMPANY RESEARCH & INTELLIGENCE OVERVIEW (HOVER-EXPANDABLE LIST) ── */}
      {expandableSections.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-base font-extrabold flex items-center gap-2">
                  <Building className="size-4 text-orange-500" />
                  1. Company Research &amp; Intelligence Overview
                </CardTitle>
                <CardDescription>
                  Hover over any section title to reveal detailed corporate metrics, technical stacks, and global scope.
                </CardDescription>
              </div>
              <span className="text-[10px] font-extrabold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                ✨ Hover to Expand Details
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <ExpandableOverviewList sections={expandableSections} />
          </CardContent>
        </Card>
      )}

      {/* ── 2. DETAILED INTERVIEW STAGES & EVALUATION PIPELINE ── */}
      {intel?.hiring_process && intel.hiring_process.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <Layers className="size-4 text-orange-500" />
              2. Hiring Process &amp; Interview Round Breakdown
            </CardTitle>
            <CardDescription>
              Step-by-step breakdown of screening tests, technical live coding, system architecture, and HR evaluation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 space-y-6 border-l border-border">
              {intel.hiring_process.map((stage, i) => {
                const stageTitle = sanitize(stage.stage).replace(/^(Round|Stage)\s*\d+:\s*(Round|Stage)\s*\d+:/i, "$1 $2:");
                return (
                  <div key={i} className="relative group">
                    {/* Timeline Node */}
                    <span
                      className="absolute -left-[37px] top-0 size-7 rounded-full text-xs font-extrabold flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: "linear-gradient(135deg, var(--orange) 0%, #fb923c 100%)",
                        color: "#fff",
                        borderColor: "var(--bg-base)",
                        boxShadow: "0 2px 8px rgba(249,115,22,0.35)",
                      }}
                    >
                      {i + 1}
                    </span>

                    <div className="surface-2 p-5 rounded-2xl border border-border space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="font-extrabold text-sm text-primary">{stageTitle}</p>
                        <span className="text-[10px] font-extrabold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                          Round 0{i + 1}
                        </span>
                      </div>
                      <p className="text-xs text-secondary leading-relaxed font-normal">
                        {sanitize(stage.description)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── PRIORITY DSA & TECHNICAL TOPIC WEIGHTAGES ── */}
      {dsaTopics && dsaTopics.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-extrabold flex items-center gap-2">
                  <Code2 className="size-4 text-orange-500" />
                  Priority Technical &amp; DSA Topic Weightages (Score 1 - 10)
                </CardTitle>
                <CardDescription>
                  Topics prioritized in {company.name}&apos;s technical screening and machine coding rounds.
                </CardDescription>
              </div>
              <Button asChild size="sm" variant="primary">
                <Link href="/dashboard/prep" className="flex items-center gap-1.5">
                  <Sparkles className="size-3.5" /> Practice Questions
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dsaTopics.map((topicRow, idx) => {
                const weight = topicRow.emphasis || 7;
                const percentage = (weight / 10) * 100;
                return (
                  <div
                    key={idx}
                    className="surface-2 p-4 rounded-2xl border border-border space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                          <Code2 className="size-3.5" />
                        </div>
                        <p className="text-xs font-bold text-primary">
                          {TOPIC_LABELS[topicRow.topic] ?? topicRow.topic}
                        </p>
                      </div>
                      <span className="text-xs font-extrabold font-mono text-orange-400">
                        {weight} / 10
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── SUGGESTED PROJECTS FOR CANDIDATE RESUME ── */}
      {metadata.suggested_projects && metadata.suggested_projects.length > 0 && (
        <Card className="border-orange-500/30 bg-orange-500/5">
          <CardHeader>
            <CardTitle className="text-base font-extrabold flex items-center gap-2 text-primary">
              <FolderGit2 className="size-4 text-orange-400" />
              Suggested Resume Projects for {company.name}
            </CardTitle>
            <CardDescription>
              Build and list these projects on your resume to guarantee getting shortlisted by recruiters at {company.name}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {metadata.suggested_projects.map((proj, i) => (
              <div key={i} className="surface p-4 rounded-2xl border border-border flex items-start gap-3">
                <div className="size-7 rounded-xl bg-orange-500/15 text-orange-400 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  0{i + 1}
                </div>
                <p className="text-xs text-secondary leading-relaxed font-medium">
                  {sanitize(proj)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ── TRACK-WISE SALARY TIERS & LEVELS ── */}
      {metadata.salary_tiers && metadata.salary_tiers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <IndianRupee className="size-4 text-emerald-400" />
              Level &amp; Track-wise Salary Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metadata.salary_tiers.map((st, i) => (
                <div key={i} className="surface-2 p-3.5 rounded-2xl border border-border flex items-center justify-between text-xs flex-wrap gap-2">
                  <span className="font-bold text-primary flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-400" /> {sanitize(st)}
                  </span>
                  <span className="font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                    Verified Salary Tier
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── CORE TECHNICAL COMPETENCIES ── */}
      {intel?.required_skills && intel.required_skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-extrabold">Core Technical Competencies &amp; Tech Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {intel.required_skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5 rounded-2xl font-bold surface-2 border border-border text-secondary flex items-center gap-1.5"
                >
                  <Sparkles className="size-3 text-orange-500" />
                  {sanitize(skill)}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── WORK CULTURE PROS & CONS (UNIFIED SINGLE CARD AT BOTTOM) ── */}
      {(allPros.length > 0 || allCons.length > 0) && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <Scale className="size-4 text-teal-400" />
              Work Culture Pros &amp; Considerations
            </CardTitle>
            <CardDescription>
              Key growth advantages, employee feedback, and team performance expectations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pros Column */}
              {allPros.length > 0 && (
                <div className="surface-2 p-4 sm:p-5 rounded-2xl border border-teal-500/30 bg-teal-500/5 space-y-3">
                  <p className="text-xs font-extrabold text-teal-400 flex items-center gap-2">
                    <ThumbsUp className="size-4" /> Work Culture &amp; Growth Pros
                  </p>
                  <div className="space-y-2 text-xs">
                    {allPros.map((p, i) => (
                      <div key={i} className="flex items-start gap-2 text-secondary font-medium">
                        <Check className="size-4 text-teal-400 shrink-0 mt-0.5" />
                        <span>{sanitize(p)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cons Column */}
              {allCons.length > 0 && (
                <div className="surface-2 p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                  <p className="text-xs font-extrabold text-amber-400 flex items-center gap-2">
                    <ThumbsDown className="size-4" /> Work Culture Cons &amp; Considerations
                  </p>
                  <div className="space-y-2 text-xs">
                    {allCons.map((c, i) => (
                      <div key={i} className="flex items-start gap-2 text-secondary font-medium">
                        <AlertCircle className="size-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{sanitize(c)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 6. INSIDER PREPARATION ROADMAP & DAY-BY-DAY TIMELINE ── */}
      {sprintDays.length > 0 && (
        <Card className="border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <BookOpen className="size-4 text-orange-500" />
              6. Custom 14-Day Interview Sprint Strategy &amp; Guidance
            </CardTitle>
            <CardDescription>
              Day-by-day action roadmap to prepare for {company.name}&apos;s technical interviews and clearance rounds.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sprintDays.map((step, i) => (
                <div key={i} className="surface-2 p-4 rounded-2xl border border-border space-y-1.5">
                  <span className="text-[10px] font-extrabold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20 inline-block">
                    {step.days}
                  </span>
                  <p className="text-xs text-secondary leading-relaxed font-medium">
                    {step.task}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── INTERVIEW DO'S & DON'TS ── */}
      {(dosList.length > 0 || dontsList.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Do's */}
          {dosList.length > 0 && (
            <Card className="border-teal-500/30 bg-teal-500/5">
              <CardHeader>
                <CardTitle className="text-base font-extrabold text-teal-400 flex items-center gap-2">
                  <CheckCircle2 className="size-4" /> Interview Do&apos;s
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {dosList.map((d, i) => (
                  <div key={i} className="flex items-start gap-2 text-secondary font-medium">
                    <Check className="size-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Don'ts */}
          {dontsList.length > 0 && (
            <Card className="border-rose-500/30 bg-rose-500/5">
              <CardHeader>
                <CardTitle className="text-base font-extrabold text-rose-400 flex items-center gap-2">
                  <XCircle className="size-4" /> Interview Don&apos;ts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {dontsList.map((d, i) => (
                  <div key={i} className="flex items-start gap-2 text-secondary font-medium">
                    <AlertCircle className="size-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ── VERIFIED REFERENCE SOURCES ── */}
      {intel?.source_urls && intel.source_urls.length > 0 && (
        <div className="surface p-4 rounded-2xl border border-border space-y-2 text-xs">
          <p className="font-extrabold text-muted uppercase tracking-wider text-[10px]">
            Verified Reference Sources
          </p>
          <div className="flex flex-wrap gap-3">
            {intel.source_urls.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:underline flex items-center gap-1 font-semibold truncate max-w-xs"
              >
                {url} <ExternalLink className="size-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
