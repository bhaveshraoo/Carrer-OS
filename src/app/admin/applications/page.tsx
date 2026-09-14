"use client";

import { useState, useEffect } from "react";
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
  Calendar,
  Clock,
  UserCheck,
  CalendarDays,
  Clock3,
  Award,
  AlertCircle,
  Filter,
  RefreshCw,
  ExternalLink,
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
  linkedInUrl?: string;
  pitch: string;
  deliverables: string;
  status: "applied" | "interview_scheduled" | "selected" | "rejected" | "under_review";
  appliedAt: string;
  interviewDate?: string;
  interviewTime?: string;
  meetUrl?: string;
  aiScore?: number;
}

interface ExtendedLeaveRequest {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userRole: string;
  date: string;
  endDate?: string;
  totalDays: number;
  status: string;
  approvalStatus: "pending" | "approved" | "rejected";
  requestReason: string;
  reviewedBy?: string;
  remark?: string;
}

interface TenureExtensionApp {
  id: string;
  projectId?: string;
  projectTitle?: string;
  userId?: string;
  internName: string;
  email: string;
  domain: string;
  currentEndDate: string;
  extensionMonths: number;
  newEndDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewRemark?: string;
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
    aiScore: 92,
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
    interviewDate: "2026-09-10",
    interviewTime: "4:00 PM IST",
    meetUrl: "https://meet.google.com/careeros-ananya-eval",
    aiScore: 96,
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
    aiScore: 88,
  },
];

const INITIAL_EXTENDED_LEAVES: ExtendedLeaveRequest[] = [
  {
    id: "att-pm-1001",
    projectId: "proj-crm",
    userId: "mem-2",
    userName: "Bhavesh Rao",
    userRole: "Intern",
    date: "2026-09-15",
    endDate: "2026-09-20",
    totalDays: 6,
    status: "leave",
    approvalStatus: "pending",
    requestReason: "[EXTENDED LEAVE TO PM - 6 Days]: Attending Annual AI Hackathon finals at IIT Delhi and university semester end project presentation.",
    reviewedBy: "Project Manager (Pending)",
  },
  {
    id: "att-pm-1002",
    projectId: "proj-crm",
    userId: "mem-3",
    userName: "Siddharth Jain",
    userRole: "Intern",
    date: "2026-09-22",
    endDate: "2026-09-25",
    totalDays: 4,
    status: "leave",
    approvalStatus: "approved",
    requestReason: "[EXTENDED LEAVE TO PM - 4 Days]: Family emergency & medical consultation.",
    reviewedBy: "Project Manager (Approved)",
    remark: "Approved. Please sync with TL Ananya before leaving.",
  },
];

const INITIAL_TENURE_EXTENSIONS: TenureExtensionApp[] = [
  {
    id: "ext-101",
    projectId: "proj-crm",
    projectTitle: "Enterprise SaaS CRM Workspace",
    userId: "mem-2",
    internName: "Bhavesh Rao",
    email: "bhavesh.rao@careeros.dev",
    domain: "Full Stack Lead",
    currentEndDate: "2026-11-05",
    extensionMonths: 2,
    newEndDate: "2027-01-05",
    reason: "Delivering Phase 2 AI Autonomous Pipelines and mentorship of incoming cohort intern team.",
    status: "pending",
    appliedAt: "2026-09-06",
  },
  {
    id: "ext-102",
    projectId: "proj-crm",
    projectTitle: "Enterprise SaaS CRM Workspace",
    userId: "mem-3",
    internName: "Dev Patel",
    email: "dev.patel@careeros.dev",
    domain: "Backend & Systems",
    currentEndDate: "2026-10-15",
    extensionMonths: 1,
    newEndDate: "2026-11-15",
    reason: "Finalizing Rust microservice deployment and Redis caching optimizations.",
    status: "approved",
    reviewedBy: "Project Manager (Approved)",
    reviewRemark: "Approved based on stellar attendance and sprint velocity.",
    appliedAt: "2026-09-02",
  },
];

export default function AdminApplicationsPage() {
  const { notify } = useNotifications();
  const [activeConsoleTab, setActiveConsoleTab] = useState<"applications" | "interviews" | "extended_leaves" | "tenure_extensions">("applications");

  const [applications, setApplications] = useState<CandidateApp[]>(INITIAL_APPLICATIONS);
  const [extendedLeaves, setExtendedLeaves] = useState<ExtendedLeaveRequest[]>(INITIAL_EXTENDED_LEAVES);
  const [tenureExtensions, setTenureExtensions] = useState<TenureExtensionApp[]>(INITIAL_TENURE_EXTENSIONS);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal States
  const [selectedAppForOffer, setSelectedAppForOffer] = useState<CandidateApp | null>(null);
  const [selectedAppForInterview, setSelectedAppForInterview] = useState<CandidateApp | null>(null);
  const [interviewDateInput, setInterviewDateInput] = useState("2026-09-15");
  const [interviewTimeInput, setInterviewTimeInput] = useState("4:00 PM IST");
  const [interviewMeetInput, setInterviewMeetInput] = useState("https://meet.google.com/careeros-pm-eval");

  const [selectedAppForFeedback, setSelectedAppForFeedback] = useState<CandidateApp | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  const [selectedLeaveForReview, setSelectedLeaveForReview] = useState<ExtendedLeaveRequest | null>(null);
  const [leaveReviewRemark, setLeaveReviewRemark] = useState("");

  const [selectedExtensionForReview, setSelectedExtensionForReview] = useState<TenureExtensionApp | null>(null);
  const [extensionReviewRemark, setExtensionReviewRemark] = useState("");

  // Sync data from database APIs on mount & manual refresh
  useEffect(() => {
    fetchDataFromAPIs();
  }, []);

  async function fetchDataFromAPIs() {
    setIsRefreshing(true);
    try {
      // 1. Fetch Candidate Applications
      const appRes = await fetch("/api/projects/applications");
      if (appRes.ok) {
        const data = await appRes.json();
        if (data.applications && Array.isArray(data.applications)) {
          const mapped: CandidateApp[] = data.applications.map((item: any) => ({
            id: item.id,
            candidateName: item.applicantName || item.candidateName || "Candidate",
            email: item.email || "applicant@careeros.dev",
            projectTitle: item.projectTitle || "Enterprise SaaS CRM",
            domain: item.domain || "Full Stack",
            resumeUrl: item.resumeUrl || "#",
            githubUrl: item.githubUrl || "https://github.com",
            pitch: item.pitch || item.experience || "Dedicated candidate seeking project role.",
            deliverables: item.deliverables || "Will deliver assigned sprint tasks.",
            status: item.status || "applied",
            appliedAt: item.appliedAt || new Date().toISOString().split("T")[0],
            interviewDate: item.interviewDate,
            interviewTime: item.interviewTime,
            meetUrl: item.meetUrl,
            aiScore: item.aiScore || 90,
          }));

          // Merge with initial fallback seed if missing
          const existingIds = new Set(mapped.map((a) => a.id));
          const combined = [...mapped];
          INITIAL_APPLICATIONS.forEach((init) => {
            if (!existingIds.has(init.id)) combined.push(init);
          });

          setApplications(combined);
        }
      }

      // 2. Fetch Extended Leaves from Attendance API
      const attRes = await fetch("/api/projects/attendance");
      if (attRes.ok) {
        const data = await attRes.json();
        if (data.records && Array.isArray(data.records)) {
          const pmLeaves: ExtendedLeaveRequest[] = data.records
            .filter((r: any) => r.requestReason?.includes("[EXTENDED LEAVE TO PM") || r.reviewedBy?.includes("Project Manager"))
            .map((r: any) => {
              // Parse days if present
              const daysMatch = r.requestReason?.match(/- (\d+) Days/);
              const days = daysMatch ? parseInt(daysMatch[1]) : 5;
              return {
                id: r.id,
                projectId: r.projectId || "proj-crm",
                userId: r.userId || "user",
                userName: r.userName || "Intern",
                userRole: r.userRole || "Intern",
                date: r.date,
                totalDays: days,
                status: r.status,
                approvalStatus: r.approvalStatus || "pending",
                requestReason: r.requestReason || "Extended leave requested.",
                reviewedBy: r.reviewedBy || "Project Manager (Pending)",
                remark: r.remark,
              };
            });

          const existingIds = new Set(pmLeaves.map((l) => l.id));
          const combinedLeaves = [...pmLeaves];
          INITIAL_EXTENDED_LEAVES.forEach((init) => {
            if (!existingIds.has(init.id)) combinedLeaves.push(init);
          });

          setExtendedLeaves(combinedLeaves);
        }
      }

      // 3. Fetch Tenure Extensions from Extensions API
      const extRes = await fetch("/api/projects/extensions");
      if (extRes.ok) {
        const data = await extRes.json();
        if (data.extensions && Array.isArray(data.extensions)) {
          const existingIds = new Set(data.extensions.map((e: any) => e.id));
          const combinedExts = [...data.extensions];
          INITIAL_TENURE_EXTENSIONS.forEach((init) => {
            if (!existingIds.has(init.id)) combinedExts.push(init);
          });
          setTenureExtensions(combinedExts);
        }
      }
    } catch (err) {
      console.warn("API refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  }

  // Application Handlers
  function handleSendOfferLetter(appId: string) {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: "selected" } : a))
    );
    setSelectedAppForOffer(null);

    // Update API
    fetch("/api/projects/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: appId, status: "selected" }),
    }).catch(() => {});

    notify({
      type: "success",
      icon: "📜",
      title: "PDF Offer Letter Dispatched!",
      body: "Official Internship Offer Letter generated and delivered to candidate dashboard.",
      autoDismiss: 4500,
    });
  }

  function handleScheduleInterviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAppForInterview) return;

    const appId = selectedAppForInterview.id;
    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              status: "interview_scheduled",
              interviewDate: interviewDateInput,
              interviewTime: interviewTimeInput,
              meetUrl: interviewMeetInput,
            }
          : a
      )
    );

    // Update API
    fetch("/api/projects/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: appId,
        status: "interview_scheduled",
        interviewDate: interviewDateInput,
        interviewTime: interviewTimeInput,
        meetUrl: interviewMeetInput,
      }),
    }).catch(() => {});

    setSelectedAppForInterview(null);
    notify({
      type: "success",
      icon: "🎙️",
      title: "Interview Scheduled!",
      body: `Live Video Interview scheduled for ${selectedAppForInterview.candidateName} on ${interviewDateInput} at ${interviewTimeInput}.`,
      autoDismiss: 4500,
    });
  }

  function handleSendRejectionFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAppForFeedback) return;

    const appId = selectedAppForFeedback.id;
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: "rejected" } : a))
    );

    fetch("/api/projects/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: appId, status: "rejected" }),
    }).catch(() => {});

    setSelectedAppForFeedback(null);
    setFeedbackText("");

    notify({
      type: "info",
      icon: "💡",
      title: "Constructive Feedback Sent",
      body: "Candidate notified with personalized skill feedback.",
      autoDismiss: 3500,
    });
  }

  // Extended Leave Decision Handler (PM Approval)
  async function handleLeaveDecision(action: "approved" | "rejected") {
    if (!selectedLeaveForReview) return;

    const targetId = selectedLeaveForReview.id;
    const reviewerName = `Project Manager (${action === "approved" ? "Approved" : "Rejected"})`;

    setExtendedLeaves((prev) =>
      prev.map((l) =>
        l.id === targetId
          ? {
              ...l,
              approvalStatus: action,
              reviewedBy: reviewerName,
              remark: leaveReviewRemark || (action === "approved" ? "Approved by PM." : "Rejected by PM."),
            }
          : l
      )
    );

    try {
      await fetch("/api/projects/attendance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: targetId,
          approvalStatus: action,
          reviewedBy: reviewerName,
          remark: leaveReviewRemark || (action === "approved" ? "Approved by PM." : "Rejected by PM."),
          status: action === "approved" ? "leave" : "present",
        }),
      });
    } catch (err) {}

    setSelectedLeaveForReview(null);
    setLeaveReviewRemark("");

    notify({
      type: action === "approved" ? "success" : "info",
      icon: action === "approved" ? "✅" : "❌",
      title: action === "approved" ? "Extended Leave Approved!" : "Extended Leave Rejected",
      body: `PM review decision saved. Intern notified on their workspace dashboard.`,
      autoDismiss: 4000,
    });
  }

  // Tenure Extension Decision Handler (PM Approval)
  async function handleExtensionDecision(action: "approved" | "rejected") {
    if (!selectedExtensionForReview) return;

    const targetId = selectedExtensionForReview.id;
    const reviewerName = `Project Manager (${action === "approved" ? "Approved" : "Rejected"})`;

    setTenureExtensions((prev) =>
      prev.map((e) =>
        e.id === targetId
          ? {
              ...e,
              status: action,
              reviewedBy: reviewerName,
              reviewRemark: extensionReviewRemark || (action === "approved" ? "Extension approved." : "Extension request declined."),
            }
          : e
      )
    );

    try {
      await fetch("/api/projects/extensions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: targetId,
          status: action,
          reviewedBy: reviewerName,
          reviewRemark: extensionReviewRemark || (action === "approved" ? "Extension approved." : "Extension request declined."),
        }),
      });
    } catch (err) {}

    setSelectedExtensionForReview(null);
    setExtensionReviewRemark("");

    notify({
      type: action === "approved" ? "success" : "info",
      icon: action === "approved" ? "⏳" : "❌",
      title: action === "approved" ? "Tenure Extension Granted!" : "Tenure Extension Rejected",
      body: action === "approved" 
        ? `Internship end date updated to ${selectedExtensionForReview.newEndDate}.`
        : `Extension request declined by Project Manager.`,
      autoDismiss: 4500,
    });
  }

  // Filters
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      app.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
      app.domain.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const scheduledInterviews = applications.filter((app) => app.status === "interview_scheduled" || app.interviewDate);

  const pendingLeaves = extendedLeaves.filter((l) => l.approvalStatus === "pending");
  const pendingExtensions = tenureExtensions.filter((e) => e.status === "pending");

  return (
    <div className="space-y-6 animate-fade-up">

      {/* Header Banner */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-orange-500/10 via-surface to-surface">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30">
              <FileCheck className="size-3.5 text-orange-500" /> PM & Admin Governance Console
            </div>
            <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
              Applications, Interviews & PM Requests
            </h1>
            <p className="text-xs text-secondary max-w-2xl">
              Review candidate applications, schedule video interviews, issue PDF offer letters, and manage intern **Extended Leaves (3–10 Days)** and **Tenure Extension Requests**.
            </p>
          </div>

          <button
            onClick={fetchDataFromAPIs}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-xl text-xs font-bold surface-2 border border-border text-primary hover:bg-orange-500/10 flex items-center gap-2 transition-all shrink-0"
          >
            <RefreshCw className={`size-3.5 text-orange-400 ${isRefreshing ? "animate-spin" : ""}`} />
            Sync DB Requests
          </button>
        </div>
      </div>

      {/* Main Console Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border">
        <button
          onClick={() => setActiveConsoleTab("applications")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all border flex items-center gap-2 whitespace-nowrap ${
            activeConsoleTab === "applications"
              ? "bg-orange-500 text-white border-orange-500 shadow-md"
              : "surface-2 text-secondary hover:text-primary border-border"
          }`}
        >
          <FileText className="size-4" /> Internship Applications ({applications.length})
        </button>

        <button
          onClick={() => setActiveConsoleTab("interviews")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all border flex items-center gap-2 whitespace-nowrap ${
            activeConsoleTab === "interviews"
              ? "bg-teal-500 text-white border-teal-500 shadow-md"
              : "surface-2 text-secondary hover:text-primary border-border"
          }`}
        >
          <Video className="size-4" /> Scheduled Interviews ({scheduledInterviews.length})
        </button>

        <button
          onClick={() => setActiveConsoleTab("extended_leaves")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all border flex items-center gap-2 whitespace-nowrap ${
            activeConsoleTab === "extended_leaves"
              ? "bg-amber-500 text-white border-amber-500 shadow-md"
              : "surface-2 text-secondary hover:text-primary border-border"
          }`}
        >
          <CalendarDays className="size-4" /> Extended Leave Requests (PM)
          {pendingLeaves.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-bold animate-pulse">
              {pendingLeaves.length} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveConsoleTab("tenure_extensions")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all border flex items-center gap-2 whitespace-nowrap ${
            activeConsoleTab === "tenure_extensions"
              ? "bg-purple-500 text-white border-purple-500 shadow-md"
              : "surface-2 text-secondary hover:text-primary border-border"
          }`}
        >
          <Clock3 className="size-4" /> Tenure Extension Apps
          {pendingExtensions.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-bold animate-pulse">
              {pendingExtensions.length} Pending
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: INTERNSHIP APPLICATIONS */}
      {activeConsoleTab === "applications" && (
        <div className="space-y-4">
          {/* Filters & Search Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="size-4 text-muted absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidate, project, or domain..."
                className="w-full h-10 pl-10 pr-4 rounded-2xl surface-2 border border-border text-xs text-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: "all", label: `All (${applications.length})` },
                { id: "applied", label: "Pending Review" },
                { id: "interview_scheduled", label: "Interviews" },
                { id: "selected", label: "Selected" },
                { id: "rejected", label: "Rejected" },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setFilterStatus(st.id)}
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

          {/* Cards List */}
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
                        {app.domain}
                      </span>
                      {app.aiScore && (
                        <span className="text-[11px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                          <Sparkles className="size-3" /> AI Match: {app.aiScore}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted">{app.email} · Applied for <strong className="text-primary">{app.projectTitle}</strong> on {app.appliedAt}</p>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase border ${
                    app.status === "selected"
                      ? "bg-teal-500/20 text-teal-400 border-teal-500/30"
                      : app.status === "interview_scheduled"
                      ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                      : app.status === "rejected"
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
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

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border text-xs">
                  <div className="flex items-center gap-3">
                    <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-orange-400 font-bold hover:underline flex items-center gap-1">
                      <FileText className="size-3.5" /> Resume PDF
                    </a>
                    <a href={app.githubUrl} target="_blank" rel="noreferrer" className="text-teal-400 font-bold hover:underline flex items-center gap-1">
                      <Code2 className="size-3.5" /> GitHub Code
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {app.status !== "interview_scheduled" && app.status !== "selected" && (
                      <button
                        onClick={() => setSelectedAppForInterview(app)}
                        className="px-3.5 py-2 rounded-xl font-bold surface-2 text-orange-400 hover:bg-orange-500/10 border border-orange-500/30 flex items-center gap-1.5"
                      >
                        <Video className="size-3.5" /> Schedule Interview
                      </button>
                    )}

                    {app.status !== "selected" && (
                      <button
                        onClick={() => setSelectedAppForOffer(app)}
                        className="px-4 py-2 rounded-xl font-bold bg-teal-500 text-white hover:brightness-110 flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="size-3.5" /> Issue Offer Letter
                      </button>
                    )}

                    {app.status !== "rejected" && (
                      <button
                        onClick={() => setSelectedAppForFeedback(app)}
                        className="px-3.5 py-2 rounded-xl font-bold surface-2 text-red-400 hover:bg-red-500/10 border border-red-500/20 flex items-center gap-1.5"
                      >
                        <XCircle className="size-3.5" /> Reject & Feedback
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SCHEDULED INTERVIEWS */}
      {activeConsoleTab === "interviews" && (
        <div className="space-y-4">
          <div className="surface rounded-3xl p-6 border border-teal-500/30 bg-teal-500/5 space-y-2">
            <h3 className="font-bold text-base text-primary flex items-center gap-2">
              <Video className="size-5 text-teal-400" /> Candidate Video & AI Interview Console
            </h3>
            <p className="text-xs text-secondary">
              Manage candidate technical interviews, conduct AI automated screenings, and launch Google Meet video sessions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {scheduledInterviews.map((app) => (
              <div key={app.id} className="surface rounded-3xl p-6 border border-border space-y-4 shadow-sm hover:border-teal-500/40 transition-all">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <h4 className="font-bold text-sm text-primary">{app.candidateName}</h4>
                    <p className="text-xs text-muted">{app.domain} · {app.projectTitle}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-teal-500/15 text-teal-400 border border-teal-500/30">
                    Interview Scheduled
                  </span>
                </div>

                <div className="space-y-2 text-xs surface-2 p-4 rounded-2xl border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-muted flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-teal-400" /> Date:
                    </span>
                    <strong className="text-primary">{app.interviewDate || "2026-09-10"}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted flex items-center gap-1.5">
                      <Clock className="size-3.5 text-teal-400" /> Time Slot:
                    </span>
                    <strong className="text-primary">{app.interviewTime || "4:00 PM IST"}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-amber-400" /> AI Resume Score:
                    </span>
                    <strong className="text-amber-400">{app.aiScore || 94}% Match</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 text-xs">
                  <a
                    href={app.meetUrl || "https://meet.google.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl font-bold bg-teal-500 text-white hover:brightness-110 flex items-center gap-1.5 shadow-sm"
                  >
                    <Video className="size-3.5" /> Join Google Meet <ExternalLink className="size-3" />
                  </a>

                  <button
                    onClick={() => setSelectedAppForOffer(app)}
                    className="px-3.5 py-2 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110 flex items-center gap-1"
                  >
                    <CheckCircle2 className="size-3.5" /> Pass & Issue Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EXTENDED LEAVE REQUESTS (3-10 DAYS -> PM) */}
      {activeConsoleTab === "extended_leaves" && (
        <div className="space-y-4">
          <div className="surface rounded-3xl p-6 border border-amber-500/30 bg-amber-500/5 space-y-2">
            <h3 className="font-bold text-base text-primary flex items-center gap-2">
              <CalendarDays className="size-5 text-amber-400" /> Extended Leave Approvals (3 to 10 Days)
            </h3>
            <p className="text-xs text-secondary">
              Intern leave applications exceeding 1 day route directly to Project Managers for official review and team seat allocation check.
            </p>
          </div>

          <div className="space-y-4">
            {extendedLeaves.map((leave) => (
              <div key={leave.id} className="surface rounded-3xl p-6 border border-border space-y-4 shadow-sm hover:border-amber-500/30 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-primary">{leave.userName}</h4>
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                        {leave.totalDays} Days Extended Leave
                      </span>
                    </div>
                    <p className="text-xs text-muted">Requested starting <strong className="text-primary">{leave.date}</strong></p>
                  </div>

                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase border ${
                    leave.approvalStatus === "approved"
                      ? "bg-teal-500/20 text-teal-400 border-teal-500/30"
                      : leave.approvalStatus === "rejected"
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse"
                  }`}>
                    PM Status: {leave.approvalStatus}
                  </span>
                </div>

                <div className="surface-2 p-4 rounded-2xl border border-border text-xs space-y-1">
                  <span className="font-bold text-amber-400 text-[11px] uppercase tracking-wider block">Intern Leave Justification & Details</span>
                  <p className="text-secondary leading-relaxed">{leave.requestReason}</p>
                  {leave.remark && (
                    <p className="text-teal-400 pt-1 font-semibold">PM Remark: {leave.remark}</p>
                  )}
                </div>

                {leave.approvalStatus === "pending" && (
                  <div className="flex items-center justify-end gap-2 pt-2 text-xs">
                    <button
                      onClick={() => {
                        setSelectedLeaveForReview(leave);
                        setLeaveReviewRemark("");
                      }}
                      className="px-5 py-2.5 rounded-xl font-bold bg-amber-500 text-white hover:brightness-110 shadow-md flex items-center gap-1.5"
                    >
                      <UserCheck className="size-4" /> Review & Action Leave
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TENURE EXTENSION APPLICATIONS */}
      {activeConsoleTab === "tenure_extensions" && (
        <div className="space-y-4">
          <div className="surface rounded-3xl p-6 border border-purple-500/30 bg-purple-500/5 space-y-2">
            <h3 className="font-bold text-base text-primary flex items-center gap-2">
              <Clock3 className="size-5 text-purple-400" /> Internship Tenure Extension Applications
            </h3>
            <p className="text-xs text-secondary">
              Interns applying to extend their internship duration (+1, +2, or +3 Months) for advanced feature delivery and leadership roles.
            </p>
          </div>

          <div className="space-y-4">
            {tenureExtensions.map((ext) => (
              <div key={ext.id} className="surface rounded-3xl p-6 border border-border space-y-4 shadow-sm hover:border-purple-500/30 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-base text-primary">{ext.internName}</h4>
                      <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                        +{ext.extensionMonths} Month(s) Extension
                      </span>
                    </div>
                    <p className="text-xs text-muted">
                      {ext.email} · Current End Date: <strong className="text-orange-400">{ext.currentEndDate}</strong> ➔ New Proposed End Date: <strong className="text-teal-400">{ext.newEndDate}</strong>
                    </p>
                  </div>

                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase border ${
                    ext.status === "approved"
                      ? "bg-teal-500/20 text-teal-400 border-teal-500/30"
                      : ext.status === "rejected"
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse"
                  }`}>
                    PM Decision: {ext.status}
                  </span>
                </div>

                <div className="surface-2 p-4 rounded-2xl border border-border text-xs space-y-1">
                  <span className="font-bold text-purple-400 text-[11px] uppercase tracking-wider block">Performance & Goal Justification</span>
                  <p className="text-secondary leading-relaxed">{ext.reason}</p>
                  {ext.reviewRemark && (
                    <p className="text-teal-400 pt-1 font-semibold">PM Remark: {ext.reviewRemark}</p>
                  )}
                </div>

                {ext.status === "pending" && (
                  <div className="flex items-center justify-end gap-2 pt-2 text-xs">
                    <button
                      onClick={() => {
                        setSelectedExtensionForReview(ext);
                        setExtensionReviewRemark("");
                      }}
                      className="px-5 py-2.5 rounded-xl font-bold bg-purple-500 text-white hover:brightness-110 shadow-md flex items-center gap-1.5"
                    >
                      <Award className="size-4" /> Review Extension Application
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: SCHEDULE INTERVIEW */}
      {selectedAppForInterview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-up">
          <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <Video className="size-5 text-orange-400" /> Schedule Technical Video Interview
              </h3>
              <button onClick={() => setSelectedAppForInterview(null)} className="text-xs text-muted font-bold px-2 py-1 surface-2 rounded-lg">
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleScheduleInterviewSubmit} className="space-y-4 text-xs">
              <div className="surface-2 p-3.5 rounded-2xl border border-border">
                <p className="font-bold text-primary">{selectedAppForInterview.candidateName}</p>
                <p className="text-muted">{selectedAppForInterview.email} · {selectedAppForInterview.domain}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-primary">Interview Date</label>
                  <input
                    type="date"
                    value={interviewDateInput}
                    onChange={(e) => setInterviewDateInput(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-primary">Time Slot</label>
                  <input
                    type="text"
                    value={interviewTimeInput}
                    onChange={(e) => setInterviewTimeInput(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary">Google Meet / Video Link</label>
                <input
                  type="url"
                  value={interviewMeetInput}
                  onChange={(e) => setInterviewMeetInput(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setSelectedAppForInterview(null)} className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110 shadow-md">
                  Confirm & Send Interview Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: OFFER LETTER */}
      {selectedAppForOffer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-up">
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

      {/* MODAL 3: REJECTION FEEDBACK */}
      {selectedAppForFeedback && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-up">
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
                <label className="font-bold text-primary">Constructive Feedback Text</label>
                <textarea
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  required
                  placeholder="Feedback sent to candidate dashboard..."
                  className="w-full p-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setSelectedAppForFeedback(null)} className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl font-bold bg-red-500 text-white hover:brightness-110 shadow-md">
                  Send Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: REVIEW EXTENDED LEAVE REQUEST */}
      {selectedLeaveForReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-up">
          <div className="surface border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <CalendarDays className="size-5 text-amber-400" /> PM Review: Extended Leave Request
              </h3>
              <button onClick={() => setSelectedLeaveForReview(null)} className="text-xs text-muted font-bold px-2 py-1 surface-2 rounded-lg">
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="surface-2 p-4 rounded-2xl border border-border space-y-1.5">
                <p className="font-bold text-primary text-sm">{selectedLeaveForReview.userName}</p>
                <p className="text-amber-400 font-semibold">{selectedLeaveForReview.totalDays} Days Leave starting {selectedLeaveForReview.date}</p>
                <p className="text-secondary leading-relaxed pt-1">{selectedLeaveForReview.requestReason}</p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary">PM Remarks / Decision Note</label>
                <input
                  type="text"
                  value={leaveReviewRemark}
                  onChange={(e) => setLeaveReviewRemark(e.target.value)}
                  placeholder="e.g. Approved. Ensure sprint backlog tasks are handed over."
                  className="w-full p-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => handleLeaveDecision("rejected")}
                className="px-4 py-2.5 rounded-xl font-bold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
              >
                Reject Leave Request
              </button>
              <button
                onClick={() => handleLeaveDecision("approved")}
                className="px-5 py-2.5 rounded-xl font-bold bg-amber-500 text-white hover:brightness-110 shadow-md"
              >
                Approve {selectedLeaveForReview.totalDays}-Day Extended Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: REVIEW TENURE EXTENSION APPLICATION */}
      {selectedExtensionForReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-up">
          <div className="surface border border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <Clock3 className="size-5 text-purple-400" /> PM Review: Internship Tenure Extension
              </h3>
              <button onClick={() => setSelectedExtensionForReview(null)} className="text-xs text-muted font-bold px-2 py-1 surface-2 rounded-lg">
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="surface-2 p-4 rounded-2xl border border-border space-y-2">
                <p className="font-bold text-primary text-sm">{selectedExtensionForReview.internName}</p>
                <p className="text-purple-400 font-semibold">
                  Extension Requested: +{selectedExtensionForReview.extensionMonths} Month(s)
                </p>
                <p className="text-muted">
                  Current End Date: <strong className="text-primary">{selectedExtensionForReview.currentEndDate}</strong> ➔ New End Date: <strong className="text-teal-400">{selectedExtensionForReview.newEndDate}</strong>
                </p>
                <p className="text-secondary leading-relaxed pt-1">{selectedExtensionForReview.reason}</p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary">PM Remarks / Decision Note</label>
                <input
                  type="text"
                  value={extensionReviewRemark}
                  onChange={(e) => setExtensionReviewRemark(e.target.value)}
                  placeholder="e.g. Granted! Extended due to outstanding performance."
                  className="w-full p-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => handleExtensionDecision("rejected")}
                className="px-4 py-2.5 rounded-xl font-bold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
              >
                Decline Extension
              </button>
              <button
                onClick={() => handleExtensionDecision("approved")}
                className="px-5 py-2.5 rounded-xl font-bold bg-purple-500 text-white hover:brightness-110 shadow-md"
              >
                Approve & Extend Tenure to {selectedExtensionForReview.newEndDate}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
