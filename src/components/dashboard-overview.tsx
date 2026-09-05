"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  FileText,
  Building2,
  Code2,
  ArrowRight,
  Target,
  CheckCircle2,
  Play,
  ChevronRight,
  ShieldCheck,
  Flame,
  Award,
  Zap,
  Rocket,
  DollarSign,
  Trophy,
  Compass,
} from "lucide-react";
import { ScoreRing } from "@/components/score-ring";
import { CANONICAL_SCORES } from "@/lib/metrics/canonical-scores";

interface DashboardOverviewProps {
  displayName: string;
  email: string;
  hasResume?: boolean;
  latestResumeScore: number | null;
  parsedResumeJson: any;
  targetCompanies: { id: string; name: string }[];
  allCompaniesCount: number;
  totalQuestionsCount: number;
  recommendedTopics: string[];
  allQuestions?: { id: string; title: string; topic: string; difficulty: string }[];
}

export function DashboardOverview({
  displayName,
  email,
  hasResume = false,
  latestResumeScore,
  targetCompanies,
  allCompaniesCount,
  totalQuestionsCount,
  allQuestions = [],
}: DashboardOverviewProps) {
  const [greetingTime, setGreetingTime] = useState("Hello");
  const [solvedCount, setSolvedCount] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreetingTime("Good Morning");
    else if (hour < 18) setGreetingTime("Good Afternoon");
    else setGreetingTime("Good Evening");

    // Read solved DSA count from localStorage
    try {
      let count = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("careeros-dsa-") && localStorage.getItem(key) === "completed") {
          count++;
        }
      }
      setSolvedCount(count);
    } catch {
      setSolvedCount(0);
    }

    // Background prefetch /api/jobs
    try {
      fetch("/api/jobs", { cache: "no-store" }).catch(() => {});
    } catch {
      // Ignore
    }
  }, []);

  const resumeScore = latestResumeScore ?? 0;
  const targetCount = targetCompanies.length;
  const firstName = displayName.split(" ")[0];

  // Determine recommended question
  const nextQuestionIndex = solvedCount;
  const nextQuestion = allQuestions.length > 0
    ? allQuestions[nextQuestionIndex % allQuestions.length]
    : { title: "Two Sum (Hash Map Lookup)", topic: "Arrays & Hashing", difficulty: "Easy" };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">

      {/* ── 1. CENTERED HERO COMMAND BANNER ── */}
      <div className="relative surface border border-orange-500/30 rounded-3xl p-8 text-center space-y-6 shadow-xl overflow-hidden bg-gradient-to-b from-orange-500/10 via-surface to-surface">
        {/* Glow ambient background element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-orange-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          {/* Centered Top Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30 shadow-sm">
            <Sparkles className="size-3.5" /> Placement Command Center
          </div>

          {/* Centered Greeting */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">
            {greetingTime}, <span className="text-orange-400">{firstName}</span> 👋
          </h1>

          <p className="text-sm sm:text-base text-secondary leading-relaxed">
            Your all-in-one career optimization platform — ATS resume scanner, target company hiring maps, DSA practice roadmaps, and real-world 1–6 month SaaS project internships.
          </p>

          {/* Centered Target Companies Chips */}
          {targetCompanies.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <span className="text-xs text-muted font-semibold">Active Targets:</span>
              {targetCompanies.map((c) => (
                <span
                  key={c.id}
                  className="text-xs font-bold text-primary surface-2 px-3 py-1 rounded-xl border border-border flex items-center gap-1.5 shadow-sm"
                >
                  <Building2 className="size-3 text-orange-500" /> {c.name}
                </span>
              ))}
            </div>
          ) : (
            <div className="pt-1">
              <span className="text-xs text-muted font-medium">No target companies selected yet. Select targets in Companies Hub.</span>
            </div>
          )}
        </div>

        {/* Centered Readiness Ring Card */}
        <div className="relative z-10 pt-2 flex items-center justify-center">
          <div className="surface-2 p-5 rounded-3xl border border-border shadow-lg flex items-center gap-6 max-w-md w-full justify-center">
            {hasResume ? (
              <>
                <ScoreRing score={resumeScore} size={80} label="Readiness" />
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-1 text-xs font-bold text-teal-400">
                    <TrendingUp className="size-3.5" /> Verified ATS Analysis
                  </div>
                  <p className="font-display text-lg font-bold text-primary">
                    {resumeScore >= 80 ? "Placement Ready" : "Optimization Needed"}
                  </p>
                  <p className="text-xs text-muted">
                    ATS Score: <strong className="text-primary">{resumeScore}/100</strong>
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center space-y-3 w-full py-1">
                <div className="space-y-1">
                  <p className="font-display text-base font-bold text-primary">No Resume Uploaded Yet</p>
                  <p className="text-xs text-muted">Upload your resume to calculate your real ATS score & placement readiness.</p>
                </div>
                <Link
                  href="/dashboard/resume"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 shadow-md shadow-orange-500/20 transition-all"
                >
                  <FileText className="size-4" /> Upload Your Resume
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. BALANCED 4-METRIC KPI CARDS ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Metric 1: Resume */}
        <div className="surface p-5 rounded-3xl border border-border hover:border-orange-500/40 transition-all duration-300 space-y-3 shadow-md group">
          <div className="flex items-center justify-between">
            <div className="size-10 rounded-xl bg-orange-500/15 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="size-5" />
            </div>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${hasResume ? "text-teal-400 bg-teal-500/10 border-teal-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20"}`}>
              {hasResume ? "Verified Score" : "Action Required"}
            </span>
          </div>

          <div>
            <p className="text-xs font-bold text-muted uppercase tracking-wider">ATS Resume Score</p>
            {hasResume ? (
              <h3 className="font-display text-2xl font-extrabold text-primary mt-1">
                {resumeScore} <span className="text-xs text-muted font-normal">/ 100</span>
              </h3>
            ) : (
              <h3 className="font-display text-base font-bold text-amber-400 mt-1">
                Not Uploaded
              </h3>
            )}
          </div>

          <Link
            href="/dashboard/resume"
            className="text-xs font-bold text-orange-400 hover:text-orange-300 inline-flex items-center gap-1 pt-1"
          >
            {hasResume ? "Optimize Resume" : "Upload Resume"} <ChevronRight className="size-3.5" />
          </Link>
        </div>

        {/* Metric 2: Target Companies */}
        <div className="surface p-5 rounded-3xl border border-border hover:border-teal-500/40 transition-all duration-300 space-y-3 shadow-md group">
          <div className="flex items-center justify-between">
            <div className="size-10 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="size-5" />
            </div>
            <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
              {targetCount} Active
            </span>
          </div>

          <div>
            <p className="text-xs font-bold text-muted uppercase tracking-wider">Target Companies</p>
            <h3 className="font-display text-2xl font-extrabold text-primary mt-1">
              {targetCount} <span className="text-xs text-muted font-normal">of {allCompaniesCount}</span>
            </h3>
          </div>

          <Link
            href="/dashboard/companies"
            className="text-xs font-bold text-teal-400 hover:text-teal-300 inline-flex items-center gap-1 pt-1"
          >
            Browse Companies <ChevronRight className="size-3.5" />
          </Link>
        </div>

        {/* Metric 3: DSA Prep */}
        <div className="surface p-5 rounded-3xl border border-border hover:border-orange-500/40 transition-all duration-300 space-y-3 shadow-md group">
          <div className="flex items-center justify-between">
            <div className="size-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Code2 className="size-5" />
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              {solvedCount} Solved
            </span>
          </div>

          <div>
            <p className="text-xs font-bold text-muted uppercase tracking-wider">DSA Practice Progress</p>
            <h3 className="font-display text-2xl font-extrabold text-primary mt-1">
              {solvedCount} <span className="text-xs text-muted font-normal">of {totalQuestionsCount} Solved</span>
            </h3>
          </div>

          <Link
            href="/dashboard/prep"
            className="text-xs font-bold text-orange-400 hover:text-orange-300 inline-flex items-center gap-1 pt-1"
          >
            Practice Workspace <ChevronRight className="size-3.5" />
          </Link>
        </div>

        {/* Metric 4: Projects & Internship Hub */}
        <div className="surface p-5 rounded-3xl border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 space-y-3 shadow-md group bg-orange-500/5">
          <div className="flex items-center justify-between">
            <div className="size-10 rounded-xl bg-orange-500/15 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Rocket className="size-5" />
            </div>
            <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
              SaaS Teams
            </span>
          </div>

          <div>
            <p className="text-xs font-bold text-muted uppercase tracking-wider">Internship Hub</p>
            <h3 className="font-display text-2xl font-extrabold text-primary mt-1">
              Projects &amp; Teams
            </h3>
          </div>

          <Link
            href="/dashboard/projects"
            className="text-xs font-bold text-orange-400 hover:text-orange-300 inline-flex items-center gap-1 pt-1"
          >
            Track &amp; Apply <ChevronRight className="size-3.5" />
          </Link>
        </div>

      </div>

      {/* ── 3. BALANCED CORE MODULE TILES ── */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
            Core Modules
          </span>
          <h2 className="font-display text-2xl font-bold text-primary">
            Career Command Hubs
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Module 0: Roadmaps */}
          <div className="surface rounded-3xl p-6 border border-orange-500/30 hover:border-orange-500/50 transition-all space-y-4 flex flex-col justify-between group shadow-md hover:-translate-y-1 bg-orange-500/5">
            <div className="space-y-3">
              <div className="size-12 rounded-2xl bg-orange-500/15 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="size-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-primary group-hover:text-orange-400 transition-colors">
                Personalized Roadmaps
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                Structured skill trees, daily study pacing, Gemini custom tracks, backlog extensions, and certificates.
              </p>
            </div>

            <Link
              href="/dashboard/roadmaps"
              className="px-4 py-2 rounded-2xl text-xs font-bold bg-orange-500 text-white hover:brightness-110 transition-all flex items-center justify-between shadow-md shadow-orange-500/20"
            >
              <span>View Roadmaps</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Module 1: Resume */}
          <div className="surface rounded-3xl p-6 border border-border hover:border-orange-500/50 transition-all space-y-4 flex flex-col justify-between group shadow-md hover:-translate-y-1">
            <div className="space-y-3">
              <div className="size-12 rounded-2xl bg-orange-500/15 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="size-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-primary group-hover:text-orange-400 transition-colors">
                Resume Intelligence
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                Instant ATS score check, keyword copy pills, and AI metric bullet rewrites with PDF export.
              </p>
            </div>

            <Link
              href="/dashboard/resume"
              className="px-4 py-2 rounded-2xl text-xs font-bold bg-orange-500 text-white hover:brightness-110 transition-all flex items-center justify-between shadow-md shadow-orange-500/20"
            >
              <span>Analyse Resume</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Module 2: Target Companies */}
          <div className="surface rounded-3xl p-6 border border-border hover:border-teal-500/50 transition-all space-y-4 flex flex-col justify-between group shadow-md hover:-translate-y-1">
            <div className="space-y-3">
              <div className="size-12 rounded-2xl bg-teal-500/15 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="size-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-primary group-hover:text-teal-400 transition-colors">
                Target Companies
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                Explore tech companies, verified product vs service tiers, hiring timelines, and skills.
              </p>
            </div>

            <Link
              href="/dashboard/companies"
              className="px-4 py-2 rounded-2xl text-xs font-bold bg-teal-500 text-white hover:brightness-110 transition-all flex items-center justify-between shadow-md shadow-teal-500/20"
            >
              <span>Browse Companies</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Module 3: DSA Prep */}
          <div className="surface rounded-3xl p-6 border border-border hover:border-orange-500/50 transition-all space-y-4 flex flex-col justify-between group shadow-md hover:-translate-y-1">
            <div className="space-y-3">
              <div className="size-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Code2 className="size-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-primary group-hover:text-orange-400 transition-colors">
                DSA Evaluator
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                Domain roadmaps, interactive visualizer stepper, code writer, and AI mistake breakdown.
              </p>
            </div>

            <Link
              href="/dashboard/prep"
              className="px-4 py-2 rounded-2xl text-xs font-bold bg-orange-500 text-white hover:brightness-110 transition-all flex items-center justify-between shadow-md shadow-orange-500/20"
            >
              <span>Start Practice</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Module 4: Tech Jobs Swipe Deck */}
          <div className="surface rounded-3xl p-6 border border-teal-500/30 hover:border-teal-500/50 transition-all space-y-4 flex flex-col justify-between group shadow-md hover:-translate-y-1 bg-teal-500/5">
            <div className="space-y-3">
              <div className="size-12 rounded-2xl bg-teal-500/15 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="size-6 text-teal-400" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-teal-400 bg-teal-500/15 px-2 py-0.5 rounded-full border border-teal-500/30">
                  🔥 CareerSwipe Deck
                </span>
                <h3 className="font-display text-lg font-bold text-primary group-hover:text-teal-400 transition-colors pt-1">
                  Tech Jobs Hub
                </h3>
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                Swipe verified tech roles, get live ATS Resume Match %, and 1-click skill gap roadmaps.
              </p>
            </div>

            <Link
              href="/dashboard/jobs"
              className="px-4 py-2 rounded-2xl text-xs font-bold bg-teal-500 text-white hover:brightness-110 transition-all flex items-center justify-between shadow-md shadow-teal-500/20"
            >
              <span>Explore Tech Jobs</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Module 5: AI Mock Interview Engine */}
          <div className="surface rounded-3xl p-6 border border-purple-500/30 hover:border-purple-500/50 transition-all space-y-4 flex flex-col justify-between group shadow-md hover:-translate-y-1 bg-purple-500/5">
            <div className="space-y-3">
              <div className="size-12 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="size-6 text-purple-400" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded-full border border-purple-500/30">
                  🎙️ Voice AI Simulator
                </span>
                <h3 className="font-display text-lg font-bold text-primary group-hover:text-purple-400 transition-colors pt-1">
                  AI Mock Interview
                </h3>
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                FAANG bar-raiser AI interviewer, 5 personalities, strict grading, and recruiter report card.
              </p>
            </div>

            <Link
              href="/dashboard/interview"
              className="px-4 py-2 rounded-2xl text-xs font-bold bg-purple-600 text-white hover:brightness-110 transition-all flex items-center justify-between shadow-md shadow-purple-500/20"
            >
              <span>Start Voice Interview</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Module 6: Projects & Internship Hub */}
          <div className="surface rounded-3xl p-6 border border-orange-500/30 hover:border-orange-500/50 transition-all space-y-4 flex flex-col justify-between group shadow-md hover:-translate-y-1 bg-orange-500/5">
            <div className="space-y-3">
              <div className="size-12 rounded-2xl bg-orange-500/15 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Rocket className="size-6 text-orange-500" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-orange-400 bg-orange-500/15 px-2 py-0.5 rounded-full border border-orange-500/30">
                  🏆 Verified Certs &amp; 5% Rev Share
                </span>
                <h3 className="font-display text-lg font-bold text-primary group-hover:text-orange-400 transition-colors pt-1">
                  Projects &amp; Internships
                </h3>
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                1-6 Month SaaS internships, guaranteed certificates, LORs, 5% revenue sharing, and offer letters.
              </p>
            </div>

            <Link
              href="/dashboard/projects"
              className="px-4 py-2 rounded-2xl text-xs font-bold bg-orange-500 text-white hover:brightness-110 transition-all flex items-center justify-between shadow-md shadow-orange-500/20"
            >
              <span>Projects &amp; Tracker</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

        </div>
      </div>

      {/* ── 4. CENTERED DAILY PRACTICE SPOTLIGHT ── */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-7 text-center space-y-4 bg-orange-500/5 shadow-xl max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/20">
          <Sparkles className="size-3.5" /> Today's Recommended Question Focus
        </div>

        {solvedCount === 0 ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="font-display text-2xl font-bold text-primary">
                Start Your Technical DSA Track 🚀
              </h3>
              <p className="text-xs text-secondary max-w-md mx-auto">
                You haven't completed any DSA practice questions yet. Begin with fundamental data structures like Arrays &amp; Strings.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <Link
                href="/dashboard/prep"
                className="px-6 py-2.5 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, var(--orange) 0%, #fb923c 100%)",
                  boxShadow: "0 4px 15px rgba(249,115,22,0.35)",
                }}
              >
                <Play className="size-4 fill-white" /> Start DSA Track
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-teal-400 bg-teal-500/10 px-3 py-0.5 rounded-full border border-teal-500/20">
                Recommended Question #{solvedCount + 1}
              </span>
              <h3 className="font-display text-2xl font-bold text-primary pt-1">
                {nextQuestion.title}
              </h3>
              <p className="text-xs text-secondary">
                Topic: <strong className="text-primary">{nextQuestion.topic}</strong> · Difficulty: <strong className="text-orange-400 capitalize">{nextQuestion.difficulty}</strong>
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <Link
                href="/dashboard/prep"
                className="px-6 py-2.5 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, var(--orange) 0%, #fb923c 100%)",
                  boxShadow: "0 4px 15px rgba(249,115,22,0.35)",
                }}
              >
                <Play className="size-4 fill-white" /> Solve Question #{solvedCount + 1}
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
