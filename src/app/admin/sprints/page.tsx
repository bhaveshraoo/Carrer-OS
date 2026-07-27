"use client";

import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Award,
  Users,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";

const MOCK_SPRINT_EVALUATIONS = [
  {
    id: "eval-1",
    internName: "Bhavesh Rao",
    projectTitle: "AI Voice-Powered Career Assistant",
    domain: "Frontend Lead",
    sprint: "Sprint 2 (Week 4)",
    attendancePct: 100,
    sincerenessScore: 96,
    codeQualityScore: 94,
    status: "Top Performer 🏆",
  },
  {
    id: "eval-2",
    internName: "Rohan Varma",
    projectTitle: "Autonomous Code Refactoring Agent",
    domain: "Full Stack",
    sprint: "Sprint 2 (Week 4)",
    attendancePct: 92,
    sincerenessScore: 88,
    codeQualityScore: 90,
    status: "Good Progress ⭐",
  },
];

export default function AdminSprintsPage() {
  const { notify } = useNotifications();
  const [evaluations, setEvaluations] = useState(MOCK_SPRINT_EVALUATIONS);

  function handleAwardBadge(internName: string) {
    notify({
      type: "success",
      icon: "🏆",
      title: "Badge & Rank Awarded!",
      body: `Awarded "Top Performer" badge to ${internName}. Synced to Global Leaderboard!`,
      autoDismiss: 3500,
    });
  }

  return (
    <div className="space-y-6 animate-fade-up">

      {/* Header Banner */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-orange-500/10 via-surface to-surface">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-teal-400 bg-teal-500/15 border border-teal-500/30">
            <Calendar className="size-3.5 text-teal-400" /> Sprint & Weekly Attendance Engine
          </div>
          <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
            Sprint Performance & Sincereness Evaluator
          </h1>
          <p className="text-xs text-secondary">
            Grade weekly student work, track daily attendance logs, evaluate sincereness scores (0-100), and auto-award top intern badges on the Global Leaderboard.
          </p>
        </div>
      </div>

      {/* Evaluations Table */}
      <div className="space-y-3">
        {evaluations.map((ev) => (
          <div key={ev.id} className="surface rounded-3xl p-6 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-primary">{ev.internName}</h3>
                <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                  {ev.domain}
                </span>
                <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                  {ev.status}
                </span>
              </div>
              <p className="text-muted">{ev.projectTitle} · {ev.sprint}</p>
              <div className="flex items-center gap-3 pt-1 text-[11px]">
                <span>Attendance: <strong className="text-teal-400">{ev.attendancePct}%</strong></span>
                <span>Sincereness: <strong className="text-orange-400">{ev.sincerenessScore}/100</strong></span>
                <span>Code Quality: <strong className="text-primary">{ev.codeQualityScore}/100</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleAwardBadge(ev.internName)}
                className="px-4 py-2 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110 flex items-center gap-1.5 shadow-sm"
              >
                <Award className="size-3.5" /> Award Badge & Sync Leaderboard
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
