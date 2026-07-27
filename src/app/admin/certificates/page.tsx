"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  QrCode,
  Download,
  Share2,
  CheckCircle2,
  Sparkles,
  Users,
  Search,
} from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";

const MOCK_CERTIFICATES = [
  {
    id: "cert-101",
    certId: "COS-2026-9482",
    candidateName: "Bhavesh Rao",
    projectTitle: "AI Voice-Powered Career Assistant",
    domain: "Frontend Engineer",
    duration: "3 Months (May 2026 - July 2026)",
    score: 94,
    issueDate: "2026-07-27",
    status: "issued",
  },
  {
    id: "cert-102",
    certId: "COS-2026-8812",
    candidateName: "Rohan Varma",
    projectTitle: "Autonomous Code Refactoring Agent",
    domain: "Full Stack Engineer",
    duration: "3 Months (May 2026 - July 2026)",
    score: 91,
    issueDate: "2026-07-26",
    status: "issued",
  },
];

export default function AdminCertificatesPage() {
  const { notify } = useNotifications();
  const [certs, setCerts] = useState(MOCK_CERTIFICATES);
  const [search, setSearch] = useState("");

  function handleIssueNewCert() {
    notify({
      type: "success",
      icon: "🏆",
      title: "Certificate & LOR Issued!",
      body: "Generated QR-verified Internship Certificate & LOR for candidate.",
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
              <Award className="size-3.5 text-orange-500" /> Certificate & LOR Issuance Engine
            </div>
            <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
              Internship Certificates & LOR Ledger
            </h1>
            <p className="text-xs text-secondary">
              Issue official Internship Certificates & Letters of Recommendation with QR Verification IDs (`COS-2026-XXXX`).
            </p>
          </div>

          <button
            onClick={handleIssueNewCert}
            className="px-5 py-3 rounded-2xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 shadow-md shadow-orange-500/20 shrink-0"
          >
            Issue New Certificate & LOR
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-muted uppercase tracking-wider px-2">
          <span>Issued Certificates ({certs.length})</span>
          <span>QR Verification Ledger</span>
        </div>

        <div className="space-y-3">
          {certs.map((c) => (
            <div key={c.id} className="surface rounded-3xl p-5 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-orange-500/30 transition-all text-xs">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-orange-500/15 text-orange-500 flex items-center justify-center font-bold text-lg shrink-0">
                  <Award className="size-6" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-primary">{c.candidateName}</h3>
                    <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                      {c.certId}
                    </span>
                  </div>
                  <p className="text-muted">{c.projectTitle} · {c.duration}</p>
                  <p className="text-teal-400 font-semibold">Intern Score: {c.score}/100 · QR Verified</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => notify({ type: "info", icon: "📥", title: "Certificate Downloaded", body: `Downloaded PDF for ${c.candidateName}` })}
                  className="px-4 py-2 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110 flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="size-3.5" /> PDF Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
