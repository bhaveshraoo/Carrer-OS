"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Video,
  Sparkles,
  Briefcase,
  Zap,
  ShieldCheck,
  ArrowRight,
  FileText,
  Code2,
  Brain,
  Globe,
  Layers,
  Pencil,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Upload,
} from "lucide-react";

// ─── Predefined Role Cards ─────────────────────────────────────────────────
const ROLE_PRESETS = [
  {
    id: "web-dev",
    label: "Web Dev / Fullstack",
    icon: <Globe className="size-5 text-teal-500" />,
    color: "from-teal-500/15 to-teal-500/5 border-teal-500/30",
    activeColor: "from-teal-600 to-teal-500",
    jobRole: "Fullstack Software Engineer",
    techStack: "React, Next.js, Node.js, TypeScript, PostgreSQL, REST APIs",
    jobDescription:
      "Build and maintain high-performance fullstack web applications using React and Next.js on the frontend and Node.js / Express on the backend. Collaborate with product teams to deliver real-time features, optimize database queries, and ensure a seamless user experience at scale.",
  },
  {
    id: "dsa",
    label: "DSA / Competitive",
    icon: <Code2 className="size-5 text-amber-500" />,
    color: "from-amber-500/15 to-amber-500/5 border-amber-500/30",
    activeColor: "from-amber-500 to-orange-500",
    jobRole: "Software Development Engineer (SDE)",
    techStack: "Data Structures, Algorithms, Dynamic Programming, Graphs, Trees, C++, Java, Python",
    jobDescription:
      "Demonstrate strong command of Data Structures and Algorithms including Arrays, Strings, Trees, Graphs, Dynamic Programming, Recursion, and Greedy algorithms. Solve medium-to-hard competitive coding problems with optimal time and space complexity.",
  },
  {
    id: "ai-ml",
    label: "AI / ML Engineer",
    icon: <Brain className="size-5 text-purple-500" />,
    color: "from-purple-500/15 to-purple-500/5 border-purple-500/30",
    activeColor: "from-purple-600 to-purple-500",
    jobRole: "Machine Learning Engineer",
    techStack: "Python, TensorFlow, PyTorch, scikit-learn, LangChain, RAG, LLMs, MLOps, SQL",
    jobDescription:
      "Design and deploy production-grade ML models and LLM-based applications. Build RAG pipelines, fine-tune foundation models, and integrate AI features into scalable cloud infrastructure. Strong understanding of model evaluation metrics, data preprocessing, and MLOps best practices.",
  },
  {
    id: "system-design",
    label: "System Design / Backend",
    icon: <Layers className="size-5 text-indigo-500" />,
    color: "from-indigo-500/15 to-indigo-500/5 border-indigo-500/30",
    activeColor: "from-indigo-600 to-indigo-500",
    jobRole: "Senior Backend / Infrastructure Engineer",
    techStack: "Java, Spring Boot, Microservices, Kafka, Redis, PostgreSQL, Docker, Kubernetes, AWS",
    jobDescription:
      "Architect and build high-throughput, fault-tolerant distributed backend services. Design system architecture for real-time event-driven platforms, implement API gateways, message queues, caching layers, and ensure horizontal scalability and 99.99% uptime SLAs.",
  },
  {
    id: "custom",
    label: "Custom Role",
    icon: <Pencil className="size-5 text-rose-400" />,
    color: "from-rose-500/10 to-rose-500/5 border-rose-500/25",
    activeColor: "from-rose-600 to-rose-500",
    jobRole: "",
    techStack: "",
    jobDescription: "",
  },
];

const PERSONALITIES = [
  { id: "Friendly Recruiter", name: "Friendly Recruiter", icon: "🤝", desc: "Warm, encouraging, probes soft skills and culture fit.", badge: "High Support" },
  { id: "Professional HR", name: "Professional HR", icon: "👔", desc: "Structured, calm, evaluates behavioral scenarios & STAR framework.", badge: "Standard HR" },
  { id: "Strict Engineering Manager", name: "Strict Engineering Manager", icon: "⚡", desc: "Direct, challenges hand-waving, demands exact trade-offs & edge cases.", badge: "High Rigor" },
  { id: "Startup Founder", name: "Startup Founder", icon: "🚀", desc: "Fast-paced, pragmatic, tests ownership, speed, and bias for action.", badge: "Pragmatic" },
  { id: "Senior FAANG Engineer", name: "Senior FAANG Engineer", icon: "🏢", desc: "Deep CS fundamentals, algorithm speed, and large scale architecture.", badge: "Bar Raiser" },
];

// ─── Interview Tips (shown on generation waiting page) ─────────────────────
const INTERVIEW_TIPS = [
  { emoji: "🎯", tip: "Use the STAR method — Situation, Task, Action, Result — for every behavioral question." },
  { emoji: "⏱️", tip: "For DSA problems, always state your brute-force approach before jumping to the optimal solution." },
  { emoji: "💬", tip: "Think out loud. Interviewers evaluate your reasoning process, not just the final answer." },
  { emoji: "📊", tip: "Quantify your impact with numbers: 'reduced latency by 40%' beats 'improved performance'." },
  { emoji: "🔍", tip: "Ask clarifying questions before coding — it shows a mature engineering mindset." },
  { emoji: "🧘", tip: "Pause and breathe if you are stuck. A calm composed answer always scores higher." },
  { emoji: "🚀", tip: "Mention trade-offs in system design — scalability vs consistency, latency vs throughput." },
  { emoji: "📝", tip: "Always recap your answer at the end: 'So to summarize, my approach handles X by doing Y'." },
  { emoji: "🤝", tip: "Match the interviewer's energy. Mirror formal tone with formality, casual with openness." },
  { emoji: "🧠", tip: "For ML interviews, know your evaluation metrics — F1, AUC-ROC, precision vs recall trade-offs." },
];

// ─── Generation Waiting Page ───────────────────────────────────────────────
function GeneratingPage({ jobRole, companyName }: { jobRole: string; companyName: string }) {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [stage, setStage] = useState("Analyzing your resume and role requirements...");

  const STAGES = [
    "Analyzing your resume and role requirements...",
    "Building personalized question blueprint with Gemini...",
    "Calibrating difficulty and interview format...",
    "Generating targeted technical & behavioral questions...",
    "Preparing interviewer personality profile...",
    "Finalizing your AI interview session...",
  ];

  useEffect(() => {
    // Animate progress from 0 to ~92% (real navigation takes it to 100)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) { clearInterval(interval); return 92; }
        return prev + Math.random() * 3.5;
      });
    }, 400);

    // Cycle tips every 4s
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % INTERVIEW_TIPS.length);
    }, 4000);

    // Cycle stages
    let stageIdx = 0;
    const stageInterval = setInterval(() => {
      stageIdx = Math.min(stageIdx + 1, STAGES.length - 1);
      setStage(STAGES[stageIdx]);
    }, 2800);

    return () => { clearInterval(interval); clearInterval(tipInterval); clearInterval(stageInterval); };
  }, []);

  const tip = INTERVIEW_TIPS[tipIndex];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center max-w-2xl mx-auto px-4 space-y-10 animate-fade-in">
      {/* Logo / Pulse Animation */}
      <div className="relative flex items-center justify-center">
        <div className="absolute size-32 rounded-full bg-teal-500/10 animate-ping" />
        <div className="absolute size-24 rounded-full bg-teal-500/15 animate-pulse" />
        <div className="relative size-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-teal-500/30">
          <Brain className="size-9 text-white animate-pulse" />
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Preparing Your Interview
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          <span className="text-teal-600 dark:text-teal-400 font-bold">{jobRole}</span>
          {" "}at{" "}
          <span className="text-foreground font-bold">{companyName}</span>
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-muted-foreground">{stage}</span>
          <span className="text-teal-600 dark:text-teal-400 font-mono">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-muted border border-border overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-1">
          {["Resume", "Blueprint", "Difficulty", "Questions", "Persona", "Finalizing"].map((s, i) => (
            <div key={s} className="text-center">
              <div className={`h-1 rounded-full mb-1 transition-all duration-500 ${progress >= (i + 1) * 15 ? "bg-teal-500" : "bg-muted"}`} />
              <p className="text-[8px] text-muted-foreground font-medium truncate">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tip Card — animates every 4s */}
      <div
        key={tipIndex}
        className="w-full p-5 rounded-2xl bg-card border border-teal-500/20 shadow-xs space-y-2 animate-fade-in"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
          <Zap className="size-3.5" /> Interview Pro Tip
        </p>
        <p className="text-sm font-semibold text-foreground leading-relaxed">
          {tip.emoji} {tip.tip}
        </p>
      </div>

      {/* Ground Rules */}
      <div className="w-full p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Interview Ground Rules</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            "Speak clearly — the AI transcribes your voice in real-time",
            "Answer in 60-120 seconds per question for best scoring",
            "No browser tab switching — it affects your focus score",
            "Use technical terminology relevant to the role",
            "It is okay to pause and think before answering",
            "Mic permission is required — no video is recorded",
          ].map((rule, i) => (
            <div key={i} className="flex items-start gap-2 text-muted-foreground font-medium">
              <CheckCircle2 className="size-3.5 text-teal-500 shrink-0 mt-0.5" />
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function InterviewConfigPage() {
  const router = useRouter();

  // Role preset state
  const [selectedPreset, setSelectedPreset] = useState("web-dev");
  const [jobRole, setJobRole] = useState(ROLE_PRESETS[0].jobRole);
  const [companyName, setCompanyName] = useState("Google");
  const [experience, setExperience] = useState("2-4 years");
  const [jobDescription, setJobDescription] = useState(ROLE_PRESETS[0].jobDescription);
  const [techStackInput, setTechStackInput] = useState(ROLE_PRESETS[0].techStack);

  // Round config
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [interviewType, setInterviewType] = useState<"HR" | "Technical" | "DSA" | "System Design" | "Mixed">("Technical");
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [personality, setPersonality] = useState("Professional HR");

  // Resume state
  const [resume, setResume] = useState<{ id: string; file_name: string; status: string; ats_score?: number | null } | null>(null);
  const [resumeLoading, setResumeLoading] = useState(true);

  // Generation state
  const [generating, setGenerating] = useState(false);

  // Fetch user's latest resume
  useEffect(() => {
    async function loadResume() {
      try {
        const res = await fetch("/api/resume/analyze");
        const data = await res.json();
        if (data?.resume) {
          setResume({
            id: data.resume.id,
            file_name: data.resume.file_name,
            status: data.resume.status,
            ats_score: data.ats_score ?? null,
          });
        }
      } catch {
        // No resume uploaded yet — silent
      } finally {
        setResumeLoading(false);
      }
    }
    loadResume();
  }, []);

  // When preset changes, auto-fill fields
  const handlePresetSelect = (presetId: string) => {
    const preset = ROLE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPreset(presetId);
    if (presetId !== "custom") {
      setJobRole(preset.jobRole);
      setTechStackInput(preset.techStack);
      setJobDescription(preset.jobDescription);
    }
  };

  const handleStartInterview = async () => {
    if (!jobRole.trim() || !companyName.trim()) return;
    setGenerating(true);

    const tech_stack = techStackInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_role: jobRole,
          company_name: companyName,
          job_description: jobDescription,
          experience,
          tech_stack,
          difficulty,
          interview_type: interviewType,
          duration_minutes: durationMinutes,
          language: "English",
          personality,
          resume_id: resume?.id ?? null,
        }),
      });

      const data = await res.json();
      if (data.success && data.sessionId) {
        router.push(`/dashboard/interview/${data.sessionId}`);
      } else {
        alert(data.error || "Failed to start interview session");
        setGenerating(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error starting interview session");
      setGenerating(false);
    }
  };

  // Show generation waiting page
  if (generating) {
    return <GeneratingPage jobRole={jobRole} companyName={companyName} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header Banner (Matches Projects page surface hero card aesthetic) */}
      <div className="relative overflow-hidden p-8 md:p-10 rounded-3xl surface border border-orange-500/30 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
          <Video className="size-3.5 text-orange-500" /> Production-Grade AI Interview Simulator
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
          AI Mock Interview <span className="text-orange-500">Engine</span>
        </h1>
        <p className="text-sm text-secondary leading-relaxed max-w-2xl font-medium">
          Pick a role preset or build a custom interview. Speak naturally and receive a recruiter-grade evaluation with a personalized learning roadmap.
        </p>
        <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-secondary">
          <span className="flex items-center gap-1.5 text-primary font-bold">
            <ShieldCheck className="size-4 text-teal-500" /> 100% Local Privacy (No Video Stored)
          </span>
          <span className="flex items-center gap-1.5 text-primary font-bold">
            <Zap className="size-4 text-orange-500" /> Voice-First Realtime Interaction
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Left Column ── */}
        <div className="lg:col-span-8 space-y-6">

          {/* ── STEP 1: Role Preset Cards ── */}
          <div className="p-6 sm:p-8 rounded-3xl surface border border-border shadow-xs space-y-5">
            <h2 className="font-display text-base font-extrabold text-primary flex items-center gap-2 border-b border-border pb-3">
              <Briefcase className="size-4 text-orange-500" /> Step 1 — Choose Your Interview Role
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ROLE_PRESETS.map((preset) => {
                const isActive = selectedPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetSelect(preset.id)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 space-y-2 relative group cursor-pointer ${
                      isActive
                        ? `bg-orange-500/10 border-2 border-orange-500 shadow-md scale-[1.02]`
                        : `surface-2 border-border hover:border-orange-500/40 hover:scale-[1.01]`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {preset.icon}
                      {isActive && (
                        <span className="size-5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs">
                          <CheckCircle2 className="size-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-extrabold text-primary leading-tight">{preset.label}</p>
                  </button>
                );
              })}
            </div>

            {/* Auto-filled / editable fields */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="target-job-role" className="text-xs font-bold text-primary">
                    Job Role *
                    {selectedPreset !== "custom" && (
                      <span className="ml-2 text-[9px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/30">
                        Auto-filled
                      </span>
                    )}
                  </label>
                  <input
                    id="target-job-role"
                    type="text"
                    required
                    value={jobRole}
                    onChange={(e) => { setJobRole(e.target.value); setSelectedPreset("custom"); }}
                    placeholder="e.g. Senior Backend Engineer"
                    className="w-full px-4 py-2.5 rounded-xl surface-2 border border-border text-primary text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="target-company-name" className="text-xs font-bold text-primary">Target Company *</label>
                  <input
                    id="target-company-name"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Google, Stripe, Meesho"
                    className="w-full px-4 py-2.5 rounded-xl surface-2 border border-border text-primary text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="experience-level" className="text-xs font-bold text-primary">Experience Level</label>
                  <select
                    id="experience-level"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl surface-2 border border-border text-primary text-xs font-bold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value="Fresher / 0-1 years">Fresher / 0-1 years</option>
                    <option value="2-4 years">2-4 years (Mid Level)</option>
                    <option value="5-8 years">5-8 years (Senior)</option>
                    <option value="8+ years">8+ years (Staff / Lead)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="required-tech-stack" className="text-xs font-bold text-primary">
                    Required Tech Stack
                    {selectedPreset !== "custom" && (
                      <span className="ml-2 text-[9px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/30">
                        Auto-filled
                      </span>
                    )}
                  </label>
                  <input
                    id="required-tech-stack"
                    type="text"
                    value={techStackInput}
                    onChange={(e) => { setTechStackInput(e.target.value); setSelectedPreset("custom"); }}
                    placeholder="Comma separated skills..."
                    className="w-full px-4 py-2.5 rounded-xl surface-2 border border-border text-primary text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="job-description-excerpt" className="text-xs font-bold text-primary">
                  Job Description / Requirements
                  {selectedPreset !== "custom" && (
                    <span className="ml-2 text-[9px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/30">
                      Auto-filled
                    </span>
                  )}
                </label>
                <textarea
                  id="job-description-excerpt"
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => { setJobDescription(e.target.value); setSelectedPreset("custom"); }}
                  placeholder="Paste key responsibilities & role requirements..."
                  className="w-full px-4 py-2.5 rounded-xl surface-2 border border-border text-primary text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>

          {/* ── STEP 2: Resume Section ── */}
          <div className="p-6 sm:p-8 rounded-3xl surface border border-border shadow-xs space-y-4">
            <h2 className="font-display text-base font-extrabold text-primary flex items-center gap-2 border-b border-border pb-3">
              <FileText className="size-4 text-orange-500" /> Step 2 — Your Resume (Used for Interview Calibration)
            </h2>

            {resumeLoading ? (
              <div className="flex items-center gap-3 p-4 rounded-2xl surface-2 animate-pulse">
                <div className="size-10 rounded-xl bg-border" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-48 bg-border rounded" />
                  <div className="h-3 w-24 bg-border rounded" />
                </div>
              </div>
            ) : resume ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-primary">{resume.file_name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-teal-400 flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        {resume.status === "analyzed" ? "Analyzed" : "Uploaded"}
                      </span>
                      {resume.ats_score && (
                        <span className="text-[10px] font-extrabold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                          ATS Score: {resume.ats_score} / 100
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  href="/dashboard/resume"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-primary border border-border px-3 py-1.5 rounded-xl surface-2 transition-all shrink-0"
                >
                  <Upload className="size-3.5" /> Upload New Resume
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-2xl bg-orange-500/15 text-orange-500 flex items-center justify-center shrink-0">
                    <AlertCircle className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-primary">No Resume Uploaded</p>
                    <p className="text-[11px] text-muted font-medium mt-0.5">Upload your resume so Gemini can tailor questions to your specific experience.</p>
                  </div>
                </div>
                <Link
                  href="/dashboard/resume"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl transition-all shadow-md shadow-orange-500/20 shrink-0"
                >
                  <Upload className="size-3.5" /> Upload Resume
                </Link>
              </div>
            )}

            <p className="text-[11px] text-muted font-medium">
              Your resume is used to personalise questions based on your projects, skills, and experience. It is never shared with third parties.
            </p>
          </div>

          {/* ── STEP 3: Round Format & Difficulty ── */}
          <div className="p-6 sm:p-8 rounded-3xl surface border border-border shadow-xs space-y-6">
            <h2 className="font-display text-base font-extrabold text-primary flex items-center gap-2 border-b border-border pb-3">
              <Sparkles className="size-4 text-orange-500" /> Step 3 — Format, Duration & Rigor
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary">Interview Round Type</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl surface-2 border border-border text-primary text-xs font-bold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="Technical">Technical System Round</option>
                  <option value="HR">Behavioral / HR Culture</option>
                  <option value="DSA">Data Structures &amp; Algorithms</option>
                  <option value="System Design">High Level System Design</option>
                  <option value="Mixed">Mixed Bar Raiser Round</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary">Difficulty Level</label>
                <div className="flex rounded-xl surface-2 p-1 border border-border">
                  {(["Easy", "Medium", "Hard"] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                        difficulty === d ? "bg-orange-500 text-white shadow-xs" : "text-muted hover:text-primary"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary">Session Duration</label>
                <div className="flex rounded-xl surface-2 p-1 border border-border">
                  {[15, 30, 45].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDurationMinutes(m)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                        durationMinutes === m ? "bg-orange-500 text-white shadow-xs" : "text-muted hover:text-primary"
                      }`}
                    >
                      {m} min
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Personality Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-primary">Interviewer Personality Profile</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PERSONALITIES.map((p) => {
                  const isSelected = personality === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setPersonality(p.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                        isSelected
                          ? "bg-orange-500/10 border-orange-500 shadow-xs ring-1 ring-orange-500/30"
                          : "surface-2 border-border hover:border-orange-500/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-primary flex items-center gap-1.5">
                          <span>{p.icon}</span> {p.name}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full surface border border-border text-muted">
                          {p.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed font-medium">{p.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleStartInterview}
            disabled={!jobRole.trim() || !companyName.trim()}
            className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Video className="size-4" /> Generate Interview &amp; Start Simulation <ArrowRight className="size-4" />
          </button>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-3xl surface border border-border shadow-xs space-y-4">
            <h3 className="font-display text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-2">
              <Zap className="size-4 text-orange-500" /> How It Works
            </h3>
            <div className="space-y-3 text-xs">
              {[
                { n: 1, title: "Pick a Role Preset", desc: "Select Web Dev, DSA, AI/ML, or System Design — fields auto-fill. Or customise everything manually." },
                { n: 2, title: "Resume Calibration", desc: "Gemini reads your uploaded resume to tailor every question to your actual experience and projects." },
                { n: 3, title: "Speak Naturally", desc: "Real-time voice transcription. The AI interviewer follows up based on your answers." },
                { n: 4, title: "Get Your Report", desc: "Receive an Executive Recruiter report with ATS score analysis, hiring recommendation, and roadmap." },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex items-start gap-3">
                  <span className="size-6 rounded-full bg-orange-500/15 text-orange-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-orange-500/30">{n}</span>
                  <div>
                    <p className="font-bold text-primary">{title}</p>
                    <p className="text-muted leading-relaxed mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interview tips teaser */}
          <div className="p-5 rounded-3xl surface border border-border shadow-xs space-y-3">
            <h3 className="font-display text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-2">
              <Brain className="size-4 text-purple-500" /> Quick Interview Tips
            </h3>
            <div className="space-y-2">
              {INTERVIEW_TIPS.slice(0, 4).map((t, i) => (
                <p key={i} className="text-xs text-muted leading-relaxed">
                  {t.emoji} {t.tip}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
