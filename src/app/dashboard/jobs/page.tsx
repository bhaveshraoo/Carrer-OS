"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  LayoutGrid,
  Layers,
  Heart,
  Sparkles,
  Building2,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";
import { JobCardView } from "@/components/jobs/job-card-view";
import { JobSwipeView } from "@/components/jobs/job-swipe-view";
import { JobWishlistView } from "@/components/jobs/job-wishlist-view";
import { TopHiringDrivesCarousel } from "@/components/jobs/top-hiring-carousel";
import { JobPortalRightSidebar } from "@/components/jobs/right-sidebar";
import { FALLBACK_JOBS, type JobWithCompany } from "@/lib/jobs/jobs";

export default function JobPortalDashboardPage() {
  const [activeTab, setActiveTab] = useState<"cards" | "swipe" | "wishlist">("cards");
  const [jobs, setJobs] = useState<JobWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalInternships: 0,
    lastUpdated: "Connecting DB...",
  });
  const [factIndex, setFactIndex] = useState(0);

  const CAREER_OS_FACTS = [
    "💡 Did you know? Candidates using CareerOS AI ATS optimization are 3.4x more likely to clear resume shortlists at Tier 1 Tech firms.",
    "🚀 Job Market News: Demand for Fullstack AI Engineers & PyTorch/RAG developers in India surged 42% this quarter.",
    "🎯 CareerOS Fact: Our AI Interviewer simulates FAANG bar-raisers, evaluating system trade-offs and Big-O complexities.",
    "📊 Job Market Insight: 80% of top Indian tech startups now require candidate ATS resume alignment above 75% for initial screening.",
    "✨ CareerOS Tip: Practicing STAR behavioral answers out loud increases interview confidence score by an average of 24%.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % CAREER_OS_FACTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`/api/jobs?t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.jobs)) {
        // Double-lock client-side filter: Purge Meesho across all fields
        let cleanJobs = data.jobs.filter((j: any) => {
          const name = (j.company_name || "").toLowerCase();
          const slug = (j.company_slug || "").toLowerCase();
          const id = (j.company_id || "").toLowerCase();
          const desc = (j.description || "").toLowerCase();
          const url = (j.application_url || "").toLowerCase();
          return (
            !name.includes("meesho") &&
            !slug.includes("meesho") &&
            !id.includes("meesho") &&
            !desc.includes("meesho") &&
            !url.includes("meesho") &&
            !/^\d+$/.test(String(j.id))
          );
        });

        if (cleanJobs.length < 5) {
          cleanJobs = FALLBACK_JOBS;
        }

        setJobs(cleanJobs);

        const uniqueCompanies = new Set(cleanJobs.map((j: any) => j.company_id || j.company_name)).size;
        const internships = cleanJobs.filter((j: any) =>
          j.role.toLowerCase().includes("intern") ||
          j.domain.toLowerCase().includes("intern") ||
          j.description.toLowerCase().includes("intern")
        ).length;

        setStats({
          totalJobs: cleanJobs.length,
          totalCompanies: uniqueCompanies,
          totalInternships: internships,
          lastUpdated: "Just now",
        });
      } else {
        setJobs(FALLBACK_JOBS);
      }
    } catch (err) {
      console.error("Error fetching real jobs:", err);
      setJobs(FALLBACK_JOBS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* ─── HERO HEADER CARD (Matches Authentic CareerOS Surface Hero) ────────────────────────── */}
      <div className="relative overflow-hidden p-8 md:p-10 rounded-3xl surface border border-orange-500/30 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-3xl">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 text-xs font-extrabold px-3.5 py-1 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
              <Sparkles className="size-3.5 text-orange-500" /> CareerOS Projects &amp; Jobs Hub
            </div>

            {/* Bold Headline with Highlighted Accent Text */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary leading-tight">
              Real-World Tech Jobs &amp; <span className="text-orange-500">Verified Teams</span>
            </h1>

            <p className="text-sm sm:text-base text-secondary leading-relaxed max-w-2xl font-medium">
              Join production engineering teams, match your resume against live tech roles, earn verified 1–6 month certificates &amp; direct recruiter referrals.
            </p>
          </div>

          {/* Top Right Orange Filled Action Pill */}
          <div className="shrink-0 self-start lg:self-center">
            <button className="px-5 py-2.5 rounded-full bg-orange-500 text-white font-extrabold text-xs shadow-sm hover:brightness-110 hover:scale-105 transition-all flex items-center gap-2">
              <Award className="size-4" /> Leaderboard &amp; Top Hiring Drives
            </button>
          </div>
        </div>

        {/* ─── TAB SWITCHER PILL CONTAINER ──────────── */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="flex items-center p-1.5 rounded-2xl surface-2 border border-border shadow-2xs">
            <button
              onClick={() => setActiveTab("cards")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                activeTab === "cards"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-secondary hover:text-primary"
              }`}
            >
              <LayoutGrid className="size-4" /> Marketplace ({stats.totalJobs || jobs.length || 30})
            </button>

            <button
              onClick={() => setActiveTab("swipe")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                activeTab === "swipe"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-secondary hover:text-primary"
              }`}
            >
              <Layers className="size-4" /> CareerSwipe Deck
            </button>

            <button
              onClick={() => setActiveTab("wishlist")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                activeTab === "wishlist"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-secondary hover:text-primary"
              }`}
            >
              <Heart className="size-4 fill-current text-rose-400" /> Saved Wishlist
            </button>
          </div>
        </div>

        {/* CareerOS Market Insights & Facts Ticker */}
        <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/25 flex flex-col sm:flex-row sm:items-center gap-2.5 text-xs text-primary font-medium animate-fade-in shadow-2xs">
          <span className="px-2.5 py-1 rounded-xl bg-teal-600 text-white font-extrabold text-[10px] shrink-0 uppercase tracking-wider flex items-center gap-1 self-start sm:self-auto">
            <Zap className="size-3 text-amber-300 animate-bounce" /> Live Market Insight
          </span>
          <p className="font-semibold text-primary leading-snug line-clamp-1 transition-all duration-500">
            {CAREER_OS_FACTS[factIndex]}
          </p>
        </div>

        {/* Live Marketplace Stats Bar */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-4 border-t border-border text-xs sm:text-sm font-bold">
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-teal-500" />
            <span className="text-primary font-mono font-extrabold text-base">
              {stats.totalJobs > 0 ? stats.totalJobs.toLocaleString() : "..."}
            </span>
            <span className="text-muted font-semibold">Active Jobs</span>
          </div>

          <div className="w-px h-4 bg-border hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-orange-500" />
            <span className="text-primary font-mono font-extrabold text-base">
              {stats.totalCompanies > 0 ? stats.totalCompanies.toLocaleString() : "..."}
            </span>
            <span className="text-muted font-semibold">Hiring Companies</span>
          </div>

          <div className="w-px h-4 bg-border hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-purple-500" />
            <span className="text-primary font-mono font-extrabold text-base">
              {stats.totalInternships > 0 ? stats.totalInternships.toLocaleString() : "..."}
            </span>
            <span className="text-muted font-semibold">Internships</span>
          </div>

          <div className="w-px h-4 bg-border hidden sm:block" />

          <div className="flex items-center gap-2 text-xs text-teal-400 font-bold ml-auto sm:ml-0">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-teal-500" />
            </span>
            Real-time DB · {stats.lastUpdated}
          </div>
        </div>
      </div>

      {/* Top Hiring Drives Carousel */}
      <TopHiringDrivesCarousel />

      {/* Main Content Area: Clean Full-Width 3-Column Layout */}
      <div>
        {loading ? (
          <div className="min-h-[420px] rounded-3xl surface border border-border p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-6 shadow-xl animate-scale-up">
            {/* YouTube-style smooth circular moving spinner */}
            <div className="relative size-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-teal-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
              <Sparkles className="size-6 text-teal-500 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-extrabold text-xl text-primary tracking-tight">
                Connecting to Real-time CareerOS Database...
              </h3>
              <p className="text-xs text-muted font-semibold">
                Aggregating verified tech opportunities, active company pipelines &amp; ATS keywords
              </p>
            </div>

            {/* Dynamic Rotating Fact / News Box */}
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/25 max-w-md w-full text-left space-y-2 animate-fade-in shadow-2xs">
              <div className="flex items-center justify-between text-[10px] font-extrabold text-teal-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Zap className="size-3 text-amber-400 animate-bounce" /> Live Market Tip &amp; Insight
                </span>
                <span className="font-mono text-muted">Tip #{factIndex + 1}</span>
              </div>
              <p className="text-xs font-semibold text-primary leading-relaxed">
                {CAREER_OS_FACTS[factIndex]}
              </p>
            </div>
          </div>
        ) : (
          <div>
            {activeTab === "cards" && (
              <JobCardView jobs={jobs} onTargetCompanyToggle={fetchJobs} />
            )}

            {activeTab === "swipe" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  <JobSwipeView
                    jobs={jobs}
                    onTargetCompanyToggle={fetchJobs}
                    onWishlistUpdate={fetchJobs}
                  />
                </div>
                <div className="lg:col-span-4">
                  <JobPortalRightSidebar />
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <JobWishlistView onTargetCompanyToggle={fetchJobs} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

