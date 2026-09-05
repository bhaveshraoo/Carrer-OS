"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Clock,
  Award,
  DollarSign,
  Users,
  CheckCircle2,
  Calendar,
  Layers,
  Code2,
  HelpCircle,
  FileText,
  Globe,
  Send,
  ShieldCheck,
  Check,
  Zap,
  Upload,
  Paperclip,
  Target,
  MessageSquare,
} from "lucide-react";
import { MOCK_PROJECTS } from "@/lib/projects/data";
import { useEffect } from "react";
import { useNotifications } from "@/components/notifications/notification-provider";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = (params?.id as string) || "proj-1";
  const { notify } = useNotifications();

  const project = MOCK_PROJECTS.find((p) => p.id === projectId) || MOCK_PROJECTS[0];

  // Apply Full-Page Mode State
  const [isApplying, setIsApplying] = useState(false);

  // Resume state: Auto-fetched from candidate's profile by default or newly uploaded file name
  const [selectedResumeName, setSelectedResumeName] = useState<string | null>(null);
  const [hasProfileResume, setHasProfileResume] = useState(false);
  const [isNewUpload, setIsNewUpload] = useState(false);

  useEffect(() => {
    async function loadResume() {
      try {
        const res = await fetch("/api/resume/analyze");
        const data = await res.json();
        if (data?.resume && data?.resume?.file_name) {
          setSelectedResumeName(`${data.resume.file_name} (ATS Score: ${data.ats_score ?? 'Verified'})`);
          setHasProfileResume(true);
        } else {
          setSelectedResumeName(null);
          setHasProfileResume(false);
        }
      } catch {
        setSelectedResumeName(null);
        setHasProfileResume(false);
      }
    }
    loadResume();
  }, []);

  const [githubUrl, setGithubUrl] = useState("https://github.com/student_dev");
  const [linkedInUrl, setLinkedInUrl] = useState("https://linkedin.com/in/student_dev");
  const [selectedDomain, setSelectedDomain] = useState("Frontend");
  const [whatWillYouDo, setWhatWillYouDo] = useState("I will design the WebSocket API layer, implement AST code refactoring tools, and test E2E audio flows.");
  const [whySelectYou, setWhySelectYou] = useState("I have 1 year of experience with React & Next.js, and built 2 full-stack projects on GitHub.");
  const [availability, setAvailability] = useState("15 Hours / Week (Available Weekdays & Weekends)");
  const [applied, setApplied] = useState(false);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedResumeName(`${file.name} (${Math.round(file.size / 1024)} KB)`);
      setIsNewUpload(true);
      notify({
        type: "success",
        icon: "📄",
        title: "Resume File Uploaded!",
        body: `Attached "${file.name}" to your application.`,
        autoDismiss: 3000,
      });
    }
  }

  function handleApplySubmit(e: React.FormEvent) {
    e.preventDefault();
    setApplied(true);
    setIsApplying(false);

    notify({
      type: "success",
      icon: "🚀",
      title: "Application Submitted to Team Leader!",
      body: `Applied for ${selectedDomain} domain on ${project.title}. Team Leader will review your pitch and schedule an interview.`,
      autoDismiss: 4500,
    });
  }

  // ── SEAMLESS FULL-PAGE APPLICATION VIEW ──
  if (isApplying) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
        {/* Top Back Navigation */}
        <button
          onClick={() => setIsApplying(false)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Project Overview
        </button>

        {/* Full-Page Application Container */}
        <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl">
          
          {/* Header */}
          <div className="space-y-3 pb-6 border-b border-border">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-orange-400 bg-orange-500/15 px-3 py-1 rounded-full border border-orange-500/30 flex items-center gap-1">
                <Send className="size-3.5" /> Official Candidate Pitch & Application
              </span>
              <span className="text-xs font-bold text-teal-400 bg-teal-500/15 px-3 py-1 rounded-full border border-teal-500/30">
                {project.category} Track
              </span>
            </div>

            <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
              Apply for {project.title}
            </h1>

            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              Submit your candidate pitch to Team Leader <strong className="text-primary">{project.teamLeader?.name || "Aarav Gupta"}</strong>. Selected members receive guaranteed Internship Certificates, LORs, and 5% Revenue Shares.
            </p>
          </div>

          {/* Available Seats Status Banner */}
          <div className="surface-2 p-5 rounded-2xl border border-orange-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-orange-500/15 text-orange-500 flex items-center justify-center font-bold shrink-0">
                <Target className="size-5" />
              </div>
              <div>
                <p className="font-bold text-primary text-sm">Available Team Seats</p>
                <p className="text-xs text-secondary">{project.remainingSeats} Seats Remaining of {project.teamSize} Total Seats</p>
              </div>
            </div>

            <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-500/20">
              {project.filledSeats} Seats Confirmed
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleApplySubmit} className="space-y-8 text-xs">

            {/* SECTION 1: TARGET DOMAIN */}
            <div className="space-y-3">
              <label className="font-bold text-primary flex items-center gap-2 text-xs uppercase tracking-wider">
                <Users className="size-4 text-orange-500" /> 1. Select Target Domain (Required)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {project.domainsRequired.map((d) => {
                  const isSelected = selectedDomain === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDomain(d)}
                      className={`p-4 rounded-2xl font-bold transition-all border text-center text-xs flex flex-col items-center justify-center gap-1.5 ${
                        isSelected
                          ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20"
                          : "surface-2 text-secondary border-border hover:border-orange-500/40"
                      }`}
                    >
                      <span className="text-sm font-extrabold">{d}</span>
                      <span className={`text-[11px] font-medium ${isSelected ? "text-white/90" : "text-muted"}`}>
                        1 Open Seat
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: RESUME & PROOF OF WORK */}
            <div className="space-y-4 pt-6 border-t border-border">
              <label className="font-bold text-primary flex items-center gap-2 text-xs uppercase tracking-wider">
                <FileText className="size-4 text-teal-400" /> 2. Candidate Resume & Proof of Work
              </label>

              {/* Auto-Fetched or Upload Resume Status Box */}
              {selectedResumeName ? (
                <div className="surface-2 p-5 rounded-2xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="size-11 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0">
                      <Paperclip className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-primary text-sm">{selectedResumeName}</span>
                        {!isNewUpload && (
                          <span className="text-[11px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                            Auto-Fetched from Profile
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted pt-0.5">
                        {isNewUpload ? "Custom file attached for this application." : "Active resume from your candidate profile."}
                      </p>
                    </div>
                  </div>

                  {/* Direct File Upload Button */}
                  <label className="px-4 py-2.5 rounded-xl text-xs font-bold surface hover:bg-surface-2 border border-border text-primary flex items-center gap-2 cursor-pointer shrink-0 transition-colors">
                    <Upload className="size-4 text-orange-500" />
                    <span>Upload Different Resume</span>
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="surface-2 p-5 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-amber-500/5">
                  <div className="flex items-center gap-3.5">
                    <div className="size-11 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <span className="font-bold text-primary text-sm">No Resume Found on Profile</span>
                      <p className="text-xs text-muted pt-0.5">
                        Upload your candidate resume (PDF or DOCX) to attach it to your application.
                      </p>
                    </div>
                  </div>

                  <label className="px-5 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 cursor-pointer shrink-0 transition-all shadow-md">
                    <Upload className="size-4" />
                    <span>Upload Resume PDF</span>
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* GitHub & LinkedIn Profiles */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-secondary">GitHub Profile URL</span>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full h-11 px-4 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-secondary">LinkedIn Profile URL</span>
                  <input
                    type="url"
                    value={linkedInUrl}
                    onChange={(e) => setLinkedInUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full h-11 px-4 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: DELIVERABLES & PITCH */}
            <div className="space-y-4 pt-6 border-t border-border">
              <label className="font-bold text-primary flex items-center gap-2 text-xs uppercase tracking-wider">
                <MessageSquare className="size-4 text-orange-500" /> 3. Deliverables & Candidate Pitch
              </label>

              {/* What will you do */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-secondary">
                  What will you do in this team? (Specific Responsibilities & Contributions)
                </span>
                <textarea
                  rows={3}
                  value={whatWillYouDo}
                  onChange={(e) => setWhatWillYouDo(e.target.value)}
                  required
                  placeholder="e.g. I will design the WebSocket API layer, implement AST code refactoring tools, and test E2E audio flows..."
                  className="w-full p-4 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500/50 leading-relaxed"
                />
              </div>

              {/* Why select you */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-secondary">
                  Why should the Team Leader select YOU for this seat? (Your Pitch & Unique Value)
                </span>
                <textarea
                  rows={3}
                  value={whySelectYou}
                  onChange={(e) => setWhySelectYou(e.target.value)}
                  required
                  placeholder="Explain why you are the best candidate over other applicants, your past projects, or dedication..."
                  className="w-full p-4 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500/50 leading-relaxed"
                />
              </div>

              {/* Weekly availability */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-secondary">Weekly Availability & Commitment</span>
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  required
                  className="w-full h-11 px-4 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none focus:border-orange-500/50"
                />
              </div>
            </div>

            {/* SUBMIT ACTION FOOTER */}
            <div className="pt-6 border-t border-border flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setIsApplying(false)}
                className="px-5 py-3 rounded-xl font-bold surface-2 border border-border text-secondary hover:text-primary transition-colors text-xs"
              >
                Cancel & Return
              </button>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110 shadow-lg shadow-orange-500/25 flex items-center gap-2 text-xs"
              >
                <Send className="size-4" /> Submit Pitch to Team Leader
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  // ── STANDARD PROJECT DETAIL OVERVIEW PAGE VIEW ──
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">

      {/* Back Link */}
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary transition-colors"
      >
        <ArrowLeft className="size-4" /> Back to Project Marketplace
      </Link>

      {/* ── 1. HERO BANNER ── */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-surface to-surface">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-orange-400 bg-orange-500/15 px-3 py-1 rounded-full border border-orange-500/30 flex items-center gap-1">
                <Sparkles className="size-3.5" /> {project.category} Track
              </span>
              <span className="text-xs font-bold text-teal-400 bg-teal-500/15 px-3 py-1 rounded-full border border-teal-500/30 flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> {project.matchPercentage}% Skill Match
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              {project.title}
            </h1>

            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              {project.description}
            </p>

            <div className="surface-2 p-3.5 rounded-2xl border border-border text-xs space-y-1">
              <span className="font-bold text-orange-400">Startup & Product Vision: </span>
              <span className="text-secondary">{project.productIdea}</span>
            </div>
          </div>

          {/* Right Summary & Apply Box */}
          <div className="surface-2 p-6 rounded-3xl border border-border space-y-4 shrink-0 w-full md:w-80 shadow-md">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted">Stipend:</span>
                <span className="font-mono font-bold text-teal-400">{project.stipend}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted">Duration:</span>
                <span className="font-semibold text-primary">{project.durationMonths} Months ({project.weeklyHours} hrs/wk)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted">Seats Available:</span>
                <span className="font-bold text-orange-400">{project.remainingSeats} of {project.teamSize} Seats Left</span>
              </div>
            </div>

            <button
              onClick={() => setIsApplying(true)}
              disabled={applied}
              className={`w-full py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
                applied
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                  : "bg-orange-500 text-white hover:brightness-110 shadow-orange-500/25"
              }`}
            >
              {applied ? <CheckCircle2 className="size-4" /> : <Send className="size-4" />}
              {applied ? "Application Submitted (Under Review)" : "Apply For Internship Team"}
            </button>

            <Link
              href={`/dashboard/projects/${project.id}/workspace`}
              className="w-full py-2.5 rounded-2xl font-bold text-xs surface border border-border hover:bg-surface-2 transition-all flex items-center justify-center gap-1.5 text-secondary"
            >
              <Zap className="size-3.5 text-teal-400" /> Preview Team Workspace
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. PROJECT OVERVIEW & MILESTONES ── */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* Main Details Column */}
        <div className="md:col-span-2 space-y-6">

          {/* Problem Statement & Deliverables */}
          <div className="surface p-6 rounded-3xl border border-border space-y-4">
            <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
              <Layers className="size-5 text-orange-500" /> Objectives & Expected Deliverables
            </h3>
            <ul className="space-y-2.5 text-xs text-secondary leading-relaxed">
              <li className="flex items-start gap-2 surface-2 p-3 rounded-2xl border border-border">
                <CheckCircle2 className="size-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Production-ready web application hosted on Vercel/AWS with zero downtime.</span>
              </li>
              <li className="flex items-start gap-2 surface-2 p-3 rounded-2xl border border-border">
                <CheckCircle2 className="size-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Comprehensive test suite with unit tests and E2E automation coverage.</span>
              </li>
              <li className="flex items-start gap-2 surface-2 p-3 rounded-2xl border border-border">
                <CheckCircle2 className="size-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Clean API documentation and GitHub repository history with PR code reviews.</span>
              </li>
            </ul>
          </div>

          {/* Sprints Timeline */}
          <div className="surface p-6 rounded-3xl border border-border space-y-4">
            <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
              <Calendar className="size-5 text-orange-500" /> Milestone Timeline
            </h3>

            <div className="space-y-3">
              {[
                { sprint: "Sprint 1 (Weeks 1-2)", title: "Architecture Design & Schema Setup", desc: "Database models, API specifications, and initial frontend boilerplate." },
                { sprint: "Sprint 2 (Weeks 3-6)", title: "Core Feature Engineering", desc: "Build primary features, WebSocket connections, and external API integrations." },
                { sprint: "Sprint 3 (Weeks 7-9)", title: "Testing & Code Quality Audit", desc: "Performance optimization, unit testing, and Team Leader code reviews." },
                { sprint: "Sprint 4 (Weeks 10-12)", title: "Deployment & SaaS Product Launch", desc: "Production launch, demo recording, and Certificate generation." },
              ].map((m, i) => (
                <div key={i} className="surface-2 p-4 rounded-2xl border border-border space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-orange-400">{m.sprint}</span>
                    <span className="text-primary">{m.title}</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar Column: Mentors & Rewards */}
        <div className="space-y-6">

          {/* Mentor Details */}
          <div className="surface p-6 rounded-3xl border border-border space-y-4">
            <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
              <ShieldCheck className="size-4 text-orange-500" /> Mentor & Team Lead
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 surface-2 p-3 rounded-2xl border border-border">
                <img src={project.mentor.avatar} alt={project.mentor.name} className="size-10 rounded-full object-cover" />
                <div>
                  <p className="text-xs font-bold text-primary">{project.mentor.name}</p>
                  <p className="text-[11px] text-muted">{project.mentor.role} · {project.mentor.company}</p>
                </div>
              </div>

              {project.teamLeader && (
                <div className="flex items-center gap-3 surface-2 p-3 rounded-2xl border border-border">
                  <img src={project.teamLeader.avatar} alt={project.teamLeader.name} className="size-10 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold text-primary">{project.teamLeader.name}</p>
                    <p className="text-[11px] text-orange-400">Team Leader ({project.teamLeader.role})</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rewards & Perks */}
          <div className="surface p-6 rounded-3xl border border-border space-y-4">
            <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
              <Award className="size-4 text-orange-500" /> Guaranteed Rewards & Perks
            </h3>

            <ul className="space-y-2 text-xs text-secondary">
              {project.rewards.map((reward, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Sparkles className="size-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>{reward}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
