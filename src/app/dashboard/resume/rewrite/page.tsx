"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  FileText,
  Plus,
  CheckCircle2,
  Copy,
  Download,
  ChevronRight,
  Wand2,
  RotateCcw,
  Lightbulb,
  Target,
  AlertCircle,
  User,
  Briefcase,
  GraduationCap,
  Code2,
  Award,
  Zap,
  TrendingUp,
} from "lucide-react";

// ── Types ──
type Mode = null | "improve" | "build";
type BuildStep = "personal" | "experience" | "education" | "skills" | "projects" | "preview";

interface AiSuggestion {
  section: string;
  original: string;
  improved: string;
  reason: string;
  atsBoost: number;
}

// ── Mock AI suggestions for "improve uploaded" mode ──
const MOCK_SUGGESTIONS: AiSuggestion[] = [
  {
    section: "Experience Bullet",
    original: "Worked on backend APIs using Node.js",
    improved: "Designed and deployed 12 RESTful APIs using Node.js & Express, reducing average response time by 38% and serving 50K+ daily requests",
    reason: "Added quantified metrics and specific tech keywords ATS systems scan for",
    atsBoost: 22,
  },
  {
    section: "Experience Bullet",
    original: "Helped in building the frontend",
    improved: "Built 8 responsive React.js components integrated with Redux state management, improving UI load time by 30% across 3 product dashboards",
    reason: "Passive language replaced with action verb + measurable outcomes + keywords",
    atsBoost: 19,
  },
  {
    section: "Project Description",
    original: "Made an e-commerce website using MERN stack",
    improved: "Developed a full-stack e-commerce platform (MERN) with JWT auth, Razorpay integration, and real-time inventory tracking — supporting 500+ concurrent users",
    reason: "Added tech stack keywords, scale indicator, and specific features ATS expects",
    atsBoost: 17,
  },
  {
    section: "Skills Section",
    original: "Python, JavaScript, MySQL",
    improved: "Python · JavaScript (ES6+) · TypeScript · React.js · Node.js · Express · MySQL · PostgreSQL · Docker · Git · REST APIs · Agile/Scrum",
    reason: "Expanded with in-demand ATS keywords missing from original — recruiters filter by these",
    atsBoost: 14,
  },
  {
    section: "Summary",
    original: "A motivated CSE student looking for opportunities",
    improved: "Final-year Computer Science engineer with 2 internships, 4 shipped projects, and proficiency in full-stack development (React, Node.js, Python). Seeking SDE-1 roles in product companies.",
    reason: "Generic objective replaced with specific experience, skills, and target role",
    atsBoost: 11,
  },
];

const MISSING_KEYWORDS = [
  "REST API", "CI/CD", "Agile", "System Design", "DSA",
  "TypeScript", "Docker", "Unit Testing", "Problem Solving",
];

const SECTION_TIPS = [
  "Add a 2-line Professional Summary at the top — ATS systems prioritise it",
  "List skills as comma-separated keywords, not a visual bar chart (ATS can't read images)",
  "Quantify every bullet: use numbers, %, time saved, users impacted",
  "Add a 'Tools & Technologies' row separately from core skills",
];

// ── Export helpers ──
function buildImproveResumeText(
  acceptedIdxSet: Set<number>,
  suggestions: AiSuggestion[]
): string {
  const lines = [
    "RESUME — AI IMPROVED VERSION",
    "================================",
    "",
    "PROFESSIONAL SUMMARY",
    "--------------------",
    "Results-driven Computer Science engineer with hands-on experience in full-stack development and 2 industry internships. Proficient in React.js, Node.js, Python, and REST API design. Seeking SDE-1 roles at product-focused technology companies.",
    "",
    "EXPERIENCE",
    "----------",
  ];
  suggestions.forEach((s, i) => {
    lines.push(`[${s.section}]`);
    lines.push(acceptedIdxSet.has(i) ? s.improved : s.original);
    lines.push("");
  });
  lines.push("SKILLS");
  lines.push("------");
  lines.push("Python · JavaScript (ES6+) · TypeScript · React.js · Node.js · Express · MySQL · PostgreSQL · MongoDB · Docker · Git · REST APIs · System Design · Agile/Scrum · CI/CD · Unit Testing");
  return lines.join("\n");
}

function buildNewResumeText(fields: {
  name: string; email: string; phone: string; linkedin: string; github: string;
  summary: string; expText: string; eduText: string; skillsText: string; projectsText: string;
}): string {
  const n = (v: string, fb: string) => v.trim() || fb;
  return [
    n(fields.name, "Bhavesh Rao"),
    `${n(fields.email, "bhavesh@email.com")} | ${n(fields.phone, "+91 98765 43210")} | ${n(fields.linkedin, "linkedin.com/in/bhavesh")} | ${n(fields.github, "github.com/bhavesh")}`,
    "",
    "PROFESSIONAL SUMMARY",
    "--------------------",
    n(fields.summary, "Results-driven Computer Science engineer with hands-on experience in full-stack development and 2 industry internships. Proficient in React.js, Node.js, Python, and REST API design. Seeking SDE-1 roles at product-focused technology companies."),
    "",
    "EXPERIENCE",
    "----------",
    n(fields.expText, "SDE Intern — Google | Jun 2024 – Aug 2024\n• Engineered 3 reusable React.js dashboard components, reducing frontend rendering time by 42%\n• Designed 6 RESTful APIs handling 15K+ daily requests with 99.7% uptime"),
    "",
    "EDUCATION",
    "---------",
    n(fields.eduText, "B.Tech Computer Science — IIT Delhi (2021–2025) | CGPA: 8.4/10"),
    "",
    "SKILLS",
    "------",
    n(fields.skillsText, "Python · JavaScript (ES6+) · TypeScript · React.js · Node.js · Express · MySQL · PostgreSQL · MongoDB · Docker · Git · REST APIs · System Design · Agile/Scrum · CI/CD"),
    "",
    "PROJECTS",
    "--------",
    n(fields.projectsText, "E-Commerce Platform (MERN)\n• Full-stack shopping platform with JWT auth, Razorpay integration, supporting 500+ concurrent users"),
  ].join("\n");
}

function downloadTxt(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function printResume(printRef: React.RefObject<HTMLDivElement | null>) {
  const el = printRef.current;
  if (!el) return;
  const content = el.innerHTML;
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return;
  win.document.write(`
    <!DOCTYPE html><html><head>
    <title>Resume</title>
    <style>
      body { font-family: 'Arial', sans-serif; color: #111; background: #fff; margin: 0; padding: 40px; font-size: 12px; line-height: 1.6; }
      h1 { font-size: 22px; margin: 0 0 2px; }
      .contact { color: #444; font-size: 11px; margin-bottom: 18px; }
      .section-title { font-size: 10px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; color: #444; border-bottom: 1px solid #ddd; padding-bottom: 3px; margin: 16px 0 8px; }
      .job-title { font-weight: bold; font-size: 12px; }
      .meta { color: #666; font-size: 11px; margin-bottom: 4px; }
      ul { margin: 4px 0 10px 16px; padding: 0; }
      li { margin-bottom: 3px; }
      p { margin: 4px 0; }
      @page { margin: 20mm; }
    </style>
    </head><body>${content}</body></html>
  `);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); win.close(); }, 400);
}

// ── Build New Resume form sections ──
const BUILD_STEPS: { id: BuildStep; label: string; icon: React.ReactNode }[] = [
  { id: "personal", label: "Personal Info", icon: <User className="size-3.5" /> },
  { id: "experience", label: "Experience", icon: <Briefcase className="size-3.5" /> },
  { id: "education", label: "Education", icon: <GraduationCap className="size-3.5" /> },
  { id: "skills", label: "Skills", icon: <Code2 className="size-3.5" /> },
  { id: "projects", label: "Projects", icon: <Award className="size-3.5" /> },
  { id: "preview", label: "AI Preview", icon: <Sparkles className="size-3.5" /> },
];

export default function ResumeRewritePage() {
  const [mode, setMode] = useState<Mode>(null);
  const [buildStep, setBuildStep] = useState<BuildStep>("personal");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [acceptedIdx, setAcceptedIdx] = useState<Set<number>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const improvePrintRef = useRef<HTMLDivElement>(null);
  const buildPrintRef = useRef<HTMLDivElement>(null);

  // Build form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [summary, setSummary] = useState("");
  const [expText, setExpText] = useState("");
  const [eduText, setEduText] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [projectsText, setProjectsText] = useState("");

  function handleCopy(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  }

  function handleAccept(idx: number) {
    setAcceptedIdx((prev) => new Set(prev).add(idx));
  }

  function handleGenerate() {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
      setBuildStep("preview");
    }, 2800);
  }

  const stepIdx = BUILD_STEPS.findIndex((s) => s.id === buildStep);
  const atsBefore = 54;
  const atsAfter = Math.min(
    atsBefore + MOCK_SUGGESTIONS.filter((_, i) => acceptedIdx.has(i)).reduce((a, s) => a + s.atsBoost, 0),
    98
  );

  // ────────────────────────────────────────────────
  // MODE SELECTION SCREEN
  // ────────────────────────────────────────────────
  if (!mode) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/resume" className="size-9 rounded-2xl surface border border-border flex items-center justify-center text-muted hover:text-primary transition-colors">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">AI Resume Rewriter</h1>
            <p className="text-xs text-secondary mt-0.5">Boost your ATS score — choose how you want to proceed</p>
          </div>
        </div>

        {/* Mode Cards */}
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Option 1 — Improve Uploaded */}
          <button
            onClick={() => setMode("improve")}
            className="group text-left surface border border-border rounded-3xl p-7 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all space-y-4"
          >
            <div className="size-14 rounded-2xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
              <Wand2 className="size-7 text-orange-400" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-extrabold text-primary">AI-Improve Uploaded Resume</h2>
                <span className="text-[10px] font-bold bg-green-500/15 text-green-400 border border-green-500/25 px-2 py-0.5 rounded-full">Recommended</span>
              </div>
              <p className="text-sm text-secondary leading-relaxed">
                AI analyzes your existing resume and suggests targeted rewrites — stronger bullets, missing ATS keywords, and section improvements. You pick which changes to apply.
              </p>
            </div>
            <ul className="space-y-1.5">
              {["Rewrite weak bullet points with metrics", "Add missing ATS keywords", "Improve summary & skills section", "See ATS score before & after"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-secondary">
                  <CheckCircle2 className="size-3.5 text-green-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 group-hover:gap-2.5 transition-all">
              Get AI Suggestions <ChevronRight className="size-3.5" />
            </div>
          </button>

          {/* Option 2 — Build New */}
          <button
            onClick={() => setMode("build")}
            className="group text-left surface border border-border rounded-3xl p-7 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all space-y-4"
          >
            <div className="size-14 rounded-2xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
              <Plus className="size-7 text-orange-400" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-xl font-extrabold text-primary">Build a New Resume</h2>
              <p className="text-sm text-secondary leading-relaxed">
                Start fresh. Fill in your details and AI will generate a complete, ATS-optimized resume from scratch — formatted, keyword-rich, and ready to export.
              </p>
            </div>
            <ul className="space-y-1.5">
              {["AI-written bullets for your experience", "ATS-optimized formatting & structure", "Keyword-rich skills section", "Download as PDF-ready markdown"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-secondary">
                  <CheckCircle2 className="size-3.5 text-orange-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 group-hover:gap-2.5 transition-all">
              Start Building <ChevronRight className="size-3.5" />
            </div>
          </button>
        </div>

        {/* ATS Info Banner */}
        <div className="surface-2 border border-border rounded-2xl p-4 flex items-start gap-3">
          <Lightbulb className="size-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-bold text-primary">Why ATS score matters</p>
            <p className="text-secondary leading-relaxed">
              Over 95% of Fortune 500 companies use ATS (Applicant Tracking Systems) to filter resumes before a human ever sees them.
              A low ATS score means your resume gets auto-rejected — even if you're qualified.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // IMPROVE UPLOADED RESUME MODE
  // ────────────────────────────────────────────────
  if (mode === "improve") {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => setMode(null)} className="size-9 rounded-2xl surface border border-border flex items-center justify-center text-muted hover:text-primary transition-colors">
            <ArrowLeft className="size-4" />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-extrabold text-primary">AI Resume Improver</h1>
            <p className="text-xs text-secondary">Based on your uploaded resume · Accept suggestions to boost ATS score</p>
          </div>

          {/* ATS Score tracker */}
          <div className="surface border border-border rounded-2xl px-4 py-2 text-center shrink-0">
            <p className="text-[10px] text-muted font-bold uppercase tracking-wide">ATS Score</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-extrabold font-mono text-red-400">{atsBefore}</span>
              <TrendingUp className="size-3.5 text-green-400" />
              <span className="text-lg font-extrabold font-mono text-green-400">{atsAfter}</span>
            </div>
            <p className="text-[10px] text-muted">{acceptedIdx.size} changes applied</p>
          </div>
        </div>

        {/* Missing Keywords Banner */}
        <div className="surface-2 border border-amber-500/25 rounded-2xl p-4 space-y-2">
          <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <Target className="size-3.5" /> Missing ATS Keywords ({MISSING_KEYWORDS.length} detected)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {MISSING_KEYWORDS.map((kw) => (
              <span key={kw} className="text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full">
                + {kw}
              </span>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-primary flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-orange-400" /> AI-Suggested Rewrites ({MOCK_SUGGESTIONS.length} improvements found)
          </p>

          {MOCK_SUGGESTIONS.map((s, i) => {
            const accepted = acceptedIdx.has(i);
            return (
              <div key={i} className={`surface border rounded-2xl p-5 space-y-3 transition-all ${accepted ? "border-green-500/30 bg-green-500/5" : "border-border"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-muted px-2.5 py-1 rounded-full surface-2 border border-border">
                    {s.section}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                      +{s.atsBoost} ATS pts
                    </span>
                    {accepted && (
                      <span className="text-[10px] font-bold text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="size-3" /> Applied
                      </span>
                    )}
                  </div>
                </div>

                {/* Before */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-wide">Before</p>
                  <p className="text-xs text-secondary surface-2 border border-red-500/20 rounded-xl p-3 leading-relaxed line-through opacity-70">{s.original}</p>
                </div>

                {/* After */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-green-400 uppercase tracking-wide">After (AI Improved)</p>
                  <p className="text-xs text-primary surface-2 border border-green-500/20 rounded-xl p-3 leading-relaxed">{s.improved}</p>
                </div>

                {/* Reason */}
                <div className="flex items-start gap-2 text-[11px] text-muted">
                  <AlertCircle className="size-3.5 shrink-0 mt-0.5 text-orange-400" />
                  <span>{s.reason}</span>
                </div>

                {/* Actions */}
                {!accepted && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleAccept(i)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 text-white hover:brightness-110 transition-all shadow-sm shadow-orange-500/20"
                    >
                      ✓ Accept Change
                    </button>
                    <button
                      onClick={() => handleCopy(s.improved, i)}
                      className="px-4 py-2 rounded-xl text-xs font-bold surface-2 border border-border text-secondary hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      <Copy className="size-3.5" />
                      {copiedIdx === i ? "Copied!" : "Copy Text"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Section Tips */}
        <div className="surface border border-border rounded-2xl p-5 space-y-3">
          <p className="text-xs font-bold text-primary flex items-center gap-1.5">
            <Lightbulb className="size-3.5 text-amber-400" /> Section-Level Improvements
          </p>
          <ul className="space-y-2">
            {SECTION_TIPS.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-secondary">
                <Zap className="size-3.5 text-orange-400 shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Hidden print-ready resume for improve mode */}
        <div ref={improvePrintRef} style={{ display: "none" }}>
          <h1>{"Bhavesh Rao"}</h1>
          <p className="contact">bhavesh@email.com · +91 98765 43210 · linkedin.com/in/bhavesh · github.com/bhavesh</p>
          <div className="section-title">Professional Summary</div>
          <p>Results-driven Computer Science engineer with hands-on experience in full-stack development and 2 industry internships. Proficient in React.js, Node.js, Python, and REST API design. Seeking SDE-1 roles at product-focused technology companies.</p>
          <div className="section-title">Experience</div>
          {MOCK_SUGGESTIONS.map((s, i) => (
            <div key={i}>
              <p className="job-title">{s.section}</p>
              <p>{acceptedIdx.has(i) ? s.improved : s.original}</p>
            </div>
          ))}
          <div className="section-title">Skills</div>
          <p>Python · JavaScript (ES6+) · TypeScript · React.js · Node.js · Express · MySQL · PostgreSQL · MongoDB · Docker · Git · REST APIs · System Design · Agile/Scrum · CI/CD · Unit Testing</p>
        </div>

        {/* Download CTA */}
        {acceptedIdx.size > 0 && (
          <div className="surface border border-green-500/30 bg-green-500/5 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-sm text-primary">Ready to export your improved resume?</p>
              <p className="text-xs text-secondary mt-0.5">
                {acceptedIdx.size} AI improvements applied · ATS Score: <span className="text-green-400 font-bold">{atsBefore} → {atsAfter}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => printResume(improvePrintRef)}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-orange-500 text-white hover:brightness-110 shadow-md shadow-orange-500/20 flex items-center gap-2"
              >
                <Download className="size-4" /> Export as PDF
              </button>
              <button
                onClick={() => downloadTxt(
                  buildImproveResumeText(acceptedIdx, MOCK_SUGGESTIONS),
                  "resume-improved.txt"
                )}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold surface-2 border border-border text-secondary hover:text-primary flex items-center gap-2"
              >
                <Download className="size-4" /> Save as .txt
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // BUILD NEW RESUME MODE
  // ────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => setMode(null)} className="size-9 rounded-2xl surface border border-border flex items-center justify-center text-muted hover:text-primary transition-colors">
          <ArrowLeft className="size-4" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-primary">Build New Resume</h1>
          <p className="text-xs text-secondary">Fill in your details — AI generates ATS-optimized content for each section</p>
        </div>
      </div>

      {/* Step Progress */}
      <div className="surface border border-border rounded-2xl p-4">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {BUILD_STEPS.map((step, i) => {
            const isActive = step.id === buildStep;
            const isDone = i < stepIdx;
            return (
              <button
                key={step.id}
                onClick={() => setBuildStep(step.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive ? "bg-orange-500 text-white shadow-sm shadow-orange-500/20"
                  : isDone ? "bg-green-500/15 text-green-400 border border-green-500/25"
                  : "surface-2 text-muted border border-border"
                }`}
              >
                {isDone ? <CheckCircle2 className="size-3.5" /> : step.icon}
                {step.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="surface border border-border rounded-3xl p-6 space-y-4">

        {buildStep === "personal" && (
          <>
            <h2 className="font-display text-lg font-extrabold text-primary flex items-center gap-2"><User className="size-5 text-orange-400" /> Personal Information</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              {[
                { label: "Full Name", val: name, set: setName, placeholder: "Bhavesh Rao" },
                { label: "Email", val: email, set: setEmail, placeholder: "you@email.com" },
                { label: "Phone", val: phone, set: setPhone, placeholder: "+91 98765 43210" },
                { label: "LinkedIn URL", val: linkedin, set: setLinkedin, placeholder: "linkedin.com/in/bhavesh" },
                { label: "GitHub URL", val: github, set: setGithub, placeholder: "github.com/bhavesh" },
              ].map((f) => (
                <div key={f.label} className="space-y-1">
                  <label className="font-bold text-primary">{f.label}</label>
                  <input type="text" value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder}
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-primary focus:outline-none focus:border-orange-500/50" />
                </div>
              ))}
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-primary">Professional Summary <span className="text-orange-400">(AI will enhance this)</span></label>
                <textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)}
                  placeholder="e.g. Final-year CSE student with 2 internships in full-stack development..."
                  className="w-full p-3 rounded-xl surface-2 border border-border text-primary focus:outline-none focus:border-orange-500/50" />
              </div>
            </div>
          </>
        )}

        {buildStep === "experience" && (
          <>
            <h2 className="font-display text-lg font-extrabold text-primary flex items-center gap-2"><Briefcase className="size-5 text-orange-400" /> Work Experience & Internships</h2>
            <p className="text-xs text-secondary">Describe each role briefly — AI will rewrite bullets with metrics and keywords.</p>
            <textarea rows={10} value={expText} onChange={(e) => setExpText(e.target.value)}
              placeholder={`SDE Intern — Google (Jun 2024 – Aug 2024)\n- Built a dashboard component\n- Worked on backend APIs\n- Helped fix bugs in production\n\nBackend Intern — Razorpay (Jan 2024 – Mar 2024)\n- Worked on payment gateway integration\n- Wrote unit tests`}
              className="w-full p-4 rounded-xl surface-2 border border-border text-primary text-xs font-mono focus:outline-none focus:border-orange-500/50" />
          </>
        )}

        {buildStep === "education" && (
          <>
            <h2 className="font-display text-lg font-extrabold text-primary flex items-center gap-2"><GraduationCap className="size-5 text-orange-400" /> Education</h2>
            <textarea rows={5} value={eduText} onChange={(e) => setEduText(e.target.value)}
              placeholder={`B.Tech Computer Science — IIT Delhi (2021–2025)\nCGPA: 8.4 / 10\n\n12th — Delhi Public School (2021)\n95.2%`}
              className="w-full p-4 rounded-xl surface-2 border border-border text-primary text-xs font-mono focus:outline-none focus:border-orange-500/50" />
          </>
        )}

        {buildStep === "skills" && (
          <>
            <h2 className="font-display text-lg font-extrabold text-primary flex items-center gap-2"><Code2 className="size-5 text-orange-400" /> Skills & Technologies</h2>
            <p className="text-xs text-secondary">List your skills — AI will group, sort by demand, and add ATS-critical keywords you might be missing.</p>
            <textarea rows={6} value={skillsText} onChange={(e) => setSkillsText(e.target.value)}
              placeholder={`Languages: Python, JavaScript, Java, C++\nFrameworks: React, Node.js, Express\nDatabases: MySQL, MongoDB\nTools: Git, VS Code, Figma`}
              className="w-full p-4 rounded-xl surface-2 border border-border text-primary text-xs font-mono focus:outline-none focus:border-orange-500/50" />
          </>
        )}

        {buildStep === "projects" && (
          <>
            <h2 className="font-display text-lg font-extrabold text-primary flex items-center gap-2"><Award className="size-5 text-orange-400" /> Projects</h2>
            <p className="text-xs text-secondary">Describe your projects briefly — AI rewrites them with stack, scale, and impact language.</p>
            <textarea rows={8} value={projectsText} onChange={(e) => setProjectsText(e.target.value)}
              placeholder={`E-Commerce Website (MERN Stack)\n- Made a shopping website with cart and payment\n- Used React for frontend and Node for backend\n\nML Sentiment Analyzer\n- Built a tool that detects sentiment of tweets using Python`}
              className="w-full p-4 rounded-xl surface-2 border border-border text-primary text-xs font-mono focus:outline-none focus:border-orange-500/50" />
          </>
        )}

        {buildStep === "preview" && !generated && (
          <div className="text-center py-8 space-y-4">
            <div className="size-16 rounded-full bg-orange-500/15 border border-orange-500/25 flex items-center justify-center mx-auto">
              <Sparkles className="size-8 text-orange-400" />
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold text-primary">Ready to Generate!</h2>
              <p className="text-sm text-secondary mt-1">AI will rewrite all your content with ATS-optimized language, strong action verbs, and quantified metrics.</p>
            </div>
            {isGenerating ? (
              <div className="space-y-3">
                <div className="h-2 rounded-full bg-surface-2 overflow-hidden max-w-xs mx-auto">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full animate-pulse w-3/4" />
                </div>
                <p className="text-xs text-muted animate-pulse">AI is crafting your ATS-optimized resume...</p>
              </div>
            ) : (
              <button onClick={handleGenerate}
                className="px-8 py-3 rounded-2xl font-bold text-sm bg-orange-500 text-white hover:brightness-110 shadow-lg shadow-orange-500/25 flex items-center gap-2 mx-auto">
                <Sparkles className="size-4" /> Generate AI Resume
              </button>
            )}
          </div>
        )}

        {buildStep === "preview" && generated && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-primary flex items-center gap-2">
                <CheckCircle2 className="size-5 text-green-400" /> AI Resume Generated!
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/25 px-3 py-1 rounded-full">ATS Score: 91/100</span>
              </div>
            </div>

            {/* Generated Preview */}
            <div className="surface-2 border border-border rounded-2xl p-5 font-mono text-xs leading-relaxed space-y-4 max-h-96 overflow-y-auto">
              <div className="space-y-1">
                <p className="font-bold text-primary text-sm">{name || "Bhavesh Rao"}</p>
                <p className="text-muted">{email || "bhavesh@email.com"} · {phone || "+91 98765 43210"} · {linkedin || "linkedin.com/in/bhavesh"} · {github || "github.com/bhavesh"}</p>
              </div>
              <div>
                <p className="font-bold text-orange-400 uppercase text-[10px] tracking-widest mb-1">Professional Summary</p>
                <p className="text-secondary">{summary || "Results-driven Computer Science engineer with hands-on experience in full-stack development and 2 industry internships. Proficient in React.js, Node.js, Python, and REST API design. Seeking SDE-1 roles at product-focused technology companies."}</p>
              </div>
              <div>
                <p className="font-bold text-orange-400 uppercase text-[10px] tracking-widest mb-1">Experience</p>
                <div className="space-y-2 text-secondary">
                  <div>
                    <p className="text-primary font-bold">SDE Intern — Google · Jun 2024 – Aug 2024</p>
                    <p>• Engineered 3 reusable React.js dashboard components, reducing frontend rendering time by 42% across 2 internal tools used by 1,200+ engineers</p>
                    <p>• Designed 6 RESTful APIs (Node.js/Express) for real-time data sync, handling 15K+ daily requests with 99.7% uptime</p>
                    <p>• Resolved 14 critical production bugs in collaboration with a team of 5 engineers, cutting error rate by 30%</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-bold text-orange-400 uppercase text-[10px] tracking-widest mb-1">Skills</p>
                <p className="text-secondary">{skillsText || "Python · JavaScript (ES6+) · TypeScript · React.js · Node.js · Express · MySQL · PostgreSQL · MongoDB · Docker · Git · REST APIs · System Design · Agile/Scrum · CI/CD · Unit Testing"}</p>
              </div>
            </div>

            {/* Hidden print-ready resume for build mode */}
            <div ref={buildPrintRef} style={{ display: "none" }}>
              <h1>{name || "Bhavesh Rao"}</h1>
              <p className="contact">{email || "bhavesh@email.com"} · {phone || "+91 98765 43210"} · {linkedin || "linkedin.com/in/bhavesh"} · {github || "github.com/bhavesh"}</p>
              <div className="section-title">Professional Summary</div>
              <p>{summary || "Results-driven Computer Science engineer with hands-on experience in full-stack development and 2 industry internships. Proficient in React.js, Node.js, Python, and REST API design. Seeking SDE-1 roles at product-focused technology companies."}</p>
              <div className="section-title">Experience</div>
              <p style={{ whiteSpace: "pre-line" }}>{expText || "SDE Intern — Google · Jun 2024 – Aug 2024\n• Engineered 3 reusable React.js dashboard components, reducing frontend rendering time by 42% across 2 internal tools used by 1,200+ engineers\n• Designed 6 RESTful APIs handling 15K+ daily requests with 99.7% uptime\n• Resolved 14 critical production bugs, cutting error rate by 30%"}</p>
              <div className="section-title">Education</div>
              <p style={{ whiteSpace: "pre-line" }}>{eduText || "B.Tech Computer Science — IIT Delhi (2021–2025) | CGPA: 8.4/10"}</p>
              <div className="section-title">Skills</div>
              <p>{skillsText || "Python · JavaScript (ES6+) · TypeScript · React.js · Node.js · Express · MySQL · PostgreSQL · MongoDB · Docker · Git · REST APIs · System Design · Agile/Scrum · CI/CD · Unit Testing"}</p>
              <div className="section-title">Projects</div>
              <p style={{ whiteSpace: "pre-line" }}>{projectsText || "E-Commerce Platform (MERN)\n• Full-stack shopping platform with JWT auth, Razorpay integration, supporting 500+ concurrent users"}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => printResume(buildPrintRef)}
                className="flex-1 px-5 py-3 rounded-2xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                <Download className="size-4" /> Export as PDF
              </button>
              <button
                onClick={() => downloadTxt(
                  buildNewResumeText({ name, email, phone, linkedin, github, summary, expText, eduText, skillsText, projectsText }),
                  "resume-new.txt"
                )}
                className="px-5 py-3 rounded-2xl font-bold text-xs surface-2 border border-border text-secondary hover:text-primary flex items-center gap-2"
              >
                <Download className="size-4" /> Save as .txt
              </button>
              <button
                onClick={() => { setGenerated(false); setBuildStep("personal"); }}
                className="px-5 py-3 rounded-2xl font-bold text-xs surface-2 border border-border text-secondary hover:text-primary flex items-center gap-2"
              >
                <RotateCcw className="size-4" /> Start Over
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {buildStep !== "preview" && (
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <button
              onClick={() => setBuildStep(BUILD_STEPS[Math.max(0, stepIdx - 1)].id)}
              disabled={stepIdx === 0}
              className="px-4 py-2.5 rounded-xl text-xs font-bold surface-2 border border-border text-secondary disabled:opacity-40 flex items-center gap-1.5"
            >
              <ArrowLeft className="size-3.5" /> Previous
            </button>
            <button
              onClick={() => setBuildStep(BUILD_STEPS[Math.min(BUILD_STEPS.length - 1, stepIdx + 1)].id)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-orange-500 text-white hover:brightness-110 flex items-center gap-1.5"
            >
              Next Step <ChevronRight className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
