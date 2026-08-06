"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Flame,
  CheckCircle2,
  Clock,
  Calendar as CalendarIcon,
  Award,
  Sparkles,
  RotateCcw,
  BookOpen,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Zap,
  Sliders,
  Check,
  Circle,
  TrendingUp,
  Target,
  Code2,
  FileCode,
  CheckSquare,
  ListOrdered,
  CalendarDays,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { formatDate } from "@/lib/format";
import { PersonalizedCalendarModal } from "@/components/roadmaps/personalized-calendar-modal";
import { useNotifications } from "@/components/notifications/notification-provider";

interface Task {
  id: string;
  topic_id: string;
  topic_title: string;
  topic_category: string;
  parent_topic_id?: string;
  parent_topic_title?: string;
  notes: string | null;
  objectives?: string[] | null;
  practice_task?: string | null;
  code_snippet?: string | null;
  resources: any;
  estimated_minutes: number;
  scheduled_date: string;
  scheduled_time?: string | null;
  task_type: "study" | "manual-event";
  event_subtype?: "test" | "class" | "interview" | "deadline" | "note" | null;
  completed: boolean;
  is_backlog: boolean;
  order_index: number;
}

interface RoadmapDetail {
  id: string;
  title: string;
  track_id: string;
  is_custom: boolean;
  start_date: string;
  target_end_date: string;
  daily_hours: number;
  status: "active" | "completed" | "abandoned";
}

export default function RoadmapDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: roadmapId } = use(params);
  const router = useRouter();
  const { notify } = useNotifications();

  const [roadmap, setRoadmap] = useState<RoadmapDetail | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todayStr, setTodayStr] = useState("");
  const [backlogCount, setBacklogCount] = useState(0);
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0 });
  const [certificateSlug, setCertificateSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [activeTab, setActiveTab] = useState<"today" | "timetable" | "backlog" | "path">("today");
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [extending, setExtending] = useState(false);

  const loadRoadmapDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/roadmaps/${roadmapId}`);
      const data = await res.json();
      if (data.success) {
        setRoadmap(data.roadmap);
        setTasks(data.tasks || []);
        setTodayStr(data.todayStr || new Date().toISOString().split("T")[0]);
        setBacklogCount(data.backlogCount || 0);
        setStreak(data.streak || { current_streak: 0, longest_streak: 0 });
        if (data.certificate) {
          setCertificateSlug(data.certificate.certificate_slug);
        }
      }
    } catch (e) {
      console.error("Error fetching roadmap detail:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmapDetails();
  }, [roadmapId]);

  const handleToggleTask = async (taskId: string, currentCompleted: boolean) => {
    try {
      const res = await fetch(`/api/roadmaps/${roadmapId}/tasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, completed: !currentCompleted }),
      });

      const data = await res.json();
      if (data.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, completed: !currentCompleted } : t))
        );

        if (data.streak) {
          setStreak(data.streak);
        }

        if (data.roadmapCompleted && data.certificateSlug) {
          setCertificateSlug(data.certificateSlug);
          notify({
            type: "success",
            icon: "🏆",
            title: "Roadmap 100% Completed!",
            body: "Congratulations! You have completed all study topics. Your Verifiable Certificate is ready!",
            autoDismiss: 6000,
          });
        }
      }
    } catch (e) {
      console.error("Error toggling task:", e);
    }
  };

  const handleDeleteRoadmap = async () => {
    if (!roadmap) return;
    if (!confirm(`Are you sure you want to delete "${roadmap.title}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);
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
          body: `Deleted "${roadmap.title}" successfully.`,
          autoDismiss: 4000,
        });
        router.push("/dashboard/roadmaps");
      }
    } catch (err) {
      console.error("Error deleting roadmap:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleExtendPlan = async () => {
    setExtending(true);
    try {
      const res = await fetch(`/api/roadmaps/${roadmapId}/extend`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        notify({
          type: "success",
          icon: "⏳",
          title: "Plan Extended!",
          body: data.message || "Overdue backlog tasks redistributed across new target end date.",
          autoDismiss: 5000,
        });
        loadRoadmapDetails();
      }
    } catch (e) {
      console.error("Error extending plan:", e);
    } finally {
      setExtending(false);
    }
  };

  const handleRescheduleTask = async (taskId: string, newDate: string, newTime?: string) => {
    try {
      const res = await fetch(`/api/roadmaps/${roadmapId}/tasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, scheduled_date: newDate, scheduled_time: newTime }),
      });
      const data = await res.json();
      if (data.success) {
        loadRoadmapDetails();
        notify({
          type: "info",
          icon: "📅",
          title: "Task Rescheduled",
          body: `Moved task to ${formatDate(newDate)}.`,
          autoDismiss: 3000,
        });
      }
    } catch (e) {
      console.error("Error rescheduling task:", e);
    }
  };

  const handleAddManualEvent = async (event: { title: string; event_subtype: string; scheduled_date: string; scheduled_time: string; notes?: string }) => {
    try {
      const res = await fetch(`/api/roadmaps/${roadmapId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      const data = await res.json();
      if (data.success) {
        loadRoadmapDetails();
        notify({
          type: "success",
          icon: "💼",
          title: "Event Added to Schedule",
          body: `Added ${event.title} to your personalized calendar.`,
          autoDismiss: 4000,
        });
      }
    } catch (e) {
      console.error("Error adding manual event:", e);
    }
  };

  if (loading || !roadmap) {
    return (
      <div className="p-8 text-center surface rounded-3xl border border-border text-muted text-xs animate-fade-up">
        Loading roadmap study path...
      </div>
    );
  }

  // Filter Tasks
  const studyTasks = tasks.filter((t) => t.task_type === "study");
  const completedCount = studyTasks.filter((t) => t.completed).length;
  const progressPct = studyTasks.length > 0 ? Math.round((completedCount / studyTasks.length) * 100) : 0;

  const todayTasks = tasks.filter((t) => t.scheduled_date === todayStr && t.task_type === "study");
  const overdueTasks = tasks.filter((t) => !t.completed && t.scheduled_date < todayStr && t.task_type === "study");

  // ─────────────────────────────────────────────────────
  // Group tasks by scheduled date for Timetable View
  const tasksByDate: Record<string, Task[]> = {};
  studyTasks.forEach((t) => {
    if (!tasksByDate[t.scheduled_date]) tasksByDate[t.scheduled_date] = [];
    tasksByDate[t.scheduled_date].push(t);
  });
  const sortedDates = Object.keys(tasksByDate).sort();

  // Helper: group an array of tasks by their parent topic
  function groupByTopic(taskList: Task[]): Array<{ topicId: string; topicTitle: string; category: string; subTasks: Task[] }> {
    const map = new Map<string, { topicId: string; topicTitle: string; category: string; subTasks: Task[] }>();
    for (const t of taskList) {
      const key = t.parent_topic_id || t.topic_id;
      const title = t.parent_topic_title || t.topic_category || "Study";
      const cat = t.topic_category || "";
      if (!map.has(key)) map.set(key, { topicId: key, topicTitle: title, category: cat, subTasks: [] });
      map.get(key)!.subTasks.push(t);
    }
    return Array.from(map.values());
  }

  const todayGroups = groupByTopic(todayTasks);

  return (
    <div className="space-y-6 animate-fade-up text-primary">

      {/* Header Banner */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl bg-gradient-to-br from-orange-500/10 via-surface to-surface relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-500/15 px-3 py-0.5 rounded-full border border-orange-500/30">
                {roadmap.is_custom ? "Custom Gemini Track" : "Predefined Education Track"}
              </span>
              <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-3 py-0.5 rounded-full border border-teal-500/20 flex items-center gap-1">
                <Flame className="size-3 text-orange-500 fill-orange-500" /> {streak.current_streak} Day Streak
              </span>
            </div>

            <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
              {roadmap.title}
            </h1>

            <p className="text-xs text-secondary">
              Timeline: <strong className="text-primary">{formatDate(roadmap.start_date)}</strong> to <strong className="text-primary">{formatDate(roadmap.target_end_date)}</strong> · Budget: <strong className="text-primary">{roadmap.daily_hours} Hours / Day</strong>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowCalendarModal(true)}
              className="px-4 py-2.5 rounded-2xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 shadow-lg shadow-orange-500/20 flex items-center gap-2"
            >
              <CalendarIcon className="size-4" /> Design Personalized Calendar
            </button>

            {certificateSlug && (
              <Link
                href={`/dashboard/roadmaps/certificates/${certificateSlug}`}
                className="px-4 py-2.5 rounded-2xl font-bold text-xs bg-teal-500 text-white hover:brightness-110 shadow-md flex items-center gap-1.5"
              >
                <Award className="size-4" /> View Certificate
              </Link>
            )}

            <button
              onClick={handleDeleteRoadmap}
              disabled={deleting}
              className="px-4 py-2.5 rounded-2xl font-bold text-xs bg-surface-2 hover:bg-red-500/15 text-muted hover:text-red-500 border border-border hover:border-red-500/30 flex items-center gap-1.5 transition-all"
              title="Delete Roadmap"
            >
              {deleting ? <RotateCcw className="size-4 animate-spin" /> : <Trash2 className="size-4 text-red-500" />}
              Delete Roadmap
            </button>
          </div>
        </div>

        {/* Progress Bar & Stats */}
        <div className="space-y-2 pt-2 border-t border-border/60 text-xs">
          <div className="flex items-center justify-between font-bold">
            <span className="text-primary flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-orange-400" /> Granular Sub-Topic Mastery
            </span>
            <span className="text-orange-400 font-mono">{completedCount} of {studyTasks.length} sub-topics completed ({progressPct}%)</span>
          </div>
          <div className="h-2.5 rounded-full bg-surface-2 overflow-hidden border border-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-teal-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* CERTIFICATE BANNER IF COMPLETED */}
      {progressPct === 100 && (
        <div className="surface border border-teal-500/40 rounded-3xl p-5 bg-teal-500/10 flex items-center justify-between gap-4 shadow-lg animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-teal-500 text-white flex items-center justify-center font-bold shrink-0">
              <Award className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-extrabold text-primary">Congratulations! Track 100% Mastered</h3>
              <p className="text-xs text-muted">You have completed every study sub-topic in this roadmap. Your official certificate is ready.</p>
            </div>
          </div>
          {certificateSlug && (
            <Link
              href={`/dashboard/roadmaps/certificates/${certificateSlug}`}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-teal-500 text-white hover:brightness-110 shrink-0"
            >
              Claim Verifiable Certificate &amp; LinkedIn Badge
            </Link>
          )}
        </div>
      )}

      {/* NAV TABS */}
      <div className="flex items-center justify-between border-b border-border text-xs font-bold">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("today")}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "today"
                ? "border-orange-500 text-orange-500 dark:text-orange-400"
                : "border-transparent text-muted hover:text-primary"
            }`}
          >
            <Clock className="size-4" /> Today's Plan ({todayTasks.length})
          </button>

          <button
            onClick={() => setActiveTab("timetable")}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "timetable"
                ? "border-orange-500 text-orange-500 dark:text-orange-400"
                : "border-transparent text-muted hover:text-primary"
            }`}
          >
            <CalendarDays className="size-4 text-orange-500" /> Full Course Timetable
          </button>

          <button
            onClick={() => setActiveTab("backlog")}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "backlog"
                ? "border-orange-500 text-orange-500 dark:text-orange-400"
                : "border-transparent text-muted hover:text-primary"
            }`}
          >
            <AlertTriangle className="size-4 text-amber-500" /> Backlog ({overdueTasks.length})
          </button>

          <button
            onClick={() => setActiveTab("path")}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "path"
                ? "border-orange-500 text-orange-500 dark:text-orange-400"
                : "border-transparent text-muted hover:text-primary"
            }`}
          >
            <Compass className="size-4 text-teal-500" /> Full Curriculum Path
          </button>
        </div>
      </div>

      {/* TABS CONTENT */}

      {/* 1. TODAY'S PLAN TAB */}
      {activeTab === "today" && (
        <div className="space-y-6">
          {todayTasks.length > 0 ? (
            <div className="space-y-6">

              {/* ── TODAY'S TOPIC-GROUPED CHECKLIST ── */}
              <div className="space-y-5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-mono font-bold text-orange-500 uppercase tracking-wider">
                    📅 Today's Study Plan · {formatDate(todayStr)}
                  </span>
                  <span className="text-xs font-mono font-bold text-muted">
                    {todayTasks.filter((t) => t.completed).length} / {todayTasks.length} completed
                  </span>
                </div>

                {todayGroups.map((group) => {
                  const doneCount = group.subTasks.filter((t) => t.completed).length;
                  const allDone = doneCount === group.subTasks.length;
                  return (
                    <div
                      key={group.topicId}
                      className={`surface rounded-3xl border shadow-lg overflow-hidden transition-all ${
                        allDone ? "border-teal-500/40 bg-teal-500/5" : "border-orange-500/30 bg-orange-500/5"
                      }`}
                    >
                      {/* Topic Header */}
                      <div className={`flex items-center justify-between px-6 py-4 border-b ${
                        allDone ? "border-teal-500/20" : "border-orange-500/20"
                      }`}>
                        <div className="flex items-center gap-3">
                          <span className={`size-8 rounded-2xl flex items-center justify-center shrink-0 ${
                            allDone ? "bg-teal-500 text-white" : "bg-orange-500 text-white"
                          }`}>
                            {allDone ? <CheckCircle2 className="size-4" /> : <BookOpen className="size-4" />}
                          </span>
                          <div>
                            <p className="font-display text-base font-extrabold text-primary">{group.topicTitle}</p>
                            <p className="text-[11px] text-muted">{group.category} · {group.subTasks.length} sub-topics</p>
                          </div>
                        </div>
                        <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded-xl border ${
                          allDone
                            ? "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30"
                            : "bg-surface-2 text-muted border-border"
                        }`}>
                          {doneCount} / {group.subTasks.length}
                        </span>
                      </div>

                      {/* Sub-Topic List */}
                      <div className="divide-y divide-border/40">
                        {group.subTasks.map((task, idx) => (
                          <div
                            key={task.id}
                            className={`flex items-center justify-between gap-4 px-6 py-4 transition-all ${
                              task.completed ? "opacity-70" : "hover:bg-surface-2/50"
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              {/* Number Badge */}
                              <span className={`size-7 rounded-xl flex items-center justify-center font-mono font-extrabold text-xs shrink-0 ${
                                task.completed
                                  ? "bg-teal-500 text-white"
                                  : "bg-surface-2 border border-border text-muted"
                              }`}>
                                {task.completed ? "✓" : idx + 1}
                              </span>

                              <p className={`text-sm font-semibold ${
                                task.completed ? "line-through text-muted" : "text-primary"
                              }`}>
                                {task.topic_title}
                              </p>
                            </div>

                            <button
                              onClick={() => handleToggleTask(task.id, task.completed)}
                              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                                task.completed
                                  ? "bg-teal-500 text-white shadow-sm"
                                  : "bg-orange-500 text-white hover:brightness-110 shadow-md shadow-orange-500/20"
                              }`}
                            >
                              {task.completed ? <CheckCircle2 className="size-3.5" /> : <Circle className="size-3.5" />}
                              {task.completed ? "Completed ✓" : "Mark Complete"}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DETAILED STUDY CARDS WITH NOTES, CODE & PRACTICE */}
              <div className="space-y-5 pt-2">
                <div className="flex items-center justify-between px-1 text-xs font-bold text-muted uppercase tracking-wider">
                  <span>Detailed Study Guide &amp; Code Examples</span>
                </div>

                {todayTasks.map((task, idx) => (
                  <div
                    key={task.id}
                    className={`surface rounded-3xl p-6 sm:p-7 border space-y-5 transition-all shadow-md ${
                      task.completed
                        ? "border-teal-500/40 bg-teal-500/5 opacity-85"
                        : "border-orange-500/30 hover:border-orange-500/60"
                    }`}
                  >
                    {/* Sub-Topic Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-extrabold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-3 py-0.5 rounded-full border border-orange-500/20">
                            Task #{idx + 1} · {task.topic_category}
                          </span>
                          <span className="text-[10px] font-mono text-muted flex items-center gap-1">
                            <Clock className="size-3 text-orange-500" /> {task.estimated_minutes} Minutes
                          </span>
                        </div>
                        <h3 className="font-display text-xl font-extrabold text-primary">{task.topic_title}</h3>
                      </div>

                      <button
                        onClick={() => handleToggleTask(task.id, task.completed)}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
                          task.completed
                            ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20"
                            : "bg-orange-500 text-white hover:brightness-110 shadow-lg shadow-orange-500/20"
                        }`}
                      >
                        {task.completed ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
                        {task.completed ? "Completed ✓" : "Mark Complete"}
                      </button>
                    </div>

                    {/* 🎯 Key Learning Objectives */}
                    {Array.isArray(task.objectives) && task.objectives.length > 0 && (
                      <div className="surface-2 p-4 rounded-2xl border border-border space-y-2 text-xs">
                        <span className="font-extrabold text-orange-600 dark:text-orange-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                          <Target className="size-3.5" /> Key Learning Objectives &amp; Study Goals
                        </span>
                        <ul className="space-y-1 pl-1 text-secondary">
                          {task.objectives.map((obj, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-orange-500 font-bold">•</span>
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 📖 Educational Guidance & Notes */}
                    {task.notes && (
                      <div className="surface-2 p-4 sm:p-5 rounded-2xl border border-border space-y-2 text-xs">
                        <span className="font-extrabold text-teal-600 dark:text-teal-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="size-3.5" /> Core Concepts &amp; Study Guide Notes
                        </span>
                        <p className="text-secondary leading-relaxed">{task.notes}</p>
                      </div>
                    )}

                    {/* 💻 Runnable Code Snippet */}
                    {task.code_snippet && (
                      <div className="surface-2 rounded-2xl border border-border overflow-hidden text-xs">
                        <div className="px-4 py-2 bg-surface-3 border-b border-border flex items-center justify-between text-[11px] font-mono text-muted">
                          <span className="flex items-center gap-1.5 font-bold text-primary">
                            <Code2 className="size-3.5 text-orange-500" /> Reference Code Example
                          </span>
                          <span>JavaScript / Python</span>
                        </div>
                        <pre className="p-4 font-mono text-[11px] text-orange-600 dark:text-orange-300 overflow-x-auto bg-surface leading-relaxed">
                          {task.code_snippet}
                        </pre>
                      </div>
                    )}

                    {/* 💡 Homework Practice Task */}
                    {task.practice_task && (
                      <div className="surface-2 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 text-xs space-y-1">
                        <span className="font-extrabold text-amber-600 dark:text-amber-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                          <FileCode className="size-3.5" /> Hands-On Practice Exercise / Homework
                        </span>
                        <p className="text-primary font-medium">{task.practice_task}</p>
                      </div>
                    )}

                    {/* 🔗 Learning Resources */}
                    {Array.isArray(task.resources) && task.resources.length > 0 && (
                      <div className="space-y-1.5 pt-1 text-xs">
                        <span className="font-extrabold text-muted text-[10px] uppercase tracking-wider block">Recommended Learning Resources:</span>
                        <div className="flex items-center gap-3 flex-wrap">
                          {task.resources.map((r: any, idx: number) => (
                            <a
                              key={idx}
                              href={r.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-teal-600 dark:text-teal-400 font-bold hover:underline flex items-center gap-1.5 text-xs surface-2 px-3 py-1.5 rounded-xl border border-border"
                            >
                              <ExternalLink className="size-3.5" /> {r.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="surface border border-border rounded-3xl p-8 text-center space-y-2">
              <CheckCircle2 className="size-10 text-teal-400 mx-auto" />
              <h3 className="font-bold text-primary text-base">No Sub-Topics Scheduled For Today!</h3>
              <p className="text-xs text-muted">You are all caught up for today. Check your Full Course Timetable or open the Personalized Calendar to view upcoming dates.</p>
            </div>
          )}
        </div>
      )}

      {/* 2. FULL COURSE TIMETABLE TAB */}
      {activeTab === "timetable" && (
        <div className="surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-border">
            <div className="space-y-1">
              <h3 className="font-display text-xl font-extrabold text-primary flex items-center gap-2">
                <CalendarDays className="size-5 text-orange-500" /> Full Course Timetable ({sortedDates.length} Study Days)
              </h3>
              <p className="text-xs text-muted">
                Complete date-by-date timetable scheduled from {formatDate(roadmap.start_date)} through {formatDate(roadmap.target_end_date)}.
              </p>
            </div>
            <button
              onClick={() => setShowCalendarModal(true)}
              className="px-4 py-2 rounded-xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 shadow-md flex items-center gap-1.5"
            >
              <CalendarIcon className="size-3.5" /> Open Full-Screen Grid
            </button>
          </div>

          <div className="space-y-5">
            {sortedDates.map((dateStr, dIdx) => {
              const dayTasks = tasksByDate[dateStr];
              const isToday = dateStr === todayStr;
              const dayGroups = groupByTopic(dayTasks);
              const dayDone = dayTasks.filter((t) => t.completed).length;

              return (
                <div
                  key={dateStr}
                  className={`surface-2 rounded-3xl border transition-all overflow-hidden ${
                    isToday ? "border-orange-500 ring-2 ring-orange-500/20" : "border-border"
                  }`}
                >
                  {/* Day Header */}
                  <div className={`flex items-center justify-between px-5 py-3 border-b ${
                    isToday ? "bg-orange-500/10 border-orange-500/30" : "border-border"
                  }`}>
                    <span className="font-display font-extrabold text-sm text-primary flex items-center gap-2">
                      <span className={`size-2.5 rounded-full ${ isToday ? "bg-orange-500 animate-pulse" : "bg-border" }`}></span>
                      Day #{dIdx + 1} · {formatDate(dateStr)}
                      {isToday && <span className="text-orange-500 text-[10px] font-mono font-bold bg-orange-500/15 px-2 py-0.5 rounded-full">TODAY</span>}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-muted">
                      {dayDone}/{dayTasks.length} done
                    </span>
                  </div>

                  {/* Topics for this day */}
                  <div className="divide-y divide-border/30">
                    {dayGroups.map((group) => {
                      const gDone = group.subTasks.filter((t) => t.completed).length;
                      return (
                        <div key={group.topicId} className="px-5 py-4 space-y-3">
                          {/* Topic Label */}
                          <div className="flex items-center gap-2">
                            <span className="font-display font-extrabold text-sm text-primary">{group.topicTitle}</span>
                            <span className="text-[10px] font-mono text-muted">({gDone}/{group.subTasks.length})</span>
                          </div>
                          {/* Sub-topics */}
                          <div className="space-y-2">
                            {group.subTasks.map((st, idx) => (
                              <div
                                key={st.id}
                                className={`flex items-center justify-between gap-3 p-3 rounded-2xl border text-xs transition-all ${
                                  st.completed ? "border-teal-500/30 bg-teal-500/5 opacity-75" : "border-border hover:border-orange-500/40"
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className={`size-6 rounded-lg flex items-center justify-center font-mono font-bold text-[11px] shrink-0 ${
                                    st.completed ? "bg-teal-500 text-white" : "bg-surface text-muted border border-border"
                                  }`}>
                                    {st.completed ? "✓" : idx + 1}
                                  </span>
                                  <p className={`font-semibold ${ st.completed ? "line-through text-muted" : "text-primary" }`}>
                                    {st.topic_title}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleToggleTask(st.id, st.completed)}
                                  className={`shrink-0 px-3.5 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all ${
                                    st.completed ? "bg-teal-500 text-white" : "bg-orange-500 text-white hover:brightness-110"
                                  }`}
                                >
                                  {st.completed ? <CheckCircle2 className="size-3" /> : <Circle className="size-3" />}
                                  {st.completed ? "Done ✓" : "Mark Complete"}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. BACKLOG TAB */}
      {activeTab === "backlog" && (
        <div className="space-y-4">
          <div className="surface border border-amber-500/30 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-amber-500/5 shadow-sm">
            <div className="space-y-1">
              <h3 className="font-display text-base font-extrabold text-primary flex items-center gap-2">
                <AlertTriangle className="size-4 text-amber-500" /> Overdue Incomplete Sub-Topics ({overdueTasks.length})
              </h3>
              <p className="text-xs text-muted">
                These sub-topics were scheduled for earlier dates but not yet completed. Use the Extend Plan button to recalculate pacing and push target date forward.
              </p>
            </div>

            {overdueTasks.length > 0 && (
              <button
                onClick={handleExtendPlan}
                disabled={extending}
                className="px-5 py-2.5 rounded-2xl font-bold text-xs bg-amber-500 text-white hover:brightness-110 shadow-md shrink-0 flex items-center gap-1.5"
              >
                {extending ? <RotateCcw className="size-3.5 animate-spin" /> : <Clock className="size-3.5" />}
                Extend Plan by Backlog Days
              </button>
            )}
          </div>

          <div className="space-y-3">
            {overdueTasks.map((task) => (
              <div key={task.id} className="surface rounded-2xl p-4 border border-border flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-amber-500 font-mono font-bold">Was Scheduled for {formatDate(task.scheduled_date)}</span>
                  <p className="font-bold text-primary text-sm">{task.topic_title}</p>
                </div>

                <button
                  onClick={() => handleToggleTask(task.id, task.completed)}
                  className="px-3.5 py-1.5 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110"
                >
                  Mark Complete Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. FULL CURRICULUM PATH TAB */}
      {activeTab === "path" && (
        <div className="surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="font-display text-lg font-extrabold text-primary flex items-center gap-2">
            <Compass className="size-5 text-orange-500" /> Granular Sub-Topic Curriculum Timeline
          </h3>

          <div className="space-y-6 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
            {studyTasks.map((t, idx) => (
              <div key={t.id} className="relative flex items-start gap-4 pl-12 text-xs">
                <div className={`absolute left-2.5 top-0 size-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold z-10 ${
                  t.completed
                    ? "bg-teal-500 border-teal-500 text-white"
                    : t.scheduled_date === todayStr
                    ? "bg-orange-500 border-orange-500 text-white animate-pulse"
                    : "surface-2 border-border text-muted"
                }`}>
                  {t.completed ? "✓" : idx + 1}
                </div>

                <div className="flex-1 surface-2 p-4 rounded-2xl border border-border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary text-sm">{t.topic_title}</span>
                    <span className="text-[10px] font-mono text-muted">Date: {formatDate(t.scheduled_date)}</span>
                  </div>
                  <p className="text-secondary text-[11px]">{t.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OPT-IN PERSONALIZED CALENDAR WORKSPACE */}
      <PersonalizedCalendarModal
        roadmapId={roadmap.id}
        roadmapTitle={roadmap.title}
        tasks={tasks}
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        onTaskRescheduled={handleRescheduleTask}
        onManualEventAdded={handleAddManualEvent}
      />

    </div>
  );
}
