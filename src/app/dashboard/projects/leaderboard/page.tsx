"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Award,
  Sparkles,
  Flame,
  Star,
  CheckCircle2,
  Download,
  Share2,
  ArrowLeft,
  QrCode,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { MOCK_LEADERBOARD } from "@/lib/projects/data";
import { useNotifications } from "@/components/notifications/notification-provider";

const BADGES = [
  { name: "Top Performer", icon: "🏆", desc: "Awarded to top 1% interns by score", category: "Performance" },
  { name: "Consistency King", icon: "🔥", desc: "Maintained 100% daily streak for 30 days", category: "Consistency" },
  { name: "Fast Learner", icon: "🚀", desc: "Completed 5 complex tasks in Sprint 1", category: "Speed" },
  { name: "Full Stack Hero", icon: "⚡", desc: "Built end-to-end full-stack SaaS project", category: "Engineering" },
  { name: "AI Expert", icon: "🧠", desc: "Integrated OpenAI Realtime API & vector databases", category: "AI/ML" },
  { name: "Attendance Master", icon: "🎯", desc: "Zero leaves during 3-month internship", category: "Attendance" },
];

export default function LeaderboardAndBadgesPage() {
  const { notify } = useNotifications();
  const [showCertModal, setShowCertModal] = useState(false);

  function handleDownloadCert() {
    notify({
      type: "success",
      icon: "📥",
      title: "Certificate Downloaded!",
      body: "Downloaded official CareerOS Internship Certificate & LOR (PDF).",
      autoDismiss: 3000,
    });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-up">

      {/* Back Link */}
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary transition-colors"
      >
        <ArrowLeft className="size-4" /> Back to Project Marketplace
      </Link>

      {/* ── 1. HERO BANNER ── */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-surface to-surface">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30 shadow-sm">
              <Trophy className="size-3.5 text-orange-500" /> CareerOS Global Internship Leaderboard & Gamification
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              Top Interns & <span className="text-orange-400">Badge Vault</span>
            </h1>

            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              Earn XP points, unlock rare achievement badges, reach the top of the global leaderboard, and claim verified Internship Certificates with QR verification!
            </p>
          </div>

          {/* Certificate Trigger Button */}
          <button
            onClick={() => setShowCertModal(true)}
            className="px-5 py-3 rounded-2xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 shrink-0"
          >
            <Award className="size-4" /> Claim & View Internship Certificate
          </button>
        </div>
      </div>

      {/* ── 2. GLOBAL LEADERBOARD RANKINGS ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2">
            <Trophy className="size-5 text-orange-500" /> Top Intern Rankers
          </h2>
          <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
            Updated Daily
          </span>
        </div>

        <div className="space-y-3">
          {MOCK_LEADERBOARD.map((item) => (
            <div
              key={item.rank}
              className={`surface p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
                item.rank === 1
                  ? "border-amber-500/40 bg-amber-500/5"
                  : item.rank === 2
                  ? "border-slate-400/40"
                  : "border-border"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank Badge */}
                <div className={`size-10 rounded-2xl font-display text-lg font-extrabold flex items-center justify-center shrink-0 ${
                  item.rank === 1 ? "bg-amber-500 text-white shadow-md" : item.rank === 2 ? "bg-slate-300 text-slate-900" : "surface-2 text-primary border border-border"
                }`}>
                  #{item.rank}
                </div>

                <img src={item.avatar} alt={item.name} className="size-12 rounded-full object-cover border-2 border-orange-500/40" />

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-primary">{item.name}</h3>
                    <span className="text-[11px] font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted">{item.college} · {item.projects} Projects Completed</p>
                </div>
              </div>

              {/* Performance Score */}
              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase">Intern Score</p>
                  <p className="font-display text-2xl font-extrabold text-teal-400">{item.score} / 100</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. BADGE VAULT ── */}
      <div className="space-y-4 pt-4">
        <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2">
          <Sparkles className="size-5 text-orange-500" /> Achievement Badges Vault
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((b) => (
            <div key={b.name} className="surface-2 p-5 rounded-2xl border border-border space-y-2 hover:border-orange-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{b.icon}</span>
                <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full">
                  Unlocked
                </span>
              </div>
              <h4 className="font-bold text-sm text-primary">{b.name}</h4>
              <p className="text-xs text-secondary leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. CERTIFICATE GENERATOR MODAL ── */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
          <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-xl font-bold text-primary flex items-center gap-2">
                <Award className="size-5 text-orange-500" /> Official Internship Certificate & LOR
              </h3>
              <button
                onClick={() => setShowCertModal(false)}
                className="text-xs text-muted hover:text-primary font-bold px-2 py-1 surface-2 rounded-lg"
              >
                ✕ Close
              </button>
            </div>

            {/* Certificate Preview Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-surface-2 via-surface to-surface-2 border-2 border-orange-500/40 space-y-5 text-center relative overflow-hidden shadow-inner">
              <div className="inline-flex items-center gap-1 text-xs font-bold text-orange-400 uppercase tracking-widest">
                <ShieldCheck className="size-4" /> CareerOS Verified Credential
              </div>

              <h2 className="font-display text-2xl font-extrabold text-primary">
                Certificate of Internship Completion
              </h2>

              <p className="text-xs text-secondary leading-relaxed max-w-lg mx-auto">
                This is to certify that <strong className="text-primary text-sm font-bold">Bhavesh Rao</strong> has successfully completed a <strong className="text-orange-400">3-Month Software Engineering Internship</strong> working on <strong className="text-primary">AI Voice-Powered Career Assistant</strong> with an overall score of <strong className="text-teal-400 font-bold">94/100</strong>.
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted">
                <div className="text-left space-y-0.5">
                  <p className="font-bold text-primary">Dr. Vikram Sharma</p>
                  <p className="text-[10px]">Head of CareerOS AI Lab</p>
                </div>

                {/* QR Code Verification */}
                <div className="flex items-center gap-2 surface p-2 rounded-xl border border-border text-[10px]">
                  <QrCode className="size-8 text-orange-500" />
                  <div className="text-left">
                    <p className="font-mono font-bold text-primary">ID: COS-2026-9482</p>
                    <p className="text-teal-400">QR Verified</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText("https://careeros.app/verify/COS-2026-9482");
                  notify({ type: "info", icon: "🔗", title: "Link Copied", body: "Verification link copied to clipboard." });
                }}
                className="text-xs font-bold text-secondary hover:text-primary flex items-center gap-1.5"
              >
                <Share2 className="size-3.5 text-orange-500" /> Copy LinkedIn Credential Link
              </button>

              <button
                onClick={handleDownloadCert}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 flex items-center gap-1.5 shadow-md shadow-orange-500/20"
              >
                <Download className="size-4" /> Download PDF Certificate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
