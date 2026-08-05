"use client";

import { useState } from "react";
import {
  Bell,
  Send,
  Users,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Mail,
  Zap,
  Clock,
  Radio,
} from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";

interface BroadcastLog {
  id: string;
  title: string;
  message: string;
  audience: string;
  dispatchedAt: string;
  recipientsCount: number;
}

export default function AdminBroadcastPage() {
  const { notify } = useNotifications();
  const [targetAudience, setTargetAudience] = useState("all_students");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [history, setHistory] = useState<BroadcastLog[]>([
    {
      id: "bc-101",
      title: "Sprint 4 Code Review Deadline Tomorrow at 6 PM IST",
      message: "Please ensure all GitHub PRs are submitted to your Team Leader for evaluation.",
      audience: "Active Internship Cohort Interns",
      dispatchedAt: "2026-07-30 14:00",
      recipientsCount: 24,
    },
    {
      id: "bc-102",
      title: "New Target Company Hiring Maps Added: Swiggy & Razorpay",
      message: "Explore updated CTC packages, interview rounds, and required tech skills.",
      audience: "All Enrolled Students",
      dispatchedAt: "2026-07-25 10:30",
      recipientsCount: 1420,
    },
  ]);

  function handleSendBroadcast(e: React.FormEvent) {
    e.preventDefault();

    const count = targetAudience === "all_students" ? 1420 : targetAudience === "active_interns" ? 24 : 8;
    const newLog: BroadcastLog = {
      id: `bc-${Date.now()}`,
      title,
      message,
      audience: targetAudience.replace("_", " "),
      dispatchedAt: new Date().toLocaleString(),
      recipientsCount: count,
    };

    setHistory([newLog, ...history]);

    notify({
      type: "success",
      icon: "📢",
      title: "Cohort Broadcast Sent!",
      body: `Dispatched "${title}" to ${count} students.`,
      autoDismiss: 4000,
    });

    setTitle("");
    setMessage("");
  }

  return (
    <div className="space-y-6 animate-fade-up">

      {/* Header Banner */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-orange-500/10 via-surface to-surface">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30">
            <Bell className="size-3.5 text-orange-500" /> Cohort Broadcast &amp; Push Notifications
          </div>
          <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
            Automated Announcement Engine
          </h1>
          <p className="text-xs text-secondary">
            Send real-time announcements, Sprint deadline reminders, and offer letter updates to student cohorts via Dashboard Toast alerts and Email digests.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Broadcast Composer Form */}
        <div className="surface border border-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
          <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
            <Send className="size-5 text-orange-500" /> Compose New Announcement
          </h3>

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-primary">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none cursor-pointer"
              >
                <option value="all_students">📢 All Enrolled Students (1,420)</option>
                <option value="active_interns">🚀 Active Internship Cohort Interns (24)</option>
                <option value="team_leaders">🛡️ Team Leaders Only (8)</option>
                <option value="pro_members">⭐ CareerOS Pro Subscribers Only (340)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-primary">Announcement Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Sprint 2 Mandatory Code Review Tomorrow at 6 PM IST"
                className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-primary">Message Body</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Write detailed message for student cohorts..."
                className="w-full p-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110 shadow-md shadow-orange-500/20 flex items-center gap-2"
              >
                <Send className="size-4" /> Dispatch Broadcast Notification
              </button>
            </div>
          </form>
        </div>

        {/* Broadcast History Ledger */}
        <div className="surface border border-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
            <Radio className="size-5 text-teal-400" /> Broadcast Dispatch History
          </h3>

          <div className="space-y-3 text-xs">
            {history.map((h) => (
              <div key={h.id} className="surface-2 p-4 rounded-2xl border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-primary">{h.title}</p>
                  <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                    {h.recipientsCount} Recipients
                  </span>
                </div>
                <p className="text-muted text-[11px]">{h.message}</p>
                <p className="text-[10px] text-muted font-mono pt-1">Audience: {h.audience} · {h.dispatchedAt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
