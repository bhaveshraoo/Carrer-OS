"use client";

import { useState } from "react";
import {
  DollarSign,
  CheckCircle2,
  TrendingUp,
  Award,
  Users,
  ShieldCheck,
  Zap,
  Download,
  Calculator,
  Building2,
  FileText,
} from "lucide-react";
import { MOCK_REVENUE_SHARES } from "@/lib/projects/data";
import { useNotifications } from "@/components/notifications/notification-provider";

export default function AdminRevenuePage() {
  const { notify } = useNotifications();

  // Interactive Sale Calculator State
  const [saleAmountInput, setSaleAmountInput] = useState(2500000);
  const [internsCountInput, setInternsCountInput] = useState(5);
  const [payoutsHistory, setPayoutsHistory] = useState([
    { id: "pay-101", project: "Autonomous Code Refactoring Agent", sale: 2500000, tlShare: 125000, internShare: 25000, date: "2026-07-28", status: "Paid" },
    { id: "pay-102", project: "AI Voice-Powered Career Assistant", sale: 1800000, tlShare: 90000, internShare: 18000, date: "2026-06-15", status: "Paid" },
  ]);

  const tlShareVal = Math.round(saleAmountInput * 0.05);
  const totalTeamShareVal = Math.round(saleAmountInput * 0.05);
  const perInternShareVal = Math.round(totalTeamShareVal / (internsCountInput || 1));
  const platformShareVal = saleAmountInput - tlShareVal - totalTeamShareVal;

  function handleAuthorizePayout() {
    const newRecord = {
      id: `pay-${Date.now()}`,
      project: "Custom SaaS Product Sale",
      sale: saleAmountInput,
      tlShare: tlShareVal,
      internShare: perInternShareVal,
      date: new Date().toISOString().split("T")[0],
      status: "Paid",
    };

    setPayoutsHistory([newRecord, ...payoutsHistory]);

    notify({
      type: "success",
      icon: "💰",
      title: "Batch Bank Payouts Authorized!",
      body: `Transferred ₹${tlShareVal.toLocaleString()} to Team Leader and ₹${perInternShareVal.toLocaleString()} each to ${internsCountInput} team members.`,
      autoDismiss: 4500,
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
              Calculate, inspect, and authorize revenue sharing distributions when software products built by student cohorts are commercially licensed or acquired.
            </p>
          </div>

          <button
            onClick={handleAuthorizePayout}
            className="px-5 py-3 rounded-2xl font-bold text-xs bg-teal-500 text-white hover:brightness-110 shadow-md shadow-teal-500/20 shrink-0 flex items-center gap-1.5"
          >
            <CheckCircle2 className="size-4" /> Authorize Batch Bank Payouts
          </button>
        </div>
      </div>

      {/* ── INTERACTIVE REVENUE SPLIT CALCULATOR ── */}
      <div className="surface border border-border rounded-3xl p-6 space-y-5 shadow-sm">
        <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
          <Calculator className="size-5 text-orange-500" /> Live Revenue Split Simulator
        </h3>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-primary">Gross Product Licensing / Sale Value (₹)</label>
            <input
              type="number"
              value={saleAmountInput}
              onChange={(e) => setSaleAmountInput(Number(e.target.value))}
              className="w-full h-11 px-4 rounded-2xl surface-2 border border-border font-mono text-sm text-primary font-bold focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-primary">Number of Approved Intern Team Members</label>
            <input
              type="number"
              min={1}
              max={20}
              value={internsCountInput}
              onChange={(e) => setInternsCountInput(Number(e.target.value))}
              className="w-full h-11 px-4 rounded-2xl surface-2 border border-border font-mono text-sm text-primary font-bold focus:outline-none"
            />
          </div>
        </div>

        {/* Dynamic Split Breakdown Cards */}
        <div className="grid sm:grid-cols-4 gap-4 text-xs">
          <div className="surface-2 p-4 rounded-2xl border border-border space-y-1 text-center">
            <p className="text-muted font-bold uppercase text-[10px]">Gross Sale</p>
            <p className="font-display text-xl font-extrabold text-primary">₹{saleAmountInput.toLocaleString()}</p>
            <p className="text-teal-400 font-semibold text-[11px]">100% Total</p>
          </div>

          <div className="surface-2 p-4 rounded-2xl border border-orange-500/30 bg-orange-500/5 space-y-1 text-center">
            <p className="text-orange-400 font-bold uppercase text-[10px]">TL Share (5%)</p>
            <p className="font-display text-xl font-extrabold text-orange-400">₹{tlShareVal.toLocaleString()}</p>
            <p className="text-muted text-[11px]">Team Leader Payout</p>
          </div>

          <div className="surface-2 p-4 rounded-2xl border border-teal-500/30 bg-teal-500/5 space-y-1 text-center">
            <p className="text-teal-400 font-bold uppercase text-[10px]">Per Intern Split (5%)</p>
            <p className="font-display text-xl font-extrabold text-teal-400">₹{perInternShareVal.toLocaleString()}</p>
            <p className="text-muted text-[11px]">Split across {internsCountInput} Interns</p>
          </div>

          <div className="surface-2 p-4 rounded-2xl border border-border space-y-1 text-center">
            <p className="text-muted font-bold uppercase text-[10px]">CareerOS Platform (90%)</p>
            <p className="font-display text-xl font-extrabold text-primary">₹{platformShareVal.toLocaleString()}</p>
            <p className="text-muted text-[11px]">Infra &amp; Operations</p>
          </div>
        </div>
      </div>

      {/* ── DISPATCHES HISTORY LEDGER TABLE ── */}
      <div className="surface border border-border rounded-3xl p-6 space-y-4 shadow-sm">
        <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
          <FileText className="size-5 text-teal-400" /> Commercial Payout History Ledger
        </h3>

        <div className="space-y-3 text-xs">
          {payoutsHistory.map((p) => (
            <div key={p.id} className="surface-2 p-4 rounded-2xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="font-bold text-primary text-sm">{p.project}</p>
                <p className="text-muted">Dispatched on {p.date} · Gross Sale: <strong className="text-primary">₹{p.sale.toLocaleString()}</strong></p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-mono font-bold text-orange-400">TL: ₹{p.tlShare.toLocaleString()}</p>
                  <p className="font-mono text-teal-400 font-bold">Interns: ₹{p.internShare.toLocaleString()} ea</p>
                </div>
                <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
