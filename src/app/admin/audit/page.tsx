"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const MOCK_AUDIT_LOGS = [
  {
    id: "log-101",
    adminName: "Bhavesh Rao (Boss)",
    action: "Assigned 'DSA Creator' tag to Karan Mehta",
    ipAddress: "192.168.1.45",
    timestamp: "2026-07-27 01:57:25",
    severity: "Normal",
  },
  {
    id: "log-102",
    adminName: "Aarav Gupta (TL)",
    action: "Dispatched PDF Offer Letter to Rohan Varma (OFFER-COS-2026-9821)",
    ipAddress: "192.168.1.92",
    timestamp: "2026-07-27 01:54:15",
    severity: "High Impact",
  },
  {
    id: "log-103",
    adminName: "Bhavesh Rao (Boss)",
    action: "Authorized Batch Revenue Share Payouts (₹250,000 Total)",
    ipAddress: "192.168.1.45",
    timestamp: "2026-07-27 01:54:04",
    severity: "Financial",
  },
];

export default function AdminAuditPage() {
  return (
    <div className="space-y-6 animate-fade-up">

      {/* Header Banner */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-orange-500/10 via-surface to-surface">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-teal-400 bg-teal-500/15 border border-teal-500/30">
            <Lock className="size-3.5 text-teal-400" /> System Security & Audit Monitor
          </div>
          <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
            Security Audit Trail Logs
          </h1>
          <p className="text-xs text-secondary">
            Immutable log trail of all admin actions, role changes, offer letter dispatches, and revenue payout authorizations.
          </p>
        </div>
      </div>

      {/* Audit Logs List */}
      <div className="space-y-3">
        {MOCK_AUDIT_LOGS.map((log) => (
          <div key={log.id} className="surface rounded-3xl p-5 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-sm">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">{log.adminName}</span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  log.severity === "Financial"
                    ? "bg-orange-500/15 text-orange-400 border-orange-500/30"
                    : log.severity === "High Impact"
                    ? "bg-teal-500/15 text-teal-400 border-teal-500/30"
                    : "surface-2 text-secondary border-border"
                }`}>
                  {log.severity}
                </span>
              </div>
              <p className="text-secondary font-mono">{log.action}</p>
              <p className="text-muted text-[11px]">IP: {log.ipAddress} · {log.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
