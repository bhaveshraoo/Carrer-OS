"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Video,
  Download,
  Send,
  MessageSquare,
  FileText,
  Code2,
  Globe,
  Sparkles,
  ShieldCheck,
  Zap,
  ChevronRight,
  Search,
} from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";

interface CandidateApp {
  id: string;
  candidateName: string;
  email: string;
  projectTitle: string;
  domain: string;
  resumeUrl: string;
  githubUrl: string;
  linkedInUrl: string;
  pitch: string;
  deliverables: string;
  status: "applied" | "interview_scheduled" | "selected" | "rejected";
  appliedAt: string;
}

const INITIAL_APPLICATIONS: CandidateApp[] = [
  {
    id: "app-101",
    candidateName: "Rohan Varma",
    email: "rohan.varma@iitd.ac.in",
    projectTitle: "Autonomous Code Refactoring Agent",
    domain: "Frontend Engineer",
    resumeUrl: "https://careeros.app/resumes/rohan_resume.pdf",
    githubUrl: "https://github.com/rohan_dev",
    linkedInUrl: "https://linkedin.com/in/rohan_varma",
    pitch: "I have built 2 production Next.js apps with WebSocket real-time state. Highly dedicated to 15 hrs/week commitment.",
    deliverables: "I will build the AST code refactoring UI and connect WebSocket streaming.",
    status: "applied",
    appliedAt: "2026-07-26",
  },
  {
    id: "app-102",
    candidateName: "Ananya Roy",
    email: "ananya.roy@iiit.ac.in",
    projectTitle: "AI Voice-Powered Career Assistant",
    domain: "AI/ML Engineer",
    resumeUrl: "https://careeros.app/resumes/ananya_resume.pdf",
    githubUrl: "https://github.com/ananya_ai",
    linkedInUrl: "https://linkedin.com/in/ananya_roy",
    pitch: "1 year experience in PyTorch & OpenAI Realtime Audio API. Built vector search pipelines.",
    deliverables: "Implement audio streaming pipeline and Pinecone vector database index.",
    status: "interview_scheduled",
    appliedAt: "2026-07-25",
  },
  {
    id: "app-103",
    candidateName: "Vikram Malhotra",
    email: "vikram.m@nsut.ac.in",
    projectTitle: "Open Source Developer Tooling",
    domain: "Backend Engineer",
    resumeUrl: "https://careeros.app/resumes/vikram_resume.pdf",
    githubUrl: "https://github.com/vikram_dev",
    linkedInUrl: "https://linkedin.com/in/vikram_m",
    pitch: "Built Rust CLI tools and Node.js microservices with Docker.",
    deliverables: "Build CLI distribution binary and automated test suite.",
    status: "selected",
    appliedAt: "2026-07-24",
  },
];

export default function AdminApplicationsPage() {
  const { notify } = useNotifications();
  const [applications, setApplications] = useState<CandidateApp[]>(INITIAL_APPLICATIONS);
  const [filterStatus, setFilterStatus] = useState<"all" | "applied" | "interview_scheduled" | "selected" | "rejected">("all");
  const [search, setSearch] = useState("");

  // Offer Modal State
  const [selectedAppForOffer, setSelectedAppForOffer] = useState<CandidateApp | null>(null);

  // Feedback Modal State
  const [selectedAppForFeedback, setSelectedAppForFeedback] = useState<CandidateApp | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      app.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
      app.domain.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  function handleSendOfferLetter(appId: string) {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: "selected" } : a))
    );
    setSelectedAppForOffer(null);

    notify({
      type: "success",
      icon: "📜",
      title: "PDF Offer Letter Sent!",
      body: "Official Internship Offer Letter generated and dispatched to candidate inbox & dashboard.",
      autoDismiss: 4500,
    });
  }

  function handleSendRejectionFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (selectedAppForFeedback) {
      setApplications((prev) =>
        prev.map((a) => (a.id === selectedAppForFeedback.id ? { ...a, status: "rejected" } : a))
      );
      setSelectedAppForFeedback(null);
      setFeedbackText("");

      notify({
        type: "info",
        icon: "💡",
        title: "Feedback Delivered to Candidate",
        body: "Candidate notified with constructive skill growth advice.",
        autoDismiss: 3500,
      });
    }
  }

  return (
    <div className="space-y-6 animate-fade-up">

      {/* Header Banner */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-orange-500/10 via-surface to-surface">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30">
            <FileCheck className="size-3.5 text-orange-500" /> Offer Letter & Application Engine
          </div>
          <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
            Student Applications & Offers
          </h1>
          <p className="text-xs text-secondary">
            Review candidate pitches, issue PDF Offer Letters, schedule interviews, and deliver constructive rejection feedback.
          </p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="size-4 text-muted absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name, project, or domain..."
              className="w-full h-10 pl-10 pr-4 rounded-2xl surface-2 border border-border text-xs text-primary focus:outline-none"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "all", label: "All (3)" },
              { id: "applied", label: "Pending (1)" },
              { id: "interview_scheduled", label: "Interviews (1)" },
              { id: "selected", label: "Selected (1)" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterStatus(st.id as typeof filterStatus)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                  filterStatus === st.id
                    ? "bg-orange-500 text-white border-orange-500"
                    : "surface-2 text-secondary hover:text-primary border-border"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Cards List */}
      <div className="space-y-4">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="surface rounded-3xl p-6 border border-border space-y-4 shadow-sm hover:border-orange-500/30 transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base text-primary">{app.candidateName}</h3>
                  <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                    Domain: {app.domain}
                  </span>
                </div>
                <p className="text-xs text-muted">{app.email} · Applied for <strong className="text-primary">{app.projectTitle}</strong> on {app.appliedAt}</p>
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase border ${
                app.status === "selected"
                  ? "bg-teal-500/20 text-teal-400 border-teal-500/30"
                  : app.status === "interview_scheduled"
                  ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                  : "bg-surface-2 text-secondary border-border"
              }`}>
                {app.status.replace("_", " ")}
              </span>
            </div>

            {/* Candidate Pitch & Deliverables */}
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="surface-2 p-3.5 rounded-2xl border border-border space-y-1">
                <span className="font-bold text-orange-400 text-[11px] uppercase tracking-wider block">Candidate Pitch</span>
                <p className="text-secondary leading-relaxed">{app.pitch}</p>
              </div>

              <div className="surface-2 p-3.5 rounded-2xl border border-border space-y-1">
                <span className="font-bold text-teal-400 text-[11px] uppercase tracking-wider block">Deliverables & Plan</span>
                <p className="text-secondary leading-relaxed">{app.deliverables}</p>
              </div>
            </div>

            {/* Resume Links & Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border text-xs">
              <div className="flex items-center gap-3">
                <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-orange-400 font-bold hover:underline flex items-center gap-1">
                  <FileText className="size-3.5" /> Resume PDF
                </a>
                <a href={app.githubUrl} target="_blank" rel="noreferrer" className="text-teal-400 font-bold hover:underline flex items-center gap-1">
                  <Code2 className="size-3.5" /> GitHub
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {app.status !== "selected" && (
                  <button
                    onClick={() => setSelectedAppForOffer(app)}
                    className="px-4 py-2 rounded-xl font-bold bg-teal-500 text-white hover:brightness-110 flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="size-3.5" /> Accept & Issue Offer Letter
                  </button>
                )}

                {app.status !== "rejected" && (
                  <button
                    onClick={() => setSelectedAppForFeedback(app)}
                    className="px-3.5 py-2 rounded-xl font-bold surface-2 text-red-400 hover:bg-red-500/10 border border-red-500/20 flex items-center gap-1.5"
                  >
                    <XCircle className="size-3.5" /> Reject & Send Feedback
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* OFFER LETTER GENERATOR MODAL */}
      {selectedAppForOffer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
          <div className="surface border border-teal-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <FileCheck className="size-5 text-teal-400" /> Issue Internship Offer Letter
              </h3>
              <button onClick={() => setSelectedAppForOffer(null)} className="text-xs text-muted font-bold px-2 py-1 surface-2 rounded-lg">
                ✕ Close
              </button>
            </div>

            <div className="surface-2 p-4 rounded-2xl border border-teal-500/30 space-y-2 text-xs">
              <p className="font-bold text-primary text-sm">{selectedAppForOffer.candidateName}</p>
              <p className="text-muted">Project: <strong className="text-primary">{selectedAppForOffer.projectTitle}</strong></p>
              <p className="text-teal-400 font-semibold">Domain: {selectedAppForOffer.domain} · Stipend: ₹15,000/mo</p>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button onClick={() => setSelectedAppForOffer(null)} className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary">
                Cancel
              </button>
              <button
                onClick={() => handleSendOfferLetter(selectedAppForOffer.id)}
                className="px-6 py-2 rounded-xl font-bold bg-teal-500 text-white hover:brightness-110 shadow-md"
              >
                Generate & Dispatch PDF Offer Letter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION FEEDBACK MODAL */}
      {selectedAppForFeedback && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
          <div className="surface border border-red-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <XCircle className="size-5 text-red-400" /> Rejection & Constructive Feedback
              </h3>
              <button onClick={() => setSelectedAppForFeedback(null)} className="text-xs text-muted font-bold px-2 py-1 surface-2 rounded-lg">
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSendRejectionFeedback} className="space-y-4 text-xs">
              <p className="text-secondary">
                Candidate: <strong className="text-primary">{selectedAppForFeedback.candidateName}</strong>
              </p>

              <div className="space-y-1">
                <label className="font-bold text-primary">Why can't we proceed with this candidate? (Feedback text sent to student)</label>
                <textarea
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  required
                  placeholder="e.g. Your candidate profile is strong, but for this cohort we required 2+ prior production deployments with WebSockets. Recommended: Complete the WebSocket module on DSA Prep..."
                  className="w-full p-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setSelectedAppForFeedback(null)} className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl font-bold bg-red-500 text-white hover:brightness-110 shadow-md">
                  Send Feedback & Mark Not Selected
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
