"use client";

import { useState } from "react";
import { ScoreRing } from "@/components/score-ring";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ResumeAnalysisReport } from "@/lib/resume/types";
import { useNotifications } from "@/components/notifications/notification-provider";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Tag,
  Copy,
  Check,
  Zap,
  TrendingUp,
  Award,
  Sparkles,
  FileText,
  Layers,
  Code2,
  Download,
  Share2,
} from "lucide-react";

const subScores = (scores: ResumeAnalysisReport["scores"]) => [
  { label: "ATS Score",        value: scores.ats_score,           color: "var(--orange)", desc: "Parser Compatibility" },
  { label: "Recruiter Read",   value: scores.recruiter_score,      color: "var(--teal)",   desc: "First 6-Second Impact" },
  { label: "HR Readability",   value: scores.hr_readability_score, color: "var(--amber)",  desc: "Structure & Grammar" },
  { label: "Industry Match",   value: scores.industry_match_score, color: "var(--orange)", desc: "Campus Benchmark" },
];

const atsBreakdownLabels: Record<string, string> = {
  contact_info: "Contact Info & Links",
  skills_match: "Technical Skills Match",
  experience:   "Experience & Impact",
  education:    "Degree & Coursework",
  keywords:     "ATS Target Keywords",
  formatting:   "Layout & Formatting",
};

export function ResumeReport({ report }: { report: ResumeAnalysisReport }) {
  const { scores, suggestions, extracted } = report;
  const { notify } = useNotifications();

  const [activeTab, setActiveTab] = useState<"overview" | "rewrites" | "keywords" | "export">("overview");
  const [appliedRewrites, setAppliedRewrites] = useState<Record<number, boolean>>({});
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [copiedBullet, setCopiedBullet] = useState<number | null>(null);

  // Calculate live boosted score if rewrites are accepted
  const acceptedCount = Object.values(appliedRewrites).filter(Boolean).length;
  const scoreBoost = acceptedCount * 3;
  const potentialScore = Math.min(99, scores.resume_score + scoreBoost);

  function toggleRewrite(index: number, improvedText: string) {
    const isApplied = !!appliedRewrites[index];
    setAppliedRewrites((prev) => ({ ...prev, [index]: !isApplied }));

    if (!isApplied) {
      notify({
        type: "success",
        icon: "✨",
        title: "Bullet Rewrite Applied!",
        body: `Applied rewrite #${index + 1}. Potential ATS score increased to ${Math.min(99, scores.resume_score + (acceptedCount + 1) * 3)}!`,
        autoDismiss: 3000,
      });
    }
  }

  function handleCopyBullet(text: string, index: number) {
    navigator.clipboard.writeText(text);
    setCopiedBullet(index);
    notify({
      type: "info",
      icon: "📋",
      title: "Copied to Clipboard",
      body: "Bullet point text copied successfully.",
      autoDismiss: 2000,
    });
    setTimeout(() => setCopiedBullet(null), 2000);
  }

  function handleCopyKeyword(kw: string) {
    navigator.clipboard.writeText(kw);
    setCopiedKeyword(kw);
    notify({
      type: "info",
      icon: "🏷️",
      title: "Keyword Copied",
      body: `"${kw}" copied to clipboard.`,
      autoDismiss: 2000,
    });
    setTimeout(() => setCopiedKeyword(null), 2000);
  }

  function handleExportMarkdown() {
    const text = `# CareerOS Resume Report
**Score**: ${scores.resume_score}/100 (ATS: ${scores.ats_score})

## Summary
${scores.summary}

## Strengths
${scores.strengths.map((s) => `- ${s}`).join("\n")}

## Needs Work
${scores.weaknesses.map((w) => `- ${w}`).join("\n")}

## Recommended Bullet Rewrites
${suggestions.bullet_rewrites.map((b, i) => `### ${i + 1}. Original\n${b.original}\n\n**Improved**:\n${b.improved}\n\n*Reason*: ${b.reason}`).join("\n\n")}

## Missing ATS Keywords
${suggestions.missing_ats_keywords.join(", ")}
`;

    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Resume_Report_${new Date().toISOString().split("T")[0]}.md`;
    a.click();

    notify({
      type: "success",
      icon: "📥",
      title: "Report Exported",
      body: "Downloaded Markdown summary of your analysis.",
      autoDismiss: 3000,
    });
  }

  return (
    <div className="space-y-6 animate-fade-up">

      {/* ── Top Header Bar & Live Score Meter ── */}
      <div
        className="rounded-3xl p-6 border flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-strong)",
        }}
      >
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 mb-1">
            <Sparkles className="size-3.5 text-orange-500" /> CareerOS Resume Intelligence
          </div>
          <h2 className="font-display text-2xl font-bold text-primary">
            Analysis & Optimization Report
          </h2>
          <p className="text-xs text-secondary">
            AI-Scored against enterprise ATS systems & Indian campus hiring benchmarks.
          </p>
        </div>

        {/* Live Boosted Score Indicator */}
        <div className="flex items-center gap-4 surface-2 px-5 py-3 rounded-2xl border border-border">
          <div className="text-center">
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Current Score</p>
            <p className="font-display text-2xl font-bold text-orange-500">{scores.resume_score}</p>
          </div>
          <ArrowRight className="size-4 text-muted" />
          <div className="text-center">
            <p className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Potential Score</p>
            <p className="font-display text-2xl font-bold text-teal-400">{potentialScore}</p>
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex gap-2 border-b border-border overflow-x-auto pb-1">
        {[
          { id: "overview", label: "Overview & Scores", icon: Layers },
          { id: "rewrites", label: `Bullet Rewrites (${suggestions.bullet_rewrites.length})`, icon: Zap },
          { id: "keywords", label: `Keywords (${suggestions.missing_ats_keywords.length})`, icon: Tag },
          { id: "export",   label: "Export & Actions", icon: Download },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                  : "text-secondary hover:text-primary surface-2 border border-transparent"
              }`}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: OVERVIEW & SCORES ── */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-up">
          {/* Main Score Ring & Sub-scores */}
          <Card>
            <CardContent className="pt-6 grid sm:grid-cols-[auto_1fr] gap-8 items-center">
              <div className="flex flex-col items-center">
                <ScoreRing score={scores.resume_score} size={150} />
                <span className="text-xs font-bold mt-3 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center gap-1">
                  <Award className="size-3.5" />
                  {scores.resume_score >= 80 ? "Shortlist Ready" : "Optimization Needed"}
                </span>
              </div>

              <div className="space-y-4">
                {subScores(scores).map((s) => (
                  <div key={s.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-primary">{s.label}</span>
                      <span className="font-mono font-bold" style={{ color: s.color }}>{s.value}/100</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden surface-2 border border-border">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${s.value}%`, background: s.color }}
                      />
                    </div>
                    <p className="text-[10px] text-muted">{s.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ATS Category Breakdown Grid */}
          {scores.ats_breakdown && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="size-4 text-orange-500" />
                  ATS Metric Breakdown
                </CardTitle>
                <CardDescription>
                  Detailed scoring across critical ATS parser parameters.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(scores.ats_breakdown).map(([key, value]) => (
                    <div key={key} className="surface-2 p-3.5 rounded-2xl border border-border space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-primary">{atsBreakdownLabels[key] ?? key}</span>
                        <span className="font-mono font-bold text-teal-400">{value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden bg-border">
                        <div
                          className="h-full rounded-full transition-all duration-700 bg-teal-400"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary & Strengths/Weaknesses */}
          <Card>
            <CardHeader><CardTitle>Executive AI Evaluation</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm leading-relaxed text-secondary surface-2 p-4 rounded-2xl border border-border">
                {scores.summary}
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <CheckCircle2 className="size-4" /> Validated Strengths
                  </p>
                  <ul className="space-y-2">
                    {scores.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2 text-xs text-secondary surface p-2.5 rounded-xl border border-border">
                        <CheckCircle2 className="size-4 shrink-0 text-teal-400 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="size-4" /> Improvement Areas
                  </p>
                  <ul className="space-y-2">
                    {scores.weaknesses.map((w, i) => (
                      <li key={i} className="flex gap-2 text-xs text-secondary surface p-2.5 rounded-xl border border-border">
                        <AlertTriangle className="size-4 shrink-0 text-amber-400 mt-0.5" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── TAB 2: INTERACTIVE BULLET REWRITES & DIFF VIEWER ── */}
      {activeTab === "rewrites" && (
        <div className="space-y-6 animate-fade-up">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="size-4 text-orange-500" />
                    Action-Impact Bullet Rewriter
                  </CardTitle>
                  <CardDescription>
                    Compare original bullets with AI improvements. Apply rewrites to boost your score!
                  </CardDescription>
                </div>
                <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                  {acceptedCount} / {suggestions.bullet_rewrites.length} Applied
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {suggestions.bullet_rewrites.map((b, i) => {
                const isApplied = !!appliedRewrites[i];
                return (
                  <div
                    key={i}
                    className={`rounded-2xl p-5 border transition-all space-y-3 ${
                      isApplied ? "border-teal-500/40 bg-teal-500/5 shadow-md" : "border-border surface-2"
                    }`}
                  >
                    {/* Header line */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted">
                        Rewrite #{i + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyBullet(b.improved, i)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold surface border border-border hover:bg-surface-2 transition-colors text-secondary flex items-center gap-1"
                        >
                          {copiedBullet === i ? <Check className="size-3 text-teal-400" /> : <Copy className="size-3" />}
                          {copiedBullet === i ? "Copied" : "Copy"}
                        </button>

                        <button
                          onClick={() => toggleRewrite(i, b.improved)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            isApplied
                              ? "bg-teal-500 text-white shadow-sm"
                              : "bg-orange-500 text-white hover:brightness-110"
                          }`}
                        >
                          {isApplied ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
                          {isApplied ? "Applied (+3 pts)" : "Apply Rewrite"}
                        </button>
                      </div>
                    </div>

                    {/* Original bullet (Red deletion style) */}
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs space-y-1">
                      <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
                        Original Draft
                      </span>
                      <p className="text-red-300 font-mono leading-relaxed line-through">
                        {b.original}
                      </p>
                    </div>

                    {/* AI Improved Bullet (Green addition style) */}
                    <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs space-y-1">
                      <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block flex items-center gap-1">
                        <Sparkles className="size-3 text-orange-500" /> AI Action-Impact Bullet
                      </span>
                      <p className="text-teal-200 font-mono font-medium leading-relaxed">
                        {b.improved}
                      </p>
                    </div>

                    {/* Rationale explanation */}
                    <p className="text-xs text-muted leading-relaxed pl-1">
                      <strong className="text-orange-400">Why this helps: </strong>
                      {b.reason}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── TAB 3: KEYWORD VAULT & MISSING SKILLS ── */}
      {activeTab === "keywords" && (
        <div className="space-y-6 animate-fade-up">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Tag className="size-4 text-orange-500" />
                Missing ATS Keywords & Skills Vault
              </CardTitle>
              <CardDescription>
                Click any keyword to copy it directly for your resume technical skills section.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {suggestions.missing_ats_keywords.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-muted uppercase tracking-wider">
                    High-Impact Missing Keywords ({suggestions.missing_ats_keywords.length})
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {suggestions.missing_ats_keywords.map((kw) => (
                      <button
                        key={kw}
                        onClick={() => handleCopyKeyword(kw)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all border ${
                          copiedKeyword === kw
                            ? "bg-teal-500 text-white border-teal-500 shadow-md"
                            : "surface-2 hover:bg-surface border-border text-primary hover:border-orange-500/40"
                        }`}
                      >
                        {copiedKeyword === kw ? (
                          <Check className="size-3.5" />
                        ) : (
                          <Tag className="size-3.5 text-orange-500" />
                        )}
                        <span>{kw}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.section_suggestions.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <p className="text-xs font-bold text-muted uppercase tracking-wider">
                    Recommended Section Improvements
                  </p>
                  <div className="space-y-2">
                    {suggestions.section_suggestions.map((s, i) => (
                      <div key={i} className="p-3 rounded-xl surface border border-border text-xs text-secondary flex items-start gap-2">
                        <ArrowRight className="size-3.5 text-orange-500 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── TAB 4: EXPORT & ACTIONS ── */}
      {activeTab === "export" && (
        <div className="space-y-6 animate-fade-up">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Download className="size-4 text-orange-500" />
                Export & Placement Actions
              </CardTitle>
              <CardDescription>
                Download your complete analysis report or take the next step in your placement roadmap.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleExportMarkdown}
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Download className="size-4" /> Download Markdown Report
                </Button>

                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    notify({
                      type: "success",
                      icon: "🔗",
                      title: "Link Copied",
                      body: "Report link copied to clipboard.",
                      autoDismiss: 2000,
                    });
                  }}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Share2 className="size-4" /> Copy Shareable Link
                </Button>
              </div>

              {/* Next Roadmap Banner */}
              <div className="surface-2 p-5 rounded-2xl border border-orange-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
                  <Sparkles className="size-4" /> Ready for the Next Step?
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  Now that your resume score is optimized, select target companies to get a personalized DSA topic practice roadmap.
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Button asChild size="sm" variant="primary">
                    <a href="/dashboard/companies">
                      Browse Target Companies <ArrowRight className="size-3.5" />
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <a href="/dashboard/prep">
                      Start DSA Practice <Code2 className="size-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Plus icon helper
function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
