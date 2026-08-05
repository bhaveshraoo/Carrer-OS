"use client";

import { useState } from "react";
import Link from "next/link";
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
  Wand2,
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

## Missing Keywords
${suggestions.missing_ats_keywords.map((k) => `- ${k}`).join("\n")}
`;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "careeros-resume-report.md";
    a.click();
    URL.revokeObjectURL(url);
    notify({
      type: "success",
      icon: "📥",
      title: "Report Exported",
      body: "Downloaded markdown report.",
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
            Analysis &amp; Optimization Report
          </h2>
          <p className="text-xs text-secondary">
            AI-Scored against enterprise ATS systems &amp; Indian campus hiring benchmarks.
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

      {/* ── AI RE-WRITE RESUME CTA BANNER BELOW CAREEROS INTELLIGENCE SCORE ── */}
      <div className="surface p-4 rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-500/15 via-orange-500/5 to-transparent flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/25 shrink-0">
            <Wand2 className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-primary flex items-center gap-1.5">
              Want an instant 90+ ATS resume score?
            </h4>
            <p className="text-xs text-secondary font-medium">
              Transform your bullet points into Stanford/IIT grads&apos; Jake&apos;s Resume LaTeX format with Gemini.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/resume/rewrite"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-xs bg-orange-500 text-white hover:brightness-110 transition-all shadow-lg shadow-orange-500/25 shrink-0"
        >
          <Wand2 className="size-4" /> AI Re-write Resume
        </Link>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 surface border border-border p-6 rounded-3xl">
            <div className="flex flex-col items-center justify-center text-center space-y-3 md:border-r border-border md:pr-6">
              <ScoreRing score={scores.resume_score} size={140} stroke={12} label="Resume Score" />
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
                {scores.resume_score >= 80 ? "Top Candidate Fit" : "Optimization Needed"}
              </span>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subScores(scores).map((s) => (
                <div key={s.label} className="surface-2 p-4 rounded-2xl border border-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-secondary">{s.label}</span>
                    <span className="font-mono text-sm font-extrabold text-primary">{s.value}/100</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${s.value}%`, backgroundColor: s.color }}
                    />
                  </div>
                  <p className="text-[10px] text-muted font-medium">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ATS Breakdown Parameters */}
          <div className="surface p-6 rounded-3xl border border-border space-y-4">
            <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
              <TrendingUp className="size-4 text-orange-500" /> ATS Metric Breakdown
            </h3>
            <p className="text-xs text-secondary">
              Detailed scoring across critical ATS parser parameters.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {Object.entries(scores.ats_breakdown || {}).map(([key, val]) => (
                <div key={key} className="surface-2 p-3.5 rounded-xl border border-border space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-primary">{atsBreakdownLabels[key] || key}</span>
                    <span className="font-mono font-bold text-orange-400">{val}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: `${val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: REWRITES ── */}
      {activeTab === "rewrites" && (
        <div className="space-y-4 animate-fade-up">
          {suggestions.bullet_rewrites.map((item, idx) => {
            const isApplied = !!appliedRewrites[idx];
            return (
              <div
                key={idx}
                className={`surface p-5 rounded-2xl border transition-all space-y-3 ${
                  isApplied ? "border-emerald-500/40 bg-emerald-500/5 shadow-md" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between text-xs gap-2 flex-wrap">
                  <span className="font-bold text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="size-3.5" /> Weak Original Bullet #{idx + 1}
                  </span>
                  <span className="text-[10px] font-extrabold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                    Why: {item.reason}
                  </span>
                </div>

                <p className="text-xs text-secondary bg-surface-2 p-3 rounded-xl border border-border font-medium">
                  {item.original}
                </p>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="size-3.5 text-orange-500" /> CareerOS AI STAR Formula Rewrite
                    </span>
                    <button
                      onClick={() => handleCopyBullet(item.improved, idx)}
                      className="text-[10px] text-secondary hover:text-primary flex items-center gap-1 bg-surface-2 px-2.5 py-1 rounded-lg border border-border"
                    >
                      {copiedBullet === idx ? (
                        <>
                          <Check className="size-3 text-emerald-400" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" /> Copy Text
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-primary bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/30 font-semibold leading-relaxed font-mono">
                    {item.improved}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    onClick={() => toggleRewrite(idx, item.improved)}
                    size="sm"
                    variant={isApplied ? "outline" : "primary"}
                    className="text-xs shadow-sm"
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="size-3.5 text-emerald-400 mr-1.5" /> Applied to Resume
                      </>
                    ) : (
                      <>
                        <Zap className="size-3.5 mr-1.5" /> Apply Rewrite (+3 pts)
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TAB 3: KEYWORDS ── */}
      {activeTab === "keywords" && (
        <div className="surface p-6 rounded-3xl border border-border space-y-4 animate-fade-up">
          <div>
            <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
              <Tag className="size-4 text-orange-500" /> Missing ATS Target Keywords
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              Click any keyword to copy and paste into your skills section.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {suggestions.missing_ats_keywords.map((kw) => (
              <button
                key={kw}
                onClick={() => handleCopyKeyword(kw)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold surface-2 hover:bg-orange-500/15 text-primary border border-border hover:border-orange-500/30 transition-all"
              >
                <span>+ {kw}</span>
                {copiedKeyword === kw ? (
                  <Check className="size-3.5 text-emerald-400" />
                ) : (
                  <Copy className="size-3 text-muted" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: EXPORT ── */}
      {activeTab === "export" && (
        <div className="surface p-6 rounded-3xl border border-border space-y-4 animate-fade-up text-center py-10">
          <Award className="size-10 text-orange-500 mx-auto" />
          <h3 className="font-display text-lg font-bold text-primary">Export Full Optimization Report</h3>
          <p className="text-xs text-secondary max-w-md mx-auto">
            Download your full ATS score breakdown, missing keywords, and AI bullet rewrites as a clean Markdown document.
          </p>
          <Button onClick={handleExportMarkdown} variant="primary" className="shadow-lg shadow-orange-500/25">
            <Download className="size-4 mr-2" /> Export Report (.MD)
          </Button>
        </div>
      )}

    </div>
  );
}
