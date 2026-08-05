"use client";

import { useState, useRef, MouseEvent } from "react";
import { Sparkles, Bot, Wand2, BarChart3, FileText, History } from "lucide-react";
import { GeminiAtsAuditor, type AtsAuditData } from "./gemini-ats-auditor";
import { GeminiResumeChat } from "./gemini-resume-chat";
import { GeminiBulletRebuilder } from "./gemini-bullet-rebuilder";
import { ResumeReport } from "@/components/resume-report";
import type { ResumeAnalysisReport } from "@/lib/resume/types";

/**
 * Custom Tab Button with Cursor Tracking Glare Spotlight
 */
function GlareTabButton({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSpotlight({ x, y, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-black text-sm transition-all duration-200 cursor-pointer select-none ${
        isActive
          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25 scale-[1.02] border border-orange-400/50"
          : "surface-2 text-primary hover:text-primary border border-border"
      }`}
    >
      {/* ── CURSOR SPOTLIGHT GLARE OVERLAY ── */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: spotlight.opacity,
          background: isActive
            ? `radial-gradient(circle 90px at ${spotlight.x}px ${spotlight.y}px, rgba(255, 255, 255, 0.4), transparent 75%)`
            : `radial-gradient(circle 90px at ${spotlight.x}px ${spotlight.y}px, rgba(251, 146, 60, 0.35), transparent 75%)`,
        }}
      />
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
    </button>
  );
}

export function ResumeIntelligenceTabs({
  preSavedAuditData,
  analysisReport,
}: {
  preSavedAuditData: AtsAuditData | null;
  analysisReport: ResumeAnalysisReport | null;
}) {
  const [activeTab, setActiveTab] = useState<"audit" | "chat" | "rebuilder">("audit");

  return (
    <div className="space-y-6">
      {/* ── SLEEK NAVIGATION TABS WITH CURSOR GLARE SPOTLIGHT ── */}
      <div className="flex items-center gap-3 p-2 surface border border-border rounded-3xl w-full sm:w-auto shadow-lg flex-wrap">
        <GlareTabButton
          isActive={activeTab === "audit"}
          onClick={() => setActiveTab("audit")}
        >
          <BarChart3 className="size-5 shrink-0" />
          <span>📊 Gemini ATS Audit &amp; Report</span>
        </GlareTabButton>

        <GlareTabButton
          isActive={activeTab === "chat"}
          onClick={() => setActiveTab("chat")}
        >
          <Bot className="size-5 text-orange-300 shrink-0" />
          <span>🤖 Resume AI Assistant</span>
        </GlareTabButton>

        <GlareTabButton
          isActive={activeTab === "rebuilder"}
          onClick={() => setActiveTab("rebuilder")}
        >
          <Wand2 className="size-5 shrink-0" />
          <span>⚡ AI Bullet Re-builder</span>
        </GlareTabButton>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="animate-fade-up">
        {activeTab === "audit" && (
          <div className="space-y-6">
            <GeminiAtsAuditor initialAuditData={preSavedAuditData} />
            {analysisReport && <ResumeReport report={analysisReport} />}
          </div>
        )}

        {activeTab === "chat" && (
          <div>
            <GeminiResumeChat />
          </div>
        )}

        {activeTab === "rebuilder" && (
          <div>
            <GeminiBulletRebuilder />
          </div>
        )}
      </div>
    </div>
  );
}
