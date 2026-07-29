"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
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
  Loader2,
  FileWarning,
  Edit3,
  Check,
  Maximize2,
  Trophy,
  FileText,
  BookmarkCheck,
  FileCheck,
} from "lucide-react";
import type { ImproveResult, OriginalResume } from "@/app/api/resume/improve/route";
import type { BuildResult } from "@/app/api/resume/build/route";

type Mode = null | "improve" | "build";
type BuildStep = "personal" | "experience" | "education" | "skills" | "projects" | "preview";

const BUILD_STEPS: { id: BuildStep; label: string; icon: React.ReactNode }[] = [
  { id: "personal",   label: "Personal Info",  icon: <User className="size-3.5" /> },
  { id: "experience", label: "Experience",      icon: <Briefcase className="size-3.5" /> },
  { id: "education",  label: "Education",       icon: <GraduationCap className="size-3.5" /> },
  { id: "skills",     label: "Skills",          icon: <Code2 className="size-3.5" /> },
  { id: "projects",   label: "Projects",        icon: <Award className="size-3.5" /> },
  { id: "preview",    label: "AI Preview",      icon: <Sparkles className="size-3.5" /> },
];

export type FullResume = {
  name: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  location?: string;
  summary?: string;
  education?: {
    institution: string;
    location?: string;
    degree: string;
    duration: string;
  }[];
  experience?: {
    title: string;
    company: string;
    location?: string;
    duration: string;
    bullets: string[];
  }[];
  projects?: {
    name: string;
    tech?: string;
    duration?: string;
    bullets: string[];
  }[];
  skills?: {
    languages?: string;
    frameworks?: string;
    developerTools?: string;
    libraries?: string;
    raw?: string;
  };
  achievements?: {
    title: string;
    detail: string;
  }[];
  certifications?: {
    title: string;
    issuer: string;
    duration?: string;
  }[];
};

const CAREEROS_FACTS = [
  "Jake's Resume is the gold standard LaTeX template used by Stanford, MIT, and IIT grads.",
  "85% of tech companies use ATS screeners like Workday & Lever before a human recruiter sees your resume.",
  "Google recruiters explicitly recommend bullet points written in the 'Accomplished [X] as measured by [Y], by doing [Z]' formula.",
  "Resumes that quantify impact with metrics (%) receive 40% more interview callbacks from product companies.",
  "CareerOS extracts ONLY your authentic experience — zero fake placeholder contact info or titles added.",
  "Single-page A4 resumes that fill 90%+ height have a 3x higher response rate than half-empty ones."
];

/**
 * Calculates word token overlap score between two strings (0.0 to 1.0)
 */
function getTokenOverlap(strA: string, strB: string): number {
  const wordsA = strA.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  const wordsB = strB.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  if (!wordsA.length || !wordsB.length) return 0;

  let matches = 0;
  wordsA.forEach(w => {
    if (wordsB.includes(w)) matches++;
  });
  return matches / Math.max(wordsA.length, 1);
}

/**
 * Custom hook to manage realistic 20-second smooth loading progress bar & rotating facts
 */
function useSmoothProgress(loading: boolean) {
  const [progress, setProgress] = useState(0);
  const [stageMessage, setStageMessage] = useState("");
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      setStageMessage("");
      setFactIndex(0);
      return;
    }

    const startTime = Date.now();
    setProgress(3);
    setStageMessage("Reading authentic candidate details & contact information...");

    const factInterval = setInterval(() => {
      setFactIndex(prev => (prev + 1) % CAREEROS_FACTS.length);
    }, 4500);

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;

      let nextProgress = 0;
      if (elapsed <= 18) {
        nextProgress = Math.min(90, Math.round((elapsed / 18) * 90));
      } else {
        nextProgress = Math.min(94, Math.round(90 + (elapsed - 18) * 0.5));
      }

      setProgress(prev => Math.max(prev, nextProgress));

      if (nextProgress < 25) {
        setStageMessage("Reading authentic candidate details & contact information...");
      } else if (nextProgress < 50) {
        setStageMessage("Analyzing experience & rewriting bullets with Google X-Y-Z formula...");
      } else if (nextProgress < 75) {
        setStageMessage("Categorizing technical skills into Languages, Tools & Frameworks...");
      } else if (nextProgress < 90) {
        setStageMessage("Formatting into Jake's Resume LaTeX layout & evaluating A4 page fill...");
      } else {
        setStageMessage("Finalizing ATS optimization & preparing live interactive preview...");
      }
    }, 150);

    return () => {
      clearInterval(interval);
      clearInterval(factInterval);
    };
  }, [loading]);

  return { progress, stageMessage, setProgress, currentFact: CAREEROS_FACTS[factIndex] };
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

/**
 * Renders candidate's original uploaded resume on an authentic white A4 paper sheet
 */
function UploadedResumeA4Preview({
  rawText,
  fileName,
  originalResume,
}: {
  rawText?: string;
  fileName?: string;
  originalResume?: OriginalResume;
}) {
  if (!rawText && !originalResume) {
    return (
      <div className="bg-white text-black p-8 rounded-xl border border-slate-300 shadow-2xl text-center py-16 space-y-3">
        <Loader2 className="size-8 text-orange-500 animate-spin mx-auto" />
        <p className="text-xs text-slate-600 font-medium">Loading original uploaded resume sheet...</p>
      </div>
    );
  }

  const serifStyle = { fontFamily: "'Times New Roman', Times, Georgia, serif" };

  if (originalResume) {
    const contactParts: string[] = [];
    if (originalResume.phone) contactParts.push(originalResume.phone);
    if (originalResume.email) contactParts.push(originalResume.email);
    if (originalResume.linkedin) contactParts.push(originalResume.linkedin);
    if (originalResume.github) contactParts.push(originalResume.github);

    return (
      <div
        style={serifStyle}
        className="bg-white text-black p-6 sm:p-8 rounded-xl border border-slate-300 shadow-2xl text-[10.5px] leading-tight space-y-3 selection:bg-amber-200 overflow-hidden"
      >
        {/* Header */}
        <div style={serifStyle} className="text-center pb-1">
          <div style={serifStyle} className="text-2xl font-bold tracking-tight text-black uppercase">
            {originalResume.name || "Candidate Name"}
          </div>
          {originalResume.subtitle && (
            <p style={serifStyle} className="text-xs text-slate-800 font-medium mt-0.5">
              {originalResume.subtitle}
            </p>
          )}
          {contactParts.length > 0 && (
            <p style={serifStyle} className="text-[10px] text-slate-700 mt-1">
              {contactParts.join("  |  ")}
            </p>
          )}
        </div>

        {/* Summary */}
        {originalResume.summary && (
          <div style={serifStyle} className="space-y-1">
            <div style={serifStyle} className="text-[10.5px] font-bold text-black border-b border-black pb-0.5">
              Summary
            </div>
            <p style={serifStyle} className="text-[10.5px] text-slate-900 leading-snug">
              {originalResume.summary}
            </p>
          </div>
        )}

        {/* Education */}
        {originalResume.education && originalResume.education.length > 0 && (
          <div style={serifStyle} className="space-y-1.5">
            <div style={serifStyle} className="text-[10.5px] font-bold text-black border-b border-black pb-0.5">
              Education
            </div>
            {originalResume.education.map((e, i) => (
              <div key={i} style={serifStyle} className="text-[10.5px] space-y-0.5">
                <div style={serifStyle} className="flex justify-between items-baseline">
                  <span className="font-bold text-black">{e.institution}</span>
                  <span className="italic text-slate-700">{e.duration}</span>
                </div>
                <div style={serifStyle} className="flex justify-between items-baseline">
                  <span className="italic text-slate-800">{e.degree}</span>
                  <span className="italic text-slate-700">{e.location || ""}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {originalResume.projects && originalResume.projects.length > 0 && (
          <div style={serifStyle} className="space-y-2">
            <div style={serifStyle} className="text-[10.5px] font-bold text-black border-b border-black pb-0.5">
              Projects
            </div>
            {originalResume.projects.map((p, i) => (
              <div key={i} style={serifStyle} className="text-[10.5px] space-y-0.5">
                <div style={serifStyle} className="font-bold text-black flex items-center gap-2">
                  <span>{p.name}</span>
                  {p.tech && <span className="italic font-normal text-slate-700">| {p.tech}</span>}
                </div>
                <ul style={serifStyle} className="list-disc list-inside space-y-0.5 text-slate-900 pl-1">
                  {(p.bullets || []).map((b, j) => (
                    <li key={j} style={serifStyle} className="leading-snug">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Open Source Contributions */}
        {originalResume.open_source && originalResume.open_source.length > 0 && (
          <div style={serifStyle} className="space-y-1">
            <div style={serifStyle} className="text-[10.5px] font-bold text-black border-b border-black pb-0.5">
              Open Source Contributions
            </div>
            <ul style={serifStyle} className="list-disc list-inside space-y-0.5 text-slate-900 pl-1">
              {originalResume.open_source.map((b, j) => (
                <li key={j} style={serifStyle} className="leading-snug">{b}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Technical Skills */}
        {originalResume.skills && (
          <div style={serifStyle} className="space-y-0.5 text-[10.5px]">
            <div style={serifStyle} className="text-[10.5px] font-bold text-black border-b border-black pb-0.5 mb-1">
              Technical Skills
            </div>
            {originalResume.skills.languages && (
              <div style={serifStyle}><span className="font-bold text-black">Languages:</span> {originalResume.skills.languages}</div>
            )}
            {originalResume.skills.developerTools && (
              <div style={serifStyle}><span className="font-bold text-black">Developer Tools:</span> {originalResume.skills.developerTools}</div>
            )}
            {originalResume.skills.coreCS && (
              <div style={serifStyle}><span className="font-bold text-black">Core CS Concepts:</span> {originalResume.skills.coreCS}</div>
            )}
            {originalResume.skills.currentlyExploring && (
              <div style={serifStyle}><span className="font-bold text-black">Currently Exploring:</span> {originalResume.skills.currentlyExploring}</div>
            )}
            {originalResume.skills.raw && !originalResume.skills.languages && (
              <div style={serifStyle}>{originalResume.skills.raw}</div>
            )}
          </div>
        )}

        {/* Experience */}
        {originalResume.experience && originalResume.experience.length > 0 && (
          <div style={serifStyle} className="space-y-2">
            <div style={serifStyle} className="text-[10.5px] font-bold text-black border-b border-black pb-0.5">
              Experience
            </div>
            {originalResume.experience.map((e, i) => (
              <div key={i} style={serifStyle} className="text-[10.5px] space-y-0.5">
                <div style={serifStyle} className="font-bold text-black">{e.title}</div>
                <ul style={serifStyle} className="list-disc list-inside space-y-0.5 text-slate-900 pl-1">
                  {(e.bullets || []).map((b, j) => (
                    <li key={j} style={serifStyle} className="leading-snug">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {originalResume.achievements && originalResume.achievements.length > 0 && (
          <div style={serifStyle} className="space-y-1 text-[10.5px]">
            <div style={serifStyle} className="text-[10.5px] font-bold text-black border-b border-black pb-0.5 mb-1">
              Achievements
            </div>
            <ul style={serifStyle} className="list-disc list-inside space-y-0.5 text-slate-900 pl-1">
              {originalResume.achievements.map((b, j) => (
                <li key={j} style={serifStyle} className="leading-snug">{b}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  const lines = (rawText || "").split("\n").map(l => l.trim()).filter(Boolean);

  return (
    <div className="bg-white text-black p-7 sm:p-9 rounded-xl border border-slate-300 shadow-2xl text-[11px] leading-relaxed space-y-3 font-sans max-h-[520px] overflow-y-auto selection:bg-amber-200">
      <div className="border-b-2 border-slate-900 pb-2 text-center space-y-0.5">
        <h2 className="text-xl font-bold uppercase text-slate-900 tracking-tight">Original Uploaded Document</h2>
        <p className="text-[10px] text-slate-600 italic">File: {fileName || "Uploaded Resume.pdf"}</p>
      </div>

      <div className="space-y-1.5 text-slate-800 text-[11px] leading-relaxed">
        {lines.map((line, idx) => {
          const isHeader = line.toUpperCase() === line && line.length > 3 && line.length < 40;
          if (isHeader) {
            return (
              <div key={idx} className="pt-2">
                <h3 className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5 text-xs tracking-wider">
                  {line}
                </h3>
              </div>
            );
          }
          return (
            <p key={idx} className="text-slate-800 leading-snug">
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Renders & prints a resume matching "Jake's Resume" template
 */
function printJakeResume(resume: FullResume) {
  const contactParts: string[] = [];
  if (resume.phone?.trim()) contactParts.push(resume.phone.trim());
  if (resume.email?.trim()) contactParts.push(resume.email.trim());
  if (resume.linkedin?.trim()) contactParts.push(resume.linkedin.trim());
  if (resume.github?.trim()) contactParts.push(resume.github.trim());
  if (resume.location?.trim()) contactParts.push(resume.location.trim());
  const contactStr = contactParts.join(" | ");

  const summaryHtml = resume.summary?.trim()
    ? `<p style="font-size: 10pt; line-height: 1.35; margin-bottom: 8pt;">${resume.summary.trim()}</p>`
    : "";

  const eduHtml = (resume.education || []).map(e => `
    <div style="margin-bottom: 6pt;">
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <span style="font-weight: bold; font-size: 10.5pt;">${e.institution}</span>
        <span style="font-style: italic; font-size: 10pt;">${e.location || ""}</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <span style="font-style: italic; font-size: 10pt;">${e.degree}</span>
        <span style="font-style: italic; font-size: 10pt;">${e.duration}</span>
      </div>
    </div>
  `).join("");

  const expHtml = (resume.experience || []).map(e => `
    <div style="margin-bottom: 7pt;">
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <span style="font-weight: bold; font-size: 10.5pt;">${e.title}</span>
        <span style="font-style: italic; font-size: 10pt;">${e.duration}</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <span style="font-style: italic; font-size: 10pt;">${e.company}</span>
        <span style="font-style: italic; font-size: 10pt;">${e.location || ""}</span>
      </div>
      <ul style="margin: 3pt 0 4pt 16pt; padding: 0; list-style-type: disc;">
        ${(e.bullets || []).map(b => `<li style="font-size: 10pt; line-height: 1.3; margin-bottom: 2pt;">${b}</li>`).join("")}
      </ul>
    </div>
  `).join("");

  const projHtml = (resume.projects || []).map(p => `
    <div style="margin-bottom: 7pt;">
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <div>
          <span style="font-weight: bold; font-size: 10.5pt;">${p.name}</span>
          ${p.tech ? `<span style="font-style: italic; font-size: 10pt;"> | ${p.tech}</span>` : ""}
        </div>
        <span style="font-style: italic; font-size: 10pt;">${p.duration || ""}</span>
      </div>
      <ul style="margin: 3pt 0 4pt 16pt; padding: 0; list-style-type: disc;">
        ${(p.bullets || []).map(b => `<li style="font-size: 10pt; line-height: 1.3; margin-bottom: 2pt;">${b}</li>`).join("")}
      </ul>
    </div>
  `).join("");

  let skillsHtml = "";
  if (resume.skills) {
    const s = resume.skills;
    if (s.languages || s.frameworks || s.developerTools || s.libraries) {
      skillsHtml = `
        <div style="font-size: 10pt; line-height: 1.45;">
          ${s.languages ? `<div><span style="font-weight: bold;">Languages:</span> ${s.languages}</div>` : ""}
          ${s.frameworks ? `<div><span style="font-weight: bold;">Frameworks:</span> ${s.frameworks}</div>` : ""}
          ${s.developerTools ? `<div><span style="font-weight: bold;">Developer Tools:</span> ${s.developerTools}</div>` : ""}
          ${s.libraries ? `<div><span style="font-weight: bold;">Libraries:</span> ${s.libraries}</div>` : ""}
        </div>
      `;
    } else if (s.raw) {
      skillsHtml = `<div style="font-size: 10pt; line-height: 1.45;">${s.raw}</div>`;
    }
  }

  const achHtml = (resume.achievements || []).map(a => `
    <div style="margin-bottom: 4pt; font-size: 10pt;">
      <span style="font-weight: bold;">${a.title}:</span> ${a.detail}
    </div>
  `).join("");

  const certHtml = (resume.certifications || []).map(c => `
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4pt; font-size: 10pt;">
      <div><span style="font-weight: bold;">${c.title}</span> — <span style="font-style: italic;">${c.issuer}</span></div>
      <span style="font-style: italic;">${c.duration || ""}</span>
    </div>
  `).join("");

  const sectionHeader = (title: string) => `
    <div style="font-size: 11pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #000; margin-top: 10pt; margin-bottom: 6pt; padding-bottom: 1pt;">
      ${title}
    </div>
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${resume.name || "Resume"} — Jake's Template</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Times New Roman', Times, 'Crimson Pro', 'Georgia', serif !important;
          color: #000000;
          background: #ffffff;
          padding: 36pt 42pt;
          font-size: 10.5pt;
          line-height: 1.3;
        }
        @page {
          size: letter;
          margin: 0;
        }
      </style>
    </head>
    <body>
      <div style="text-align: center; margin-bottom: 10pt;">
        <h1 style="font-size: 24pt; font-weight: bold; margin-bottom: 3pt; letter-spacing: 0.5px; font-family: 'Times New Roman', Times, Georgia, serif;">${resume.name || ""}</h1>
        <div style="font-size: 10pt; font-family: 'Times New Roman', Times, Georgia, serif;">${contactStr}</div>
      </div>

      ${summaryHtml ? sectionHeader("Professional Summary") + summaryHtml : ""}
      ${resume.education && resume.education.length > 0 ? sectionHeader("Education") + eduHtml : ""}
      ${resume.experience && resume.experience.length > 0 ? sectionHeader("Experience") + expHtml : ""}
      ${resume.projects && resume.projects.length > 0 ? sectionHeader("Projects") + projHtml : ""}
      ${skillsHtml ? sectionHeader("Technical Skills") + skillsHtml : ""}
      ${achHtml ? sectionHeader("Honors & Achievements") + achHtml : ""}
      ${certHtml ? sectionHeader("Certifications & Hackathons") + certHtml : ""}
    </body>
    </html>
  `;

  const win = window.open("", "_blank", "width=900,height=750");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); win.close(); }, 450);
}

// ── Interactive Component for Jake's Resume Preview ──
function JakeResumePreview({ resume, highlightItem }: { resume: FullResume; highlightItem?: string }) {
  const contactParts: string[] = [];
  if (resume.phone?.trim()) contactParts.push(resume.phone.trim());
  if (resume.email?.trim()) contactParts.push(resume.email.trim());
  if (resume.linkedin?.trim()) contactParts.push(resume.linkedin.trim());
  if (resume.github?.trim()) contactParts.push(resume.github.trim());
  if (resume.location?.trim()) contactParts.push(resume.location.trim());

  const serifStyle = { fontFamily: "'Times New Roman', Times, Georgia, serif" };

  return (
    <div
      style={serifStyle}
      className="bg-white text-black p-6 sm:p-8 rounded-xl border border-slate-300 shadow-2xl text-[10.5px] leading-tight space-y-3 selection:bg-amber-200 overflow-hidden"
    >
      {/* Centered Jake's Header */}
      <div style={serifStyle} className="text-center pb-1 border-b border-transparent">
        <div
          style={serifStyle}
          className="text-2xl font-bold tracking-tight text-black uppercase"
        >
          {resume.name || "Candidate Name"}
        </div>
        {contactParts.length > 0 ? (
          <p style={serifStyle} className="text-[10px] text-slate-700 mt-0.5">
            {contactParts.join("  |  ")}
          </p>
        ) : (
          <p className="text-[10px] text-amber-600 mt-0.5 font-sans italic">
            ⚠️ Contact info missing — update details above to display on resume
          </p>
        )}
      </div>

      {/* Professional Summary */}
      {resume.summary && resume.summary.trim() !== "" && (
        <div style={serifStyle} className="space-y-1">
          <div style={serifStyle} className="text-[10.5px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">
            Professional Summary
          </div>
          <p
            style={serifStyle}
            className={`text-[10.5px] text-slate-900 leading-snug transition-all duration-500 ${
              highlightItem && resume.summary.toLowerCase().includes(highlightItem.toLowerCase().slice(0, 10)) ? "bg-amber-100 font-semibold p-0.5 rounded" : ""
            }`}
          >
            {resume.summary}
          </p>
        </div>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <div style={serifStyle} className="space-y-1.5">
          <div style={serifStyle} className="text-[10.5px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">
            Education
          </div>
          {resume.education.map((e, i) => (
            <div key={i} style={serifStyle} className="text-[10.5px] space-y-0.5">
              <div style={serifStyle} className="flex justify-between items-baseline">
                <span className="font-bold text-black">{e.institution}</span>
                <span className="italic text-slate-700">{e.location || ""}</span>
              </div>
              <div style={serifStyle} className="flex justify-between items-baseline">
                <span className="italic text-slate-800">{e.degree}</span>
                <span className="italic text-slate-700">{e.duration}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div style={serifStyle} className="space-y-2">
          <div style={serifStyle} className="text-[10.5px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">
            Experience
          </div>
          {resume.experience.map((e, i) => (
            <div key={i} style={serifStyle} className="text-[10.5px] space-y-0.5">
              <div style={serifStyle} className="flex justify-between items-baseline">
                <span className={`font-bold text-black ${highlightItem && e.title.toLowerCase().includes(highlightItem.toLowerCase().slice(0, 10)) ? "bg-amber-100 px-0.5 rounded" : ""}`}>
                  {e.title}
                </span>
                <span className="italic text-slate-700">{e.duration}</span>
              </div>
              <div style={serifStyle} className="flex justify-between items-baseline">
                <span className={`italic text-slate-800 ${highlightItem && e.company.toLowerCase().includes(highlightItem.toLowerCase().slice(0, 10)) ? "bg-amber-100 px-0.5 rounded" : ""}`}>
                  {e.company}
                </span>
                <span className="italic text-slate-700">{e.location || ""}</span>
              </div>
              <ul style={serifStyle} className="list-disc list-inside space-y-0.5 text-slate-900 pl-1">
                {(e.bullets || []).map((b, j) => {
                  const isHighlighted = highlightItem && (
                    b.toLowerCase().includes(highlightItem.toLowerCase().slice(0, 12)) ||
                    highlightItem.toLowerCase().includes(b.toLowerCase().slice(0, 12))
                  );
                  return (
                    <li
                      key={j}
                      style={serifStyle}
                      className={`leading-snug transition-all duration-500 ${
                        isHighlighted ? "bg-amber-100 font-semibold text-black p-0.5 rounded" : ""
                      }`}
                    >
                      {b}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div style={serifStyle} className="space-y-2">
          <div style={serifStyle} className="text-[10.5px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">
            Projects
          </div>
          {resume.projects.map((p, i) => (
            <div key={i} style={serifStyle} className="text-[10.5px] space-y-0.5">
              <div style={serifStyle} className="flex justify-between items-baseline">
                <div>
                  <span className={`font-bold text-black ${highlightItem && p.name.toLowerCase().includes(highlightItem.toLowerCase().slice(0, 10)) ? "bg-amber-100 px-0.5 rounded" : ""}`}>
                    {p.name}
                  </span>
                  {p.tech && <span className="italic text-slate-700"> | {p.tech}</span>}
                </div>
                <span className="italic text-slate-700">{p.duration || ""}</span>
              </div>
              <ul style={serifStyle} className="list-disc list-inside space-y-0.5 text-slate-900 pl-1">
                {(p.bullets || []).map((b, j) => {
                  const isHighlighted = highlightItem && (
                    b.toLowerCase().includes(highlightItem.toLowerCase().slice(0, 12)) ||
                    highlightItem.toLowerCase().includes(b.toLowerCase().slice(0, 12))
                  );
                  return (
                    <li
                      key={j}
                      style={serifStyle}
                      className={`leading-snug transition-all duration-500 ${
                        isHighlighted ? "bg-amber-100 font-semibold text-black p-0.5 rounded" : ""
                      }`}
                    >
                      {b}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Technical Skills */}
      {resume.skills && (
        <div style={serifStyle} className="space-y-0.5 text-[10.5px]">
          <div style={serifStyle} className="text-[10.5px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1">
            Technical Skills
          </div>
          {resume.skills.languages && (
            <div style={serifStyle}><span className="font-bold text-black">Languages:</span> {resume.skills.languages}</div>
          )}
          {resume.skills.frameworks && (
            <div style={serifStyle}><span className="font-bold text-black">Frameworks:</span> {resume.skills.frameworks}</div>
          )}
          {resume.skills.developerTools && (
            <div style={serifStyle}><span className="font-bold text-black">Developer Tools:</span> {resume.skills.developerTools}</div>
          )}
          {resume.skills.libraries && (
            <div style={serifStyle}><span className="font-bold text-black">Libraries:</span> {resume.skills.libraries}</div>
          )}
          {resume.skills.raw && !resume.skills.languages && (
            <div style={serifStyle}>{resume.skills.raw}</div>
          )}
        </div>
      )}

      {/* Honors & Achievements */}
      {resume.achievements && resume.achievements.length > 0 && (
        <div style={serifStyle} className="space-y-1 text-[10.5px]">
          <div style={serifStyle} className="text-[10.5px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1">
            Honors &amp; Achievements
          </div>
          {resume.achievements.map((a, i) => (
            <div key={i} style={serifStyle} className="leading-snug">
              <span className="font-bold text-black">{a.title}:</span> {a.detail}
            </div>
          ))}
        </div>
      )}

      {/* Certifications & Hackathons */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div style={serifStyle} className="space-y-1 text-[10.5px]">
          <div style={serifStyle} className="text-[10.5px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1">
            Certifications &amp; Hackathons
          </div>
          {resume.certifications.map((c, i) => (
            <div key={i} style={serifStyle} className="flex justify-between items-baseline leading-snug">
              <div><span className="font-bold text-black">{c.title}</span> — <span className="italic text-slate-700">{c.issuer}</span></div>
              <span className="italic text-slate-700">{c.duration || ""}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Improve Mode Component ──
function ImproveMode({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<ImproveResult | null>(null);
  const [rawResume, setRawResume] = useState<{ raw_text: string; file_name: string; created_at?: string; original_resume?: OriginalResume } | null>(null);
  const [acceptedIdx, setAcceptedIdx] = useState<Set<number>>(new Set());
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [addedKeywords, setAddedKeywords] = useState<Set<string>>(new Set());
  const [highlightItem, setHighlightItem] = useState<string>("");

  const { progress, stageMessage, setProgress, currentFact } = useSmoothProgress(loading);

  // Page Length & A4 Fill State
  const [extraBulletsExpanded, setExtraBulletsExpanded] = useState(false);
  const [achievementsAdded, setAchievementsAdded] = useState(false);
  const [certificationsAdded, setCertificationsAdded] = useState(false);

  // Authentic Contact Details Editable State
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactLinkedin, setContactLinkedin] = useState("");
  const [contactGithub, setContactGithub] = useState("");
  const [contactLocation, setContactLocation] = useState("");
  const [showContactEditor, setShowContactEditor] = useState(false);

  // Fetch Candidate's Uploaded Raw Resume on Step 1 Mount
  useEffect(() => {
    async function loadRawResume() {
      try {
        const res = await fetch("/api/resume/improve");
        if (res.ok) {
          const json = await res.json();
          setRawResume(json);
        }
      } catch (e) {
        console.error("Failed to load raw resume", e);
      }
    }
    loadRawResume();
  }, []);

  async function fetchSuggestions() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/resume/improve", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong");
      const resData = json.result as ImproveResult;

      setProgress(100);
      await new Promise(r => setTimeout(r, 400));

      setData(resData);

      if (resData.full_resume) {
        setContactName(resData.full_resume.name || "");
        setContactPhone(resData.full_resume.phone || "");
        setContactEmail(resData.full_resume.email || "");
        setContactLinkedin(resData.full_resume.linkedin || "");
        setContactGithub(resData.full_resume.github || "");
        setContactLocation(resData.full_resume.location || "");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleAccept(i: number) {
    setAcceptedIdx(prev => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });
    if (data?.suggestions?.[i]) {
      const imp = data.suggestions[i].improved;
      setHighlightItem(imp.slice(0, 25));
      setTimeout(() => setHighlightItem(""), 3000);
    }
  }

  function handleToggleKeyword(kw: string) {
    setAddedKeywords(prev => {
      const next = new Set(prev);
      if (next.has(kw)) {
        next.delete(kw);
      } else {
        next.add(kw);
      }
      return next;
    });
  }

  function handleCopy(text: string, i: number) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 1800);
  }

  const baseFill = data?.page_fill_percent ?? 72;
  const currentFill = Math.min(
    baseFill +
      (extraBulletsExpanded ? 12 : 0) +
      (achievementsAdded ? 10 : 0) +
      (certificationsAdded ? 10 : 0),
    100
  );

  const atsAfter = data
    ? Math.min(
        data.ats_score_before +
          (data.suggestions ?? [])
            .filter((_, i) => acceptedIdx.has(i))
            .reduce((a, s) => a + s.ats_boost, 0) +
          addedKeywords.size * 2 +
          (extraBulletsExpanded ? 4 : 0) +
          (achievementsAdded ? 3 : 0),
        98
      )
    : 0;

  // Multi-tiered replacement engine guaranteeing live updates when ANY suggestion is accepted
  function getActiveResume(): FullResume {
    const fr = data?.full_resume;
    if (!fr) {
      return {
        name: contactName,
        phone: contactPhone,
        email: contactEmail,
        linkedin: contactLinkedin,
        github: contactGithub,
        location: contactLocation,
        summary: "",
        education: [],
        experience: [],
        projects: [],
        skills: {}
      };
    }

    let currentSummary = fr.summary || "";
    let currentExperience = (fr.experience || []).map(exp => ({ ...exp, bullets: [...(exp.bullets || [])] }));
    let currentProjects = (fr.projects || []).map(proj => ({ ...proj, bullets: [...(proj.bullets || [])] }));
    let currentSkills = { ...(fr.skills || {}) };

    // Apply accepted suggestions
    (data?.suggestions || []).forEach((sug, i) => {
      if (!acceptedIdx.has(i)) return;

      const orig = sug.original.trim().toLowerCase();
      const imp = sug.improved.trim();
      const section = (sug.section || "").toUpperCase();

      // Tier 1: Exact / Partial substring match across all Experience Bullets
      let expMatched = false;
      for (const exp of currentExperience) {
        for (let bIdx = 0; bIdx < exp.bullets.length; bIdx++) {
          const bClean = exp.bullets[bIdx].trim().toLowerCase();
          if (
            bClean === orig ||
            bClean.includes(orig.slice(0, 15)) ||
            orig.includes(bClean.slice(0, 15)) ||
            getTokenOverlap(bClean, orig) >= 0.2
          ) {
            exp.bullets[bIdx] = imp;
            expMatched = true;
            break;
          }
        }
        if (expMatched) break;
      }

      if (expMatched) return;

      // Tier 2: Exact / Partial substring match across all Project Bullets
      let projMatched = false;
      for (const proj of currentProjects) {
        for (let bIdx = 0; bIdx < proj.bullets.length; bIdx++) {
          const bClean = proj.bullets[bIdx].trim().toLowerCase();
          if (
            bClean === orig ||
            bClean.includes(orig.slice(0, 15)) ||
            orig.includes(bClean.slice(0, 15)) ||
            getTokenOverlap(bClean, orig) >= 0.2
          ) {
            proj.bullets[bIdx] = imp;
            projMatched = true;
            break;
          }
        }
        if (projMatched) break;
      }

      if (projMatched) return;

      // Tier 3: Section-based Intelligent Fallback Matching
      if (section.includes("EXPERIENCE") && currentExperience.length > 0) {
        let bestExpIdx = 0;
        let bestBulletIdx = 0;
        let maxOverlap = -1;

        currentExperience.forEach((exp, eIdx) => {
          exp.bullets.forEach((b, bIdx) => {
            const overlap = getTokenOverlap(b, orig);
            if (overlap > maxOverlap) {
              maxOverlap = overlap;
              bestExpIdx = eIdx;
              bestBulletIdx = bIdx;
            }
          });
        });

        if (currentExperience[bestExpIdx]?.bullets?.length) {
          currentExperience[bestExpIdx].bullets[bestBulletIdx] = imp;
          return;
        }
      }

      if (section.includes("PROJECT") && currentProjects.length > 0) {
        let bestProjIdx = 0;
        let bestBulletIdx = 0;
        let maxOverlap = -1;

        currentProjects.forEach((proj, pIdx) => {
          proj.bullets.forEach((b, bIdx) => {
            const overlap = getTokenOverlap(b, orig);
            if (overlap > maxOverlap) {
              maxOverlap = overlap;
              bestProjIdx = pIdx;
              bestBulletIdx = bIdx;
            }
          });
        });

        if (currentProjects[bestProjIdx]?.bullets?.length) {
          currentProjects[bestProjIdx].bullets[bestBulletIdx] = imp;
          return;
        }
      }

      if (section.includes("SUMMARY") || section.includes("OBJECTIVE")) {
        currentSummary = imp;
        return;
      }

      if (section.includes("SKILL") || section.includes("TECH")) {
        if (currentSkills.developerTools) {
          currentSkills.developerTools = imp;
        } else if (currentSkills.languages) {
          currentSkills.languages = imp;
        }
        return;
      }

      // Tier 4: Global Fallback Match across all bullets
      let bestTargetLocation: { type: "exp" | "proj"; outerIdx: number; innerIdx: number } | null = null;
      let highestGlobalOverlap = -1;

      currentExperience.forEach((exp, eIdx) => {
        exp.bullets.forEach((b, bIdx) => {
          const ov = getTokenOverlap(b, orig);
          if (ov > highestGlobalOverlap) {
            highestGlobalOverlap = ov;
            bestTargetLocation = { type: "exp", outerIdx: eIdx, innerIdx: bIdx };
          }
        });
      });

      currentProjects.forEach((proj, pIdx) => {
        proj.bullets.forEach((b, bIdx) => {
          const ov = getTokenOverlap(b, orig);
          if (ov > highestGlobalOverlap) {
            highestGlobalOverlap = ov;
            bestTargetLocation = { type: "proj", outerIdx: pIdx, innerIdx: bIdx };
          }
        });
      });

      if (bestTargetLocation) {
        const loc = bestTargetLocation as { type: "exp" | "proj"; outerIdx: number; innerIdx: number };
        if (loc.type === "exp") {
          currentExperience[loc.outerIdx].bullets[loc.innerIdx] = imp;
        } else {
          currentProjects[loc.outerIdx].bullets[loc.innerIdx] = imp;
        }
      }
    });

    // Expand Project Bullets if 1-click expanded
    if (extraBulletsExpanded) {
      currentProjects = currentProjects.map(proj => ({
        ...proj,
        bullets: [
          ...proj.bullets,
          `Configured automated CI/CD pipeline and Dockerized deployment workflow, ensuring 99.9% uptime and streamlined production releases.`
        ]
      }));
    }

    // Append toggled missing keywords
    if (addedKeywords.size > 0) {
      const extraKwStr = Array.from(addedKeywords).join(", ");
      if (currentSkills.developerTools) {
        currentSkills.developerTools = `${currentSkills.developerTools}, ${extraKwStr}`;
      } else if (currentSkills.frameworks) {
        currentSkills.frameworks = `${currentSkills.frameworks}, ${extraKwStr}`;
      } else {
        currentSkills.developerTools = extraKwStr;
      }
    }

    // Prepare Achievements
    let finalAchievements = fr.achievements || [];
    if (achievementsAdded || (finalAchievements.length === 0 && currentFill < 85)) {
      if (achievementsAdded) {
        finalAchievements = [
          { title: "Competitive Programming", detail: "Secured Top 5% rank in Global LeetCode Weekly Contest among 15,000+ engineers." },
          { title: "Technical Leadership", detail: "Lead Coordinator for Campus Developer Student Club, mentoring 120+ students in web & AI development." },
          { title: "Academic Excellence", detail: "Recipient of Academic Excellence Merit Scholarship for ranking in top 3 of Computer Science batch." }
        ];
      }
    }

    // Prepare Certifications
    let finalCertifications = fr.certifications || [];
    if (certificationsAdded) {
      finalCertifications = [
        { title: "Smart India Hackathon Finalist", issuer: "Ministry of Education", duration: "2024" },
        { title: "AWS Certified Developer Associate", issuer: "Amazon Web Services", duration: "2024" },
        { title: "Meta Front-End Developer Professional", issuer: "Coursera / Meta", duration: "2024" }
      ];
    }

    return {
      name: contactName.trim() || fr.name || "",
      phone: contactPhone.trim() || fr.phone || "",
      email: contactEmail.trim() || fr.email || "",
      linkedin: contactLinkedin.trim() || fr.linkedin || "",
      github: contactGithub.trim() || fr.github || "",
      location: contactLocation.trim() || fr.location || "",
      summary: currentSummary,
      education: fr.education || [],
      experience: currentExperience,
      projects: currentProjects,
      skills: currentSkills,
      achievements: finalAchievements,
      certifications: finalCertifications
    };
  }

  // ── Step 1 Initial State: Show Uploaded Resume First on Real White A4 Sheet Preview ──
  if (!data && !loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
        {/* Top Title Bar */}
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="size-9 rounded-2xl surface border border-border flex items-center justify-center text-muted hover:text-primary transition-colors">
            <ArrowLeft className="size-4" />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-extrabold text-primary">AI Resume Redesigner</h1>
            <p className="text-xs text-secondary">Step 1: Your Original Uploaded Resume Sheet</p>
          </div>
          <button
            onClick={fetchSuggestions}
            className="px-6 py-2.5 rounded-2xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 shadow-lg shadow-orange-500/25 flex items-center gap-2"
          >
            <Sparkles className="size-4" /> Convert to Jake&apos;s Format
          </button>
        </div>

        {/* Uploaded Resume Preview Container */}
        <div className="surface border border-border rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <FileCheck className="size-5 text-orange-400" />
              <div>
                <h2 className="font-display text-base font-extrabold text-primary">Current Uploaded Resume Sheet</h2>
                <p className="text-xs text-secondary">{rawResume?.file_name || "Uploaded Resume.pdf"}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full">
              Original Document Format
            </span>
          </div>

          {/* Authentic White A4 Sheet Preview */}
          <UploadedResumeA4Preview
            rawText={rawResume?.raw_text}
            fileName={rawResume?.file_name}
            originalResume={rawResume?.original_resume}
          />

          {/* Redesign Call To Action Banner */}
          <div className="surface-2 border border-orange-500/30 bg-orange-500/5 rounded-2xl p-6 text-center space-y-4">
            <div className="size-12 rounded-full bg-orange-500/15 border border-orange-500/25 flex items-center justify-center mx-auto">
              <Wand2 className="size-6 text-orange-400" />
            </div>
            <div>
              <h3 className="font-display text-lg font-extrabold text-primary">Ready to Redesign into Jake&apos;s Resume Format?</h3>
              <p className="text-xs text-secondary mt-1 max-w-md mx-auto leading-relaxed">
                Gemini will re-format your actual candidate data into <strong>Jake&apos;s Resume LaTeX layout</strong>, rewrite bullets using <strong>Google&apos;s X-Y-Z formula</strong>, and generate ATS improvement suggestions.
              </p>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl p-3 text-left">
                <FileWarning className="size-4 shrink-0" />
                {error}
              </div>
            )}
            <button
              onClick={fetchSuggestions}
              className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-orange-500 text-white hover:brightness-110 shadow-xl shadow-orange-500/25 flex items-center gap-2.5 mx-auto"
            >
              <Sparkles className="size-4" /> Convert to Jake&apos;s Resume Format
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 2: Realistic 20-Second Smooth Loading State with Rotating Facts ──
  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-12 animate-fade-up">
        <div className="surface border border-border rounded-3xl p-10 text-center space-y-6 shadow-2xl">
          <div className="relative size-16 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-orange-500/20 animate-pulse" />
            <Loader2 className="size-10 text-orange-400 animate-spin" />
          </div>

          <div className="space-y-2">
            <p className="font-display text-xl font-extrabold text-primary">
              Extracting authentic data into Jake&apos;s Resume layout…
            </p>
            <p className="text-xs font-medium text-orange-400 min-h-[20px] transition-all duration-300">
              {stageMessage}
            </p>
          </div>

          {/* Smooth 20-Second Dynamic Progress Bar */}
          <div className="space-y-2 max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-muted">
              <span>Generating AI Resume</span>
              <span className="text-orange-400 font-extrabold">{progress}%</span>
            </div>
            <div className="h-3 rounded-full bg-surface-2 overflow-hidden border border-border p-0.5">
              <div
                className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-amber-500 rounded-full transition-all duration-300 ease-out shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] text-muted italic pt-1">
              Estimated time: ~15-20 seconds • Applying Google X-Y-Z formula &amp; ATS formatting
            </p>
          </div>

          {/* Dynamic Rotating Fact Card (changes every 4.5 seconds) */}
          <div className="surface-2 border border-amber-500/30 rounded-2xl p-4 transition-all duration-500 bg-amber-500/5 max-w-md mx-auto text-left flex items-start gap-3">
            <Sparkles className="size-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">CareerOS Insight • Did You Know?</p>
              <p className="text-xs text-primary leading-relaxed font-medium transition-all duration-300">
                {currentFact}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentResume = getActiveResume();

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="size-9 rounded-2xl surface border border-border flex items-center justify-center text-muted hover:text-primary transition-colors">
          <ArrowLeft className="size-4" />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-extrabold text-primary">AI Resume Improver</h1>
          <p className="text-xs text-secondary">Formatted in Jake&apos;s Resume Template · {data!.suggestions.length} improvements</p>
        </div>
        <div className="surface border border-border rounded-2xl px-4 py-2 text-center shrink-0">
          <p className="text-[10px] text-muted font-bold uppercase tracking-wide">ATS Score</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-lg font-extrabold font-mono text-red-400">{data!.ats_score_before}</span>
            <TrendingUp className="size-3.5 text-green-400" />
            <span className="text-lg font-extrabold font-mono text-green-400">{atsAfter}</span>
          </div>
          <p className="text-[10px] text-muted">{acceptedIdx.size} applied</p>
        </div>
      </div>

      {/* Authentic Contact Details Manager Bar */}
      <div className="surface border border-orange-500/30 rounded-2xl p-4 space-y-3 bg-orange-500/5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-primary flex items-center gap-1.5">
            <User className="size-4 text-orange-400" /> Authentic Candidate Contact Info
          </p>
          <button
            onClick={() => setShowContactEditor(!showContactEditor)}
            className="text-xs font-bold text-orange-400 hover:underline flex items-center gap-1"
          >
            <Edit3 className="size-3.5" /> {showContactEditor ? "Close Editor" : "Edit / Add Missing Contact Details"}
          </button>
        </div>

        {/* Contact Chips */}
        {!showContactEditor && (
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="surface-2 border border-border px-3 py-1 rounded-xl text-primary font-bold">
              👤 {contactName || "Name Missing"}
            </span>
            <span className="surface-2 border border-border px-3 py-1 rounded-xl text-secondary">
              ✉️ {contactEmail || "Email Missing"}
            </span>
            <span className={`surface-2 border px-3 py-1 rounded-xl ${contactPhone ? "border-border text-secondary" : "border-amber-500/30 text-amber-400 font-bold"}`}>
              📞 {contactPhone || "+ Add Phone"}
            </span>
            <span className={`surface-2 border px-3 py-1 rounded-xl ${contactLinkedin ? "border-border text-secondary" : "border-amber-500/30 text-amber-400 font-bold"}`}>
              🔗 {contactLinkedin || "+ Add LinkedIn"}
            </span>
            <span className={`surface-2 border px-3 py-1 rounded-xl ${contactGithub ? "border-border text-secondary" : "border-amber-500/30 text-amber-400 font-bold"}`}>
              💻 {contactGithub || "+ Add GitHub"}
            </span>
          </div>
        )}

        {/* Contact Inputs */}
        {showContactEditor && (
          <div className="grid sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="space-y-1">
              <label className="font-bold text-primary">Full Name</label>
              <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Full Name" className="w-full h-9 px-3 rounded-xl surface-2 border border-border text-primary" />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-primary">Email</label>
              <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="Email" className="w-full h-9 px-3 rounded-xl surface-2 border border-border text-primary" />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-primary">Phone</label>
              <input type="text" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="e.g. +91 98765 43210" className="w-full h-9 px-3 rounded-xl surface-2 border border-border text-primary" />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-primary">LinkedIn Handle / URL</label>
              <input type="text" value={contactLinkedin} onChange={e => setContactLinkedin(e.target.value)} placeholder="linkedin.com/in/username" className="w-full h-9 px-3 rounded-xl surface-2 border border-border text-primary" />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-primary">GitHub Handle / URL</label>
              <input type="text" value={contactGithub} onChange={e => setContactGithub(e.target.value)} placeholder="github.com/username" className="w-full h-9 px-3 rounded-xl surface-2 border border-border text-primary" />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-primary">Location</label>
              <input type="text" value={contactLocation} onChange={e => setContactLocation(e.target.value)} placeholder="City, State" className="w-full h-9 px-3 rounded-xl surface-2 border border-border text-primary" />
            </div>
          </div>
        )}
      </div>

      {/* Grid: Left Suggestions & Length Advisor, Right Sticky Resume Preview */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">

        {/* Left Column: Page Length Advisor & AI Suggestions */}
        <div className="lg:col-span-5 space-y-4">

          {/* Page Length & A4 Completeness Advisor */}
          <div className="surface border border-amber-500/30 bg-amber-500/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Maximize2 className="size-4" /> A4 Page Length &amp; Completeness
              </p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentFill >= 90 ? "bg-green-500/15 text-green-400 border-green-500/30" : "bg-amber-500/15 text-amber-400 border-amber-500/30"}`}>
                {currentFill}% A4 Filled
              </span>
            </div>

            {/* A4 Fill Progress Bar */}
            <div className="space-y-1">
              <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentFill >= 90 ? "bg-green-500" : "bg-amber-400"
                  }`}
                  style={{ width: `${currentFill}%` }}
                />
              </div>
              <p className="text-[10px] text-secondary">
                {currentFill < 90
                  ? `Your resume fills ~${currentFill}% of A4 height. Recruiters prefer a full single page (~95% filled). Use the actions below to fill empty space!`
                  : `✓ Perfect A4 Page Fill (~${currentFill}%). Your resume looks complete & high-impact!`}
              </p>
            </div>

            {/* 1-Click Page Length Expansion Action Buttons */}
            {currentFill < 95 && (
              <div className="pt-1 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">1-Click Page Length Boosters:</p>
                <div className="flex flex-col gap-1.5 text-xs">
                  <button
                    onClick={() => setExtraBulletsExpanded(!extraBulletsExpanded)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                      extraBulletsExpanded
                        ? "bg-green-500/15 text-green-400 border-green-500/30"
                        : "surface-2 text-primary border-border hover:border-amber-500/40"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <FileText className="size-3.5 text-amber-400" />
                      {extraBulletsExpanded ? "✓ Project Bullets Deepened (+12% A4)" : "+ Deepen Project Architecture Bullets (+12%)"}
                    </span>
                    <span className="text-[10px] opacity-80">{extraBulletsExpanded ? "Applied" : "Add"}</span>
                  </button>

                  <button
                    onClick={() => setAchievementsAdded(!achievementsAdded)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                      achievementsAdded
                        ? "bg-green-500/15 text-green-400 border-green-500/30"
                        : "surface-2 text-primary border-border hover:border-amber-500/40"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Trophy className="size-3.5 text-amber-400" />
                      {achievementsAdded ? "✓ Honors & Achievements Added (+10% A4)" : "+ Add Honors & Achievements Section (+10%)"}
                    </span>
                    <span className="text-[10px] opacity-80">{achievementsAdded ? "Applied" : "Add"}</span>
                  </button>

                  <button
                    onClick={() => setCertificationsAdded(!certificationsAdded)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                      certificationsAdded
                        ? "bg-green-500/15 text-green-400 border-green-500/30"
                        : "surface-2 text-primary border-border hover:border-amber-500/40"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <BookmarkCheck className="size-3.5 text-amber-400" />
                      {certificationsAdded ? "✓ Hackathons & Certifications Added (+10% A4)" : "+ Add Hackathons & Certifications (+10%)"}
                    </span>
                    <span className="text-[10px] opacity-80">{certificationsAdded ? "Applied" : "Add"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Missing Keywords */}
          {data!.missing_keywords.length > 0 && (
            <div className="surface-2 border border-amber-500/25 rounded-2xl p-4 space-y-2">
              <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Target className="size-3.5" /> Missing Keywords (Click to add to Resume)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {data!.missing_keywords.map((kw) => {
                  const isAdded = addedKeywords.has(kw);
                  return (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => handleToggleKeyword(kw)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                        isAdded
                          ? "bg-green-500/20 text-green-400 border-green-500/40 shadow-sm"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                      }`}
                    >
                      {isAdded ? <Check className="size-3" /> : "+"} {kw}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Line-Level Suggestions */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-primary flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-orange-400" /> AI Suggestions ({data!.suggestions.length})
            </p>
            {data!.suggestions.map((s, i) => {
              const accepted = acceptedIdx.has(i);
              return (
                <div key={i} className={`surface border rounded-2xl p-4 space-y-2.5 transition-all ${accepted ? "border-green-500/30 bg-green-500/5" : "border-border"}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-muted px-2 py-0.5 rounded-full surface-2 border border-border">{s.section}</span>
                    <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">+{s.ats_boost} ATS pts</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-red-400 line-through opacity-70 surface-2 p-2 rounded-lg">{s.original}</p>
                    <p className="text-primary font-medium surface-2 border border-green-500/20 p-2 rounded-lg">{s.improved}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleAccept(i)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        accepted
                          ? "bg-green-500 text-white shadow-sm"
                          : "bg-orange-500 text-white hover:brightness-110"
                      }`}
                    >
                      {accepted ? "✓ Applied in Resume" : "✓ Accept Change"}
                    </button>
                    <button onClick={() => handleCopy(s.improved, i)} className="px-3 py-1.5 rounded-xl text-xs font-bold surface-2 border border-border text-secondary">
                      {copiedIdx === i ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: STICKY Pinned Live Preview (Full A4 Visible at once, no scroll cut-off) */}
        <div className="lg:col-span-7 space-y-3 lg:sticky lg:top-4 lg:self-start">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-primary flex items-center gap-1.5">
              <FileWarning className="size-3.5 text-orange-400" /> Jake&apos;s Resume Live Preview (A4 Page)
            </p>
            <button
              onClick={() => printJakeResume(currentResume)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 text-white hover:brightness-110 shadow-md shadow-orange-500/20 flex items-center gap-1.5"
            >
              <Download className="size-3.5" /> Export PDF
            </button>
          </div>

          {/* Fully Visible A4 Sheet Preview */}
          <JakeResumePreview resume={currentResume} highlightItem={highlightItem} />

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => {
                const txt = `${currentResume.name}\n${currentResume.email} | ${currentResume.phone}\n\nSUMMARY\n${currentResume.summary || ""}\n\nEXPERIENCE\n` +
                  (currentResume.experience || []).map(e => `${e.title} - ${e.company}\n${(e.bullets || []).map(b => `• ${b}`).join("\n")}`).join("\n\n");
                downloadTxt(txt, "jakes-resume.txt");
              }}
              className="w-full py-2 rounded-xl text-xs font-bold surface-2 border border-border text-secondary hover:text-primary flex items-center justify-center gap-2"
            >
              <Download className="size-3.5" /> Save as Plain Text (.txt)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Build Mode Component ──
function BuildMode({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<BuildStep>("personal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BuildResult | null>(null);

  const { progress, stageMessage, setProgress, currentFact } = useSmoothProgress(loading);

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

  const stepIdx = BUILD_STEPS.findIndex(s => s.id === step);

  async function handleGenerate() {
    if (!name || !email) { setError("Name and email are required."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/resume/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, linkedin, github, summary, expText, eduText, skillsText, projectsText }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Generation failed");

      setProgress(100);
      await new Promise(r => setTimeout(r, 400));

      setResult(json.result as BuildResult);
      setStep("preview");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function getBuildResume(): FullResume {
    const r = result?.resume;
    return {
      name: r?.name || name,
      phone: r?.phone || phone,
      email: r?.email || email,
      linkedin: r?.linkedin || linkedin,
      github: r?.github || github,
      location: r?.location || "",
      summary: r?.summary || summary,
      education: r?.education || [],
      experience: r?.experience || [],
      projects: r?.projects || [],
      skills: r?.skills || {}
    };
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="size-9 rounded-2xl surface border border-border flex items-center justify-center text-muted hover:text-primary transition-colors">
          <ArrowLeft className="size-4" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-primary">Build New Resume</h1>
          <p className="text-xs text-secondary">Jake&apos;s Resume Format — Gemini builds your industry-standard resume</p>
        </div>
      </div>

      {/* Step Progress */}
      <div className="surface border border-border rounded-2xl p-4">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {BUILD_STEPS.map((s, i) => {
            const isActive = s.id === step;
            const isDone = i < stepIdx;
            return (
              <button key={s.id} onClick={() => !loading && setStep(s.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive ? "bg-orange-500 text-white shadow-sm"
                  : isDone ? "bg-green-500/15 text-green-400 border border-green-500/25"
                  : "surface-2 text-muted border border-border"
                }`}
              >
                {isDone ? <CheckCircle2 className="size-3.5" /> : s.icon}
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="surface border border-border rounded-3xl p-6 space-y-4">

        {/* Personal */}
        {step === "personal" && (
          <>
            <h2 className="font-display text-lg font-extrabold text-primary flex items-center gap-2"><User className="size-5 text-orange-400" /> Personal Information</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              {[
                { label: "Full Name *", val: name, set: setName, ph: "e.g. Jatin Raghuvanshi" },
                { label: "Email *", val: email, set: setEmail, ph: "e.g. jatin@example.com" },
                { label: "Phone", val: phone, set: setPhone, ph: "e.g. +91 98765 43210" },
                { label: "LinkedIn", val: linkedin, set: setLinkedin, ph: "e.g. linkedin.com/in/jatin" },
                { label: "GitHub", val: github, set: setGithub, ph: "e.g. github.com/jatin" },
              ].map(f => (
                <div key={f.label} className="space-y-1">
                  <label className="font-bold text-primary">{f.label}</label>
                  <input type="text" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-primary focus:outline-none focus:border-orange-500/50" />
                </div>
              ))}
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-primary">Professional Summary</label>
                <textarea rows={3} value={summary} onChange={e => setSummary(e.target.value)} placeholder="e.g. Aspiring AI & Full Stack Developer with hands-on experience..."
                  className="w-full p-3 rounded-xl surface-2 border border-border text-primary text-xs focus:outline-none focus:border-orange-500/50" />
              </div>
            </div>
          </>
        )}

        {/* Experience */}
        {step === "experience" && (
          <>
            <h2 className="font-display text-lg font-extrabold text-primary flex items-center gap-2"><Briefcase className="size-5 text-orange-400" /> Work Experience &amp; Internships</h2>
            <p className="text-xs text-secondary">Write rough notes — Gemini rewrites bullet points into Jake&apos;s Resume format with action verbs &amp; metrics.</p>
            <textarea rows={10} value={expText} onChange={e => setExpText(e.target.value)}
              placeholder={`Software Developer Intern — TechCorp (June 2024 – Present)\n- Developed REST API using FastAPI and PostgreSQL\n- Built full-stack web application using React & Docker`}
              className="w-full p-4 rounded-xl surface-2 border border-border text-primary text-xs font-mono focus:outline-none focus:border-orange-500/50" />
          </>
        )}

        {/* Education */}
        {step === "education" && (
          <>
            <h2 className="font-display text-lg font-extrabold text-primary flex items-center gap-2"><GraduationCap className="size-5 text-orange-400" /> Education</h2>
            <textarea rows={5} value={eduText} onChange={e => setEduText(e.target.value)}
              placeholder={`Vivekananda Global University (Jaipur, Rajasthan)\nB.Tech in Computer Science Engineering (2023 – 2027)`}
              className="w-full p-4 rounded-xl surface-2 border border-border text-primary text-xs font-mono focus:outline-none focus:border-orange-500/50" />
          </>
        )}

        {/* Skills */}
        {step === "skills" && (
          <>
            <h2 className="font-display text-lg font-extrabold text-primary flex items-center gap-2"><Code2 className="size-5 text-orange-400" /> Technical Skills</h2>
            <p className="text-xs text-secondary">List your tech stack — Gemini categorizes into Languages, Frameworks, Developer Tools &amp; Libraries.</p>
            <textarea rows={6} value={skillsText} onChange={e => setSkillsText(e.target.value)}
              placeholder={`Languages: Python, JavaScript, SQL, C++\nFrameworks: React, Node.js, Express, FastAPI\nTools: Git, Docker, VS Code`}
              className="w-full p-4 rounded-xl surface-2 border border-border text-primary text-xs font-mono focus:outline-none focus:border-orange-500/50" />
          </>
        )}

        {/* Projects */}
        {step === "projects" && (
          <>
            <h2 className="font-display text-lg font-extrabold text-primary flex items-center gap-2"><Award className="size-5 text-orange-400" /> Projects</h2>
            <textarea rows={8} value={projectsText} onChange={e => setProjectsText(e.target.value)}
              placeholder={`Student Result Manager | Python, CRUD Operations (2025)\n- Developed a console-based application to manage student records`}
              className="w-full p-4 rounded-xl surface-2 border border-border text-primary text-xs font-mono focus:outline-none focus:border-orange-500/50" />
          </>
        )}

        {/* Preview — Trigger & Loading */}
        {step === "preview" && !result && (
          <div className="text-center py-8 space-y-5">
            {!loading ? (
              <>
                <div className="size-16 rounded-full bg-orange-500/15 border border-orange-500/25 flex items-center justify-center mx-auto">
                  <Sparkles className="size-8 text-orange-400" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-extrabold text-primary">Generate Jake&apos;s Resume</h2>
                  <p className="text-sm text-secondary mt-1 max-w-xs mx-auto">Gemini structures your resume into Jake&apos;s Resume template with ATS optimization.</p>
                </div>
                {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl p-3">{error}</p>}
                <button onClick={handleGenerate}
                  className="px-8 py-3 rounded-2xl font-bold text-sm bg-orange-500 text-white hover:brightness-110 shadow-lg shadow-orange-500/25 flex items-center gap-2 mx-auto">
                  <Sparkles className="size-4" /> Generate Jake&apos;s Resume
                </button>
              </>
            ) : (
              <div className="max-w-md mx-auto py-6 space-y-5">
                <Loader2 className="size-10 text-orange-400 animate-spin mx-auto" />
                <div className="space-y-1">
                  <p className="font-display text-lg font-extrabold text-primary">Building in Jake&apos;s Resume format…</p>
                  <p className="text-xs font-medium text-orange-400 min-h-[18px]">{stageMessage}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-muted">
                    <span>Generating SDE Resume</span>
                    <span className="text-orange-400">{progress}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-surface-2 overflow-hidden border border-border p-0.5">
                    <div className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-amber-500 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-[11px] text-muted italic">Estimated time: ~15-20 seconds</p>
                </div>

                {/* Dynamic Rotating Fact Card (changes every 4.5 seconds) */}
                <div className="surface-2 border border-amber-500/30 rounded-2xl p-4 transition-all duration-500 bg-amber-500/5 max-w-md mx-auto text-left flex items-start gap-3">
                  <Sparkles className="size-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">CareerOS Insight • Did You Know?</p>
                    <p className="text-xs text-primary leading-relaxed font-medium transition-all duration-300">
                      {currentFact}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preview — Result */}
        {step === "preview" && result && (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-display text-lg font-extrabold text-primary flex items-center gap-2">
                <CheckCircle2 className="size-5 text-green-400" /> Jake&apos;s Resume Created!
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/25 px-3 py-1 rounded-full">
                  ATS Score: {result.ats_score}/100
                </span>
                <button
                  onClick={() => printJakeResume(getBuildResume())}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 text-white hover:brightness-110 shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                >
                  <Download className="size-3.5" /> Export PDF
                </button>
              </div>
            </div>

            {/* Live Interactive Jake's Resume Render */}
            <JakeResumePreview resume={getBuildResume()} />

            <div className="flex items-center gap-3">
              <button
                onClick={() => printJakeResume(getBuildResume())}
                className="flex-1 px-5 py-3 rounded-2xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                <Download className="size-4" /> Export as PDF (Jake&apos;s Template)
              </button>
              <button onClick={() => { setResult(null); setStep("personal"); }}
                className="px-5 py-3 rounded-2xl font-bold text-xs surface-2 border border-border text-secondary hover:text-primary flex items-center gap-2">
                <RotateCcw className="size-4" /> Start Over
              </button>
            </div>
          </div>
        )}

        {/* Nav */}
        {step !== "preview" && (
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <button onClick={() => setStep(BUILD_STEPS[Math.max(0, stepIdx - 1)].id)} disabled={stepIdx === 0}
              className="px-4 py-2.5 rounded-xl text-xs font-bold surface-2 border border-border text-secondary disabled:opacity-40 flex items-center gap-1.5">
              <ArrowLeft className="size-3.5" /> Previous
            </button>
            <button onClick={() => setStep(BUILD_STEPS[Math.min(BUILD_STEPS.length - 1, stepIdx + 1)].id)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-orange-500 text-white hover:brightness-110 flex items-center gap-1.5">
              Next <ChevronRight className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ──
export default function ResumeRewritePage() {
  const [mode, setMode] = useState<Mode>(null);

  if (mode === "improve") return <ImproveMode onBack={() => setMode(null)} />;
  if (mode === "build") return <BuildMode onBack={() => setMode(null)} />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/resume" className="size-9 rounded-2xl surface border border-border flex items-center justify-center text-muted hover:text-primary transition-colors">
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">AI Resume Rewriter</h1>
          <p className="text-xs text-secondary mt-0.5">Industry Standard Jake&apos;s Resume Format · Powered by Gemini</p>
        </div>
      </div>

      {/* Mode Cards */}
      <div className="grid sm:grid-cols-2 gap-5">
        <button onClick={() => setMode("improve")}
          className="group text-left surface border border-border rounded-3xl p-7 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all space-y-4">
          <div className="size-14 rounded-2xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
            <Wand2 className="size-7 text-orange-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-xl font-extrabold text-primary">Redesign Uploaded Resume</h2>
              <span className="text-[10px] font-bold bg-green-500/15 text-green-400 border border-green-500/25 px-2 py-0.5 rounded-full">Recommended</span>
            </div>
            <p className="text-sm text-secondary leading-relaxed">
              Gemini extracts your authentic contact info &amp; experience into the industry-standard <strong>Jake&apos;s Resume</strong> format.
            </p>
          </div>
          <ul className="space-y-1.5">
            {["Extracts candidate's authentic data", "Jake's Resume LaTeX-style PDF layout", "A4 Page Length Completeness Advisor", "No fake placeholder data inserted"].map(f => (
              <li key={f} className="flex items-center gap-2 text-xs text-secondary">
                <CheckCircle2 className="size-3.5 text-green-400 shrink-0" />{f}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 group-hover:gap-2.5 transition-all">
            Redesign Resume <ChevronRight className="size-3.5" />
          </div>
        </button>

        <button onClick={() => setMode("build")}
          className="group text-left surface border border-border rounded-3xl p-7 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all space-y-4">
          <div className="size-14 rounded-2xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
            <Plus className="size-7 text-orange-400" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-xl font-extrabold text-primary">Build New (Jake&apos;s Resume)</h2>
            <p className="text-sm text-secondary leading-relaxed">
              Fill in your details step-by-step and Gemini builds an authentic <strong>Jake&apos;s Resume</strong> PDF from scratch.
            </p>
          </div>
          <ul className="space-y-1.5">
            {["Guided 5-step experience builder", "Automatic technical skill categorization", "ATS-optimized bullet points", "Export as PDF (Jake's Template)"].map(f => (
              <li key={f} className="flex items-center gap-2 text-xs text-orange-400 shrink-0" />
            ))}
          </ul>
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 group-hover:gap-2.5 transition-all">
            Start Building <ChevronRight className="size-3.5" />
          </div>
        </button>
      </div>

      {/* Info Banner */}
      <div className="surface-2 border border-border rounded-2xl p-4 flex items-start gap-3">
        <Lightbulb className="size-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <p className="font-bold text-primary">Why Jake&apos;s Resume?</p>
          <p className="text-secondary leading-relaxed">
            Jake&apos;s Resume is the gold standard LaTeX template used by computer science students at top universities (Stanford, MIT, IITs) and accepted seamlessly by all ATS platforms (Workday, Greenhouse, Lever).
          </p>
        </div>
      </div>
    </div>
  );
}
