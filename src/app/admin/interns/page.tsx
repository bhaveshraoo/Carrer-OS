"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Rocket,
  FileCheck,
  Download,
  Search,
  Zap,
  Sparkles,
  Trophy,
  Code2,
  X,
  Building2,
  Star,
  Sliders,
  Check,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";

export interface Intern {
  id: string;
  name: string;
  email: string;
  college: string;
  projectTitle: string;
  domain: string;
  teamLeader: string;
  startDate: string;
  durationMonths: number;
  stipendMonthly: string;
  attendancePct: number;
  performanceScore: number;
  offerStatus: "Enrolled" | "Offer Sent" | "Certificate Issued";
  badges: string[];
}

const INITIAL_INTERNS: Intern[] = [
  {
    id: "intern-1",
    name: "Bhavesh Rao",
    email: "bhavesh.intern@iitd.ac.in",
    college: "IIT Delhi",
    projectTitle: "AI Voice-Powered Career Assistant",
    domain: "Frontend Engineer Lead",
    teamLeader: "Aarav Gupta",
    startDate: "2026-05-01",
    durationMonths: 3,
    stipendMonthly: "₹15,000 / mo",
    attendancePct: 98,
    performanceScore: 96,
    offerStatus: "Enrolled",
    badges: ["Top Performer", "Consistency King", "Full Stack Hero"],
  },
  {
    id: "intern-2",
    name: "Rohan Varma",
    email: "rohan.varma@bits.ac.in",
    college: "BITS Pilani",
    projectTitle: "Autonomous Code Refactoring Agent",
    domain: "Full Stack Engineer",
    teamLeader: "Aarav Gupta",
    startDate: "2026-05-15",
    durationMonths: 3,
    stipendMonthly: "₹15,000 / mo",
    attendancePct: 94,
    performanceScore: 91,
    offerStatus: "Enrolled",
    badges: ["Fast Learner"],
  },
  {
    id: "intern-3",
    name: "Ananya Roy",
    email: "ananya.roy@iiit.ac.in",
    college: "IIIT Hyderabad",
    projectTitle: "AI Voice-Powered Career Assistant",
    domain: "AI/ML Engineer",
    teamLeader: "Priya Sharma",
    startDate: "2026-06-01",
    durationMonths: 3,
    stipendMonthly: "₹18,000 / mo",
    attendancePct: 96,
    performanceScore: 94,
    offerStatus: "Offer Sent",
    badges: ["AI Wizard"],
  },
  {
    id: "intern-4",
    name: "Vikram Malhotra",
    email: "vikram.m@nsut.ac.in",
    college: "NSUT Delhi",
    projectTitle: "Open Source Developer Tooling",
    domain: "Backend Engineer",
    teamLeader: "Karan Mehta",
    startDate: "2026-04-15",
    durationMonths: 3,
    stipendMonthly: "₹15,000 / mo",
    attendancePct: 100,
    performanceScore: 98,
    offerStatus: "Certificate Issued",
    badges: ["Consistency King", "Top Performer"],
  },
];

export default function AdminInternsPage() {
  const { notify } = useNotifications();
  const [interns, setInterns] = useState<Intern[]>(INITIAL_INTERNS);
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInternForEval, setSelectedInternForEval] = useState<Intern | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("IIT Delhi");
  const [projectTitle, setProjectTitle] = useState("Autonomous Code Refactoring Agent");
  const [domain, setDomain] = useState("Frontend Engineer");
  const [teamLeader, setTeamLeader] = useState("Aarav Gupta");
  const [stipendMonthly, setStipendMonthly] = useState("₹15,000 / mo");

  const filteredInterns = interns.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase()) ||
      i.college.toLowerCase().includes(search.toLowerCase()) ||
      i.projectTitle.toLowerCase().includes(search.toLowerCase());
    const matchesDomain = selectedDomain === "All" || i.domain.includes(selectedDomain);
    return matchesSearch && matchesDomain;
  });

  // KPI Calculations
  const totalInterns = interns.length;
  const avgAttendance = Math.round(interns.reduce((acc, i) => acc + i.attendancePct, 0) / (totalInterns || 1));
  const avgScore = Math.round(interns.reduce((acc, i) => acc + i.performanceScore, 0) / (totalInterns || 1));
  const certsIssuedCount = interns.filter((i) => i.offerStatus === "Certificate Issued").length;

  function handleEnrollIntern(e: React.FormEvent) {
    e.preventDefault();
    const newIntern: Intern = {
      id: `intern-${Date.now()}`,
      name,
      email,
      college,
      projectTitle,
      domain,
      teamLeader,
      startDate: new Date().toISOString().split("T")[0],
      durationMonths: 3,
      stipendMonthly,
      attendancePct: 100,
      performanceScore: 90,
      offerStatus: "Offer Sent",
      badges: ["Fast Learner"],
    };

    setInterns([newIntern, ...interns]);
    setShowAddModal(false);

    notify({
      type: "success",
      icon: "🎓",
      title: "New Intern Enrolled!",
      body: `Enrolled ${name} into ${projectTitle} (${domain}).`,
      autoDismiss: 4000,
    });
  }

  function handleIssueCert(internName: string) {
    setInterns((prev) =>
      prev.map((i) => (i.name === internName ? { ...i, offerStatus: "Certificate Issued" } : i))
    );
    notify({
      type: "success",
      icon: "🏆",
      title: "Certificate Issued!",
      body: `Issued QR-verified Internship Certificate & LOR for ${internName}.`,
      autoDismiss: 4000,
    });
  }

  function handleMarkAttendance(internId: string, delta: number) {
    setInterns((prev) =>
      prev.map((i) => {
        if (i.id !== internId) return i;
        const newPct = Math.min(100, Math.max(0, i.attendancePct + delta));
        return { ...i, attendancePct: newPct };
      })
    );
  }

  function handleUpdateScore(internId: string, score: number) {
    setInterns((prev) =>
      prev.map((i) => (i.id === internId ? { ...i, performanceScore: score } : i))
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">

      {/* Header Banner */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-orange-500/10 via-surface to-surface">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30">
              <Users className="size-3.5 text-orange-500" /> Active Student Interns Directory
            </div>
            <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
              SaaS Project Interns Roster
            </h1>
            <p className="text-xs text-secondary">
              Track active 1–6 month student interns across SaaS product teams, evaluate weekly performance scores, monitor attendance, and issue certificates.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 rounded-2xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 shadow-md shadow-orange-500/20 shrink-0 flex items-center gap-1.5"
          >
            <UserPlus className="size-4" /> Enroll New Intern
          </button>
        </div>
      </div>

      {/* KPI METRICS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface p-5 rounded-3xl border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Active Interns</span>
            <Users className="size-4 text-orange-500" />
          </div>
          <p className="font-display text-2xl font-extrabold text-primary">{totalInterns} <span className="text-xs font-normal text-muted">Interns</span></p>
          <p className="text-[11px] text-teal-400 font-semibold">Across 8 SaaS Product Teams</p>
        </div>

        <div className="surface p-5 rounded-3xl border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Avg Attendance</span>
            <Calendar className="size-4 text-teal-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-teal-400">{avgAttendance}%</p>
          <p className="text-[11px] text-muted">Daily Attendance Marked</p>
        </div>

        <div className="surface p-5 rounded-3xl border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Avg Intern Score</span>
            <Star className="size-4 text-amber-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-amber-400">{avgScore} <span className="text-xs font-normal text-muted">/ 100</span></p>
          <p className="text-[11px] text-teal-400 font-semibold">Top Tier Performance</p>
        </div>

        <div className="surface p-5 rounded-3xl border border-teal-500/30 space-y-2 shadow-sm bg-teal-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Certs &amp; LORs Issued</span>
            <Award className="size-4 text-teal-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-teal-400">{certsIssuedCount}</p>
          <p className="text-[11px] text-muted">QR-Verified Certificates</p>
        </div>
      </div>

      {/* SEARCH & DOMAIN FILTERS */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="size-4 text-muted absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search intern by name, college, project, or domain..."
              className="w-full h-10 pl-10 pr-4 rounded-2xl surface-2 border border-border text-xs text-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {["All", "Frontend", "Backend", "AI/ML", "Full Stack"].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDomain(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                  selectedDomain === d
                    ? "bg-orange-500 text-white border-orange-500"
                    : "surface-2 text-secondary hover:text-primary border-border"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* INTERNS ROSTER CARDS */}
      <div className="space-y-4">
        {filteredInterns.map((intern) => (
          <div
            key={intern.id}
            className="surface rounded-3xl p-6 border border-border space-y-4 shadow-sm hover:border-orange-500/30 transition-all text-xs"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base text-primary">{intern.name}</h3>
                  <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                    {intern.college}
                  </span>
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                    {intern.domain}
                  </span>
                </div>
                <p className="text-muted">
                  Project: <strong className="text-primary">{intern.projectTitle}</strong> · Team Lead: <strong className="text-primary">{intern.teamLeader}</strong>
                </p>
              </div>

              {/* Status Badge & Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase border ${
                  intern.offerStatus === "Certificate Issued"
                    ? "bg-teal-500/20 text-teal-400 border-teal-500/30"
                    : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                }`}>
                  {intern.offerStatus}
                </span>

                <button
                  onClick={() => setSelectedInternForEval(intern)}
                  className="px-3.5 py-1.5 rounded-xl font-bold surface-2 border border-border hover:border-orange-500/40 text-primary flex items-center gap-1.5"
                >
                  <Sliders className="size-3.5 text-amber-400" /> Evaluate
                </button>

                {intern.offerStatus !== "Certificate Issued" && (
                  <button
                    onClick={() => handleIssueCert(intern.name)}
                    className="px-3.5 py-1.5 rounded-xl font-bold bg-teal-500 text-white hover:brightness-110 flex items-center gap-1.5 shadow-sm"
                  >
                    <Award className="size-3.5" /> Issue Cert &amp; LOR
                  </button>
                )}
              </div>
            </div>

            {/* Attendance & Performance Score Controls */}
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="surface-2 p-3.5 rounded-2xl border border-border space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted text-[10px] font-bold uppercase">Attendance Tracker</span>
                  <span className="font-bold text-teal-400">{intern.attendancePct}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMarkAttendance(intern.id, 2)}
                    className="flex-1 py-1 rounded-lg bg-teal-500/10 text-teal-400 font-bold hover:bg-teal-500/20 border border-teal-500/20"
                  >
                    + Present
                  </button>
                  <button
                    onClick={() => handleMarkAttendance(intern.id, -2)}
                    className="flex-1 py-1 rounded-lg bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20 border border-red-500/20"
                  >
                    - Absent
                  </button>
                </div>
              </div>

              <div className="surface-2 p-3.5 rounded-2xl border border-border space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted text-[10px] font-bold uppercase">Sprint Score</span>
                  <span className="font-bold text-amber-400">{intern.performanceScore} / 100</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={intern.performanceScore}
                  onChange={(e) => handleUpdateScore(intern.id, Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="surface-2 p-3.5 rounded-2xl border border-border space-y-1">
                <span className="text-muted text-[10px] font-bold uppercase">Stipend Monthly</span>
                <p className="font-mono font-bold text-primary text-sm">{intern.stipendMonthly}</p>
              </div>
            </div>

            {/* Badges Vault */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] font-semibold text-muted">Earned Badges:</span>
              {intern.badges.map((b) => (
                <span key={b} className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                  <Trophy className="size-3" /> {b}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ENROLL NEW INTERN MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
          <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <UserPlus className="size-5 text-orange-500" /> Enroll New Student Intern
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-xs text-muted font-bold px-2 py-1 surface-2 rounded-lg">
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleEnrollIntern} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-primary">Student Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-primary">Student Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="vikram@iitd.ac.in"
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">College / University</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    required
                    placeholder="IIT Delhi"
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary">Assigned SaaS Project</label>
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
                  <label className="font-bold text-primary">Target Domain</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  >
                    <option value="Frontend Engineer">Frontend Engineer</option>
                    <option value="Backend Engineer">Backend Engineer</option>
                    <option value="AI/ML Engineer">AI/ML Engineer</option>
                    <option value="Full Stack Engineer">Full Stack Engineer</option>
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Monthly Stipend</label>
                  <input
                    type="text"
                    value={stipendMonthly}
                    onChange={(e) => setStipendMonthly(e.target.value)}
                    required
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110 shadow-md">
                  Enroll Intern &amp; Send Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EVALUATE INTERN MODAL */}
      {selectedInternForEval && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
          <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="space-y-0.5">
                <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                  <Sliders className="size-5 text-amber-400" /> Evaluate Intern Performance
                </h3>
                <p className="text-xs text-muted">{selectedInternForEval.name} ({selectedInternForEval.college})</p>
              </div>
              <button onClick={() => setSelectedInternForEval(null)} className="text-xs text-muted font-bold px-2 py-1 surface-2 rounded-lg">
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="surface-2 p-4 rounded-2xl border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">Performance Rating Score</span>
                  <span className="font-extrabold text-amber-400 text-sm">{selectedInternForEval.performanceScore} / 100</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={selectedInternForEval.performanceScore}
                  onChange={(e) => {
                    const newScore = Number(e.target.value);
                    handleUpdateScore(selectedInternForEval.id, newScore);
                    setSelectedInternForEval({ ...selectedInternForEval, performanceScore: newScore });
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <span className="font-bold text-primary">Badges Awarded</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedInternForEval.badges.map((b) => (
                    <span key={b} className="px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20">
                      🏆 {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button onClick={() => setSelectedInternForEval(null)} className="px-6 py-2 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110 shadow-md">
                Save Evaluation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
