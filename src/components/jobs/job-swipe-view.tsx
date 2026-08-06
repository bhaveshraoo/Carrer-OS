"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  X,
  Heart,
  Bookmark,
  Building2,
  MapPin,
  IndianRupee,
  Clock,
  Code2,
  Layers,
  Info,
  RotateCcw,
  Undo2,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Eye,
  SlidersHorizontal,
  ArrowRight,
  Zap,
} from "lucide-react";
import { formatDate } from "@/lib/format";
import { getInterviewTypeBadgeStyle } from "@/lib/taxonomy/interview-types";
import { JobDetailModal } from "./job-detail-modal";
import { getCompanyLogoUrl } from "@/lib/companies/logo-resolver";
import { isJobActive, type JobWithCompany } from "@/lib/jobs/jobs";

interface JobSwipeViewProps {
  jobs: JobWithCompany[];
  onTargetCompanyToggle?: (companyId: string, currentTargeted: boolean) => void;
  onWishlistUpdate?: () => void;
}

export function JobSwipeView({
  jobs,
  onTargetCompanyToggle,
  onWishlistUpdate,
}: JobSwipeViewProps) {
  // Master Active Jobs
  const activeJobs = useMemo(() => jobs.filter((j) => isJobActive(j.last_date)), [jobs]);

  // Filter States
  const [roleFilter, setRoleFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [workModeFilter, setWorkModeFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [rightSwipeAction, setRightSwipeAction] = useState<"Save Job" | "Interested" | "Apply Later">("Save Job");

  // Deck Computation
  const deck = useMemo(() => {
    return activeJobs.filter((job) => {
      if (roleFilter !== "All") {
        const matchesRole = job.role.toLowerCase().includes(roleFilter.toLowerCase()) ||
                            job.domain.toLowerCase().includes(roleFilter.toLowerCase());
        if (!matchesRole) return false;
      }
      if (locationFilter !== "All") {
        if (locationFilter === "Remote" && !job.location.toLowerCase().includes("remote")) return false;
        if (locationFilter !== "Remote" && !job.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      }
      if (workModeFilter !== "All") {
        if (!job.location.toLowerCase().includes(workModeFilter.toLowerCase())) return false;
      }
      return true;
    });
  }, [activeJobs, roleFilter, locationFilter, workModeFilter]);

  // Navigation & History State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [historyStack, setHistoryStack] = useState<Array<{ job: JobWithCompany; direction: "left" | "right" }>>([]);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [activeModalJob, setActiveModalJob] = useState<JobWithCompany | null>(null);
  const [showAllRounds, setShowAllRounds] = useState(false);

  // Touch & Drag state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [swipingDirection, setSwipingDirection] = useState<"left" | "right" | null>(null);

  // Feedback Banner State
  const [feedbackBanner, setFeedbackBanner] = useState<{
    text: string;
    type: "wishlist" | "pass" | "undo";
  } | null>(null);

  const startPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setCurrentIndex(0);
    setHistoryStack([]);
  }, [roleFilter, locationFilter, workModeFilter]);

  // Current Active Card
  const currentJob = deck[currentIndex];

  // Swipe Action Handler
  const handleSwipe = async (direction: "left" | "right") => {
    if (!currentJob || swipingDirection !== null) return;

    const targetJob = currentJob;
    setSwipingDirection(direction);

    // Save to history stack for Undo
    setHistoryStack((prev) => [...prev, { job: targetJob, direction }]);

    if (direction === "right") {
      setDragOffset({ x: 600, y: 40 });
      setSavedJobsCount((prev) => prev + 1);
      setFeedbackBanner({
        text: `${rightSwipeAction}: Saved ${targetJob.company_name} to Wishlist`,
        type: "wishlist",
      });
    } else {
      setDragOffset({ x: -600, y: 40 });
      setFeedbackBanner({
        text: `Skipped ${targetJob.company_name}`,
        type: "pass",
      });
    }

    // Advance card index after exit animation (280ms)
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDragOffset({ x: 0, y: 0 });
      setSwipingDirection(null);
      setShowAllRounds(false);
    }, 280);

    setTimeout(() => {
      setFeedbackBanner(null);
    }, 2400);

    // Sync to localStorage
    if (direction === "right") {
      try {
        const stored = localStorage.getItem("careeros_wishlist_jobs");
        const existingList: JobWithCompany[] = stored ? JSON.parse(stored) : [];
        if (!existingList.some((j) => j.id === targetJob.id)) {
          const updatedList = [{ ...targetJob, is_wishlisted: true }, ...existingList];
          localStorage.setItem("careeros_wishlist_jobs", JSON.stringify(updatedList));
        }
      } catch (e) {
        console.error("Error saving wishlist:", e);
      }
    }

    // Call Swipe API in background
    try {
      await fetch(`/api/jobs/${targetJob.id}/swipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction, companyId: targetJob.company_id }),
      });
      if (direction === "right" && onWishlistUpdate) {
        onWishlistUpdate();
      }
    } catch (err) {
      console.error("Swipe API error:", err);
    }
  };

  // Undo Last Swipe Handler
  const handleUndo = () => {
    if (historyStack.length === 0 || currentIndex === 0) return;

    const lastItem = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, -1));
    setCurrentIndex((prev) => Math.max(0, prev - 1));

    if (lastItem.direction === "right") {
      setSavedJobsCount((prev) => Math.max(0, prev - 1));
      try {
        const stored = localStorage.getItem("careeros_wishlist_jobs");
        if (stored) {
          const list: JobWithCompany[] = JSON.parse(stored);
          const updated = list.filter((j) => j.id !== lastItem.job.id);
          localStorage.setItem("careeros_wishlist_jobs", JSON.stringify(updated));
        }
      } catch (e) {
        console.error(e);
      }
    }

    setFeedbackBanner({
      text: `Undid swipe for ${lastItem.job.company_name}`,
      type: "undo",
    });
    setTimeout(() => setFeedbackBanner(null), 2000);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalJob) return;
      if (e.key === "ArrowLeft") {
        handleSwipe("left");
      } else if (e.key === "ArrowRight") {
        handleSwipe("right");
      } else if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
        handleUndo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, currentJob, activeModalJob, swipingDirection, historyStack]);

  // Mouse & Touch Drag Handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (swipingDirection !== null) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    startPosRef.current = { x: clientX, y: clientY };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || swipingDirection !== null) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const deltaX = clientX - startPosRef.current.x;
    const deltaY = clientY - startPosRef.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    if (!isDragging || swipingDirection !== null) return;
    setIsDragging(false);
    const threshold = 95;
    if (dragOffset.x > threshold) {
      handleSwipe("right");
    } else if (dragOffset.x < -threshold) {
      handleSwipe("left");
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleResetDeck = () => {
    setCurrentIndex(0);
    setHistoryStack([]);
    setSavedJobsCount(0);
    setRoleFilter("All");
    setLocationFilter("All");
    setWorkModeFilter("All");
    setFeedbackBanner(null);
  };

  const rotationDegrees = dragOffset.x * 0.07;
  const isDraggingRight = dragOffset.x > 35;
  const isDraggingLeft = dragOffset.x < -35;
  const isPopOutAnimating = swipingDirection !== null;

  // Compute Match Details for current card
  const matchDetails = useMemo(() => {
    if (!currentJob) return null;
    const tech = currentJob.tech_stack || ["React", "TypeScript", "Node.js"];
    const matched = tech.slice(0, 2).map((t, idx) => ({ name: t, score: 92 - idx * 6 }));
    const missing = tech.length > 2 ? `Missing: ${tech[2]}` : null;
    const matchScore = 85 + (currentJob.id.length % 11);
    
    // Parse Work Mode & Experience
    const locationLower = currentJob.location.toLowerCase();
    const workMode = locationLower.includes("remote") ? "Remote" : locationLower.includes("hybrid") ? "Hybrid" : "On-site";
    const experience = currentJob.role.toLowerCase().includes("senior") || currentJob.role.toLowerCase().includes("architect") ? "3-5 Yrs Exp" : "0-2 Yrs (Fresher)";

    return { matchScore, matched, missing, workMode, experience };
  }, [currentJob]);

  // ─── END OF DECK STATE ──────────────────────────────────────────────────
  if (!currentJob || currentIndex >= deck.length) {
    return (
      <div className="max-w-md mx-auto min-h-[480px] bg-card border-2 border-border rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center justify-center space-y-6 shadow-xl animate-scale-up">
        <div className="size-16 rounded-3xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold shadow-inner">
          <CheckCircle2 className="size-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-display font-extrabold text-2xl text-foreground tracking-tight">
            You reviewed {deck.length} roles — {savedJobsCount} saved!
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
            Improve your match score for 5 more jobs by optimizing your active resume with AI keywords.
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 pt-2">
          <button
            onClick={handleResetDeck}
            className="w-full py-3 rounded-2xl font-extrabold text-xs bg-teal-600 text-white hover:bg-teal-700 shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="size-4" /> Reset Deck &amp; Review Again
          </button>

          <Link
            href="/dashboard/resume"
            className="w-full py-3 rounded-2xl font-bold text-xs bg-muted hover:bg-muted/80 text-foreground border border-border transition-all flex items-center justify-center gap-2"
          >
            <Zap className="size-4 text-amber-500" /> Optimize Resume with AI
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 flex flex-col items-center select-none">
      {/* ─── TOP CONTROL BAR: Progress Counter & Filters ─────────────────────── */}
      <div className="w-full flex items-center justify-between px-1 text-xs font-bold text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-mono text-[11px]">
            {currentIndex + 1} of {deck.length} Curated Jobs
          </span>
          {savedJobsCount > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[10px]">
              {savedJobsCount} Saved
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Swipe Preference Selector */}
          <select
            value={rightSwipeAction}
            onChange={(e) => setRightSwipeAction(e.target.value as any)}
            className="px-2.5 py-1 rounded-xl bg-card border border-border text-[11px] font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-2xs"
            title="Right Swipe Action Preference"
          >
            <option value="Save Job">📌 Right Swipe: Save</option>
            <option value="Interested">⭐ Right Swipe: Interested</option>
            <option value="Apply Later">⏳ Right Swipe: Apply Later</option>
          </select>

          {/* Toggle Filter Bar */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded-xl border transition-all flex items-center gap-1 text-[11px] ${
              showFilters || roleFilter !== "All" || locationFilter !== "All" || workModeFilter !== "All"
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-card hover:bg-muted text-muted-foreground border-border"
            }`}
            title="Toggle Filter Bar"
          >
            <SlidersHorizontal className="size-3.5" />
          </button>
        </div>
      </div>

      {/* ─── COMPACT FILTER BAR ──────────────────────────────────────────────── */}
      {showFilters && (
        <div className="w-full p-4 rounded-2xl bg-card border border-border shadow-md space-y-3 animate-fade-in text-xs">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <SlidersHorizontal className="size-3.5 text-teal-500" /> Filter Jobs Deck
            </span>
            <button
              onClick={handleResetDeck}
              className="text-[10px] font-bold text-rose-500 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="size-3" /> Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Role Domain</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full p-1.5 rounded-xl bg-muted border border-border text-[11px] font-semibold text-foreground"
              >
                <option value="All">All Roles</option>
                <option value="Android">Android / Mobile</option>
                <option value="Fullstack">Full Stack</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="AI">AI / ML</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Location</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full p-1.5 rounded-xl bg-muted border border-border text-[11px] font-semibold text-foreground"
              >
                <option value="All">All Cities</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Remote">Remote</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Mumbai">Mumbai</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Work Mode</label>
              <select
                value={workModeFilter}
                onChange={(e) => setWorkModeFilter(e.target.value)}
                className="w-full p-1.5 rounded-xl bg-muted border border-border text-[11px] font-semibold text-foreground"
              >
                <option value="All">All Modes</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">On-site</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ─── VISUAL FEEDBACK POPUP BANNER ───────────────────────────────────── */}
      {feedbackBanner && (
        <div
          className={`px-4 py-2 rounded-full font-bold text-xs border shadow-lg flex items-center gap-2 transition-all animate-bounce ${
            feedbackBanner.type === "wishlist"
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40"
              : feedbackBanner.type === "undo"
              ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40"
              : "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/40"
          }`}
        >
          {feedbackBanner.type === "wishlist" ? (
            <Bookmark className="size-3.5 fill-current text-emerald-500" />
          ) : feedbackBanner.type === "undo" ? (
            <Undo2 className="size-3.5 text-amber-500" />
          ) : (
            <X className="size-3.5 text-rose-500" />
          )}
          {feedbackBanner.text}
        </div>
      )}

      {/* ─── SWIPEABLE CARD STACK CONTAINER ─────────────────────────────────── */}
      <div className="relative w-full h-[530px] sm:h-[550px] flex items-center justify-center">
        {/* Next Card Background Stack Preview */}
        {deck[currentIndex + 1] && (
          <div className="absolute w-[94%] h-[94%] bg-card rounded-3xl shadow-md scale-95 translate-y-3 opacity-60 pointer-events-none transition-all duration-300 border border-border" />
        )}

        {/* Top Active Card */}
        <div
          key={currentJob.id}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0px) rotate(${rotationDegrees}deg)`,
            opacity: 1,
            transition: isDragging
              ? "none"
              : "transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.28s ease-out",
          }}
          className={`absolute w-full h-full surface border-2 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between cursor-grab active:cursor-grabbing text-primary z-10 transition-colors ${
            isDraggingRight
              ? "border-emerald-500/80 bg-emerald-500/5"
              : isDraggingLeft
              ? "border-rose-500/80 bg-rose-500/5"
              : "border-border"
          } ${!isDragging && !isPopOutAnimating ? "animate-card-bounce" : ""}`}
        >
          {/* Green Right Drag Stamp Overlay */}
          <div
            className={`absolute inset-0 bg-emerald-500/20 backdrop-blur-[2px] z-30 pointer-events-none flex items-center justify-center transition-opacity duration-150 ${
              isDraggingRight || swipingDirection === "right" ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-extrabold text-base shadow-2xl tracking-wider uppercase rotate-[-10deg] border-2 border-white/40 flex items-center gap-2 animate-bounce">
              <Bookmark className="size-5 fill-white" /> {rightSwipeAction.toUpperCase()}
            </span>
          </div>

          {/* Red Left Drag Stamp Overlay */}
          <div
            className={`absolute inset-0 bg-rose-500/20 backdrop-blur-[2px] z-30 pointer-events-none flex items-center justify-center transition-opacity duration-150 ${
              isDraggingLeft || swipingDirection === "left" ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="px-6 py-3 rounded-2xl bg-rose-600 text-white font-extrabold text-base shadow-2xl tracking-wider uppercase rotate-[10deg] border-2 border-white/40 flex items-center gap-2 animate-bounce">
              <X className="size-5" /> SKIP / PASS
            </span>
          </div>

          {/* ─── CARD HEADER: Company & Critical Info ────────────────────────── */}
          <div className="p-5 sm:p-6 bg-gradient-to-br from-teal-500/10 via-orange-500/5 to-transparent border-b border-border space-y-3 shrink-0">
            {/* Row 1: Company Logo & Verified Source */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl surface border border-border p-1 flex items-center justify-center font-bold text-lg overflow-hidden shadow-xs shrink-0 relative">
                  <img
                    src={getCompanyLogoUrl(currentJob.company_name, currentJob.company_slug, currentJob.company_logo_url)}
                    alt={currentJob.company_name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove("hidden");
                    }}
                  />
                  <div className="hidden size-full rounded-xl bg-orange-500 text-white font-extrabold text-base flex items-center justify-center">
                    {currentJob.company_name.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-primary tracking-tight flex items-center gap-1.5">
                    {currentJob.company_name}
                    <ShieldCheck className="size-3.5 text-teal-500 shrink-0" />
                  </h4>
                  <span className="text-[10px] font-semibold text-muted flex items-center gap-1">
                    Verified source · Posted 2 days ago
                  </span>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="text-right shrink-0">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/30 inline-block shadow-2xs">
                  ⚡ {matchDetails?.matchScore}% Match
                </span>
              </div>
            </div>

            {/* Row 2: Role Title */}
            <div>
              <h2 className="font-display font-extrabold text-xl text-primary leading-snug tracking-tight">
                {currentJob.role}
              </h2>
            </div>

            {/* Row 3: Decision-Critical Meta Badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-bold">
              <span className="px-2.5 py-0.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                💼 {matchDetails?.experience}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                🌐 {matchDetails?.workMode}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">
                ₹ {currentJob.ctc_range}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                ⏳ Deadline: {formatDate(currentJob.last_date)}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg surface-2 text-secondary border border-border">
                📍 {currentJob.location}
              </span>
            </div>
          </div>

          {/* ─── MIDDLE CARD BODY: "Why It Matches You" Breakdown ──────────────── */}
          <div className="p-5 sm:p-6 space-y-4 flex-1 overflow-y-auto">
            {/* Why It Matches You Card */}
            <div className="p-4 rounded-2xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-teal-500" /> Why It Matches You
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Target Alignment
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {matchDetails?.matched.map((sk) => (
                  <span
                    key={sk.name}
                    className="text-xs font-bold px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
                  >
                    <CheckCircle2 className="size-3 text-emerald-500" /> {sk.name} ({sk.score}%)
                  </span>
                ))}
                {matchDetails?.missing && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                    ⚠️ {matchDetails.missing}
                  </span>
                )}
              </div>
            </div>

            {/* Required Tech Stack */}
            {currentJob.tech_stack && currentJob.tech_stack.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Code2 className="size-3 text-teal-500" /> Required Tech Stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {currentJob.tech_stack.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Compact Collapsible Interview Rounds */}
            {currentJob.interview_types && currentJob.interview_types.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Layers className="size-3 text-indigo-500" /> Interview Rounds ({currentJob.interview_types.length})
                  </p>
                  {currentJob.interview_types.length > 3 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAllRounds(!showAllRounds);
                      }}
                      className="text-[10px] font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-0.5"
                    >
                      {showAllRounds ? (
                        <>Show less <ChevronUp className="size-3" /></>
                      ) : (
                        <>+{currentJob.interview_types.length - 3} more <ChevronDown className="size-3" /></>
                      )}
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(showAllRounds ? currentJob.interview_types : currentJob.interview_types.slice(0, 3)).map((type) => {
                    const style = getInterviewTypeBadgeStyle(type);
                    return (
                      <span
                        key={type}
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg border ${style.bg} ${style.text} ${style.border}`}
                      >
                        {style.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ─── CARD FOOTER TRIGGER ────────────────────────────────────────── */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveModalJob(currentJob);
            }}
            className="w-full py-3.5 border-t border-teal-500/20 bg-teal-500/10 hover:bg-teal-500/20 text-xs font-bold text-teal-700 dark:text-teal-300 transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            <Eye className="size-3.5" /> View Full Job Details &amp; Apply <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* ─── EXPLICIT ACTION BUTTON CONTROLS ─────────────────────────────────── */}
      <div className="flex items-center justify-between w-full pt-2 px-2">
        {/* Undo Button */}
        <button
          onClick={handleUndo}
          disabled={historyStack.length === 0 || currentIndex === 0}
          className="px-3.5 py-2.5 rounded-2xl bg-card border border-border text-foreground hover:bg-muted font-bold text-xs shadow-xs transition-all disabled:opacity-40 flex items-center gap-1.5"
          title="Undo Last Swipe (Ctrl+Z / Cmd+Z)"
        >
          <Undo2 className="size-4 text-amber-500" />
          <span>Undo</span>
        </button>

        {/* Skip / Pass Button */}
        <button
          onClick={() => handleSwipe("left")}
          disabled={swipingDirection !== null}
          className="px-5 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-600 border border-rose-500/30 font-extrabold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
          title="Skip Job (Left Arrow)"
        >
          <X className="size-4" /> Skip
        </button>

        {/* Save Job Button */}
        <button
          onClick={() => handleSwipe("right")}
          disabled={swipingDirection !== null}
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
          title={`${rightSwipeAction} (Right Arrow)`}
        >
          <Bookmark className="size-4 fill-white" /> {rightSwipeAction}
        </button>

        {/* View & Apply Modal Trigger */}
        <button
          onClick={() => setActiveModalJob(currentJob)}
          className="px-4 py-2.5 rounded-2xl bg-card border border-teal-500/30 text-teal-700 dark:text-teal-300 hover:bg-teal-500/10 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
        >
          <Eye className="size-4 text-teal-500" /> Details
        </button>
      </div>

      {/* Full Detail Modal (Contains 'Apply on Company Site') */}
      <JobDetailModal
        job={activeModalJob}
        isOpen={activeModalJob !== null}
        onClose={() => setActiveModalJob(null)}
        onTargetCompanyToggle={onTargetCompanyToggle}
      />
    </div>
  );
}
