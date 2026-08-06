"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  GraduationCap,
  FileCheck,
  AlertTriangle,
  StickyNote,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { formatDate } from "@/lib/format";
import { addDays } from "@/lib/roadmaps/planner";

interface TaskItem {
  id: string;
  scheduled_date: string;
  scheduled_time?: string | null;
  topic_title: string;
  topic_category: string;
  notes?: string | null;
  estimated_minutes: number;
  task_type: "study" | "manual-event";
  event_subtype?: "test" | "class" | "interview" | "deadline" | "note" | null;
  completed: boolean;
}

interface CalendarModalProps {
  roadmapId: string;
  roadmapTitle: string;
  tasks: TaskItem[];
  isOpen: boolean;
  onClose: () => void;
  onTaskRescheduled: (taskId: string, newDate: string, newTime?: string) => void;
  onManualEventAdded: (event: { title: string; event_subtype: string; scheduled_date: string; scheduled_time: string; notes?: string }) => void;
}

export function PersonalizedCalendarModal({
  roadmapId,
  roadmapTitle,
  tasks,
  isOpen,
  onClose,
  onTaskRescheduled,
  onManualEventAdded,
}: CalendarModalProps) {
  const [mounted, setMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateForEvent, setSelectedDateForEvent] = useState<string | null>(null);

  // Manual Event Form State
  const [eventTitle, setEventTitle] = useState("");
  const [eventSubtype, setEventSubtype] = useState<"test" | "class" | "interview" | "deadline" | "note">("interview");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("10:00");
  const [eventNotes, setEventNotes] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  // Calendar Days Calculation
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarGridDays: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  // Previous Month Padding
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const prevDay = prevMonthLastDay - i;
    const prevMonthDate = new Date(year, month - 1, prevDay);
    calendarGridDays.push({
      dateStr: prevMonthDate.toISOString().split("T")[0],
      dayNum: prevDay,
      isCurrentMonth: false,
    });
  }

  // Current Month Days
  for (let day = 1; day <= daysInMonth; day++) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    calendarGridDays.push({
      dateStr: `${year}-${mm}-${dd}`,
      dayNum: day,
      isCurrentMonth: true,
    });
  }

  // Map Tasks by Date
  const tasksByDate: Record<string, TaskItem[]> = {};
  tasks.forEach((t) => {
    if (!tasksByDate[t.scheduled_date]) tasksByDate[t.scheduled_date] = [];
    tasksByDate[t.scheduled_date].push(t);
  });

  function handleCreateManualEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!eventTitle || !eventDate) return;

    onManualEventAdded({
      title: eventTitle,
      event_subtype: eventSubtype,
      scheduled_date: eventDate,
      scheduled_time: eventTime,
      notes: eventNotes,
    });

    setEventTitle("");
    setSelectedDateForEvent(null);
  }

  const getEventBadge = (subtype?: string | null) => {
    switch (subtype) {
      case "interview":
        return { label: "Interview", icon: <Briefcase className="size-3" />, color: "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 font-bold" };
      case "test":
        return { label: "Exam / Test", icon: <FileCheck className="size-3" />, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold" };
      case "class":
        return { label: "College Class", icon: <GraduationCap className="size-3" />, color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-bold" };
      case "deadline":
        return { label: "Deadline", icon: <AlertTriangle className="size-3" />, color: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold" };
      default:
        return { label: "Note / Event", icon: <StickyNote className="size-3" />, color: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 font-bold" };
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-2xl overflow-y-auto flex flex-col p-4 sm:p-8 animate-fade-up text-primary">
      <div className="w-full max-w-[1600px] mx-auto space-y-6 flex-1 flex flex-col justify-between">
        
        {/* Full-Page Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="space-y-1">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary transition-colors surface-2 px-3.5 py-1.5 rounded-xl border border-border mb-1"
            >
              <ArrowLeft className="size-3.5 text-orange-500" /> Back to Roadmap Details
            </button>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-primary tracking-tight flex items-center gap-2">
              Personalized Calendar &amp; Time-Slot Schedule
            </h1>
            <p className="text-xs text-secondary">
              Reschedule study topics via click/drag, assign time slots, and schedule real-world events (tests, college classes, interviews).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                const todayYmd = new Date().toISOString().split("T")[0];
                setEventDate(todayYmd);
                setSelectedDateForEvent(todayYmd);
              }}
              className="px-5 py-3 rounded-2xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 flex items-center gap-2 shadow-lg shadow-orange-500/20"
            >
              <Plus className="size-4" /> Add Real-World Event
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-2xl surface-2 border border-border font-bold text-xs text-secondary hover:text-primary"
            >
              Close Studio
            </button>
          </div>
        </div>

        {/* Calendar Control & Legend Toolbar */}
        <div className="surface border border-border rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
              className="p-2.5 rounded-xl surface-2 border border-border text-primary hover:bg-surface-3 transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="font-display text-lg font-extrabold text-primary min-w-[160px] text-center">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <button
              onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
              className="p-2.5 rounded-xl surface-2 border border-border text-primary hover:bg-surface-3 transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Color Legend Pills */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-bold surface-2 px-3 py-1 rounded-xl border border-orange-500/30">
              <span className="size-2.5 rounded-full bg-orange-500"></span> Study Topics
            </span>
            <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold surface-2 px-3 py-1 rounded-xl border border-red-500/30">
              <span className="size-2.5 rounded-full bg-red-500"></span> Interview / Exam
            </span>
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold surface-2 px-3 py-1 rounded-xl border border-blue-500/30">
              <span className="size-2.5 rounded-full bg-blue-500"></span> College Class
            </span>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2.5 text-center font-extrabold text-xs text-primary py-1">
          {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => (
            <div key={d} className="surface-2 py-2.5 rounded-2xl border border-border uppercase tracking-wider text-[11px] font-bold shadow-xs">
              {d}
            </div>
          ))}
        </div>

        {/* Full-Page Theme-Aware Calendar Grid */}
        <div className="flex-1 grid grid-cols-7 gap-2.5 pt-1 overflow-y-auto min-h-[520px]">
          {calendarGridDays.map((cell, idx) => {
            const dayTasks = tasksByDate[cell.dateStr] || [];
            const isToday = cell.dateStr === new Date().toISOString().split("T")[0];
            const hasHeavyEvent = dayTasks.some((t) => t.event_subtype === "interview" || t.event_subtype === "test");

            return (
              <div
                key={idx}
                onClick={() => {
                  setEventDate(cell.dateStr);
                  setSelectedDateForEvent(cell.dateStr);
                }}
                className={`surface border rounded-3xl p-3.5 min-h-[145px] flex flex-col justify-between transition-all cursor-pointer hover:border-orange-500/60 hover:shadow-lg ${
                  isToday
                    ? "border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/30 shadow-md"
                    : cell.isCurrentMonth
                    ? "border-border shadow-xs"
                    : "opacity-40 bg-surface/50 border-border/50"
                } ${hasHeavyEvent ? "bg-red-500/10 border-red-500/30" : ""}`}
              >
                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-border/60">
                  <span className={`font-mono font-extrabold ${isToday ? "text-orange-600 dark:text-orange-400 text-sm" : "text-primary"}`}>
                    {cell.dayNum}
                  </span>
                  {hasHeavyEvent && (
                    <span className="text-[9px] font-extrabold text-red-600 dark:text-red-400 bg-red-500/15 px-2 py-0.5 rounded-full border border-red-500/30">
                      ⚡ Light Load
                    </span>
                  )}
                </div>

                {/* Day Tasks List */}
                <div className="space-y-1.5 my-2 flex-1 overflow-y-auto max-h-[135px] text-[11px]">
                  {dayTasks.map((task) => {
                    if (task.task_type === "manual-event") {
                      const badge = getEventBadge(task.event_subtype);
                      return (
                        <div
                          key={task.id}
                          className={`p-1.5 rounded-xl flex items-center justify-between gap-1 shadow-xs ${badge.color}`}
                        >
                          <span className="truncate flex items-center gap-1.5">
                            {badge.icon} {task.topic_title}
                          </span>
                          <span className="font-mono text-[9px] shrink-0">{task.scheduled_time || "10:00"}</span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextDate = addDays(task.scheduled_date, 1);
                          onTaskRescheduled(task.id, nextDate);
                        }}
                        className={`p-1.5 rounded-xl border flex items-center justify-between gap-1.5 transition-all shadow-xs ${
                          task.completed
                            ? "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30 line-through"
                            : "surface-2 text-primary border-border hover:border-orange-500 font-semibold"
                        }`}
                        title="Click to reschedule to next day"
                      >
                        <span className="truncate flex items-center gap-1.5">
                          <BookOpen className="size-3 text-orange-500 shrink-0" /> {task.topic_title}
                        </span>
                        <span className="font-mono text-[9px] text-muted shrink-0">{task.estimated_minutes}m</span>
                      </div>
                    );
                  })}
                </div>

                <div className="text-[10px] font-extrabold text-muted text-right pt-1 border-t border-border/60">
                  {dayTasks.length > 0 ? `${dayTasks.length} Scheduled` : ""}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* CREATE MANUAL REAL-WORLD EVENT MODAL */}
      {selectedDateForEvent && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-up text-primary">
          <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
                <Plus className="size-4 text-orange-500" /> Add Real-World Event / Exam / Class
              </h3>
              <button onClick={() => setSelectedDateForEvent(null)} className="text-xs text-muted font-bold px-2 py-1 surface-2 rounded-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualEvent} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-primary">Event Title</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                  placeholder="e.g. Final Semester OS Exam or Swiggy Technical Interview"
                  className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-primary">Event Category</label>
                  <select
                    value={eventSubtype}
                    onChange={(e) => setEventSubtype(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none cursor-pointer"
                  >
                    <option value="interview">💼 Job / Intern Interview</option>
                    <option value="test">📄 Semester Exam / Test</option>
                    <option value="class">🎓 College Class / Lab</option>
                    <option value="deadline">⚠️ Project Deadline</option>
                    <option value="note">📌 Personal Note</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Time of Day</label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary">Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDateForEvent(null)}
                  className="px-4 py-2.5 rounded-xl font-bold surface-2 border border-border text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110 shadow-md"
                >
                  Add Event to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>,
    document.body
  );
}
