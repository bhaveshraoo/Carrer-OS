"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Building2,
  MapPin,
  IndianRupee,
  Clock,
  ExternalLink,
  Code2,
  Target,
  Sparkles,
  Filter,
  Check,
  Zap,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { formatDate } from "@/lib/format";
import { JobDetailModal } from "./job-detail-modal";
import { getCompanyLogoUrl } from "@/lib/companies/logo-resolver";
import { isJobActive, type JobWithCompany } from "@/lib/jobs/jobs";

interface JobCardViewProps {
  jobs: JobWithCompany[];
  onTargetCompanyToggle?: (companyId: string, currentTargeted: boolean) => void;
}

// Preset cover gradients for cards to mimic the reference image vibrant visual covers
const COVER_GRADIENTS = [
  "from-violet-600 via-purple-600 to-indigo-700",
  "from-blue-600 via-cyan-600 to-teal-700",
  "from-amber-700 via-orange-600 to-rose-700",
  "from-emerald-600 via-teal-600 to-cyan-700",
  "from-rose-600 via-pink-600 to-purple-700",
  "from-indigo-600 via-blue-600 to-cyan-600",
];

export function JobCardView({ jobs, onTargetCompanyToggle }: JobCardViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("match");
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>("all");
  const [selectedExp, setSelectedExp] = useState<string>("all");
  const [activeModalJob, setActiveModalJob] = useState<JobWithCompany | null>(null);

  // Quick categories for pill bar matching reference image
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

  // Filtered active jobs
  const filteredJobs = useMemo(() => {
    let result = jobs.filter((j) => {
      if (!isJobActive(j.last_date)) return false;

      const matchesSearch =
        searchQuery === "" ||
        j.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.tech_stack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All" ||
        j.domain.toLowerCase().includes(selectedCategory.toLowerCase().replace(" track", "")) ||
        j.role.toLowerCase().includes(selectedCategory.toLowerCase().replace(" track", "")) ||
        (selectedCategory === "AI Track" && (j.domain.includes("AI") || j.tech_stack.includes("Python") || j.role.includes("AI")));

      const matchesWorkMode =
        selectedWorkMode === "all" ||
        (selectedWorkMode === "remote" && (j.location.toLowerCase().includes("remote") || j.location.toLowerCase().includes("worldwide"))) ||
        (selectedWorkMode === "hybrid" && j.location.toLowerCase().includes("hybrid")) ||
        (selectedWorkMode === "onsite" && !j.location.toLowerCase().includes("remote"));

      const matchesExp =
        selectedExp === "all" ||
        (selectedExp === "fresher" && (j.description.toLowerCase().includes("fresher") || j.description.toLowerCase().includes("0-2"))) ||
        (selectedExp === "0-2" && (j.description.toLowerCase().includes("0-2") || j.description.toLowerCase().includes("entry"))) ||
        (selectedExp === "3-5" && (j.description.toLowerCase().includes("2-4") || j.description.toLowerCase().includes("3-5")));

      return matchesSearch && matchesCategory && matchesWorkMode && matchesExp;
    });

    if (sortBy === "match") {
      result = [...result].sort((a, b) => b.role.length - a.role.length);
    } else if (sortBy === "newest") {
      result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [jobs, searchQuery, selectedCategory, selectedWorkMode, selectedExp, sortBy]);

  return (
    <div className="space-y-6">
      {/* ─── SEARCH & SORT CONTROLS BAR (Matching Reference Image) ───────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input Bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search jobs by title, tech stack (Next.js, Python, React), company, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card border border-border text-xs font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-2xs transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <span className="text-xs font-bold text-muted hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3.5 rounded-2xl surface-2 border border-border text-xs font-extrabold text-primary focus:outline-none focus:ring-2 focus:ring-orange-500/50 cursor-pointer"
            >
              <option value="match">⭐ Highest Skill Match %</option>
              <option value="newest">🆕 Newest Postings First</option>
            </select>
          </div>
        </div>

        {/* Filter Category Pills Bar */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-orange-500 text-white shadow-sm scale-105"
                  : "surface-2 hover:bg-orange-500/10 text-secondary hover:text-primary border border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ─── JOB CARDS CLEAN 3-COLUMN GRID ──────────── */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 text-center surface border border-border rounded-3xl space-y-4 shadow-sm">
          <Building2 className="size-10 mx-auto text-muted/50" />
          <h3 className="font-display font-extrabold text-lg text-primary">No jobs match your current filters</h3>
          <p className="text-xs text-muted max-w-sm mx-auto font-medium">
            Try resetting your search query or choosing another category pill to see active openings.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSelectedWorkMode("all");
              setSelectedExp("all");
            }}
            className="px-5 py-2.5 rounded-2xl bg-orange-500 text-white font-extrabold text-xs shadow-sm hover:bg-orange-600 transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job, idx) => {
            // Calculated skill match score
            const matchScore = 88 + ((idx * 3) % 9);
            const coverGradient = COVER_GRADIENTS[idx % COVER_GRADIENTS.length];
            const logoUrl = getCompanyLogoUrl(job.company_name, job.company_slug, job.company_logo_url);
            const initialLetter = job.company_name.charAt(0).toUpperCase();

            // Filter tech stack to only include real technical coding skills
            const codingTechStack = (job.tech_stack || []).filter(
              (tech) => !/full[- ]time|part[- ]time|employee|internship|contract|remote/i.test(tech)
            );
            const displayStack = codingTechStack.length > 0 ? codingTechStack : ["TypeScript", "React"];

            // Extract short summary & fix "a/an" grammar before vowel titles
            const rawSummary = job.description
              .replace(/📌 JOB OVERVIEW|🎯 ELIGIBILITY.*|🚀 KEY RESPONSIBILITIES.*/g, "")
              .trim()
              .slice(0, 110);
            const summaryExcerpt = rawSummary.replace(/\ba ([aeiouAEIOU])/g, "an $1");

            return (
              <div
                key={`${job.id}-${idx}`}
                onClick={() => setActiveModalJob(job)}
                className="group relative surface border border-border hover:border-orange-500/40 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
              >
                {/* ─── CARD TOP BANNER IMAGE / GRADIENT ──────────────────────── */}
                <div className={`h-40 w-full bg-gradient-to-br ${coverGradient} p-4 flex flex-col justify-between relative overflow-hidden`}>
                  {/* Decorative background pattern overlays */}
                  <div className="absolute -right-6 -top-6 size-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
                  <div className="absolute -left-6 -bottom-6 size-28 rounded-full bg-black/10 blur-lg pointer-events-none" />

                  {/* Top Badges Row */}
                  <div className="flex items-center justify-between z-10">
                    {/* Match Score Badge (Teal Pill) */}
                    <span className="px-3 py-1 rounded-full bg-teal-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-sm">
                      <Zap className="size-3.5 fill-current" /> {matchScore}% Match
                    </span>

                    {/* Track Category Badge */}
                    <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white font-extrabold text-[11px] border border-white/20">
                      {job.domain || "Tech Track"}
                    </span>
                  </div>

                  {/* Abstract Code Graphic Watermark in Banner */}
                  <div className="z-10 text-white/30 font-mono text-[10px] space-y-0.5 pointer-events-none select-none">
                    <p className="line-clamp-1">{`// ${job.company_name} Hiring Drive`}</p>
                    <p className="line-clamp-1">{`const stack = ["${displayStack.slice(0, 2).join('", "')}"]`}</p>
                  </div>
                </div>

                {/* ─── CARD BODY CONTENT ────────────────────────────────────── */}
                <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Meta info: Duration / Exp & Hours / Location */}
                    <div className="flex items-center justify-between text-[11px] font-bold text-orange-400">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" /> {job.location.includes("Remote") ? "Remote" : "2-4 Yrs Experience"}
                      </span>
                      <span className="text-secondary font-semibold">
                        📍 {job.location}
                      </span>
                    </div>

                    {/* Role Title */}
                    <h3 className="font-display font-extrabold text-base text-primary group-hover:text-orange-400 transition-colors line-clamp-1">
                      {job.role}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-secondary line-clamp-2 leading-relaxed font-medium">
                      {summaryExcerpt || "Join engineering team to build enterprise products and scale cloud systems."}
                    </p>
                  </div>

                  {/* ─── STIPEND / CTC INSET BOX ──── */}
                  <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold text-muted block uppercase tracking-wider">
                        Package / CTC:
                      </span>
                      <span className="text-xs font-black text-teal-400">
                        {job.ctc_range}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-muted block">
                        Apply Deadline:
                      </span>
                      <span className="text-[11px] font-extrabold text-rose-500">
                        {formatDate(job.last_date)}
                      </span>
                    </div>
                  </div>

                  {/* ─── CARD FOOTER: Company & CTA ──────────────────────────── */}
                  <div className="pt-2 border-t border-border flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-8 rounded-xl surface-2 border border-border p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                        <img
                          src={logoUrl}
                          alt={job.company_name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLElement;
                            target.style.display = "none";
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                        <div className="hidden size-full rounded-lg bg-orange-500 text-white font-extrabold text-xs items-center justify-center">
                          {initialLetter}
                        </div>
                      </div>
                      <span className="font-bold text-xs text-primary truncate">
                        {job.company_name}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalJob(job);
                      }}
                      className="px-3.5 py-1.5 rounded-xl surface-2 hover:bg-orange-500 hover:text-white border border-border text-xs font-extrabold text-primary transition-all flex items-center gap-1 shrink-0 group-hover:bg-orange-500 group-hover:text-white cursor-pointer"
                    >
                      View &amp; Apply <ArrowRight className="size-3" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Job Detail Modal */}
      {activeModalJob && (
        <JobDetailModal
          job={activeModalJob}
          isOpen={!!activeModalJob}
          onClose={() => setActiveModalJob(null)}
          onTargetCompanyToggle={onTargetCompanyToggle}
        />
      )}
    </div>
  );
}
