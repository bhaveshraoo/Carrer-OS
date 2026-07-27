"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  FileCheck,
  Award,
  DollarSign,
  BarChart3,
  PieChart,
  Globe,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-up">

      {/* Header Banner */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-orange-500/10 via-surface to-surface">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30">
            <BarChart3 className="size-3.5 text-orange-500" /> Platform Intelligence & Analytics
          </div>
          <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
            Real-Time System Analytics Hub
          </h1>
          <p className="text-xs text-secondary">
            Monitor student engagement, ATS resume conversion rates, project application funnels, and college placement statistics.
          </p>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface p-5 rounded-3xl border border-border space-y-2">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Active Daily Users</span>
          <p className="font-display text-2xl font-extrabold text-primary">842 <span className="text-xs font-normal text-teal-400">+14%</span></p>
          <p className="text-[11px] text-muted">94% from Indian Colleges</p>
        </div>

        <div className="surface p-5 rounded-3xl border border-border space-y-2">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Avg ATS Resume Score</span>
          <p className="font-display text-2xl font-extrabold text-teal-400">84.2 <span className="text-xs font-normal text-muted">/ 100</span></p>
          <p className="text-[11px] text-teal-400 font-semibold">+18.5 pts average boost</p>
        </div>

        <div className="surface p-5 rounded-3xl border border-border space-y-2">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Offer Conversion Rate</span>
          <p className="font-display text-2xl font-extrabold text-orange-400">34.8%</p>
          <p className="text-[11px] text-muted">Applicants to Offers</p>
        </div>

        <div className="surface p-5 rounded-3xl border border-border space-y-2">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Pro Subscriber MRR</span>
          <p className="font-display text-2xl font-extrabold text-primary">₹480,000</p>
          <p className="text-[11px] text-teal-400 font-semibold">+22% MoM growth</p>
        </div>
      </div>

      {/* Application Funnel & Regional Stats */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Application Funnel Bar */}
        <div className="surface border border-border rounded-3xl p-6 space-y-4">
          <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
            <PieChart className="size-5 text-orange-500" /> Application Funnel Conversion
          </h3>

          <div className="space-y-3 text-xs">
            {[
              { label: "1. Total Resume Scans", count: "14,250", pct: 100, color: "bg-orange-500" },
              { label: "2. Project Applications Submitted", count: "1,560", pct: 65, color: "bg-amber-500" },
              { label: "3. Technical Interviews Scheduled", count: "420", pct: 40, color: "bg-blue-500" },
              { label: "4. Selected & Offer Letter Issued", count: "210", pct: 25, color: "bg-teal-500" },
            ].map((f) => (
              <div key={f.label} className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-primary">{f.label}</span>
                  <span className="text-muted">{f.count}</span>
                </div>
                <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden border border-border">
                  <div className={`h-full ${f.color} rounded-full`} style={{ width: `${f.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top College Demographics */}
        <div className="surface border border-border rounded-3xl p-6 space-y-4">
          <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
            <Globe className="size-5 text-teal-400" /> College Demographics
          </h3>

          <div className="space-y-3 text-xs">
            {[
              { college: "IIT Delhi & Bombay", share: "28% of applicants", status: "High Placement Rate" },
              { college: "BITS Pilani & Goa", share: "24% of applicants", status: "Top Intern Rankers" },
              { college: "NIT Trichy & Surathkal", share: "22% of applicants", status: "Active Cohorts" },
              { college: "VTU & Anna University", share: "18% of applicants", status: "Growing Fast" },
            ].map((c, i) => (
              <div key={i} className="surface-2 p-3.5 rounded-2xl border border-border flex items-center justify-between">
                <div>
                  <p className="font-bold text-primary">{c.college}</p>
                  <p className="text-muted text-[11px]">{c.share}</p>
                </div>
                <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
