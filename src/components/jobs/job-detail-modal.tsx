import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock outer body scrolling when modal is open so page doesn't scroll around
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !job || !mounted) return null;

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

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] w-screen h-screen bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-hidden animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white text-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[720px] relative transition-all duration-300 transform animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── HEADER BANNER (Solid White + Warm Orange Accent) ───────────────── */}
        <div className="relative p-6 sm:p-8 border-b border-amber-500/20 bg-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all shadow-xs z-20 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="size-16 rounded-2xl bg-white border-2 border-amber-500/30 flex items-center justify-center font-bold text-xl text-slate-900 overflow-hidden shrink-0 shadow-xs">
              {job.company_logo_url ? (
                <img
                  src={job.company_logo_url}
                  alt={job.company_name}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <Building2 className="size-8 text-slate-400" />
              )}
            </div>

            <div className="space-y-1.5 pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 border border-amber-500/30">
                  {job.domain}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                  {job.company_tier}
                </span>
              </div>

              <h2 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                {job.role}
              </h2>

              <Link
                href={`/dashboard/companies/${job.company_slug}`}
                className="text-sm font-bold text-amber-600 hover:underline flex items-center gap-1"
              >
                {job.company_name} <ExternalLink className="size-3" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-amber-500/20 text-xs">
            <div className="flex items-center gap-2">
              <IndianRupee className="size-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-black text-slate-500">CTC Package</p>
                <p className="font-black text-emerald-600">{job.ctc_range}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-amber-500 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-black text-slate-500">Location</p>
                <p className="font-extrabold text-slate-900 truncate">{job.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="size-4 text-rose-500 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-black text-slate-500">Last Date</p>
                <p className="font-black text-rose-600">{formatDate(job.last_date)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── MODAL BODY (Warm Off-White Surface with Crisp White Cards) ────────── */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-amber-500/5">
          {/* Job Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border-2 border-amber-500/30 text-xs shadow-2xs">
            <div className="flex items-center gap-2">
              <Briefcase className="size-4 text-amber-500 shrink-0" />
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase">Experience</p>
                <p className="font-extrabold text-slate-900">0 - 2 Yrs / Freshers</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <GraduationCap className="size-4 text-indigo-500 shrink-0" />
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase">Eligible Batch</p>
                <p className="font-extrabold text-slate-900">2025 &amp; 2026 Batch</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-teal-500 shrink-0" />
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase">Work Mode</p>
                <p className="font-extrabold text-slate-900">Hybrid / On-site</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Award className="size-4 text-emerald-500 shrink-0" />
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase">Role Type</p>
                <p className="font-extrabold text-slate-900">Full-Time Permanent</p>
              </div>
            </div>
          </div>

          {/* Tech Stack Tags */}
          {job.tech_stack && job.tech_stack.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-black tracking-wider text-slate-500 flex items-center gap-1.5">
                <Code2 className="size-3.5 text-amber-500" /> Required Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-extrabold px-3 py-1 rounded-xl bg-white text-slate-900 border-2 border-amber-500/30 shadow-2xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Expected Interview Selection Rounds */}
          {job.interview_types && job.interview_types.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-black tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="size-3.5 text-indigo-500" /> Expected Interview Selection Rounds
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.interview_types.map((type) => {
                  const style = getInterviewTypeBadgeStyle(type);
                  return (
                    <span
                      key={type}
                      className={`text-xs font-extrabold px-3 py-1 rounded-xl border ${style.bg} ${style.text} ${style.border}`}
                    >
                      {style.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rich Structured Description Sections (Solid White + Warm Orange Border Vibe) */}
          <div className="space-y-4 pt-2">
            {sections.map((block, idx) => {
              const lines = block.split("\n");
              const title = lines[0];
              const bodyLines = lines.slice(1);

              return (
                <div
                  key={idx}
                  className="bg-white p-5.5 rounded-2xl border-2 border-amber-500/35 space-y-3 shadow-xs hover:border-amber-500/60 transition-colors"
                >
                  <h4 className="font-black text-sm text-slate-900 flex items-center gap-2 border-b border-amber-500/20 pb-2.5">
                    {title}
                  </h4>
                  <div className="text-xs sm:text-sm text-slate-800 space-y-2.5 leading-relaxed font-semibold">
                    {bodyLines.map((line, lIdx) => {
                      if (line.startsWith("•") || line.startsWith("-")) {
                        return (
                          <div key={lIdx} className="flex items-start gap-2.5 pl-1">
                            <CheckCircle2 className="size-4 text-amber-500 shrink-0 mt-0.5" />
                            <span className="text-slate-800">{line.replace(/^[•-]\s*/, "")}</span>
                          </div>
                        );
                      }
                      return <p key={lIdx} className="text-slate-800">{line}</p>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── MODAL FOOTER (Solid White Surface) ─────────────────────────────── */}
        <div className="p-4 sm:p-6 border-t border-amber-500/20 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Target this Company Button */}
            <button
              onClick={handleTargetToggle}
              disabled={targetingLoading}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 border ${
                isTargeted
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200"
              }`}
            >
              {isTargeted ? (
                <>
                  <Check className="size-3.5 text-emerald-500" /> Target Added
                </>
              ) : (
                <>
                  <Target className="size-3.5 text-amber-500" /> Target Company
                </>
              )}
            </button>

            {/* DSA Shortcut Button */}
            <Link
              href={dsaPrepUrl}
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-extrabold text-xs bg-amber-500/10 text-amber-700 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Code2 className="size-3.5" /> DSA for Job
            </Link>
          </div>

          {/* Primary Apply Button */}
          <a
            href={job.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-extrabold text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md transition-all flex items-center justify-center gap-2"
          >
            Apply Now <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

