"use client";

import { Sparkles, ArrowRight, Building2, Flame, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const FEATURED_DRIVES = [
  {
    id: "drive-1",
    company: "Amazon AWS",
    company_slug: "amazon",
    logo: "https://logo.clearbit.com/amazon.com",
    title: "AI Science & LLM Engineering Drive 2026",
    ctc: "₹26L - ₹36L PA",
    badge: "🔥 Featured Drive",
    badgeBg: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    gradient: "from-amber-500/15 via-rose-500/10 to-transparent",
    tech: ["PyTorch", "LLMs", "RAG", "SageMaker"],
    location: "Bengaluru (Hybrid)",
  },
  {
    id: "drive-2",
    company: "Google India",
    company_slug: "google",
    logo: "https://logo.clearbit.com/google.com",
    title: "University Graduate SDE Campus Hiring 2026",
    ctc: "₹24L - ₹32L PA",
    badge: "⭐ Recommended",
    badgeBg: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    gradient: "from-blue-500/15 via-teal-500/10 to-transparent",
    tech: ["C++", "Python", "DSA", "Distributed Systems"],
    location: "Bengaluru / Hyderabad",
  },
  {
    id: "drive-3",
    company: "Microsoft IDC",
    company_slug: "microsoft",
    logo: "https://logo.clearbit.com/microsoft.com",
    title: "Azure Cloud Full Stack Engineering Drive",
    ctc: "₹22L - ₹28L PA",
    badge: "💎 Premium Hiring",
    badgeBg: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    gradient: "from-purple-500/15 via-indigo-500/10 to-transparent",
    tech: ["React", "TypeScript", "C#", "Azure"],
    location: "Hyderabad, Telangana",
  },
  {
    id: "drive-4",
    company: "Meesho",
    company_slug: "meesho",
    logo: "https://logo.clearbit.com/meesho.com",
    title: "Product Engineering & Mobile Architecture Hiring",
    ctc: "₹28L - ₹42L PA",
    badge: "🚀 Fast Track",
    badgeBg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    gradient: "from-emerald-500/15 via-teal-500/10 to-transparent",
    tech: ["Android", "Kotlin", "Java", "Backend"],
    location: "Bengaluru, Karnataka",
  },
];

export function TopHiringDrivesCarousel({ onSelectDrive }: { onSelectDrive?: (drive: any) => void }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const nextSlide = () => setActiveIdx((prev) => (prev + 1) % FEATURED_DRIVES.length);
  const prevSlide = () => setActiveIdx((prev) => (prev - 1 + FEATURED_DRIVES.length) % FEATURED_DRIVES.length);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="size-4 text-rose-500 animate-pulse" />
          <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">
            Top Hiring Drives &amp; Campus Pipelines
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={prevSlide}
            className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border transition-all"
            aria-label="Previous drive"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={nextSlide}
            className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border transition-all"
            aria-label="Next drive"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Grid of featured drives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FEATURED_DRIVES.slice(activeIdx, activeIdx + 2).concat(
          FEATURED_DRIVES.length < 2 ? [] : activeIdx + 2 > FEATURED_DRIVES.length ? [FEATURED_DRIVES[0]] : []
        ).slice(0, 2).map((drive) => (
          <div
            key={drive.id}
            onClick={() => onSelectDrive && onSelectDrive(drive)}
            className={`relative overflow-hidden p-5 rounded-3xl border border-border/80 bg-gradient-to-r ${drive.gradient} bg-card cursor-pointer group shadow-sm transform-gpu transition-all duration-300 ease-out hover:-translate-y-3 hover:scale-[1.015] hover:border-teal-400/80 hover:shadow-[0_25px_50px_-12px_rgba(20,184,166,0.3)] dark:hover:shadow-[0_25px_50px_-12px_rgba(20,184,166,0.22)] space-y-3`}
          >
            {/* Glowing Top Ambient Shimmer Bar on Hover */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500/0 via-teal-400 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

            {/* Diagonal Glass Sheen Light Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 dark:via-teal-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none z-20" />
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-white dark:bg-slate-900 border border-border p-1 flex items-center justify-center shrink-0 shadow-xs relative overflow-hidden">
                  <img
                    src={drive.logo}
                    alt={drive.company}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove("hidden");
                    }}
                  />
                  <div className="hidden size-full rounded-xl bg-gradient-to-br from-teal-500 to-amber-500 text-white font-extrabold text-xs flex items-center justify-center">
                    {drive.company.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-foreground">{drive.company}</h4>
                  <p className="text-[11px] font-semibold text-muted-foreground">{drive.location}</p>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${drive.badgeBg}`}>
                {drive.badge}
              </span>
            </div>

            <div>
              <h4 className="font-display font-bold text-sm text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                {drive.title}
              </h4>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border/40">
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                {drive.ctc}
              </span>

              <div className="flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform">
                Explore Drive <ArrowRight className="size-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
