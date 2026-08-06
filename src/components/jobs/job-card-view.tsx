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
  ChevronRight,
  Flame,
  Zap,
  Star,
  Award,
  BookOpen,
} from "lucide-react";
import { formatDate } from "@/lib/format";
import { JobDetailModal } from "./job-detail-modal";
import { getCompanyLogoUrl } from "@/lib/companies/logo-resolver";
import { isJobActive, type JobWithCompany } from "@/lib/jobs/jobs";

interface JobCardViewProps {
  jobs: JobWithCompany[];
  onTargetCompanyToggle?: (companyId: string, currentTargeted: boolean) => void;
}

export function JobCardView({ jobs, onTargetCompanyToggle }: JobCardViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>("all");
  const [selectedExp, setSelectedExp] = useState<string>("all");
  const [selectedTech, setSelectedTech] = useState<string>("all");
  const [activeModalJob, setActiveModalJob] = useState<JobWithCompany | null>(null);

  // Extract unique domains, companies, tech stacks
  const domains = useMemo(() => {
    const set = new Set<string>();
    jobs.filter((j) => isJobActive(j.last_date)).forEach((j) => set.add(j.domain));
    return Array.from(set).sort();
  }, [jobs]);

  const companies = useMemo(() => {
    const set = new Set<string>();
    jobs.filter((j) => isJobActive(j.last_date)).forEach((j) => set.add(j.company_name));
    return Array.from(set).sort();
  }, [jobs]);

  const techStacks = useMemo(() => {
    const set = new Set<string>();
    jobs.filter((j) => isJobActive(j.last_date)).forEach((j) => j.tech_stack.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [jobs]);

  // Filtered active jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (!isJobActive(j.last_date)) return false;

      const matchesSearch =
        searchQuery === "" ||
        j.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.domain.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDomain = selectedDomain === "all" || j.domain === selectedDomain;
      const matchesCompany = selectedCompany === "all" || j.company_name === selectedCompany;

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

      const matchesTech =
        selectedTech === "all" ||
        j.tech_stack.some((t) => t.toLowerCase() === selectedTech.toLowerCase()) ||
        j.role.toLowerCase().includes(selectedTech.toLowerCase());

      return matchesSearch && matchesDomain && matchesCompany && matchesWorkMode && matchesExp && matchesTech;
    });
  }, [jobs, searchQuery, selectedDomain, selectedCompany, selectedWorkMode, selectedExp, selectedTech]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by role title, company name, skill, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/60 border border-border text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
            />
          </div>

          {/* Domain Dropdown */}
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-4 py-3 rounded-2xl bg-muted/60 border border-border text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          >
            <option value="all">All Domains</option>
            {domains.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Company Dropdown */}
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-4 py-3 rounded-2xl bg-muted/60 border border-border text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          >
            <option value="all">All Companies</option>
            {companies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Interactive Filter Chips */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground font-bold flex items-center gap-1 shrink-0">
              <Filter className="size-3.5" /> Work Mode:
            </span>
            {[
              { id: "all", label: "All" },
              { id: "remote", label: "🏠 Remote" },
              { id: "hybrid", label: "🏢 Hybrid" },
              { id: "onsite", label: "📍 Onsite" },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedWorkMode(mode.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedWorkMode === mode.id
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
                }`}
              >
                {mode.label}
              </button>
            ))}

            <span className="text-muted-foreground font-bold flex items-center gap-1 shrink-0 ml-3">
              Experience:
            </span>
            {[
              { id: "all", label: "All" },
              { id: "fresher", label: "🎓 Fresher" },
              { id: "0-2", label: "⚡ 0-2 Yrs" },
              { id: "3-5", label: "🚀 3-5 Yrs" },
            ].map((exp) => (
              <button
                key={exp.id}
                onClick={() => setSelectedExp(exp.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedExp === exp.id
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
                }`}
              >
                {exp.label}
              </button>
            ))}
          </div>

          {/* Tech Stack Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-muted-foreground font-bold text-[11px] shrink-0">Tech Stack:</span>
            {["All", "AI", "Python", "React", "Node.js", "Java", "C++"].map((tech) => {
              const val = tech === "All" ? "all" : tech;
              return (
                <button
                  key={tech}
                  onClick={() => setSelectedTech(val)}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                    selectedTech === val
                      ? "bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/40"
                      : "bg-muted/50 hover:bg-muted text-muted-foreground border border-border/40"
                  }`}
                >
                  {tech}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 text-center bg-card border border-border rounded-3xl space-y-3">
          <Building2 className="size-8 mx-auto text-muted-foreground/50" />
          <h3 className="font-display font-bold text-base text-foreground">No active job postings match your filters</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try resetting your search query, work mode, or tech stack filters to see more active openings.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedDomain("all");
              setSelectedCompany("all");
              setSelectedWorkMode("all");
              setSelectedExp("all");
              setSelectedTech("all");
            }}
            className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-sm hover:bg-teal-700 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job, idx) => {
            const primaryTech = job.tech_stack[0] || "";
            const dsaPrepUrl = `/dashboard/prep?company=${encodeURIComponent(job.company_slug)}${
              primaryTech ? `&tech=${encodeURIComponent(primaryTech)}` : ""
            }`;

            // Mock dynamic AI match scores & ribbons for demonstration
            const matchScore = 90 + ((idx * 3) % 9);
            const ribbonType = idx % 3 === 0 ? "🔥 Featured" : idx % 3 === 1 ? "⭐ Recommended" : "💎 Premium Hiring";
            const ribbonColor =
              idx % 3 === 0
                ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                : idx % 3 === 1
                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                : "bg-purple-500/10 text-purple-600 border-purple-500/20";

            // High-resolution real company logo URL
            const logoUrl = getCompanyLogoUrl(job.company_name, job.company_slug, job.company_logo_url);
            const initialLetter = job.company_name.charAt(0).toUpperCase();

            // Extract concise 2-sentence summary
            const summaryExcerpt = job.description
              .replace(/📌 JOB OVERVIEW|🎯 ELIGIBILITY.*|🚀 KEY RESPONSIBILITIES.*/g, "")
              .trim()
              .slice(0, 140);

            return (
              <div
                key={job.id}
                onClick={() => setActiveModalJob(job)}
                className="relative bg-card border border-border/80 p-6 rounded-3xl space-y-4 shadow-sm transform-gpu transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between group overflow-hidden hover:-translate-y-3.5 hover:scale-[1.02] hover:-rotate-[0.5deg] hover:border-teal-400/80 hover:shadow-[0_25px_60px_-15px_rgba(20,184,166,0.35),0_0_30px_rgba(20,184,166,0.15)] dark:hover:shadow-[0_25px_60px_-15px_rgba(20,184,166,0.25),0_0_35px_rgba(20,184,166,0.2)]"
              >
                {/* Glowing Top Ambient Shimmer Bar on Hover */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500/0 via-teal-400 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

                {/* Diagonal Glass Sheen Light Reflection Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 dark:via-teal-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none z-20" />

                {/* Top Corner Featured Ribbon & Track ID */}
                <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-3">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${ribbonColor}`}>
                    {ribbonType}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                      Job #{job.id}
                    </span>
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                      Until {formatDate(job.last_date)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Top Company Info & Real Logo */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-2xl bg-white dark:bg-slate-900 border border-border/80 p-1 flex items-center justify-center font-bold text-lg text-primary overflow-hidden shadow-xs shrink-0 relative">
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
                        <div className="hidden size-full rounded-xl bg-gradient-to-br from-teal-500 to-amber-500 text-white font-extrabold text-base items-center justify-center">
                          {initialLetter}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-foreground tracking-tight">{job.company_name}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                          {job.domain}
                        </span>
                      </div>
                    </div>

                    {/* Prominent Bold CTC */}
                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 inline-block shadow-2xs">
                        {job.ctc_range}
                      </span>
                    </div>
                  </div>

                  {/* Role Title */}
                  <h3 className="font-display font-bold text-base text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                    {job.role}
                  </h3>

                  {/* Badges Row: Actively Hiring, Easy Apply, Posted Today */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 flex items-center gap-1">
                      <Flame className="size-3 text-amber-500" /> Actively Hiring
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 flex items-center gap-1">
                      <Zap className="size-3 text-teal-500" /> Easy Apply
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                      🆕 Posted Today
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                      🏠 {job.location.includes("Remote") ? "Remote" : job.location}
                    </span>
                  </div>

                  {/* 💡 AI Role Summary Box */}
                  <div className="p-3 rounded-2xl bg-muted/50 border border-border/60 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-700 dark:text-teal-300">
                      <Sparkles className="size-3.5 text-teal-500" /> AI Role Overview:
                    </div>
                    <p className="text-muted-foreground text-[11px] line-clamp-2 leading-relaxed">
                      {summaryExcerpt || `${job.company_name} is recruiting for ${job.role}. Work on modern software infrastructure and engineering pipelines.`}
                    </p>
                  </div>

                  {/* Standout AI Match & Skill Gap Widget */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-teal-500/10 via-background to-emerald-500/10 border border-teal-500/20 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1 text-teal-700 dark:text-teal-300">
                        <Star className="size-3.5 fill-teal-500 text-teal-500" /> AI Resume Match Score
                      </span>
                      <span className="text-teal-600 dark:text-teal-400 font-mono font-extrabold">{matchScore}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                        style={{ width: `${matchScore}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
                      <span className="font-semibold text-foreground">
                        Missing Skills: <span className="text-rose-600 dark:text-rose-400">✓ Docker ✓ Redis</span>
                      </span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">Difficulty: ★★★★☆</span>
                    </div>
                  </div>

                  {/* Tech Stack Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {job.tech_stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-muted text-foreground border border-border/60"
                      >
                        {tech}
                      </span>
                    ))}
                    {job.tech_stack.length > 4 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md text-muted-foreground">
                        +{job.tech_stack.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer CTA Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50 gap-3">
                  <Link
                    href={dsaPrepUrl}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-xs font-bold transition-all"
                  >
                    <Code2 className="size-3.5" /> Prep DSA &amp; AI
                  </Link>

                  <a
                    href={job.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    Apply Now <ExternalLink className="size-3.5" />
                  </a>
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
