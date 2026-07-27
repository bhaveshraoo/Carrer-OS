"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Rocket,
  Users,
  FileCheck,
  Award,
  DollarSign,
  TrendingUp,
  Plus,
  CheckCircle2,
  AlertCircle,
  Video,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { MOCK_PROJECTS } from "@/lib/projects/data";
import { useNotifications } from "@/components/notifications/notification-provider";

export default function AdminOverviewPage() {
  const { notify } = useNotifications();

  function handleAuthorizePayout() {
    notify({
      type: "success",
      icon: "💰",
      title: "Revenue Payout Authorized!",
      body: "Distributed 5% TL share (₹125,000) and 5% Team share (₹25,000/intern) to bank accounts.",
      autoDismiss: 4000,
    });
  }

  return (
    <div className="space-y-6 animate-fade-up">

      {/* ── 1. HERO BANNER ── */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-orange-500/10 via-surface to-surface">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30">
              <ShieldCheck className="size-3.5 text-orange-500" /> SuperAdmin Overview
            </div>
            <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
              Platform Command Center
            </h1>
            <p className="text-xs text-secondary">
              Manage SaaS projects, review student applications, issue PDF Offer Letters & Certificates, and monitor 5% revenue sharing distributions.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/admin/projects"
              className="px-4 py-2.5 rounded-2xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/20"
            >
              <Plus className="size-4" /> Create New Project
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. KPI METRICS GRID ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface p-5 rounded-3xl border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Total Enrolled</span>
            <Users className="size-4 text-orange-500" />
          </div>
          <p className="font-display text-2xl font-extrabold text-primary">1,420 <span className="text-xs font-normal text-muted">Students</span></p>
          <p className="text-[11px] text-teal-400 font-semibold">+18% this month</p>
        </div>

        <div className="surface p-5 rounded-3xl border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Active Projects</span>
            <Rocket className="size-4 text-teal-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-primary">8 <span className="text-xs font-normal text-muted">SaaS Products</span></p>
          <p className="text-[11px] text-orange-400 font-semibold">24/30 Seats Filled</p>
        </div>

        <div className="surface p-5 rounded-3xl border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Applications</span>
            <FileCheck className="size-4 text-amber-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-primary">156 <span className="text-xs font-normal text-muted">Submitted</span></p>
          <p className="text-[11px] text-teal-400 font-semibold">12 Pending Review</p>
        </div>

        <div className="surface p-5 rounded-3xl border border-orange-500/30 space-y-2 shadow-sm bg-orange-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Total Product Sales</span>
            <DollarSign className="size-4 text-orange-500" />
          </div>
          <p className="font-display text-2xl font-extrabold text-primary">₹2.5M <span className="text-xs font-normal text-muted">Sales</span></p>
          <p className="text-[11px] text-teal-400 font-semibold">₹250k Distributed</p>
        </div>
      </div>

      {/* ── 3. RECENT APPLICATIONS QUEUE ── */}
      <div className="surface border border-border rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="space-y-0.5">
            <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
              <FileCheck className="size-5 text-orange-500" /> Recent Student Applications (Action Required)
            </h3>
            <p className="text-xs text-muted">Review candidate pitches, issue PDF Offer Letters, or assign to Team Leaders.</p>
          </div>

          <Link href="/admin/applications" className="text-xs font-bold text-orange-400 hover:underline flex items-center gap-1">
            View All (156) <ChevronRight className="size-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {[
            { name: "Rohan Varma", project: "Autonomous Code Refactoring Agent", domain: "Frontend", status: "Applied", score: "88/100" },
            { name: "Ananya Roy", project: "AI Voice-Powered Career Assistant", domain: "AI/ML", status: "Interview Scheduled", score: "94/100" },
            { name: "Vikram Malhotra", project: "Open Source Developer Tooling", domain: "Backend", status: "Selected", score: "91/100" },
          ].map((app, i) => (
            <div key={i} className="surface-2 p-4 rounded-2xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary text-sm">{app.name}</span>
                  <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                    {app.domain} Domain
                  </span>
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
                    ATS: {app.score}
                  </span>
                </div>
                <p className="text-muted">{app.project}</p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/admin/applications"
                  className="px-3.5 py-1.5 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110 flex items-center gap-1 shadow-sm"
                >
                  <FileCheck className="size-3.5" /> Review & Issue Offer
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. REVENUE SHARING LEDGER SPOTLIGHT ── */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 space-y-4 shadow-xl bg-orange-500/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-border">
          <div className="space-y-0.5">
            <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
              <DollarSign className="size-5 text-orange-500" /> Commercial Revenue Distribution Ledger
            </h3>
            <p className="text-xs text-muted">5% Team Leader Share · 5% Equal Team Split · 90% CareerOS Platform Share</p>
          </div>

          <button
            onClick={handleAuthorizePayout}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-500 text-white hover:brightness-110 shadow-md flex items-center gap-1.5 shrink-0"
          >
            <CheckCircle2 className="size-3.5" /> Authorize Batch Bank Payouts
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div className="surface-2 p-4 rounded-2xl border border-border space-y-1 text-center">
            <p className="text-muted font-bold uppercase text-[10px]">Product Sale Value</p>
            <p className="font-display text-2xl font-extrabold text-primary">₹2,500,000</p>
            <p className="text-teal-400 font-semibold">Sale Approved</p>
          </div>

          <div className="surface-2 p-4 rounded-2xl border border-border space-y-1 text-center">
            <p className="text-muted font-bold uppercase text-[10px]">Team Leader Share (5%)</p>
            <p className="font-display text-2xl font-extrabold text-orange-400">₹125,000</p>
            <p className="text-muted">Aarav Gupta (TL)</p>
          </div>

          <div className="surface-2 p-4 rounded-2xl border border-border space-y-1 text-center">
            <p className="text-muted font-bold uppercase text-[10px]">Team Member Share (5% Split)</p>
            <p className="font-display text-2xl font-extrabold text-teal-400">₹25,000 / member</p>
            <p className="text-muted">Distributed to 5 Approved Interns</p>
          </div>
        </div>
      </div>

    </div>
  );
}
