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
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  XCircle,
  Brain,
  MessageSquare,
  Code2,
  Home,
  Download,
  GraduationCap,
} from "lucide-react";
import type { InterviewSession, InterviewReport } from "@/lib/interview/schema";
import { InterviewOSTeacherModal } from "@/components/interview/interview-os-teacher-modal";

export default function InterviewReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: sessionId } = use(params);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(1);
  const [isTeacherOpen, setIsTeacherOpen] = useState(false);

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
      <div className="py-28 text-center space-y-4 animate-pulse">
        <div className="size-14 rounded-2xl bg-teal-500/15 text-teal-600 font-bold flex items-center justify-center mx-auto border border-teal-500/30">
          <Award className="size-7 animate-bounce" />
        </div>
        <p className="font-display text-base font-bold text-foreground">Generating Strict Bar-Raiser Recruiter Report...</p>
        <p className="text-xs text-muted-foreground">Evaluating technical depth, system trade-offs, and communication precision</p>
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
      {/* ── TOP ACTION BAR: Home, Download, Ask OS-Teacher ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl surface border border-border shadow-xs print:hidden">
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-xl surface-2 border border-border text-xs font-extrabold text-primary hover:border-orange-500/40 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Home className="size-4 text-orange-500" /> Go to Home
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl surface-2 border border-border text-xs font-extrabold text-primary hover:border-teal-500/40 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="size-4 text-teal-400" /> Download Report
          </button>

          <button
            onClick={() => setIsTeacherOpen(true)}
            className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            <GraduationCap className="size-4" /> Ask OS-Teacher
          </button>
        </div>
      </div>

      {/* Top Header Banner */}
      <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-teal-500/10 via-background to-amber-500/10 border border-teal-500/20 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30">
              <Award className="size-3.5 text-teal-500" /> Strict Bar-Raiser Recruiter Report
            </div>
            <h1 className="font-display text-3xl font-extrabold text-foreground tracking-tight">
              {session.job_role} Evaluation
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Target Company: <strong className="text-foreground">{session.company_name}</strong> • Round: <strong className="text-foreground">{session.interview_type}</strong> • Persona: <strong className="text-teal-600 dark:text-teal-400">{session.personality}</strong>
            </p>
          </div>

          {/* Hiring Recommendation Badge */}
          <div className="text-right shrink-0">
            <span className={`text-sm font-extrabold px-4 py-2 rounded-2xl border ${recBadgeColor} inline-block shadow-2xs`}>
              Bar Decision: {report.hiring_recommendation}
            </span>
          </div>
        </div>

        {/* Bar-Raiser Verdict Reason (if present) */}
        {report.candidate_verdict_reason && (
          <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1">
            <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="size-3.5" /> Bar-Raiser Executive Verdict Rationale
            </span>
            <p className="text-xs text-foreground font-medium leading-relaxed">
              {report.candidate_verdict_reason}
            </p>
          </div>
        )}

        {/* 5-Dimension Score Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-border/60">
          {[
            { label: "Overall Score", score: report.overall_score },
            { label: "Technical Depth", score: report.technical_score },
            { label: "Problem Solving", score: report.problem_solving_score },
            { label: "Communication", score: report.communication_score },
            { label: "Behavior & Culture", score: report.behavior_score },
          ].map((item) => (
            <div key={item.label} className="p-3.5 rounded-2xl bg-card border border-border/70 space-y-1 text-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{item.label}</span>
              <div className="font-mono font-extrabold text-2xl text-teal-600 dark:text-teal-400">{item.score} <span className="text-xs text-muted-foreground font-normal">/ 100</span></div>
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
                ? "Strong resume keywords match requirements well."
                : "Resume ATS optimization recommended to increase keyword density."}
            </p>
          </div>
        )}
      </div>

      {/* Red Flags & Missing Concepts Alerts (Strict Bar-Raiser Feedback) */}
      {((report.red_flags && report.red_flags.length > 0) || (report.missing_critical_concepts && report.missing_critical_concepts.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Red Flags Card */}
          {report.red_flags && report.red_flags.length > 0 && (
            <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/20 space-y-3">
              <h3 className="font-display text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <XCircle className="size-4 text-rose-500" /> High-Severity Red Flags / Hand-Waving
              </h3>
              <ul className="space-y-2">
                {report.red_flags.map((flag, i) => (
                  <li key={i} className="text-xs text-foreground font-medium flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Concepts Card */}
          {report.missing_critical_concepts && report.missing_critical_concepts.length > 0 && (
            <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 space-y-3">
              <h3 className="font-display text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <Code2 className="size-4 text-amber-500" /> Missing Technical Terms & Concepts
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {report.missing_critical_concepts.map((concept, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                  >
                    ⚠️ {concept}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recruiter Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Strengths */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-4">
          <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-500" /> Confirmed Strengths
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
            <AlertCircle className="size-4 text-amber-500" /> Strict Technical Growth Areas
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

      {/* Detailed Question-by-Question Evaluation Breakdown */}
      {report.question_evaluations && report.question_evaluations.length > 0 && (
        <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="size-4 text-teal-500" /> Detailed Question-by-Question Bar-Raiser Breakdown
            </h3>
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
              {report.question_evaluations.length} Questions Evaluated
            </span>
          </div>

          <div className="space-y-4">
            {report.question_evaluations.map((q) => {
              const isExpanded = expandedQuestion === q.question_number;
              const qScoreColor =
                q.score >= 85
                  ? "text-emerald-500"
                  : q.score >= 70
                  ? "text-amber-500"
                  : "text-rose-500";

              return (
                <div
                  key={q.question_number}
                  className="rounded-2xl bg-muted/40 border border-border/70 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedQuestion(isExpanded ? null : q.question_number)}
                    className="w-full p-4 flex items-center justify-between text-left gap-4 hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="size-7 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-teal-500/20">
                        Q{q.question_number}
                      </span>
                      <p className="font-display text-xs font-bold text-foreground line-clamp-1">
                        {q.question_text}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`font-mono text-sm font-extrabold ${qScoreColor}`}>
                        {q.score} / 100
                      </span>
                      {isExpanded ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-2 border-t border-border/50 space-y-4 text-xs">
                      {/* Candidate Answer */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Candidate Spoken Response:</span>
                        <p className="text-xs text-foreground bg-card p-3 rounded-xl border border-border/60 italic leading-relaxed">
                          "{q.answer_text}"
                        </p>
                      </div>

                      {/* Recruiter Feedback Critique */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Strict Recruiter Critique:</span>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                          {q.feedback}
                        </p>
                      </div>

                      {/* Covered & Missed Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {/* Covered */}
                        <div className="space-y-1.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="size-3" /> Key Aspects Covered
                          </span>
                          <ul className="space-y-1">
                            {q.key_points_covered.map((pt, idx) => (
                              <li key={idx} className="text-[11px] text-foreground font-medium flex items-center gap-1.5">
                                <span className="size-1 rounded-full bg-emerald-500" /> {pt}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Missed */}
                        <div className="space-y-1.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                            <AlertCircle className="size-3" /> Missed Technical Aspects
                          </span>
                          <ul className="space-y-1">
                            {q.missing_aspects.map((pt, idx) => (
                              <li key={idx} className="text-[11px] text-foreground font-medium flex items-center gap-1.5">
                                <span className="size-1 rounded-full bg-amber-500" /> {pt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recruiter Written Summary */}
      <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-3">
        <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
          <FileText className="size-4 text-teal-500" /> Executive Recruiter Summary Evaluation
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
          {report.interview_summary}
        </p>
      </div>

      {/* Targeted Post-Interview Learning Roadmap */}
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

      {/* Interview OS-Teacher Interactive Debrief Chat Modal */}
      <InterviewOSTeacherModal
        isOpen={isTeacherOpen}
        onClose={() => setIsTeacherOpen(false)}
        session={session}
        report={report}
      />
    </div>
  );
}

