"use client";

import Link from "next/link";
import {
  Building2,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  Flame,
  Award,
  Zap,
} from "lucide-react";

export function JobPortalRightSidebar() {
  return (
    <div className="space-y-6">
      {/* 1. Today's Top Hiring Companies */}
      <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Building2 className="size-4 text-teal-500" /> Today&apos;s Top Hiring Companies
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Active Now
          </span>
        </div>

        <div className="space-y-2.5">
          {[
            { name: "Google", slug: "google", logo: "https://logo.clearbit.com/google.com", count: "14 Roles", tier: "Tier 1 Product" },
            { name: "Microsoft", slug: "microsoft", logo: "https://logo.clearbit.com/microsoft.com", count: "9 Roles", tier: "Cloud & AI" },
            { name: "Rubrik", slug: "rubrik", logo: "https://logo.clearbit.com/rubrik.com", count: "11 Roles", tier: "Zero Trust Security" },
            { name: "Stripe", slug: "stripe", logo: "https://logo.clearbit.com/stripe.com", count: "7 Roles", tier: "Fintech Infra" },
            { name: "PhonePe", slug: "phonepe", logo: "https://logo.clearbit.com/phonepe.com", count: "12 Roles", tier: "Mobile Systems" },
          ].map((c) => (
            <Link
              key={c.slug}
              href={`/dashboard/companies/${c.slug}`}
              className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-muted/60 transition-colors border border-transparent hover:border-border group"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-background border border-border p-0.5 flex items-center justify-center shrink-0 relative overflow-hidden">
                  <img
                    src={c.logo}
                    alt={c.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove("hidden");
                    }}
                  />
                  <div className="hidden size-full rounded-lg bg-gradient-to-br from-teal-500 to-amber-500 text-white font-extrabold text-[10px] flex items-center justify-center">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {c.name}
                  </h4>
                  <p className="text-[10px] font-semibold text-muted-foreground">{c.tier}</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                {c.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. AI Resume Match Score Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-500/10 via-background to-amber-500/10 border border-teal-500/30 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-300">
            <Sparkles className="size-4 text-teal-500" /> AI Resume Readiness
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            87% ATS Ready
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-foreground">
            <span>Overall Resume ATS Score</span>
            <span className="text-teal-600 dark:text-teal-400 font-mono font-extrabold">87 / 100</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full w-[87%]" />
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Your active resume matches 87% of live Tier 1 SDE postings. Boost your match score by adding missing keywords like <strong>Docker</strong> and <strong>Redis</strong>.
        </p>

        <Link
          href="/dashboard/resume"
          className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          Optimize Resume with AI <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      {/* 3. Trending Skills in India */}
      <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-xs space-y-3">
        <h3 className="font-display text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
          <TrendingUp className="size-4 text-amber-500" /> Trending Tech Skills in India
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {[
            { skill: "PyTorch & RAG", count: "1,240 Jobs" },
            { skill: "System Design", count: "3,410 Jobs" },
            { skill: "React & Next.js", count: "4,120 Jobs" },
            { skill: "PostgreSQL & Redis", count: "2,890 Jobs" },
            { skill: "AWS & Kubernetes", count: "1,980 Jobs" },
          ].map((s) => (
            <span
              key={s.skill}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-muted text-foreground border border-border/70 flex items-center gap-1"
            >
              {s.skill} <span className="text-[9px] font-bold text-muted-foreground font-mono">({s.count})</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
