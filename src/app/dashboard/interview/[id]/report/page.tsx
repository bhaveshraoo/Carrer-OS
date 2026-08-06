"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Sparkles,
  Building2,
  FileText,
  Briefcase,
  Star,
  Zap,
  ShieldCheck,
} from "lucide-react";
import type { InterviewSession, InterviewReport } from "@/lib/interview/schema";

export default function InterviewReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: sessionId } = use(params);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        const res = await fetch(`/api/interview/${sessionId}`);
        const data = await res.json();
        if (data.success) {
          setSession(data.session);
          setReport(data.report);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="py-24 text-center text-sm font-semibold text-muted-foreground animate-pulse">
        Generating Executive Recruiter Evaluation Report &amp; Roadmap...
      </div>
    );
  }

  if (!report || !session) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground">Report standardizing in progress...</h2>
        <p className="text-xs text-muted-foreground">The report will appear as soon as Gemini finishes analyzing your full transcript.</p>
        <Link
          href="/dashboard/interview"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
        >
          Return to Interview Dashboard
        </Link>
      </div>
    );
  }

  const recBadgeColor =
    report.hiring_recommendation === "Strong Hire"
      ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
      : report.hiring_recommendation === "Hire"
      ? "bg-teal-500/15 text-teal-600 border-teal-500/30"
      : report.hiring_recommendation === "Leaning Hire"
      ? "bg-amber-500/15 text-amber-600 border-amber-500/30"
      : "bg-rose-500/15 text-rose-600 border-rose-500/30";

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-teal-500/10 via-background to-amber-500/10 border border-teal-500/20 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30">
              <Award className="size-3.5 text-teal-500" /> Executive Recruiter Evaluation Report
            </div>
            <h1 className="font-display text-3xl font-extrabold text-foreground tracking-tight">
              {session.job_role} Interview Report
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Target Company: <strong>{session.company_name}</strong> • Round: <strong>{session.interview_type}</strong>
            </p>
          </div>

          {/* Hiring Recommendation Badge */}
          <div className="text-right shrink-0">
            <span className={`text-sm font-extrabold px-4 py-2 rounded-2xl border ${recBadgeColor} inline-block shadow-2xs`}>
              Hiring Bar Decision: {report.hiring_recommendation}
            </span>
          </div>
        </div>

        {/* Score Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-border/60">
          {[
            { label: "Overall Score", score: report.overall_score },
            { label: "Technical Depth", score: report.technical_score },
            { label: "Problem Solving", score: report.problem_solving_score },
            { label: "Communication", score: report.communication_score },
            { label: "Behavior & Culture", score: report.behavior_score },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-2xl bg-card border border-border/70 space-y-1 text-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{item.label}</span>
              <div className="font-mono font-extrabold text-xl text-teal-600 dark:text-teal-400">{item.score} / 100</div>
            </div>
          ))}
        </div>

        {/* Resume ATS Score Banner (if available) */}
        {session.resume_ats_score && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                <FileText className="size-5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-amber-500" /> Resume ATS Compatibility Score
                </p>
                {session.resume_file_name && (
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{session.resume_file_name}</p>
                )}
              </div>
            </div>
            <div className="sm:ml-auto flex items-center gap-3">
              <div className="text-center">
                <div className="font-mono font-extrabold text-2xl text-amber-500">{session.resume_ats_score}</div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">/ 100 ATS</p>
              </div>
              <div className="w-20 h-2 rounded-full bg-muted border border-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
                  style={{ width: `${session.resume_ats_score}%` }}
                />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium sm:max-w-xs">
              {session.resume_ats_score >= 80
                ? "Strong resume. Your format and keywords are well-optimised for ATS parsers."
                : session.resume_ats_score >= 60
                ? "Average ATS compatibility. Consider adding more role-specific keywords."
                : "Your resume needs ATS optimisation. Review keyword alignment and format."}
            </p>
          </div>
        )}
      </div>

      {/* Recruiter Summary & Strengths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Strengths */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-4">
          <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-500" /> Recruiter Confirmed Strengths
          </h3>
          <ul className="space-y-2.5">
            {report.strengths.map((st, i) => (
              <li key={i} className="text-xs text-foreground font-medium flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                {st}
              </li>
            ))}
          </ul>
        </div>

        {/* Growth Areas */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-4">
          <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <AlertCircle className="size-4 text-amber-500" /> Areas for Technical Growth
          </h3>
          <ul className="space-y-2.5">
            {report.weaknesses.map((wk, i) => (
              <li key={i} className="text-xs text-foreground font-medium flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                {wk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recruiter Written Evaluation */}
      <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-3">
        <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
          <FileText className="size-4 text-teal-500" /> Recruiter Summary Evaluation
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
          {report.interview_summary}
        </p>
      </div>

      {/* Actionable Learning Roadmap */}
      <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="size-4 text-teal-500" /> Targeted Post-Interview Learning Roadmap
          </h3>
          <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
            {report.learning_roadmap.length} Milestones
          </span>
        </div>

        <div className="space-y-4">
          {report.learning_roadmap.map((item) => (
            <div key={item.step} className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-700 dark:text-teal-300 flex items-center gap-2">
                  <span className="size-5 rounded-full bg-teal-500/20 text-teal-600 font-mono text-[10px] font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                  {item.topic}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground font-mono">
                  {item.resources}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.action}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <Link
            href="/dashboard/interview"
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all inline-flex items-center gap-2"
          >
            Start Another AI Interview <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
