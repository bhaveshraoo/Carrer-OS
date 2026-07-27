"use client";

import React from "react";
import { ScoreRing } from "@/components/score-ring";
import {
  FileX,
  FileCheck,
  Building2,
  Code2,
  Briefcase,
  Trophy,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  Zap,
  TrendingUp,
  GitBranch,
  Layers,
  BarChart3,
  CheckCheck,
  Download,
  MessageSquare,
  FileText,
  DollarSign,
} from "lucide-react";

interface StoryStageProps {
  step: number; // 1 to 6
}

export function StoryStage({ step }: StoryStageProps) {
  return (
    <div
      className="relative w-full min-h-[420px] rounded-3xl p-6 sm:p-7 overflow-hidden flex flex-col justify-between transition-all duration-700 shadow-2xl border"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-strong)",
      }}
    >
      {/* Background ambient lighting */}
      <div
        className="absolute -top-24 -right-24 size-80 rounded-full blur-3xl transition-all duration-700 pointer-events-none opacity-30"
        style={{
          background:
            step === 1
              ? "#EF4444"
              : step === 2
              ? "#2DD4BF"
              : step === 3
              ? "#F97316"
              : step === 4
              ? "#F59E0B"
              : step === 5
              ? "#3B82F6"
              : "#10B981",
        }}
      />

      {/* Step Header */}
      <div className="flex items-center justify-between z-10">
        <span
          className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border"
          style={{
            background: "var(--orange-glow)",
            color: "var(--orange)",
            borderColor: "rgba(249,115,22,0.3)",
          }}
        >
          Step 0{step} of 06 • Interactive Diagram
        </span>
        <span className="text-xs font-semibold text-muted flex items-center gap-1.5">
          <Zap className="size-3.5 text-orange-500" /> CareerOS Engine
        </span>
      </div>

      {/* Step Visual Diagrams & Working Nature Flow */}
      <div className="relative z-10 my-auto py-3">
        {/* STEP 1: LOW ATS RESUME & REJECTION DIAGRAM */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                  Working Nature: Raw Unformatted Draft
                </span>
                <h3 className="font-display text-xl font-bold text-primary">
                  ATS Scanner Rejection Risk
                </h3>
              </div>
              <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20 flex items-center gap-1">
                <FileX className="size-3.5" /> High Risk
              </span>
            </div>

            {/* Diagram: Rejection Pipeline */}
            <div className="grid grid-cols-3 gap-2 surface-2 p-3 rounded-2xl border border-border text-center text-xs">
              <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="font-bold text-red-400">Raw Draft</p>
                <p className="text-[10px] text-muted mt-0.5">Unstructured PDF</p>
              </div>
              <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="font-bold text-red-400">ATS Parsing</p>
                <p className="text-[10px] text-muted mt-0.5">Missing Keywords</p>
              </div>
              <div className="p-2 rounded-xl bg-red-500/20 border border-red-500/40">
                <p className="font-bold text-red-400">Status</p>
                <p className="text-[10px] text-red-300 font-bold mt-0.5">Auto-Rejected ❌</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="space-y-1 max-w-[200px]">
                <p className="text-xs font-semibold text-primary">Keyword Coverage: 32%</p>
                <p className="text-xs text-muted">Impact Metrics: 0 Quantified</p>
              </div>
              <ScoreRing score={38} size={110} label="ATS Score" animate={true} />
            </div>
          </div>
        )}

        {/* STEP 2: AI OVERHAUL & GREEN RESULT DIAGRAM */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                  Working Nature: AI Action-Impact Rewriter
                </span>
                <h3 className="font-display text-xl font-bold text-primary">
                  ATS Shortlist Transformation
                </h3>
              </div>
              <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20 flex items-center gap-1">
                <FileCheck className="size-3.5" /> Shortlist Ready
              </span>
            </div>

            {/* Diagram: Transformation Chart 38 -> 87 */}
            <div className="surface-2 p-3.5 rounded-2xl border border-teal-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-muted">Original: 38 Score</span>
                <ArrowRight className="size-4 text-teal-400" />
                <span className="text-teal-400">AI Rewritten: 87 Score (+49 pts)</span>
              </div>
              <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full w-[87%] transition-all duration-1000" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="space-y-1 text-xs">
                <p className="text-teal-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> 94% Action Verb Coverage
                </p>
                <p className="text-teal-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> Quantified Impact Added
                </p>
              </div>
              <ScoreRing score={87} size={110} label="ATS Score" animate={true} />
            </div>
          </div>
        )}

        {/* STEP 3: COMPANY INTELLIGENCE COMPARISON DIAGRAM */}
        {step === 3 && (
          <div className="space-y-3.5 animate-fade-up">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                Working Nature: Verified Requirements Engine
              </span>
              <h3 className="font-display text-xl font-bold text-primary">
                Target Company Intelligence Matrix
              </h3>
            </div>

            {/* Diagram: Company Matrix */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { name: "Accenture", tier: "IT Services", rounds: "3 Rounds", ctc: "6.5-12 LPA", verified: true },
                { name: "Adobe India", tier: "Product", rounds: "4 Rounds", ctc: "22-45 LPA", verified: true },
                { name: "Amazon India", tier: "Big Tech", rounds: "5 Rounds", ctc: "28-48 LPA", verified: true },
                { name: "Atlassian", tier: "Product", rounds: "4 Rounds", ctc: "35-55 LPA", verified: true },
              ].map((c) => (
                <div
                  key={c.name}
                  className="surface-2 p-3 rounded-2xl border border-border hover:border-orange-500/40 transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-primary">{c.name}</p>
                    {c.verified && (
                      <span className="text-[9px] font-bold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted">
                    <span>{c.tier}</span>
                    <span className="text-orange-400 font-semibold">{c.ctc}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-muted text-center pt-1">
              ✦ Target selection automatically prioritizes your DSA topics & PYQ roadmap
            </p>
          </div>
        )}

        {/* STEP 4: DSA TOPIC WEIGHTAGE & PYQ ROADMAP DIAGRAM */}
        {step === 4 && (
          <div className="space-y-3.5 animate-fade-up">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Working Nature: Priority Queue Sort Algorithm
              </span>
              <h3 className="font-display text-xl font-bold text-primary">
                Topic Emphasis Breakdown Diagram
              </h3>
            </div>

            {/* Diagram: Topic Weight Distribution */}
            <div className="space-y-2 surface-2 p-3.5 rounded-2xl border border-border">
              {[
                { name: "Graphs & BFS/DFS", weight: 85, color: "var(--orange)" },
                { name: "Dynamic Programming", weight: 75, color: "var(--teal)" },
                { name: "Trees & Binary Search", weight: 65, color: "var(--amber)" },
              ].map((t) => (
                <div key={t.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-primary">{t.name}</span>
                    <span style={{ color: t.color }}>{t.weight}% Weightage</span>
                  </div>
                  <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${t.weight}%`, background: t.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-muted pt-1">
              <span>🎯 Curated PYQ Bank</span>
              <span className="text-amber-400 font-semibold">Company Mapped</span>
            </div>
          </div>
        )}

        {/* STEP 5: INTERNSHIP PROJECT & REVENUE SHARE DIAGRAM */}
        {step === 5 && (
          <div className="space-y-3.5 animate-fade-up">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                Working Nature: Projects & Internship Engine
              </span>
              <h3 className="font-display text-xl font-bold text-primary">
                1-6 Months SaaS Internship Pipeline
              </h3>
            </div>

            {/* Diagram: Project Internship Pipeline */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="surface-2 p-2.5 rounded-2xl border border-border space-y-1">
                <GitBranch className="size-4 text-blue-400 mx-auto" />
                <p className="font-bold text-primary">Build SaaS</p>
                <p className="text-[9px] text-muted">1-6 Months Track</p>
              </div>
              <div className="surface-2 p-2.5 rounded-2xl border border-border space-y-1">
                <Award className="size-4 text-orange-400 mx-auto" />
                <p className="font-bold text-primary">Get Cert & LOR</p>
                <p className="text-[9px] text-muted">QR Verified</p>
              </div>
              <div className="surface-2 p-2.5 rounded-2xl border border-teal-500/40 space-y-1 bg-teal-500/10">
                <DollarSign className="size-4 text-teal-400 mx-auto" />
                <p className="font-bold text-teal-400">5% Revenue</p>
                <p className="text-[9px] text-teal-300 font-semibold">Equal Team Split</p>
              </div>
            </div>

            <p className="text-[11px] text-muted text-center">
              ✦ Real production SaaS codebase experience + guaranteed internship rewards
            </p>
          </div>
        )}

        {/* STEP 6: APPLICATION COMMAND CENTER & OFFER LETTER DIAGRAM */}
        {step === 6 && (
          <div className="space-y-4 animate-fade-up">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Working Nature: Application Tracker & Offer Engine
              </span>
              <h3 className="font-display text-xl font-bold text-primary">
                Offer Letter & Group Access Command Center
              </h3>
            </div>

            {/* Comprehensive Offer & Tracker Cards */}
            <div className="space-y-2 text-xs">
              {/* Offer Letter Ready Card */}
              <div className="surface-2 p-3 rounded-2xl border border-teal-500/30 flex items-center justify-between bg-teal-500/5">
                <div className="flex items-center gap-2.5">
                  <Download className="size-4 text-teal-400 shrink-0" />
                  <div>
                    <p className="font-bold text-primary text-xs">Internship Offer Letter Ready (PDF)</p>
                    <p className="text-[10px] text-muted">Selected for Frontend Domain Team</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                  Confirmed 🎉
                </span>
              </div>

              {/* Discord Group Access Card */}
              <div className="surface-2 p-3 rounded-2xl border border-indigo-500/30 flex items-center justify-between bg-indigo-500/5">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="size-4 text-indigo-400 shrink-0" />
                  <div>
                    <p className="font-bold text-primary text-xs">Private Team Discord Channel</p>
                    <p className="text-[10px] text-muted">Collaborate with Team Lead & Mentor</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  Joined 💬
                </span>
              </div>
            </div>

            {/* Final Offer Result Card */}
            <div className="surface border border-emerald-500/40 p-3.5 rounded-2xl flex items-center justify-between bg-emerald-500/5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Trophy className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                    CareerOS Placement Success
                  </p>
                  <p className="text-xs font-bold text-primary">Software Development Engineer</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 block">
                  ₹18.5 LPA
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Step Navigation Bar */}
      <div className="flex items-center justify-between z-10 pt-2 border-t border-border">
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === step
                  ? "w-8 bg-orange-500"
                  : i < step
                  ? "w-3 bg-teal-500"
                  : "w-3 bg-border"
              }`}
            />
          ))}
        </div>
        <span className="text-[11px] font-semibold text-secondary flex items-center gap-1">
          Scroll to view architecture <ArrowRight className="size-3 text-orange-500" />
        </span>
      </div>
    </div>
  );
}
