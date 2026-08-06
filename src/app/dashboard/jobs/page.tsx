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
import type { JobWithCompany } from "@/lib/jobs/jobs";

export default function JobPortalDashboardPage() {
  const [activeTab, setActiveTab] = useState<"cards" | "swipe" | "wishlist">("cards");
  const [jobs, setJobs] = useState<JobWithCompany[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (data.success && data.jobs) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error("Error fetching real jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* High Impact Hero Section */}
      <div className="relative overflow-hidden p-8 md:p-10 rounded-3xl bg-gradient-to-br from-teal-500/10 via-background to-amber-500/10 border border-teal-500/20 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30">
              <Sparkles className="size-3.5 text-teal-500" /> AI-Powered Tech Career Engine
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Find Your Dream Tech Job with AI
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
              Discover 10,000+ verified tech jobs, AI-powered resume matching, company insights, and interview preparation—all in one place.
            </p>
          </div>

          {/* Top Tab Mode Switcher */}
          <div className="flex items-center p-1.5 rounded-2xl bg-card border border-border shrink-0 self-start lg:self-center shadow-sm">
            <button
              onClick={() => setActiveTab("cards")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === "cards"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="size-4" /> Card List View
            </button>

            <button
              onClick={() => setActiveTab("swipe")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === "swipe"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="size-4" /> Tinder Swipe Deck
            </button>

            <button
              onClick={() => setActiveTab("wishlist")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === "wishlist"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className="size-4 fill-current text-rose-400" /> Saved Wishlist
            </button>
          </div>
        </div>

        {/* Live Marketplace Stats Bar */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-6 border-t border-border/60 text-xs sm:text-sm font-bold">
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-teal-500" />
            <span className="text-foreground font-mono font-extrabold text-base">10,245</span>
            <span className="text-muted-foreground font-semibold">Jobs</span>
          </div>

          <div className="w-px h-4 bg-border hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-amber-500" />
            <span className="text-foreground font-mono font-extrabold text-base">1,250</span>
            <span className="text-muted-foreground font-semibold">Companies</span>
          </div>

          <div className="w-px h-4 bg-border hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-purple-500" />
            <span className="text-foreground font-mono font-extrabold text-base">4,500</span>
            <span className="text-muted-foreground font-semibold">Internships</span>
          </div>

          <div className="w-px h-4 bg-border hidden sm:block" />

          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold ml-auto sm:ml-0">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Updated 2 mins ago
          </div>
        </div>
      </div>

      {/* Top Hiring Drives Carousel */}
      <TopHiringDrivesCarousel />

      {/* Main Content Area with Desktop Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-6 rounded-3xl bg-card border border-border/80 space-y-4 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="size-10 rounded-2xl bg-muted" />
                    <div className="h-6 w-20 rounded-full bg-muted" />
                  </div>
                  <div className="h-5 w-3/4 rounded-lg bg-muted" />
                  <div className="h-12 w-full rounded-2xl bg-muted" />
                  <div className="flex gap-2">
                    <div className="h-8 flex-1 rounded-xl bg-muted" />
                    <div className="h-8 flex-1 rounded-xl bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {activeTab === "cards" && (
                <JobCardView jobs={jobs} onTargetCompanyToggle={fetchJobs} />
              )}

              {activeTab === "swipe" && (
                <JobSwipeView
                  jobs={jobs}
                  onTargetCompanyToggle={fetchJobs}
                  onWishlistUpdate={fetchJobs}
                />
              )}

              {activeTab === "wishlist" && (
                <JobWishlistView onTargetCompanyToggle={fetchJobs} />
              )}
            </div>
          )}
        </div>

        {/* Right Desktop Sidebar */}
        <div className="lg:col-span-4">
          <JobPortalRightSidebar />
        </div>
      </div>
    </div>
  );
}
