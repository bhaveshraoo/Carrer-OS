"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  ExternalLink,
  Target,
  Code2,
  Building2,
  MapPin,
  IndianRupee,
  Clock,
  Check,
  Calendar,
  Sparkles,
  Layers,
  Briefcase,
  GraduationCap,
  Award,
  Gift,
  CheckCircle2,
} from "lucide-react";
import { formatDate } from "@/lib/format";
import { getInterviewTypeBadgeStyle } from "@/lib/taxonomy/interview-types";
import type { JobWithCompany } from "@/lib/jobs/jobs";

interface JobDetailModalProps {
  job: JobWithCompany | null;
  isOpen: boolean;
  onClose: () => void;
  onTargetCompanyToggle?: (companyId: string, currentTargeted: boolean) => void;
}

export function JobDetailModal({
  job,
  isOpen,
  onClose,
  onTargetCompanyToggle,
}: JobDetailModalProps) {
  const [targetingLoading, setTargetingLoading] = useState(false);
  const [isTargeted, setIsTargeted] = useState(job?.is_company_targeted ?? false);

  if (!isOpen || !job) return null;

  const handleTargetToggle = async () => {
    setTargetingLoading(true);
    try {
      const res = await fetch("/api/companies/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId: job.company_id, action: isTargeted ? "untarget" : "target" }),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        const nextTargeted = !isTargeted;
        setIsTargeted(nextTargeted);
        if (onTargetCompanyToggle) {
          onTargetCompanyToggle(job.company_id, nextTargeted);
        }
      }
    } catch (err) {
      console.error("Target company toggle error:", err);
    } finally {
      setTargetingLoading(false);
    }
  };

  const primaryTech = job.tech_stack[0] || "";
  const dsaPrepUrl = `/dashboard/prep?company=${encodeURIComponent(job.company_slug)}${
    primaryTech ? `&tech=${encodeURIComponent(primaryTech)}` : ""
  }`;

  // Helper to parse description into rich sections
  const sections = job.description.split("\n\n").filter(Boolean);

  return (
    <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div
        className="w-full max-w-3xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-card-foreground animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative p-6 sm:p-8 border-b border-border bg-gradient-to-br from-teal-500/10 via-transparent to-amber-500/10">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="size-16 rounded-2xl bg-muted border border-border flex items-center justify-center font-bold text-xl text-primary overflow-hidden shrink-0 shadow-sm">
              {job.company_logo_url ? (
                <img
                  src={job.company_logo_url}
                  alt={job.company_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="size-8 text-muted-foreground" />
              )}
            </div>

            <div className="space-y-1.5 pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                  {job.domain}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                  {job.company_tier}
                </span>
              </div>

              <h2 className="font-sans font-bold text-xl sm:text-2xl tracking-tight text-foreground">
                {job.role}
              </h2>

              <Link
                href={`/dashboard/companies/${job.company_slug}`}
                className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                {job.company_name} <ExternalLink className="size-3" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-border/60 text-xs">
            <div className="flex items-center gap-2">
              <IndianRupee className="size-4 text-emerald-500 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">CTC Package</p>
                <p className="font-bold text-foreground">{job.ctc_range}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-amber-500 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Location</p>
                <p className="font-bold text-foreground truncate">{job.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="size-4 text-rose-500 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Last Date</p>
                <p className="font-bold text-foreground">{formatDate(job.last_date)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Naukri-Style Job Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/30 p-4 rounded-2xl border border-border/60 text-xs">
            <div className="flex items-center gap-2">
              <Briefcase className="size-4 text-teal-500 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Experience</p>
                <p className="font-bold text-foreground">0 - 2 Yrs / Freshers</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <GraduationCap className="size-4 text-indigo-500 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Eligible Batch</p>
                <p className="font-bold text-foreground">2025 &amp; 2026 Batch</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-amber-500 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Work Mode</p>
                <p className="font-bold text-foreground">Hybrid / On-site</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Award className="size-4 text-emerald-500 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Role Type</p>
                <p className="font-bold text-foreground">Full-Time Permanent</p>
              </div>
            </div>
          </div>

          {/* Tech Stack Tags */}
          {job.tech_stack && job.tech_stack.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Code2 className="size-3.5 text-teal-500" /> Required Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-semibold px-3 py-1 rounded-xl bg-muted text-foreground border border-border/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Shared Interview Taxonomy Rounds Badges */}
          {job.interview_types && job.interview_types.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="size-3.5 text-indigo-500" /> Expected Interview Selection Rounds
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.interview_types.map((type) => {
                  const style = getInterviewTypeBadgeStyle(type);
                  return (
                    <span
                      key={type}
                      className={`text-xs font-semibold px-3 py-1 rounded-xl border ${style.bg} ${style.text} ${style.border}`}
                    >
                      {style.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rich Structured Description Sections */}
          <div className="space-y-4 pt-2">
            {sections.map((block, idx) => {
              const lines = block.split("\n");
              const title = lines[0];
              const bodyLines = lines.slice(1);

              return (
                <div key={idx} className="bg-muted/40 p-5 rounded-2xl border border-border/60 space-y-3">
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                    {title}
                  </h4>
                  <div className="text-xs sm:text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                    {bodyLines.map((line, lIdx) => {
                      if (line.startsWith("•") || line.startsWith("-")) {
                        return (
                          <div key={lIdx} className="flex items-start gap-2 pl-1">
                            <CheckCircle2 className="size-3.5 text-teal-500 shrink-0 mt-0.5" />
                            <span>{line.replace(/^[•-]\s*/, "")}</span>
                          </div>
                        );
                      }
                      return <p key={lIdx}>{line}</p>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer / CTAs */}
        <div className="p-4 sm:p-6 border-t border-border bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Target this Company Button */}
            <button
              onClick={handleTargetToggle}
              disabled={targetingLoading}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 border ${
                isTargeted
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : "bg-secondary text-secondary-foreground border-border hover:bg-secondary/80"
              }`}
            >
              {isTargeted ? (
                <>
                  <Check className="size-3.5 text-emerald-500" /> Target Added
                </>
              ) : (
                <>
                  <Target className="size-3.5 text-teal-500" /> Target Company
                </>
              )}
            </button>

            {/* DSA Shortcut Button */}
            <Link
              href={dsaPrepUrl}
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-semibold text-xs bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Code2 className="size-3.5" /> DSA for Job
            </Link>
          </div>

          {/* Primary Apply Button */}
          <a
            href={job.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
          >
            Apply Now <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
