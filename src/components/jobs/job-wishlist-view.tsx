"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Building2,
  MapPin,
  IndianRupee,
  Clock,
  Trash2,
  ExternalLink,
  Code2,
  Target,
  Sparkles,
  Layers,
} from "lucide-react";
import { formatDate } from "@/lib/format";
import { getInterviewTypeBadgeStyle } from "@/lib/taxonomy/interview-types";
import { JobDetailModal } from "./job-detail-modal";
import type { JobWithCompany } from "@/lib/jobs/jobs";

interface JobWishlistViewProps {
  onTargetCompanyToggle?: (companyId: string, currentTargeted: boolean) => void;
}

export function JobWishlistView({ onTargetCompanyToggle }: JobWishlistViewProps) {
  const [wishlist, setWishlist] = useState<JobWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModalJob, setActiveModalJob] = useState<JobWithCompany | null>(null);

  const fetchWishlist = async () => {
    setLoading(true);
    let apiWishlist: JobWithCompany[] = [];
    try {
      const res = await fetch("/api/jobs/wishlist");
      const data = await res.json();
      if (data.success && data.wishlist) {
        apiWishlist = data.wishlist;
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }

    // Merge with localStorage
    try {
      const stored = localStorage.getItem("careeros_wishlist_jobs");
      const localList: JobWithCompany[] = stored ? JSON.parse(stored) : [];
      
      const mergedMap = new Map<string, JobWithCompany>();
      apiWishlist.forEach((j) => mergedMap.set(j.id, j));
      localList.forEach((j) => {
        if (!mergedMap.has(j.id)) {
          mergedMap.set(j.id, j);
        }
      });

      const mergedArray = Array.from(mergedMap.values());
      setWishlist(mergedArray);
    } catch {
      setWishlist(apiWishlist);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Remove from localStorage
      const stored = localStorage.getItem("careeros_wishlist_jobs");
      if (stored) {
        const localList: JobWithCompany[] = JSON.parse(stored);
        const updated = localList.filter((j) => j.id !== jobId);
        localStorage.setItem("careeros_wishlist_jobs", JSON.stringify(updated));
      }
    } catch {
      // Ignore
    }

    try {
      await fetch(`/api/jobs/wishlist?jobId=${jobId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Remove from wishlist API error:", err);
    }

    setWishlist((prev) => prev.filter((j) => j.id !== jobId));
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs font-semibold text-muted-foreground animate-pulse">
        Loading your wishlisted jobs...
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="bg-card border border-border rounded-3xl p-12 text-center space-y-4">
        <Heart className="size-10 text-muted-foreground mx-auto" />
        <h3 className="font-display font-bold text-lg text-foreground">Your Wishlist is empty</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Swipe right on jobs in the Swipe Deck to quickly save opportunities here for review and application.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <p className="text-xs font-semibold text-muted-foreground">
          You have <span className="text-foreground font-bold">{wishlist.length}</span> saved opportunities in your Wishlist
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((job) => {
          const primaryTech = job.tech_stack[0] || "";
          const dsaPrepUrl = `/dashboard/prep?company=${encodeURIComponent(job.company_slug)}${
            primaryTech ? `&tech=${encodeURIComponent(primaryTech)}` : ""
          }`;

          return (
            <div
              key={job.id}
              onClick={() => setActiveModalJob(job)}
              className="bg-card border border-border hover:border-emerald-500/40 p-6 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Header with Remove button */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-2xl bg-muted border border-border flex items-center justify-center font-bold text-lg text-primary overflow-hidden shrink-0">
                      {job.company_logo_url ? (
                        <img
                          src={job.company_logo_url}
                          alt={job.company_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="size-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-muted-foreground">{job.company_name}</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                        {job.domain}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleRemove(job.id, e)}
                    className="p-2 rounded-xl bg-muted/60 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 border border-border transition-all"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                {/* Role Title */}
                <h3 className="font-display font-bold text-base text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {job.role}
                </h3>

                {/* CTC & Location */}
                <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground pt-1">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <IndianRupee className="size-3.5" /> {job.ctc_range}
                  </span>
                  <span className="flex items-center gap-1 text-foreground/80">
                    <MapPin className="size-3.5" /> {job.location}
                  </span>
                </div>

                {/* Tech Stack */}
                {job.tech_stack && job.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.tech_stack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions Bar */}
              <div className="pt-4 border-t border-border flex items-center justify-between gap-2 mt-4">
                <Link
                  href={dsaPrepUrl}
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1.5 rounded-lg font-semibold text-[11px] bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center gap-1"
                >
                  <Code2 className="size-3" /> DSA Prep
                </Link>

                <a
                  href={job.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-4 py-1.5 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-500 text-white transition-all flex items-center gap-1"
                >
                  Apply <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reusable Job Detail Modal */}
      <JobDetailModal
        job={activeModalJob}
        isOpen={activeModalJob !== null}
        onClose={() => setActiveModalJob(null)}
        onTargetCompanyToggle={onTargetCompanyToggle}
      />
    </div>
  );
}
