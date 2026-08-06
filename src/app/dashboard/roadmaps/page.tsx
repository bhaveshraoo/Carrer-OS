"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  Plus,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ArrowRight,
  Code2,
  Server,
  Layout,
  Layers,
  Globe,
  RotateCcw,
  Zap,
  TrendingUp,
  X,
  BookOpen,
  ArrowLeft,
  Calendar,
  Trash2,
} from "lucide-react";
import { formatDate } from "@/lib/format";
import { PREDEFINED_TRACKS, TrackDefinition } from "@/lib/roadmaps/tracks-data";
import { useNotifications } from "@/components/notifications/notification-provider";
import { SEED_ROADMAPS } from "@/lib/roadmaps/seed-roadmaps";

interface RoadmapItem {
  id: string;
  track_id: string;
  title: string;
  is_custom: boolean;
  start_date: string;
  target_end_date: string;
  daily_hours: number;
  status: "active" | "completed" | "abandoned";
  total_tasks: number;
  completed_tasks: number;
  progress_pct: number;
}

export default function RoadmapsHubPage() {
  const { notify } = useNotifications();
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [selectedTrackId, setSelectedTrackId] = useState("dsa");
  const [customTopicInput, setCustomTopicInput] = useState("");
  const [durationMonths, setDurationMonths] = useState(3);
  const [dailyHours, setDailyHours] = useState(2);
  const [creating, setCreating] = useState(false);

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/roadmaps");
      const data = await res.json();
      if (data.success && data.roadmaps && data.roadmaps.length > 0) {
        setRoadmaps(data.roadmaps);
      } else {
        setRoadmaps(SEED_ROADMAPS);
      }
    } catch (e) {
      console.error("Error loading roadmaps, using seed fallback:", e);
      setRoadmaps(SEED_ROADMAPS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleCreateRoadmapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch("/api/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId: selectedTrackId,
          customTopic: selectedTrackId === "custom" ? customTopicInput : "",
          durationMonths: Number(durationMonths),
          dailyHours: Number(dailyHours),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        notify({
          type: "warning",
          icon: "⚠️",
          title: "Roadmap Creation Notice",
          body: data.error || "Could not create roadmap.",
          autoDismiss: 6000,
        });
        return;
      }

      notify({
        type: "success",
        icon: "🚀",
        title: "Study Roadmap Generated!",
        body: `Created "${data.title}" with ${data.totalTasks} structured tasks scheduled through ${formatDate(data.targetEndDate)}.`,
        autoDismiss: 4500,
      });

      setIsCreating(false);
      setCustomTopicInput("");
      fetchRoadmaps();
    } catch (err: any) {
      notify({
        type: "warning",
        icon: "⚠️",
        title: "Error",
        body: err.message || "Failed to generate roadmap",
        autoDismiss: 4000,
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteRoadmap = async (e: React.MouseEvent, roadmapId: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(roadmapId);
    try {
      const res = await fetch(`/api/roadmaps/${roadmapId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        notify({
          type: "success",
          icon: "🗑️",
          title: "Roadmap Deleted",
          body: `Deleted "${title}" and all its scheduled tasks.`,
          autoDismiss: 4000,
        });
        fetchRoadmaps();
      }
    } catch (err) {
      console.error("Error deleting roadmap:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const getTrackIcon = (iconName: string) => {
    switch (iconName) {
      case "Code2":
        return <Code2 className="size-6 text-orange-500" />;
      case "Server":
        return <Server className="size-6 text-blue-500" />;
      case "Layout":
        return <Layout className="size-6 text-teal-400" />;
      case "Layers":
        return <Layers className="size-6 text-purple-500" />;
      case "Globe":
        return <Globe className="size-6 text-emerald-500" />;
      default:
        return <Sparkles className="size-6 text-amber-500" />;
    }
  };

  // ── FULL PAGE ROADMAP CREATION STUDIO VIEW ──
  if (isCreating) {
    return (
      <div className="min-h-screen space-y-8 animate-fade-up max-w-6xl mx-auto py-4 px-2 sm:px-4 text-primary">
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <button
            onClick={() => setIsCreating(false)}
            className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary transition-colors surface-2 px-4 py-2.5 rounded-2xl border border-border"
          >
            <ArrowLeft className="size-4 text-orange-500" /> Back to Active Roadmaps
          </button>
          <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            Roadmap Builder Studio
          </span>
        </div>

        {/* Full Page Studio Header */}
        <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-10 space-y-3 shadow-xl bg-gradient-to-br from-orange-500/10 via-surface to-surface relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold text-orange-400 bg-orange-500/15 border border-orange-500/30">
            <Compass className="size-4 text-orange-500" /> AI-Powered Education Architect
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            Design Your Personalized Study Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-secondary max-w-3xl">
            Select a structured education track or prompt Gemini AI for a custom skill-tree. We will distribute daily study topics, notes, and milestones across your target end date.
          </p>
        </div>

        <form onSubmit={handleCreateRoadmapSubmit} className="space-y-8 text-xs">
          
          {/* STEP 1: SELECT STUDY TRACK */}
          <div className="surface border border-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="space-y-1">
              <h2 className="font-display text-lg font-extrabold text-primary flex items-center gap-2">
                <BookOpen className="size-5 text-orange-500" /> 1. Select Your Target Education Track
              </h2>
              <p className="text-xs text-muted">Choose from predefined placement skill trees or prompt Gemini for any custom tech domain.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PREDEFINED_TRACKS.map((track) => {
                const isSelected = selectedTrackId === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => setSelectedTrackId(track.id)}
                    className={`surface-2 rounded-3xl p-5 border cursor-pointer transition-all space-y-3 relative flex flex-col justify-between ${
                      isSelected
                        ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10 scale-[1.02]"
                        : "border-border hover:border-orange-500/40 hover:shadow-md"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="size-10 rounded-2xl bg-orange-500/15 text-orange-500 flex items-center justify-center font-bold">
                          {getTrackIcon(track.iconName)}
                        </div>
                        {isSelected && (
                          <span className="size-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                            ✓
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-base font-bold text-primary">{track.title}</h3>
                      <p className="text-[11px] text-secondary leading-relaxed line-clamp-3">{track.description}</p>
                    </div>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted font-bold">
                      <span>{track.topics.length} Modules</span>
                      <span className="text-teal-400 font-mono">~{track.estimatedTotalHours} Hours Total</span>
                    </div>
                  </div>
                );
              })}

              {/* CUSTOM GEMINI TRACK OPTION */}
              <div
                onClick={() => setSelectedTrackId("custom")}
                className={`surface-2 rounded-3xl p-5 border cursor-pointer transition-all space-y-3 relative flex flex-col justify-between ${
                  selectedTrackId === "custom"
                    ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10 scale-[1.02]"
                    : "border-border hover:border-orange-500/40 hover:shadow-md"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="size-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
                      <Sparkles className="size-5" />
                    </div>
                    {selectedTrackId === "custom" && (
                      <span className="size-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                        ✓
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-base font-bold text-orange-400 flex items-center gap-1.5">
                    Custom Topic (Gemini AI)
                  </h3>
                  <p className="text-[11px] text-secondary leading-relaxed">
                    Generate a structured skill tree for any topic outside predefined list (e.g. DevOps, Quantum Computing, iOS Development).
                  </p>
                </div>

                <div className="pt-2 border-t border-border/60 text-[10px] text-amber-400 font-bold">
                  ⚡ Powered by Gemini 3.1 Flash-Lite
                </div>
              </div>
            </div>

            {/* Custom Free-Text Input */}
            {selectedTrackId === "custom" && (
              <div className="surface p-5 rounded-2xl border border-orange-500/40 space-y-2 animate-fade-up bg-orange-500/5">
                <label className="font-bold text-primary text-sm flex items-center gap-2">
                  <Sparkles className="size-4 text-amber-400" /> Enter Custom Study Topic or Skill
                </label>
                <input
                  type="text"
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  required={selectedTrackId === "custom"}
                  placeholder="e.g. Kubernetes & Cloud Native Architecture, Rust System Programming, Advanced iOS Swift..."
                  className="w-full h-12 px-4 rounded-xl surface-2 border border-border text-xs text-primary font-semibold focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* STEP 2: PACING & TIME COMMITMENT */}
          <div className="surface border border-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="space-y-1">
              <h2 className="font-display text-lg font-extrabold text-primary flex items-center gap-2">
                <Clock className="size-5 text-teal-400" /> 2. Target Duration &amp; Daily Time Budget
              </h2>
              <p className="text-xs text-muted">Set your completion timeframe and how many hours per day you can commit to study.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              
              {/* Target Duration Pills */}
              <div className="space-y-2">
                <label className="font-bold text-primary">Target Completion Timeframe</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { months: 2, label: "2 Months", sub: "Accelerated" },
                    { months: 3, label: "3 Months", sub: "Standard" },
                    { months: 6, label: "6 Months", sub: "In-Depth" },
                  ].map((d) => (
                    <button
                      key={d.months}
                      type="button"
                      onClick={() => setDurationMonths(d.months)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        durationMonths === d.months
                          ? "bg-orange-500 text-white border-orange-500 shadow-md font-bold"
                          : "surface-2 text-secondary hover:text-primary border-border"
                      }`}
                    >
                      <p className="font-extrabold text-sm">{d.label}</p>
                      <p className="text-[10px] opacity-80">{d.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Hours Pills */}
              <div className="space-y-2">
                <label className="font-bold text-primary">Daily Time Budget (Hours / Day)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { hrs: 1, label: "1 Hr/day" },
                    { hrs: 2, label: "2 Hrs/day" },
                    { hrs: 3, label: "3 Hrs/day" },
                    { hrs: 4, label: "4 Hrs/day" },
                  ].map((h) => (
                    <button
                      key={h.hrs}
                      type="button"
                      onClick={() => setDailyHours(h.hrs)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        dailyHours === h.hrs
                          ? "bg-teal-500 text-white border-teal-500 shadow-md font-bold"
                          : "surface-2 text-secondary hover:text-primary border-border"
                      }`}
                    >
                      <p className="font-extrabold text-xs">{h.label}</p>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* STEP 3: SUBMIT BUTTON */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-6 py-3 rounded-2xl font-bold surface-2 border border-border text-secondary hover:text-primary"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={creating}
              className="px-8 py-4 rounded-2xl font-extrabold text-sm bg-orange-500 text-white hover:brightness-110 shadow-xl shadow-orange-500/25 flex items-center gap-2.5 transition-all"
            >
              {creating ? <RotateCcw className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
              {creating ? "Generating Full Course Schedule..." : "Generate Personalized Study Roadmap"}
            </button>
          </div>

        </form>
      </div>
    );
  }

  // ── MAIN ROADMAPS HUB GRID VIEW ──
  return (
    <div className="space-y-6 animate-fade-up text-primary">

      {/* Header Banner */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-orange-500/10 via-surface to-surface relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold text-orange-400 bg-orange-500/15 border border-orange-500/30">
              <Compass className="size-3.5 text-orange-500" /> Personalized Education Paths
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              Personalized Study Roadmaps
            </h1>
            <p className="text-xs sm:text-sm text-secondary max-w-2xl">
              Structured, dependency-aware skill trees with daily pacing, study notes, backlog extensions, opt-in calendar scheduling, and verifiable completion certificates.
            </p>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="px-6 py-3.5 rounded-2xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 shadow-lg shadow-orange-500/20 shrink-0 flex items-center gap-2 transition-all"
          >
            <Plus className="size-4" /> Create New Roadmap
          </button>
        </div>
      </div>

      {/* Active Roadmaps Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1 text-xs font-bold text-muted uppercase tracking-wider">
          <span>Your Active Study Roadmaps ({roadmaps.length})</span>
          <span>Click to open path</span>
        </div>

        {loading ? (
          <div className="p-8 text-center surface rounded-3xl border border-border text-muted text-xs">
            Loading your study roadmaps...
          </div>
        ) : roadmaps.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {roadmaps.map((rm) => (
              <div
                key={rm.id}
                className="surface border border-border rounded-3xl p-6 space-y-4 shadow-sm hover:border-orange-500/50 hover:shadow-orange-500/10 hover:shadow-lg transition-all group flex flex-col justify-between relative"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                      {rm.is_custom ? "Gemini Custom Track" : "Predefined Track"}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                        rm.status === "completed"
                          ? "bg-teal-500/15 text-teal-400 border-teal-500/30"
                          : "bg-orange-500/15 text-orange-400 border-orange-500/30"
                      }`}>
                        {rm.status}
                      </span>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => handleDeleteRoadmap(e, rm.id, rm.title)}
                        disabled={deletingId === rm.id}
                        className="p-1.5 rounded-xl surface-2 text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors border border-border"
                        title="Delete Roadmap"
                      >
                        {deletingId === rm.id ? <RotateCcw className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                      </button>
                    </div>
                  </div>

                  <Link href={`/dashboard/roadmaps/${rm.id}`} className="block space-y-2">
                    <h3 className="font-display text-lg font-extrabold text-primary group-hover:text-orange-400 transition-colors">
                      {rm.title}
                    </h3>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between text-muted font-bold text-[11px]">
                        <span>Progress</span>
                        <span className="text-orange-400 font-mono">{rm.progress_pct}% Completed</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-2 overflow-hidden border border-border">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                          style={{ width: `${rm.progress_pct}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted font-semibold">
                    Target: <strong className="text-primary">{formatDate(rm.target_end_date)}</strong>
                  </span>
                  <Link
                    href={`/dashboard/roadmaps/${rm.id}`}
                    className="text-orange-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    Open Path <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="surface border border-border rounded-3xl p-8 text-center space-y-4">
            <div className="size-14 rounded-3xl bg-orange-500/15 text-orange-500 flex items-center justify-center font-bold text-2xl mx-auto border border-orange-500/30">
              <Compass className="size-7" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="font-display text-lg font-bold text-primary">No Active Study Roadmaps Yet</h3>
              <p className="text-xs text-muted">
                Create your first personalized study path from predefined tracks (DSA, System Design, Full Stack) or generate a custom track using Gemini AI!
              </p>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-2.5 rounded-2xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 shadow-md"
            >
              Start First Roadmap Now
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
