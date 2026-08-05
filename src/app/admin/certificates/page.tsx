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
  Plus,
  X,
  FileText,
  Building2,
  ExternalLink,
} from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";

interface CertRecord {
  id: string;
  certId: string;
  candidateName: string;
  projectTitle: string;
  domain: string;
  duration: string;
  score: number;
  issueDate: string;
  status: string;
}

const MOCK_CERTIFICATES: CertRecord[] = [
  {
    id: "cert-101",
    certId: "COS-2026-9482",
    candidateName: "Bhavesh Rao",
    projectTitle: "AI Voice-Powered Career Assistant",
    domain: "Frontend Engineer Lead",
    duration: "3 Months (May 2026 - July 2026)",
    score: 96,
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
  {
    id: "cert-103",
    certId: "COS-2026-7721",
    candidateName: "Vikram Malhotra",
    projectTitle: "Open Source Developer Tooling",
    domain: "Backend Engineer",
    duration: "3 Months (Apr 2026 - June 2026)",
    score: 98,
    issueDate: "2026-06-30",
    status: "issued",
  },
];

export default function AdminCertificatesPage() {
  const { notify } = useNotifications();
  const [certs, setCerts] = useState<CertRecord[]>(MOCK_CERTIFICATES);
  const [search, setSearch] = useState("");
  const [showIssueModal, setShowIssueModal] = useState(false);

  // Form State
  const [candidateName, setCandidateName] = useState("");
  const [projectTitle, setProjectTitle] = useState("AI Voice-Powered Career Assistant");
  const [domain, setDomain] = useState("Frontend Engineer");
  const [score, setScore] = useState(95);

  const filteredCerts = certs.filter(
    (c) =>
      c.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      c.certId.toLowerCase().includes(search.toLowerCase()) ||
      c.projectTitle.toLowerCase().includes(search.toLowerCase())
  );

  function handleIssueCertSubmit(e: React.FormEvent) {
    e.preventDefault();
    const certNum = Math.floor(1000 + Math.random() * 9000);
    const newCert: CertRecord = {
      id: `cert-${Date.now()}`,
      certId: `COS-2026-${certNum}`,
      candidateName,
      projectTitle,
      domain,
      duration: "3 Months (May 2026 - July 2026)",
      score: Number(score),
      issueDate: new Date().toISOString().split("T")[0],
      status: "issued",
    };

    setCerts([newCert, ...certs]);
    setShowIssueModal(false);
    setCandidateName("");

    notify({
      type: "success",
      icon: "🏆",
      title: "Certificate & LOR Issued!",
      body: `Generated QR-verified Certificate ${newCert.certId} for ${candidateName}.`,
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
              <Award className="size-3.5 text-orange-500" /> Certificate &amp; LOR Issuance Engine
            </div>
            <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
              Internship Certificates &amp; LOR Ledger
            </h1>
            <p className="text-xs text-secondary">
              Issue official Internship Certificates &amp; Letters of Recommendation with QR Verification IDs (`COS-2026-XXXX`).
            </p>
          </div>

          <button
            onClick={() => setShowIssueModal(true)}
            className="px-5 py-3 rounded-2xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 shadow-md shadow-orange-500/20 shrink-0 flex items-center gap-1.5"
          >
            <Plus className="size-4" /> Issue Certificate &amp; LOR
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="size-4 text-muted absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by candidate name, certificate ID (COS-2026-XXXX), or project..."
          className="w-full h-10 pl-10 pr-4 rounded-2xl surface-2 border border-border text-xs text-primary focus:outline-none"
        />
      </div>

      {/* Ledger Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-muted uppercase tracking-wider px-2">
          <span>Issued Certificates ({filteredCerts.length})</span>
          <span>QR Verification Ledger</span>
        </div>

        <div className="space-y-3">
          {filteredCerts.map((c) => (
            <div key={c.id} className="surface rounded-3xl p-5 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-orange-500/30 transition-all text-xs">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-orange-500/15 text-orange-500 flex items-center justify-center font-bold text-lg shrink-0 border border-orange-500/30">
                  <Award className="size-6" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-primary">{c.candidateName}</h3>
                    <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                      {c.certId}
                    </span>
                  </div>
                  <p className="text-muted">{c.projectTitle} ({c.domain}) · {c.duration}</p>
                  <p className="text-teal-400 font-semibold">Intern Score: {c.score}/100 · Issued {c.issueDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => notify({ type: "info", icon: "📥", title: "Certificate Downloaded", body: `Downloaded PDF for ${c.candidateName} (${c.certId})` })}
                  className="px-4 py-2 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110 flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="size-3.5" /> PDF Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ISSUE CERTIFICATE MODAL */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
          <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <Award className="size-5 text-orange-500" /> Issue Internship Certificate &amp; LOR
              </h3>
              <button onClick={() => setShowIssueModal(false)} className="text-xs text-muted font-bold px-2 py-1 surface-2 rounded-lg">
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleIssueCertSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-primary">Candidate Full Name *</label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  required
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary">Completed SaaS Project</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  required
                  className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-primary">Role / Domain</label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    required
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Performance Score</label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    required
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowIssueModal(false)} className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110 shadow-md">
                  Generate &amp; Issue Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
