"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Rocket,
  Search,
  Filter,
  Sparkles,
  Users,
  Clock,
  Award,
  Zap,
  ChevronRight,
  ShieldCheck,
  Building2,
  DollarSign,
  Trophy,
  Code2,
  Briefcase,
  CheckCircle2,
  ArrowUpRight,
  FileText,
  Download,
  MessageSquare,
  AlertCircle,
  Video,
  ExternalLink,
  Calendar,
  Layers,
} from "lucide-react";
import { MOCK_PROJECTS } from "@/lib/projects/data";
import { useNotifications } from "@/components/notifications/notification-provider";

const CATEGORIES = [
  "All",
  "AI Track",
  "Web Development",
  "Mobile Apps",
  "DevOps",
  "Cyber Security",
  "Blockchain",
  "UI UX",
  "ML Systems",
  "Open Source",
];

import { useEffect } from "react";

export default function ProjectsMarketplacePage() {
  const { notify } = useNotifications();
  const [activeTab, setActiveTab] = useState<"marketplace" | "my_applications">("marketplace");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "starting_soon" | "highest_match">("highest_match");
  const [hasResume, setHasResume] = useState(false);
  const [candidateSkillsText, setCandidateSkillsText] = useState<string | null>(null);

  useEffect(() => {
    async function checkResume() {
      try {
        const res = await fetch("/api/resume/analyze");
        const data = await res.json();
        if (data?.resume && data?.resume?.status === "analyzed") {
          setHasResume(true);
          const report = data.report || {};
          const skills = [
            ...(report.skills || []),
            ...(report.keywords || []),
            data.resume.raw_text || "",
          ].join(" ");
          setCandidateSkillsText(skills);
        } else {
          setHasResume(false);
        }
      } catch {
        setHasResume(false);
      }
    }
    checkResume();
  }, []);

  const calculateProjectMatch = (techStack: string[], category: string): number | null => {
    if (!hasResume || !candidateSkillsText) return null;
    const norm = candidateSkillsText.toLowerCase();
    let count = 0;
    for (const tech of techStack) {
      if (norm.includes(tech.toLowerCase())) count++;
    }
    const ratio = techStack.length > 0 ? count / techStack.length : 0.5;
    return Math.max(52, Math.min(98, Math.round(ratio * 50 + 48)));
  };

  // Dynamic Applications state (starts empty for fresh accounts)
  const [userApplications, setUserApplications] = useState<any[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("careeros_user_project_applications");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const appliedCount = userApplications.length;
  const confirmedCount = userApplications.filter((a) => a.status === "selected").length;
  const interviewCount = userApplications.filter((a) => a.status === "interview_scheduled").length;
  const notSelectedCount = userApplications.filter((a) => a.status === "not_selected").length;

  // Filter projects
  const filteredProjects = MOCK_PROJECTS.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" ||
      p.category === selectedCategory ||
      (selectedCategory === "AI Track" && (p.category === "AI Track" || p.category === "AI")) ||
      (selectedCategory === "ML Systems" && (p.category === "ML Systems" || p.category === "ML"));

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === "highest_match") {
      const matchA = calculateProjectMatch(a.techStack, a.category) ?? 0;
      const matchB = calculateProjectMatch(b.techStack, b.category) ?? 0;
      return matchB - matchA;
    }
    if (sortBy === "latest") return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    if (sortBy === "starting_soon") return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    return 0;
  });

  function handleDownloadOffer() {
    notify({
      type: "success",
      icon: "📜",
      title: "Offer Letter Downloaded!",
      body: "Downloaded official CareerOS Internship Offer Letter (PDF).",
      autoDismiss: 3500,
    });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">

      {/* ── 1. CLEAN HEADER NAVIGATION ── */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-surface to-surface">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30">
              <Rocket className="size-3.5 text-orange-500" /> CareerOS Projects & Internship Hub
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              Real-World SaaS Projects & <span className="text-orange-400">Internship Teams</span>
            </h1>

            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              Join production engineering teams, build sellable software products, earn verified 1–6 month Internship Certificates, LORs, and receive 5% revenue sharing on project sales.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard/projects/leaderboard"
              className="px-4 py-2.5 rounded-2xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 transition-all flex items-center gap-2 shadow-md shadow-orange-500/20"
            >
              <Trophy className="size-4" /> Leaderboard & Badges
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. CLEAN SEGMENTED TAB SELECTOR ── */}
      <div className="surface p-1.5 rounded-2xl border border-border flex items-center gap-1 max-w-md">
        <button
          onClick={() => setActiveTab("marketplace")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 ${
            activeTab === "marketplace"
              ? "bg-orange-500 text-white shadow-md"
              : "text-secondary hover:text-primary"
          }`}
        >
          <Briefcase className="size-4" /> Marketplace ({MOCK_PROJECTS.length})
        </button>

        <button
          onClick={() => setActiveTab("my_applications")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 ${
            activeTab === "my_applications"
              ? "bg-orange-500 text-white shadow-md"
              : "text-secondary hover:text-primary"
          }`}
        >
          <CheckCircle2 className="size-4" /> My Tracker ({appliedCount})
        </button>
      </div>

      {/* ── VIEW A: MY APPLICATIONS & STATUS TRACKER ── */}
      {activeTab === "my_applications" && (
        <div className="space-y-6 animate-fade-up">

          {/* KPI Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="surface p-4 rounded-2xl border border-border text-center space-y-1">
              <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Applied Projects</p>
              <p className="font-display text-2xl font-extrabold text-primary">{appliedCount}</p>
            </div>
            <div className="surface p-4 rounded-2xl border border-teal-500/30 text-center space-y-1">
              <p className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Confirmed & Selected</p>
              <p className="font-display text-2xl font-extrabold text-teal-400">{confirmedCount}</p>
            </div>
            <div className="surface p-4 rounded-2xl border border-orange-500/30 text-center space-y-1">
              <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Interview Scheduled</p>
              <p className="font-display text-2xl font-extrabold text-orange-400">{interviewCount}</p>
            </div>
            <div className="surface p-4 rounded-2xl border border-border text-center space-y-1">
              <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Not Selected</p>
              <p className="font-display text-2xl font-extrabold text-secondary">{notSelectedCount}</p>
            </div>
          </div>

          {/* Empty State when fresh user has not applied to any project cohort */}
          {userApplications.length === 0 ? (
            <div className="surface rounded-3xl p-10 border border-border text-center space-y-4 my-6">
              <div className="size-16 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto">
                <Rocket className="size-8 text-orange-500" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-display text-xl font-extrabold text-primary">No Active Project Applications Yet</h3>
                <p className="text-xs text-secondary leading-relaxed">
                  You haven&apos;t applied to any project cohorts yet. Browse the Marketplace to pitch for your preferred domain and join an active engineering team!
                </p>
              </div>
              <button
                onClick={() => setActiveTab("marketplace")}
                className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all inline-flex items-center gap-2"
              >
                <Briefcase className="size-4" /> Explore Marketplace Cohorts
              </button>
            </div>
          ) : (
            /* Applications Cards List */
            <div className="space-y-4">
              {userApplications.map((app) => (
              <div
                key={app.id}
                className="surface rounded-3xl p-6 sm:p-7 border border-border space-y-5 shadow-sm hover:border-orange-500/30 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-xl font-bold text-primary">{app.project.title}</h3>
                      <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                        {app.domain}
                      </span>
                    </div>
                    <p className="text-xs text-muted">Applied on {app.appliedAt} · Stipend: {app.project.stipend} · {app.project.durationMonths} Months Track</p>
                  </div>

                  {/* Status Badge */}
                  <span className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase border flex items-center gap-1.5 shrink-0 ${
                    app.status === "selected"
                      ? "bg-teal-500/20 text-teal-400 border-teal-500/30"
                      : app.status === "interview_scheduled"
                      ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                      : "bg-surface-2 text-secondary border-border"
                  }`}>
                    {app.status === "selected" && <CheckCircle2 className="size-3.5" />}
                    {app.status === "interview_scheduled" && <Video className="size-3.5" />}
                    {app.status === "not_selected" && <AlertCircle className="size-3.5 text-red-400" />}
                    {app.status.replace("_", " ")}
                  </span>
                </div>

                {/* CONDITION 1: ACCEPTED & SELECTED 🎉 */}
                {app.status === "selected" && (
                  <div className="surface-2 p-5 rounded-2xl border border-teal-500/30 space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-teal-400 flex items-center gap-2">
                        <CheckCircle2 className="size-4" /> Congratulations! You have been selected for this project.
                      </h4>
                      <p className="text-xs text-secondary leading-relaxed">
                        Your application pitch was approved by Team Leader Aarav Gupta. You are now officially enrolled in the 3-Month Internship cohort with guaranteed certificate, LOR, and 5% revenue share.
                      </p>
                    </div>

                    {/* Offer Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        onClick={handleDownloadOffer}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-500 text-white hover:brightness-110 flex items-center gap-2 shadow-sm"
                      >
                        <Download className="size-3.5" /> Download Offer Letter (PDF)
                      </button>

                      <a
                        href={app.discordGroupUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl text-xs font-bold surface hover:bg-surface-2 border border-border text-primary flex items-center gap-2"
                      >
                        <MessageSquare className="size-3.5 text-indigo-400" /> Join Team Discord Channel
                      </a>

                      <Link
                        href={`/dashboard/projects/${app.project.id}/workspace`}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 text-white hover:brightness-110 flex items-center gap-2 shadow-sm"
                      >
                        <Zap className="size-3.5" /> Enter Team Workspace
                      </Link>
                    </div>
                  </div>
                )}

                {/* CONDITION 2: INTERVIEW SCHEDULED 📅 */}
                {app.status === "interview_scheduled" && (
                  <div className="surface-2 p-5 rounded-2xl border border-orange-500/30 space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-orange-400 flex items-center gap-2">
                        <Video className="size-4" /> 1-on-1 Technical Interview Scheduled
                      </h4>
                      <p className="text-xs text-secondary">
                        Date & Time: <strong className="text-primary">{app.interviewDate}</strong> with Mentor {app.mentorName}.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <a
                        href={app.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 text-white hover:brightness-110 flex items-center gap-2 shadow-sm"
                      >
                        <Video className="size-3.5" /> Join Google Meet Interview
                      </a>
                    </div>
                  </div>
                )}

                {/* CONDITION 3: NOT SELECTED WITH CONSTRUCTIVE FEEDBACK 💡 */}
                {app.status === "not_selected" && app.feedback && (
                  <div className="surface-2 p-5 rounded-2xl border border-border space-y-3">
                    <h4 className="font-bold text-xs text-red-400 flex items-center gap-2 uppercase tracking-wider">
                      <AlertCircle className="size-4" /> Why you were not selected for this cohort
                    </h4>

                    <p className="text-xs text-secondary leading-relaxed surface p-3.5 rounded-xl border border-border">
                      <strong className="text-primary font-semibold">Team Leader Feedback: </strong>
                      {app.feedback}
                    </p>

                    <div className="pt-2 flex items-center justify-between gap-3 text-xs">
                      <span className="text-muted">Recommended: Boost WebSocket score on DSA Prep to rank higher for next week's cohort.</span>
                      <Link
                        href="/dashboard/prep"
                        className="font-bold text-orange-400 hover:underline flex items-center gap-1 shrink-0"
                      >
                        Open DSA Prep <ChevronRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          )}

        </div>
      )}

      {/* ── VIEW B: PROJECT MARKETPLACE GRID ── */}
      {activeTab === "marketplace" && (
        <>
          {/* SEARCH & FILTER TOOLBAR */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">

              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="size-4 text-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects by title, tech stack (Next.js, Python, Rust)..."
                  className="w-full h-10 pl-10 pr-4 rounded-2xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500/50"
                />
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-medium whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="h-10 px-3 rounded-2xl surface-2 border border-border text-xs font-bold text-primary focus:outline-none cursor-pointer"
                >
                  <option value="highest_match">⭐ Highest Skill Match %</option>
                  <option value="latest">🆕 Latest Projects</option>
                  <option value="starting_soon">⏰ Starting Soon</option>
                </select>
              </div>
            </div>

            {/* Category Pill Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                    selectedCategory === cat
                      ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                      : "surface-2 text-secondary hover:text-primary border-border"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* PROJECT CARDS GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="surface rounded-3xl border border-border hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-md hover:-translate-y-1"
              >
                {/* Project Image & Cover Badge */}
                <div className="relative h-44 w-full overflow-hidden bg-surface-2">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />

                  {/* Match Badge */}
                  {(() => {
                    const matchScore = calculateProjectMatch(project.techStack, project.category);
                    if (matchScore !== null) {
                      return (
                        <div className="absolute top-3 left-3 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                          <Sparkles className="size-3" /> {matchScore}% Match
                        </div>
                      );
                    } else {
                      return (
                        <Link
                          href="/dashboard/resume"
                          className="absolute top-3 left-3 bg-amber-400 text-slate-950 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md hover:bg-amber-300 transition-colors"
                        >
                          Upload Resume
                        </Link>
                      );
                    }
                  })()}

                  {/* Category Pill */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                    {project.category}
                  </div>
                </div>

                {/* Project Content Body */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5 text-orange-500" /> {project.durationMonths} Months Internship
                      </span>
                      <span className="text-orange-400 font-bold">{project.weeklyHours} hrs/week</span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-primary group-hover:text-orange-400 transition-colors line-clamp-1">
                      {project.title}
                    </h3>

                    <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    {/* Product Value & Stipend */}
                    <div className="surface-2 p-3 rounded-2xl border border-border text-xs space-y-1">
                      <div className="flex justify-between items-center text-primary font-bold">
                        <span>Stipend:</span>
                        <span className="text-teal-400 font-mono">{project.stipend}</span>
                      </div>
                      <div className="flex justify-between items-center text-muted text-[11px]">
                        <span>Product Val:</span>
                        <span>{project.estimatedProductValue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Seats Progress & Tech Stack */}
                  <div className="space-y-3 pt-2">
                    {/* Seats Progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-muted">Team Seats Filled</span>
                        <span className="text-orange-400">{project.filledSeats} / {project.teamSize} ({project.remainingSeats} Left)</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden border border-border">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${(project.filledSeats / project.teamSize) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span key={tech} className="text-[10px] font-mono font-bold surface-2 px-2 py-0.5 rounded-lg border border-border text-secondary">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Mentor Info */}
                    <div className="flex items-center gap-2 pt-2 border-t border-border text-xs text-muted">
                      <img src={project.mentor.avatar} alt={project.mentor.name} className="size-6 rounded-full object-cover" />
                      <span className="truncate">Mentor: <strong className="text-primary">{project.mentor.name}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-surface-2 border-t border-border flex items-center justify-between gap-2">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="w-full py-2.5 rounded-2xl text-xs font-bold bg-orange-500 text-white hover:brightness-110 transition-all flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span>View Details & Apply</span>
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
}
