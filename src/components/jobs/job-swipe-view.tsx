"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Heart,
  Building2,
  MapPin,
  IndianRupee,
  Clock,
  Code2,
  Layers,
  Info,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Check,
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
  const [deck, setDeck] = useState<JobWithCompany[]>(() => jobs.filter((j) => isJobActive(j.last_date)));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeModalJob, setActiveModalJob] = useState<JobWithCompany | null>(null);

  // Touch & Drag state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [swipingDirection, setSwipingDirection] = useState<"left" | "right" | null>(null);

  // Pop-in / Feedback Banner State
  const [feedbackBanner, setFeedbackBanner] = useState<{
    text: string;
    type: "wishlist" | "pass";
  } | null>(null);

  const startPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setDeck(jobs.filter((j) => isJobActive(j.last_date)));
    setCurrentIndex(0);
  }, [jobs]);

  // Current Card
  const currentJob = deck[currentIndex];

  const handleSwipe = async (direction: "left" | "right") => {
    if (!currentJob || swipingDirection !== null) return;

    const targetJob = currentJob;
    setSwipingDirection(direction);

    // Set pop-out flyaway offset for button clicks / drag releases
    if (direction === "right") {
      setDragOffset({ x: 600, y: 40 });
      setFeedbackBanner({
        text: `Saved ${targetJob.company_name} to Wishlist!`,
        type: "wishlist",
      });
    } else {
      setDragOffset({ x: -600, y: 40 });
      setFeedbackBanner({
        text: `Passed ${targetJob.company_name}`,
        type: "pass",
      });
    }

    // Advance card index after flyout pop animation finishes (300ms)
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDragOffset({ x: 0, y: 0 });
      setSwipingDirection(null);
    }, 300);

    // Auto dismiss feedback banner after 2.5 seconds
    setTimeout(() => {
      setFeedbackBanner(null);
    }, 2500);

    // Sync to localStorage for immediate instant UI persistence
    if (direction === "right") {
      try {
        const stored = localStorage.getItem("careeros_wishlist_jobs");
        const existingList: JobWithCompany[] = stored ? JSON.parse(stored) : [];
        if (!existingList.some((j) => j.id === targetJob.id)) {
          const updatedList = [{ ...targetJob, is_wishlisted: true }, ...existingList];
          localStorage.setItem("careeros_wishlist_jobs", JSON.stringify(updatedList));
        }
      } catch (e) {
        console.error("Error saving to localStorage wishlist:", e);
      }
    }

    // API call in background
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalJob) return;
      if (e.key === "ArrowLeft") {
        handleSwipe("left");
      } else if (e.key === "ArrowRight") {
        handleSwipe("right");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, currentJob, activeModalJob, swipingDirection]);

  // Touch & Drag handlers
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

    const threshold = 100;
    if (dragOffset.x > threshold) {
      handleSwipe("right");
    } else if (dragOffset.x < -threshold) {
      handleSwipe("left");
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleResetDeck = () => {
    setDeck(jobs.filter((j) => isJobActive(j.last_date)));
    setCurrentIndex(0);
    setFeedbackBanner(null);
  };

  const rotationDegrees = dragOffset.x * 0.08;
  const isDraggingRight = dragOffset.x > 35;
  const isDraggingLeft = dragOffset.x < -35;
  const isPopOutAnimating = swipingDirection !== null;

  if (!currentJob || currentIndex >= deck.length) {
    return (
      <div className="min-h-[480px] bg-card border border-border rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm animate-scale-up">
        <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
          <CheckCircle2 className="size-8" />
        </div>
        <h3 className="font-display font-bold text-xl text-foreground">You&apos;ve reviewed all available jobs!</h3>
        <p className="text-xs text-muted-foreground max-w-sm">
          Check back soon for new opportunities or reset the deck to review again.
        </p>
        <button
          onClick={handleResetDeck}
          className="px-6 py-2.5 rounded-2xl font-bold text-xs bg-teal-600 text-white hover:bg-teal-500 shadow-lg shadow-teal-600/20 transition-all flex items-center gap-2"
        >
          <RotateCcw className="size-4" /> Reset Swipe Deck
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-5 flex flex-col items-center select-none">
      {/* Visual Feedback Confirmation Banner */}
      {feedbackBanner && (
        <div
          className={`px-4 py-2 rounded-full font-bold text-xs border shadow-lg flex items-center gap-2 transition-all animate-bounce ${
            feedbackBanner.type === "wishlist"
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40"
              : "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/40"
          }`}
        >
          {feedbackBanner.type === "wishlist" ? (
            <Heart className="size-3.5 fill-current text-emerald-500" />
          ) : (
            <X className="size-3.5 text-rose-500" />
          )}
          {feedbackBanner.text}
        </div>
      )}

      {/* Keyboard Shortcuts Hint */}
      {!feedbackBanner && (
        <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground bg-muted/60 px-4 py-1.5 rounded-full border border-border shadow-xs">
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-0.5 rounded bg-background border border-border text-[10px] shadow-xs">←</kbd> Pass
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-0.5 rounded bg-background border border-border text-[10px] shadow-xs">→</kbd> Wishlist
          </span>
        </div>
      )}

      {/* Swipeable Card Stack Container */}
      <div className="relative w-full h-[510px] sm:h-[530px] flex items-center justify-center">
        {/* Next Card Background Stack Preview - Pop In Preview */}
        {deck[currentIndex + 1] && (
          <div className="absolute w-[94%] h-[94%] bg-card rounded-3xl shadow-md scale-95 translate-y-3 opacity-60 pointer-events-none transition-all duration-300" />
        )}

        {/* Top Active Card - Animated Exit Pop-Out & Entrance Pop-In */}
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
          className={`absolute w-full h-full bg-[#FAF8F5] dark:bg-[#0D1527] border border-border/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between cursor-grab active:cursor-grabbing text-card-foreground z-10 ${
            !isDragging && !isPopOutAnimating ? "animate-card-bounce" : ""
          }`}
        >
          {/* Green Right Swipe Overlay */}
          <div
            className={`absolute inset-0 bg-emerald-500/25 backdrop-blur-[2px] z-30 pointer-events-none flex items-center justify-center transition-opacity duration-150 ${
              isDraggingRight || swipingDirection === "right" ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-extrabold text-base shadow-2xl tracking-wider uppercase rotate-[-10deg] border-2 border-white/40 flex items-center gap-2 animate-bounce">
              <Heart className="size-5 fill-white" /> SAVE TO WISHLIST
            </span>
          </div>

          {/* Red Left Swipe Overlay */}
          <div
            className={`absolute inset-0 bg-rose-500/25 backdrop-blur-[2px] z-30 pointer-events-none flex items-center justify-center transition-opacity duration-150 ${
              isDraggingLeft || swipingDirection === "left" ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="px-6 py-3 rounded-2xl bg-rose-600 text-white font-extrabold text-base shadow-2xl tracking-wider uppercase rotate-[10deg] border-2 border-white/40 flex items-center gap-2 animate-bounce">
              <X className="size-5" /> PASS
            </span>
          </div>

          {/* Top Company Header Banner */}
          <div className="p-6 bg-gradient-to-br from-teal-500/10 via-transparent to-amber-500/10 border-b border-border/60 space-y-3 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-white dark:bg-slate-900 border border-border/80 p-1 flex items-center justify-center font-bold text-lg text-primary overflow-hidden shadow-xs shrink-0 relative">
                  <img
                    src={getCompanyLogoUrl(currentJob.company_name, currentJob.company_slug, currentJob.company_logo_url)}
                    alt={currentJob.company_name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                  <div className="hidden size-full rounded-xl bg-gradient-to-br from-teal-500 to-amber-500 text-white font-extrabold text-base items-center justify-center">
                    {currentJob.company_name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-foreground tracking-tight">{currentJob.company_name}</h4>
                  <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                    {currentJob.domain}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                  Job #{currentJob.id}
                </span>
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                  Until {formatDate(currentJob.last_date)}
                </span>
              </div>
            </div>

            {/* Fitted Role Title */}
            <div className="pt-1">
              <h2 className="font-sans font-bold text-lg sm:text-xl text-foreground leading-snug tracking-tight line-clamp-2">
                {currentJob.role}
              </h2>
            </div>
          </div>

          {/* Middle Body Details Container */}
          <div className="p-6 space-y-4 flex-1 overflow-y-auto">
            {/* CTC & Location Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5 bg-muted/40 p-3 rounded-2xl border border-border/50">
                <IndianRupee className="size-4 text-emerald-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">CTC Package</p>
                  <p className="font-bold text-foreground truncate">{currentJob.ctc_range}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-muted/40 p-3 rounded-2xl border border-border/50">
                <MapPin className="size-4 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Location</p>
                  <p className="font-bold text-foreground truncate">{currentJob.location}</p>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            {currentJob.tech_stack && currentJob.tech_stack.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Code2 className="size-3 text-teal-500" /> Required Tech Stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {currentJob.tech_stack.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-muted text-foreground border border-border/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interview Types Taxonomy Badges */}
            {currentJob.interview_types && currentJob.interview_types.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Layers className="size-3 text-indigo-500" /> Interview Rounds
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {currentJob.interview_types.map((type) => {
                    const style = getInterviewTypeBadgeStyle(type);
                    return (
                      <span
                        key={type}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-xl border ${style.bg} ${style.text} ${style.border}`}
                      >
                        {style.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Card Footer Action Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveModalJob(currentJob);
            }}
            className="w-full py-3 border-t border-border/70 bg-muted/20 hover:bg-muted/40 text-xs font-semibold text-teal-600 dark:text-teal-400 transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            <Info className="size-3.5" /> Tap for full job description &amp; apply <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Swipe Action Floating Buttons */}
      <div className="flex items-center justify-center gap-8 pt-2">
        {/* Pass Button (Red X) */}
        <button
          onClick={() => handleSwipe("left")}
          disabled={swipingDirection !== null}
          className="size-16 rounded-full bg-card border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white shadow-lg hover:shadow-rose-500/20 transition-all flex items-center justify-center active:scale-90 disabled:opacity-50 group"
          title="Pass (Left Arrow)"
        >
          <X className="size-7 group-hover:scale-110 transition-transform" />
        </button>

        {/* Wishlist Button (Green Heart) */}
        <button
          onClick={() => handleSwipe("right")}
          disabled={swipingDirection !== null}
          className="size-16 rounded-full bg-card border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center active:scale-90 disabled:opacity-50 group"
          title="Save to Wishlist (Right Arrow)"
        >
          <Heart className="size-7 group-hover:scale-110 transition-transform fill-current" />
        </button>
      </div>

      {/* Full Detail Modal */}
      <JobDetailModal
        job={activeModalJob}
        isOpen={activeModalJob !== null}
        onClose={() => setActiveModalJob(null)}
        onTargetCompanyToggle={onTargetCompanyToggle}
      />
    </div>
  );
}
