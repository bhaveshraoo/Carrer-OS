"use client";

import { useState } from "react";
import {
  Rocket,
  Plus,
  Trash2,
  X,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  CalendarDays,
  ChevronRight,
  Activity,
  Star,
  AlertCircle,
  MessageSquare,
  GitBranch,
  Zap,
  Award,
  BarChart3,
  DollarSign,
} from "lucide-react";
import { MOCK_PROJECTS } from "@/lib/projects/data";
import { Project } from "@/lib/projects/types";
import { useNotifications } from "@/components/notifications/notification-provider";

// ── Extended mock data for the detail drawer ──
const PROJECT_DETAILS: Record<string, {
  completion: number;
  sprintNo: number;
  totalSprints: number;
  attendance: number;
  teamMembers: { name: string; role: string; college: string; score: number; avatar: string }[];
  recentUpdates: { time: string; user: string; action: string; type: "commit" | "review" | "alert" | "badge" }[];
  milestones: { label: string; done: boolean }[];
  tlInfo: { name: string; email: string; phone: string; since: string; rating: number };
}> = {
  "proj-1": {
    completion: 68,
    sprintNo: 5,
    totalSprints: 8,
    attendance: 94,
    teamMembers: [
      { name: "Riya Mehta", role: "Frontend Lead", college: "IIT Delhi", score: 96, avatar: "https://i.pravatar.cc/40?img=47" },
      { name: "Arjun Nair", role: "Backend Dev", college: "BITS Pilani", score: 91, avatar: "https://i.pravatar.cc/40?img=11" },
      { name: "Priya Singh", role: "AI/ML Engineer", college: "IIIT Hyderabad", score: 88, avatar: "https://i.pravatar.cc/40?img=45" },
      { name: "Karan Shah", role: "DevOps", college: "VIT Vellore", score: 85, avatar: "https://i.pravatar.cc/40?img=15" },
    ],
    recentUpdates: [
      { time: "2h ago", user: "Riya Mehta", action: "Pushed sprint-5 UI polish branch", type: "commit" },
      { time: "4h ago", user: "Aarav Gupta (TL)", action: "Reviewed & merged PR #47 — Resume Scorer v2", type: "review" },
      { time: "1d ago", user: "Arjun Nair", action: "Fixed voice pipeline latency bug (480ms → 120ms)", type: "commit" },
      { time: "2d ago", user: "System", action: "⚠️ Karan Shah attendance dipped to 76% this week", type: "alert" },
      { time: "3d ago", user: "Priya Singh", action: "Earned 🏆 Top Performer badge — Sprint 4", type: "badge" },
    ],
    milestones: [
      { label: "MVP Voice Interface", done: true },
      { label: "Resume Scorer Integration", done: true },
      { label: "Company Targeting Engine", done: true },
      { label: "Live Interview Coach", done: false },
      { label: "Beta Launch & QA", done: false },
    ],
    tlInfo: { name: "Aarav Gupta", email: "aarav.gupta@careeros.in", phone: "+91 98765 43210", since: "Jan 2026", rating: 4.9 },
  },
  "proj-2": {
    completion: 42,
    sprintNo: 3,
    totalSprints: 8,
    attendance: 89,
    teamMembers: [
      { name: "Dev Patel", role: "Quant Dev", college: "IIT Bombay", score: 93, avatar: "https://i.pravatar.cc/40?img=12" },
      { name: "Ananya Roy", role: "Backend Engineer", college: "NIT Trichy", score: 87, avatar: "https://i.pravatar.cc/40?img=47" },
      { name: "Siddharth K", role: "UI/UX Lead", college: "SRM University", score: 82, avatar: "https://i.pravatar.cc/40?img=33" },
    ],
    recentUpdates: [
      { time: "3h ago", user: "Dev Patel", action: "Completed order book simulation module", type: "commit" },
      { time: "6h ago", user: "Sneha Patel (TL)", action: "Sprint 3 planning session done — 12 tasks assigned", type: "review" },
      { time: "1d ago", user: "Ananya Roy", action: "Latency optimization: API now handles 10k req/s", type: "commit" },
      { time: "2d ago", user: "System", action: "⚠️ Milestone 2 deadline extended by 3 days", type: "alert" },
    ],
    milestones: [
      { label: "Market Data Feed Setup", done: true },
      { label: "Order Book Engine", done: true },
      { label: "Execution Algorithm", done: false },
      { label: "Risk Management Layer", done: false },
      { label: "Performance Backtesting", done: false },
    ],
    tlInfo: { name: "Sneha Patel", email: "sneha.patel@careeros.in", phone: "+91 87654 32109", since: "Feb 2026", rating: 4.7 },
  },
  "proj-3": {
    completion: 55,
    sprintNo: 4,
    totalSprints: 6,
    attendance: 97,
    teamMembers: [
      { name: "Nikhil Joshi", role: "OSS Contributor", college: "IIT Madras", score: 98, avatar: "https://i.pravatar.cc/40?img=13" },
      { name: "Pooja Iyer", role: "Compiler Dev", college: "IIIT Bangalore", score: 94, avatar: "https://i.pravatar.cc/40?img=44" },
    ],
    recentUpdates: [
      { time: "1h ago", user: "Nikhil Joshi", action: "Released v0.4.0 — AST refactoring passes added", type: "commit" },
      { time: "5h ago", user: "Aarav Gupta (TL)", action: "Code review complete — merged 6 PRs", type: "review" },
      { time: "1d ago", user: "Pooja Iyer", action: "Earned 🥇 Full Stack Hero badge", type: "badge" },
    ],
    milestones: [
      { label: "Static Analysis Engine", done: true },
      { label: "AST Transformation Layer", done: true },
      { label: "Multi-language Support", done: true },
      { label: "VS Code Extension", done: false },
      { label: "Public OSS Launch", done: false },
    ],
    tlInfo: { name: "Aarav Gupta", email: "aarav.gupta@careeros.in", phone: "+91 98765 43210", since: "Mar 2026", rating: 5.0 },
  },
};

// Fallback detail for dynamically created projects
const DEFAULT_DETAIL = {
  completion: 10, sprintNo: 1, totalSprints: 8, attendance: 100,
  teamMembers: [],
  recentUpdates: [{ time: "just now", user: "System", action: "Project published — awaiting team enrollment", type: "review" as const }],
  milestones: [{ label: "Project Kickoff", done: true }],
  tlInfo: { name: "Aarav Gupta", email: "aarav.gupta@careeros.in", phone: "+91 98765 43210", since: "Jul 2026", rating: 4.9 },
};

export default function AdminProjectsPage() {
  const { notify } = useNotifications();
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // New Project Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("AI");
  const [description, setDescription] = useState("");
  const [productIdea, setProductIdea] = useState("");
  const [durationMonths, setDurationMonths] = useState(3);
  const [stipend, setStipend] = useState("₹15,000 / month");
  const [estimatedProductValue, setEstimatedProductValue] = useState("₹2,500,000");
  const [teamSize, setTeamSize] = useState(6);
  const [techStackInput, setTechStackInput] = useState("Next.js, TypeScript, TailwindCSS, OpenAI");
  const [domainsInput, setDomainsInput] = useState("Frontend, Backend, AI/ML, UI UX");
  const [teamLeaderName, setTeamLeaderName] = useState("Aarav Gupta");
  const [mentorName, setMentorName] = useState("Dr. Vikram Sharma");

  const detail = selectedProject
    ? (PROJECT_DETAILS[selectedProject.id] ?? DEFAULT_DETAIL)
    : null;

  function handleCreateProjectSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title, description, productIdea,
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      category: category as Project["category"],
      durationMonths: Number(durationMonths),
      weeklyHours: 15,
      stipend, estimatedProductValue,
      teamSize: Number(teamSize),
      filledSeats: 1,
      remainingSeats: Number(teamSize) - 1,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-10-27",
      applicationDeadline: "2026-08-10",
      status: "open",
      difficulty: "Intermediate",
      requiredSkills: ["Next.js", "TypeScript", "TailwindCSS"],
      techStack: techStackInput.split(",").map((s) => s.trim()),
      domainsRequired: domainsInput.split(",").map((s) => s.trim()) as Project["domainsRequired"],
      rewards: [
        "Verified 3-Month Internship Certificate & LOR",
        "5% Equal Revenue Share on Product Commercial Sales",
        "Direct Interview Priority for CareerOS Core Engineering",
      ],
      mentor: { name: mentorName, role: "Senior AI Architect", company: "CareerOS Labs", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80" },
      teamLeader: { name: teamLeaderName, role: "Full Stack Lead", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80" },
      matchPercentage: 94,
    };
    setProjects([newProj, ...projects]);
    setShowCreateModal(false);
    notify({ type: "success", icon: "🚀", title: "New Project Published!", body: `"${title}" published with ${teamSize - 1} open seats!`, autoDismiss: 4000 });
  }

  function handleDeleteProject(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (selectedProject?.id === id) setSelectedProject(null);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    notify({ type: "info", icon: "🗑️", title: "Project Unlisted", body: "Removed project from marketplace.", autoDismiss: 2500 });
  }

  const updateIcon = (type: string) => {
    if (type === "commit") return <GitBranch className="size-3.5 text-teal-400" />;
    if (type === "review") return <CheckCircle2 className="size-3.5 text-green-400" />;
    if (type === "alert") return <AlertCircle className="size-3.5 text-amber-400" />;
    if (type === "badge") return <Award className="size-3.5 text-purple-400" />;
    return <MessageSquare className="size-3.5 text-blue-400" />;
  };

  return (
    <div className="space-y-6 animate-fade-up">

      {/* Header Banner */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-orange-500/10 via-surface to-surface">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30">
              <Rocket className="size-3.5 text-orange-500" /> Admin Project Listing Engine
            </div>
            <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">SaaS Project Manager</h1>
            <p className="text-xs text-secondary">Click any project tile to view full details — progress, team, attendance, TL info & recent updates.</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-2xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 transition-all flex items-center gap-2 shadow-md shadow-orange-500/20 shrink-0"
          >
            <Plus className="size-4" /> Publish New Project
          </button>
        </div>
      </div>

      {/* Main Grid: List + Detail Panel */}
      <div className={`grid gap-4 transition-all duration-300 ${selectedProject ? "lg:grid-cols-5" : "lg:grid-cols-1"}`}>

        {/* ── Projects List ── */}
        <div className={`space-y-3 ${selectedProject ? "lg:col-span-2" : "lg:col-span-1"}`}>
          <div className="flex items-center justify-between text-xs font-bold text-muted uppercase tracking-wider px-2">
            <span>Active SaaS Projects ({projects.length})</span>
            <span>Click to inspect</span>
          </div>

          {projects.map((p) => {
            const det = PROJECT_DETAILS[p.id] ?? DEFAULT_DETAIL;
            const isSelected = selectedProject?.id === p.id;
            return (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedProject(isSelected ? null : p)}
                onKeyDown={(e) => e.key === "Enter" && setSelectedProject(isSelected ? null : p)}
                className={`w-full text-left surface rounded-3xl p-4 border transition-all shadow-sm hover:border-orange-500/50 hover:shadow-orange-500/10 hover:shadow-lg cursor-pointer group ${
                  isSelected ? "border-orange-500 shadow-orange-500/20 shadow-lg bg-orange-500/5" : "border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={p.coverImage} alt={p.title} className="size-14 rounded-2xl object-cover border border-border shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-primary truncate">{p.title}</h3>
                      <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20 shrink-0">
                        {p.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted">
                      TL: <strong className="text-primary">{p.teamLeader?.name ?? "Aarav Gupta"}</strong>
                    </p>
                    {/* Mini progress bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all"
                          style={{ width: `${det.completion}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold font-mono text-orange-400 shrink-0">{det.completion}%</span>
                    </div>
                    <p className="text-xs text-teal-400 font-semibold">
                      {p.filledSeats}/{p.teamSize} Seats · Sprint {det.sprintNo}/{det.totalSprints}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <ChevronRight className={`size-4 text-orange-400 transition-transform ${isSelected ? "rotate-90" : "group-hover:translate-x-0.5"}`} />
                    <button
                      onClick={(e) => handleDeleteProject(p.id, e)}
                      className="p-1.5 rounded-xl surface-2 text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Detail Panel (Slide In) ── */}
        {selectedProject && detail && (
          <div className="lg:col-span-3 surface border border-orange-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/10 animate-fade-up">

            {/* Panel Header */}
            <div className="p-5 border-b border-border bg-gradient-to-r from-orange-500/10 to-transparent flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={selectedProject.coverImage} alt={selectedProject.title} className="size-12 rounded-2xl object-cover border border-border" />
                <div>
                  <h2 className="font-display text-lg font-extrabold text-primary leading-tight">{selectedProject.title}</h2>
                  <p className="text-xs text-muted mt-0.5">
                    <span className="text-orange-400 font-bold">{selectedProject.category}</span> · {selectedProject.durationMonths} Months · {selectedProject.stipend}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="size-8 rounded-full surface-2 border border-border flex items-center justify-center text-muted hover:text-primary shrink-0 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[72vh] overflow-y-auto">

              {/* KPI Row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Completion", value: `${detail.completion}%`, icon: <TrendingUp className="size-4 text-orange-400" />, color: "text-orange-400" },
                  { label: "Attendance", value: `${detail.attendance}%`, icon: <CalendarDays className="size-4 text-teal-400" />, color: "text-teal-400" },
                  { label: "Sprint", value: `${detail.sprintNo}/${detail.totalSprints}`, icon: <Zap className="size-4 text-purple-400" />, color: "text-purple-400" },
                  { label: "Team", value: `${detail.teamMembers.length} Members`, icon: <Users className="size-4 text-blue-400" />, color: "text-blue-400" },
                ].map((kpi) => (
                  <div key={kpi.label} className="surface-2 rounded-2xl p-3 border border-border text-center space-y-1">
                    <div className="flex justify-center">{kpi.icon}</div>
                    <p className={`text-base font-extrabold font-mono ${kpi.color}`}>{kpi.value}</p>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-wide">{kpi.label}</p>
                  </div>
                ))}
              </div>

              {/* Overall Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-primary flex items-center gap-1.5"><BarChart3 className="size-3.5 text-orange-400" /> Work Completion</span>
                  <span className="text-orange-400 font-mono">{detail.completion}% done</span>
                </div>
                <div className="h-3 rounded-full bg-surface-2 border border-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 transition-all duration-700 shadow-sm"
                    style={{ width: `${detail.completion}%` }}
                  />
                </div>
                <p className="text-[11px] text-muted">Sprint {detail.sprintNo} of {detail.totalSprints} — Est. delivery on track</p>
              </div>

              {/* Milestones */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-primary flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-green-400" /> Sprint Milestones</p>
                <div className="space-y-1.5">
                  {detail.milestones.map((m, i) => (
                    <div key={i} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${m.done ? "surface-2 border border-green-500/20" : "surface border border-border opacity-60"}`}>
                      {m.done
                        ? <CheckCircle2 className="size-3.5 text-green-400 shrink-0" />
                        : <Clock className="size-3.5 text-muted shrink-0" />
                      }
                      <span className={`font-semibold ${m.done ? "text-primary" : "text-secondary"}`}>{m.label}</span>
                      {m.done && <span className="ml-auto text-[10px] text-green-400 font-bold">✓ Done</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* TL Info */}
              <div className="surface-2 border border-border rounded-2xl p-4 space-y-3">
                <p className="text-xs font-bold text-primary flex items-center gap-1.5"><Star className="size-3.5 text-amber-400" /> Team Leader Info</p>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {detail.tlInfo.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-primary">{detail.tlInfo.name}</p>
                    <p className="text-[11px] text-muted font-mono">{detail.tlInfo.email}</p>
                  </div>
                  <div className="text-right text-xs shrink-0">
                    <p className="font-bold text-amber-400 flex items-center gap-1">
                      <Star className="size-3 fill-amber-400" /> {detail.tlInfo.rating}
                    </p>
                    <p className="text-muted text-[10px]">Since {detail.tlInfo.since}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-border">
                  <div className="surface rounded-xl p-2 text-center">
                    <p className="text-muted font-bold uppercase tracking-wide text-[9px]">Contact</p>
                    <p className="text-primary font-mono">{detail.tlInfo.phone}</p>
                  </div>
                  <div className="surface rounded-xl p-2 text-center">
                    <p className="text-muted font-bold uppercase tracking-wide text-[9px]">Stipend</p>
                    <p className="text-teal-400 font-mono font-bold">{selectedProject.stipend}</p>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              {detail.teamMembers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-primary flex items-center gap-1.5"><Users className="size-3.5 text-blue-400" /> Active Team Members</p>
                  <div className="space-y-2">
                    {detail.teamMembers.map((m, i) => (
                      <div key={i} className="surface-2 border border-border rounded-2xl p-3 flex items-center gap-3">
                        <img src={m.avatar} alt={m.name} className="size-9 rounded-full border border-border object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-primary">{m.name}</p>
                          <p className="text-[11px] text-muted">{m.role} · {m.college}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-extrabold font-mono text-teal-400">{m.score}/100</p>
                          <div className="w-16 h-1.5 rounded-full bg-surface overflow-hidden mt-1">
                            <div className="h-full rounded-full bg-teal-400" style={{ width: `${m.score}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Updates Feed */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-primary flex items-center gap-1.5"><Activity className="size-3.5 text-purple-400" /> Recent Updates</p>
                <div className="space-y-2">
                  {detail.recentUpdates.map((u, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 surface-2 border border-border rounded-2xl">
                      <div className="mt-0.5 shrink-0">{updateIcon(u.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-primary font-semibold leading-snug">{u.action}</p>
                        <p className="text-[11px] text-muted mt-0.5">{u.user}</p>
                      </div>
                      <span className="text-[10px] text-muted shrink-0 font-mono">{u.time}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* CREATE NEW PROJECT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
          <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-xl font-bold text-primary flex items-center gap-2">
                <Rocket className="size-5 text-orange-500" /> Publish New Project & Internship
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="size-8 rounded-full surface-2 border border-border flex items-center justify-center text-muted hover:text-primary"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-primary">Project Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                  placeholder="e.g. AI-Powered Code Auditor & Refactoring Agent"
                  className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none" />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-primary">Category Track</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none">
                    <option value="AI">AI & Machine Learning</option>
                    <option value="Web Development">Full Stack Web Development</option>
                    <option value="Mobile">Mobile Apps</option>
                    <option value="DevOps">DevOps & Cloud</option>
                    <option value="Open Source">Open Source DevTools</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-primary">Team Size</label>
                  <input type="number" value={teamSize} min={2} max={12} onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary">Short Description</label>
                <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} required
                  placeholder="Summary of the project..."
                  className="w-full p-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary">Startup & Product Vision</label>
                <input type="text" value={productIdea} onChange={(e) => setProductIdea(e.target.value)} required
                  placeholder="e.g. Build an autonomous code refactoring SaaS sold to enterprise engineering teams..."
                  className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none" />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-primary">Stipend Per Month</label>
                  <input type="text" value={stipend} onChange={(e) => setStipend(e.target.value)} required
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-primary">Estimated Product Value</label>
                  <input type="text" value={estimatedProductValue} onChange={(e) => setEstimatedProductValue(e.target.value)} required
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary">Domains Required (Comma Separated)</label>
                <input type="text" value={domainsInput} onChange={(e) => setDomainsInput(e.target.value)} required
                  className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary">Tech Stack Tags (Comma Separated)</label>
                <input type="text" value={techStackInput} onChange={(e) => setTechStackInput(e.target.value)} required
                  className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none" />
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <button type="button" onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl font-bold surface-2 border border-border text-secondary">
                  Cancel
                </button>
                <button type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110 shadow-md shadow-orange-500/20">
                  Publish Project Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
