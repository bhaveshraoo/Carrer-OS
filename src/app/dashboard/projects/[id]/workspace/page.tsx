"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Zap,
  CheckCircle2,
  Clock,
  Plus,
  Users,
  Layers,
  Calendar,
  DollarSign,
  Award,
  Code2,
  Globe,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Check,
  UserCheck,
  UserX,
  Video,
  FileText,
  Send,
  Star,
} from "lucide-react";
import { MOCK_PROJECTS, MOCK_TASKS, MOCK_ATTENDANCE, MOCK_REVENUE_SHARES } from "@/lib/projects/data";
import { Task, AttendanceRecord, ProjectApplication } from "@/lib/projects/types";
import { useNotifications } from "@/components/notifications/notification-provider";

const MOCK_APPLICANTS: ProjectApplication[] = [
  {
    id: "app-1",
    projectId: "proj-1",
    userId: "u-101",
    applicantName: "Rohan Varma",
    email: "rohan.varma@iitd.ac.in",
    resumeUrl: "https://careeros.app/resumes/rohan_resume.pdf",
    githubUrl: "https://github.com/rohan_dev",
    linkedInUrl: "https://linkedin.com/in/rohan_varma",
    whyJoin: "Experienced with Next.js 16 and WebSockets. Built 2 full-stack SaaS side projects.",
    experience: "2 Years React & Node.js",
    availability: "15 hrs/week",
    domain: "Frontend",
    status: "applied",
    appliedAt: "2026-07-26",
  },
  {
    id: "app-2",
    projectId: "proj-1",
    userId: "u-102",
    applicantName: "Ananya Roy",
    email: "ananya.roy@iiit.ac.in",
    resumeUrl: "https://careeros.app/resumes/ananya_resume.pdf",
    githubUrl: "https://github.com/ananya_ai",
    linkedInUrl: "https://linkedin.com/in/ananya_roy",
    whyJoin: "Interested in vector databases and real-time audio LLM processing.",
    experience: "1 Year Python & PyTorch",
    availability: "18 hrs/week",
    domain: "AI/ML",
    status: "interview_scheduled",
    appliedAt: "2026-07-25",
  },
];

export default function TeamWorkspacePage() {
  const params = useParams();
  const projectId = (params?.id as string) || "proj-1";
  const { notify } = useNotifications();

  const project = MOCK_PROJECTS.find((p) => p.id === projectId) || MOCK_PROJECTS[0];
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [applicants, setApplicants] = useState<ProjectApplication[]>(MOCK_APPLICANTS);
  const [activeTab, setActiveTab] = useState<"kanban" | "applicants" | "attendance" | "evaluation" | "revenue">("kanban");

  // Today's attendance state
  const [todayStatus, setTodayStatus] = useState<"present" | "leave" | "half_day" | "absent" | null>("present");

  // Interview modal state
  const [selectedApplicant, setSelectedApplicant] = useState<ProjectApplication | null>(null);
  const [interviewDate, setInterviewDate] = useState("2026-07-29");
  const [interviewTime, setInterviewTime] = useState("16:00");
  const [meetLink, setMeetLink] = useState("https://meet.google.com/xyz-abc-123");

  function moveTask(taskId: string, newStatus: Task["status"]) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    notify({
      type: "info",
      icon: "📋",
      title: "Task Updated",
      body: `Moved task to ${newStatus.toUpperCase()}`,
      autoDismiss: 2000,
    });
  }

  function handleApplicantStatus(appId: string, newStatus: ProjectApplication["status"]) {
    setApplicants((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
    notify({
      type: "success",
      icon: "👥",
      title: `Applicant ${newStatus === "selected" ? "Accepted" : "Updated"}`,
      body: `Applicant status updated to ${newStatus.replace("_", " ").toUpperCase()}`,
      autoDismiss: 3000,
    });
  }

  function handleScheduleInterviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedApplicant) {
      handleApplicantStatus(selectedApplicant.id, "interview_scheduled");
      setSelectedApplicant(null);
      notify({
        type: "success",
        icon: "📅",
        title: "Interview Scheduled!",
        body: `Scheduled interview on ${interviewDate} at ${interviewTime} with Google Meet link.`,
        autoDismiss: 3500,
      });
    }
  }

  function handleMarkAttendance(status: "present" | "leave" | "half_day" | "absent") {
    setTodayStatus(status);
    notify({
      type: "success",
      icon: "🗓️",
      title: "Attendance Marked",
      body: `Marked as ${status.toUpperCase()} for today. Verified by Team Leader.`,
      autoDismiss: 2500,
    });
  }

  const revenueInfo = MOCK_REVENUE_SHARES[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">

      {/* Back Link */}
      <Link
        href={`/dashboard/projects/${project.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary transition-colors"
      >
        <ArrowLeft className="size-4" /> Back to Project Overview
      </Link>

      {/* ── 1. WORKSPACE HEADER BANNER ── */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-surface to-surface">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-orange-400 bg-orange-500/15 px-3 py-1 rounded-full border border-orange-500/30 flex items-center gap-1">
                <Zap className="size-3.5" /> Team Workspace
              </span>
              <span className="text-xs font-bold text-teal-400 bg-teal-500/15 px-3 py-1 rounded-full border border-teal-500/30 flex items-center gap-1">
                <ShieldCheck className="size-3.5" /> Sprint 2 Active
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              {project.title}
            </h1>

            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              Real-time collaboration workspace — Kanban task board, TL Applicant Review & Interview Scheduling, daily attendance, weekly evaluations, and revenue share ledger.
            </p>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold surface-2 px-3 py-1.5 rounded-xl border border-border flex items-center gap-1.5 text-primary hover:border-orange-500/40"
              >
                <Code2 className="size-3.5" /> GitHub Repository <ExternalLink className="size-3 text-muted" />
              </a>

              <a
                href="https://figma.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold surface-2 px-3 py-1.5 rounded-xl border border-border flex items-center gap-1.5 text-primary hover:border-orange-500/40"
              >
                <Globe className="size-3.5 text-orange-400" /> Figma Design Specs <ExternalLink className="size-3 text-muted" />
              </a>
            </div>
          </div>

          {/* Right Progress Meter */}
          <div className="surface-2 p-5 rounded-3xl border border-border space-y-3 shrink-0 w-full md:w-64 text-center">
            <p className="text-xs font-bold text-muted uppercase tracking-wider">Project Progress</p>
            <p className="font-display text-3xl font-extrabold text-teal-400">68%</p>

            <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-border">
              <div className="h-full bg-gradient-to-r from-orange-500 to-teal-400 w-[68%] rounded-full" />
            </div>

            <p className="text-[11px] text-secondary font-medium">8 of 12 Milestones Completed</p>
          </div>
        </div>
      </div>

      {/* ── 2. WORKSPACE TAB NAVIGATION ── */}
      <div className="flex gap-2 border-b border-border overflow-x-auto pb-1">
        {[
          { id: "kanban", label: "Kanban Task Board", icon: Layers },
          { id: "applicants", label: "TL Applicants & Interviews", icon: Users },
          { id: "attendance", label: "Daily Attendance Log", icon: Calendar },
          { id: "evaluation", label: "Weekly Performance (/100)", icon: TrendingUp },
          { id: "revenue", label: "Revenue Share Ledger (5%)", icon: DollarSign },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                  : "text-secondary hover:text-primary surface-2 border border-transparent"
              }`}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: KANBAN TASK BOARD ── */}
      {activeTab === "kanban" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
          {(["todo", "in_progress", "review", "done"] as const).map((col) => {
            const colTasks = tasks.filter((t) => t.status === col);
            const colLabels: Record<string, string> = {
              todo: "To Do",
              in_progress: "In Progress",
              review: "In Review",
              done: "Completed",
            };

            return (
              <div key={col} className="surface border border-border rounded-3xl p-4 space-y-4 min-h-[400px]">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    {colLabels[col]}
                  </span>
                  <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colTasks.map((t) => (
                    <div key={t.id} className="surface-2 p-4 rounded-2xl border border-border space-y-3 shadow-sm hover:border-orange-500/40 transition-all">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`font-bold px-2 py-0.5 rounded-md ${
                          t.priority === "high" ? "bg-red-500/20 text-red-300" : "bg-orange-500/20 text-orange-300"
                        }`}>
                          {t.priority.toUpperCase()}
                        </span>
                        <span className="font-mono text-muted">{t.points} pts</span>
                      </div>

                      <p className="font-bold text-xs text-primary leading-snug">{t.title}</p>
                      <p className="text-[11px] text-muted line-clamp-2">{t.description}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-border text-[11px]">
                        <div className="flex items-center gap-1.5 text-secondary">
                          <img src={t.assignee.avatar} alt={t.assignee.name} className="size-5 rounded-full object-cover" />
                          <span className="truncate max-w-[100px]">{t.assignee.name}</span>
                        </div>

                        {/* Move controls */}
                        <div className="flex gap-1">
                          {col !== "todo" && (
                            <button
                              onClick={() => moveTask(t.id, col === "done" ? "review" : col === "review" ? "in_progress" : "todo")}
                              className="px-1.5 py-0.5 rounded surface text-muted hover:text-primary"
                            >
                              ←
                            </button>
                          )}
                          {col !== "done" && (
                            <button
                              onClick={() => moveTask(t.id, col === "todo" ? "in_progress" : col === "in_progress" ? "review" : "done")}
                              className="px-1.5 py-0.5 rounded surface text-orange-400 hover:text-white font-bold"
                            >
                              →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TAB 2: TEAM LEADER APPLICANT REVIEW & INTERVIEW MODULE ── */}
      {activeTab === "applicants" && (
        <div className="surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <Users className="size-5 text-orange-500" /> Team Leader Applicant Review Dashboard
              </h3>
              <p className="text-xs text-secondary">Review applicants, inspect GitHub & resumes, schedule interviews, and accept members into team domains.</p>
            </div>

            <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              {applicants.length} Total Applicants
            </span>
          </div>

          <div className="space-y-4">
            {applicants.map((app) => (
              <div key={app.id} className="surface-2 p-5 rounded-2xl border border-border space-y-4 shadow-sm hover:border-orange-500/40 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-primary">{app.applicantName}</h4>
                      <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                        Domain: {app.domain}
                      </span>
                    </div>
                    <p className="text-xs text-muted">{app.email} · Applied on {app.appliedAt}</p>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase border ${
                    app.status === "selected"
                      ? "bg-teal-500/20 text-teal-300 border-teal-500/30"
                      : app.status === "interview_scheduled"
                      ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
                      : "bg-surface text-secondary border-border"
                  }`}>
                    {app.status.replace("_", " ")}
                  </span>
                </div>

                <p className="text-xs text-secondary leading-relaxed surface p-3 rounded-xl border border-border">
                  <strong className="text-primary font-semibold">Motivation: </strong>{app.whyJoin}
                </p>

                {/* Profiles & Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
                  <div className="flex items-center gap-3 text-xs">
                    <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-orange-400 hover:underline flex items-center gap-1 font-semibold">
                      <FileText className="size-3.5" /> Resume PDF
                    </a>
                    {app.githubUrl && (
                      <a href={app.githubUrl} target="_blank" rel="noreferrer" className="text-teal-400 hover:underline flex items-center gap-1 font-semibold">
                        <Code2 className="size-3.5" /> GitHub
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setSelectedApplicant(app)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold surface hover:bg-surface-2 border border-border text-primary flex items-center gap-1.5"
                    >
                      <Video className="size-3.5 text-orange-400" /> Schedule Interview
                    </button>

                    <button
                      onClick={() => handleApplicantStatus(app.id, "selected")}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-500 text-white hover:brightness-110 flex items-center gap-1.5 shadow-sm"
                    >
                      <UserCheck className="size-3.5" /> Accept Team Member
                    </button>

                    <button
                      onClick={() => handleApplicantStatus(app.id, "rejected")}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold surface text-red-400 hover:bg-red-500/10 border border-red-500/20 flex items-center gap-1.5"
                    >
                      <UserX className="size-3.5" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: DAILY ATTENDANCE SYSTEM ── */}
      {activeTab === "attendance" && (
        <div className="surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-up">
          <div className="space-y-1 pb-4 border-b border-border">
            <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
              <Calendar className="size-5 text-orange-500" /> Daily Intern Attendance Log
            </h3>
            <p className="text-xs text-secondary">
              Mark daily attendance to maintain your 100% Internship Completion Certificate eligibility.
            </p>
          </div>

          {/* Mark Attendance Box */}
          <div className="surface-2 p-5 rounded-2xl border border-orange-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-sm text-primary">Mark Today's Attendance ({new Date().toISOString().split("T")[0]})</p>
              <p className="text-xs text-muted">Verified by Team Leader Aarav Gupta</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["present", "leave", "half_day", "absent"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => handleMarkAttendance(st)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    todayStatus === st
                      ? "bg-teal-500 text-white border-teal-500 shadow-sm"
                      : "surface text-secondary hover:text-primary border-border"
                  }`}
                >
                  {st.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Attendance Log Table */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-muted uppercase tracking-wider">Attendance Log (Last 5 Days)</p>
            <div className="space-y-2">
              {attendance.map((rec) => (
                <div key={rec.id} className="surface-2 p-3.5 rounded-2xl border border-border flex items-center justify-between text-xs">
                  <span className="font-mono text-muted">{rec.date}</span>
                  <span className={`font-bold px-3 py-1 rounded-full border ${
                    rec.status === "present"
                      ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {rec.status.toUpperCase()}
                  </span>
                  <span className="text-teal-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="size-3.5" /> Verified by TL
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: WEEKLY EVALUATION & PERFORMANCE ENGINE ── */}
      {activeTab === "evaluation" && (
        <div className="surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <TrendingUp className="size-5 text-orange-500" /> Performance Scoring Engine
              </h3>
              <p className="text-xs text-secondary">Auto-calculated score based on PR count, attendance, code reviews, and TL ratings.</p>
            </div>

            <div className="surface-2 px-5 py-3 rounded-2xl border border-border text-center">
              <p className="text-[10px] font-bold text-muted uppercase">Overall Intern Score</p>
              <p className="font-display text-3xl font-extrabold text-orange-400">94 <span className="text-xs text-muted">/ 100</span></p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Technical Competency", score: "9.5 / 10", color: "text-orange-400" },
              { label: "Code Quality & PRs", score: "9.2 / 10", color: "text-teal-400" },
              { label: "Attendance & Consistency", score: "9.8 / 10", color: "text-amber-400" },
              { label: "Team Communication", score: "9.0 / 10", color: "text-purple-400" },
            ].map((m, i) => (
              <div key={i} className="surface-2 p-4 rounded-2xl border border-border space-y-1 text-center">
                <p className="text-xs font-bold text-muted">{m.label}</p>
                <p className={`font-display text-xl font-bold ${m.color}`}>{m.score}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: REVENUE SHARING LEDGER (5% TL / 5% TEAM / 90% CAREEROS) ── */}
      {activeTab === "revenue" && (
        <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl bg-orange-500/5 animate-fade-up">
          <div className="space-y-1 pb-4 border-b border-border">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/20">
              <DollarSign className="size-3.5" /> Transparent Revenue Sharing Ledger
            </div>
            <h3 className="font-display text-xl font-bold text-primary pt-1">
              Project Commercial Sale & Earnings Distribution
            </h3>
            <p className="text-xs text-secondary">
              When CareerOS sells completed software products: <strong className="text-primary">5% goes to Team Leader</strong>, <strong className="text-primary">5% is split equally among team members</strong>, and 90% goes to CareerOS.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div className="surface-2 p-5 rounded-2xl border border-border space-y-1 text-center">
              <p className="text-xs font-bold text-muted uppercase">Estimated Product Sale</p>
              <p className="font-display text-2xl font-extrabold text-primary">₹{revenueInfo.saleAmount.toLocaleString()}</p>
              <p className="text-[11px] text-teal-400 font-semibold">Status: {revenueInfo.status.toUpperCase()}</p>
            </div>

            <div className="surface-2 p-5 rounded-2xl border border-border space-y-1 text-center">
              <p className="text-xs font-bold text-muted uppercase">Team Leader Payout (5%)</p>
              <p className="font-display text-2xl font-extrabold text-orange-400">₹{revenueInfo.tlShare.toLocaleString()}</p>
              <p className="text-[11px] text-muted">Aarav Gupta (TL)</p>
            </div>

            <div className="surface-2 p-5 rounded-2xl border border-border space-y-1 text-center">
              <p className="text-xs font-bold text-muted uppercase">Your Intern Share (5% Split)</p>
              <p className="font-display text-2xl font-extrabold text-teal-400">₹{revenueInfo.teamSharePerMember.toLocaleString()}</p>
              <p className="text-[11px] text-muted">Equal distribution to approved team</p>
            </div>
          </div>
        </div>
      )}

      {/* ── SCHEDULE INTERVIEW MODAL ── */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
          <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <Video className="size-5 text-orange-500" /> Schedule 1-on-1 Interview
              </h3>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="text-xs text-muted font-bold px-2 py-1 surface-2 rounded-lg"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleScheduleInterviewSubmit} className="space-y-4 text-xs">
              <p className="text-secondary">
                Candidate: <strong className="text-primary">{selectedApplicant.applicantName}</strong> ({selectedApplicant.domain} Domain)
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-primary">Interview Date</label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    required
                    className="w-full h-9 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Time (IST)</label>
                  <input
                    type="time"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    required
                    className="w-full h-9 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary">Meeting Link (Google Meet / Zoom)</label>
                <input
                  type="url"
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                  required
                  className="w-full h-9 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedApplicant(null)}
                  className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110 shadow-md shadow-orange-500/20"
                >
                  Schedule & Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
