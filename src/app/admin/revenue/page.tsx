"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  CheckCircle2,
  TrendingUp,
  Award,
  Users,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { MOCK_REVENUE_SHARES } from "@/lib/projects/data";
import { useNotifications } from "@/components/notifications/notification-provider";

export default function AdminRevenuePage() {
  const { notify } = useNotifications();
  const revenueData = MOCK_REVENUE_SHARES[0];

  function handleAuthorizePayout() {
    notify({
      type: "success",
      icon: "💰",
      title: "Batch Payout Authorized!",
      body: "Sent bank transfers to Team Leader Aarav Gupta and 5 approved team members.",
      autoDismiss: 4000,
    });
  }

  return (
    <div className="space-y-6 animate-fade-up">

      {/* Header Banner */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-orange-500/10 via-surface to-surface">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30">
              <DollarSign className="size-3.5 text-orange-500" /> Commercial Revenue Distribution Ledger
            </div>
            <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
              SaaS Project Payouts (5% TL / 5% Interns)
            </h1>
            <p className="text-xs text-secondary">
              Automatic revenue sharing breakdown when completed software products are commercially licensed or acquired.
            </p>
          </div>

          <button
            onClick={handleAuthorizePayout}
            className="px-5 py-3 rounded-2xl font-bold text-xs bg-teal-500 text-white hover:brightness-110 shadow-md shadow-teal-500/20 shrink-0"
          >
            Authorize Bank Payouts
          </button>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid sm:grid-cols-3 gap-5">
        <div className="surface p-6 rounded-3xl border border-border text-center space-y-2">
          <p className="text-xs font-bold text-muted uppercase">Gross Product Sale</p>
          <p className="font-display text-3xl font-extrabold text-primary">₹{revenueData.saleAmount.toLocaleString()}</p>
          <p className="text-xs text-teal-400 font-semibold">Status: APPROVED</p>
        </div>

        <div className="surface p-6 rounded-3xl border border-orange-500/30 text-center space-y-2 bg-orange-500/5">
          <p className="text-xs font-bold text-orange-400 uppercase">Team Leader Share (5%)</p>
          <p className="font-display text-3xl font-extrabold text-orange-400">₹{revenueData.tlShare.toLocaleString()}</p>
          <p className="text-xs text-muted">Aarav Gupta (TL)</p>
        </div>

        <div className="surface p-6 rounded-3xl border border-border text-center space-y-2">
          <p className="text-xs font-bold text-muted uppercase">Intern Team Member Payout (5% Split)</p>
          <p className="font-display text-3xl font-extrabold text-teal-400">₹{revenueData.teamSharePerMember.toLocaleString()}</p>
          <p className="text-xs text-muted">Each of 5 Approved Team Interns</p>
        </div>
      </div>

    </div>
  );
}
