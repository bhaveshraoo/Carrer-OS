import { TopicDefinition } from "./tracks-data";

export interface ScheduledTaskPayload {
  topic_id: string;
  topic_title: string;
  topic_category: string;
  // The parent topic this sub-topic belongs to (for grouping in UI)
  parent_topic_id: string;
  parent_topic_title: string;
  notes: string;
  objectives?: string[];
  practice_task?: string;
  code_snippet?: string;
  resources: any;
  estimated_minutes: number;
  scheduled_date: string; // YYYY-MM-DD
  task_type: "study" | "manual-event";
  event_subtype: "test" | "class" | "interview" | "deadline" | "note" | null;
  completed: boolean;
  is_backlog: boolean;
  order_index: number;
}

export function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function toYmd(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * CORE PACING ENGINE
 * ──────────────────
 * Strategy: One TOPIC per day. All sub-topics of that topic are
 * scheduled on the SAME date, creating a clean grouped list:
 *
 *   Day 1 — Python & Programming Fundamentals
 *     1. Python Syntax & Data Types       [Mark Complete]
 *     2. Control Flow (loops, conditionals)[Mark Complete]
 *     3. Functions & Scope                [Mark Complete]
 *     4. OOP (classes, inheritance…)      [Mark Complete]
 *
 *   Day 2 — NumPy Foundations
 *     1. Array Creation & Indexing        [Mark Complete]
 *     2. Broadcasting                     [Mark Complete]
 *     …
 *
 * The topics are spread across the full duration (60 / 90 / 180 days)
 * so that the timetable fills every week up to target_end_date.
 */
export function distributeTopicsAcrossDays(params: {
  topics: TopicDefinition[];
  startDateStr: string;
  targetEndDateStr?: string;
  dailyHours: number;
  durationMonths?: number;
}): { tasks: ScheduledTaskPayload[]; calculatedEndDate: string } {
  const { topics, startDateStr, dailyHours, durationMonths = 3 } = params;
  const targetTotalDays = Math.max(30, durationMonths * 30);
  const calculatedEndDate = addDays(startDateStr, targetTotalDays);

  // Daily budget in minutes (minimum 60, maximum 240)
  const dailyMinutesBudget = Math.min(240, Math.max(60, Math.round(dailyHours * 60)));

  // ── 1. Flatten ALL sub-topics into one ordered list ──────────────────────────
  // Each sub-topic carries its parent topic info for UI grouping.
  type FlatSub = {
    id: string;
    title: string;
    estimatedMinutes: number;
    notes: string;
    objectives: string[];
    practiceTask: string;
    codeSnippet?: string;
    resources: any[];
    parentId: string;
    parentTitle: string;
    category: string;
  };

  const flatSubs: FlatSub[] = [];

  for (const topic of topics) {
    const subs =
      Array.isArray(topic.subTopics) && topic.subTopics.length > 0
        ? topic.subTopics.map((s) => ({
            id: s.id,
            title: s.title,
            estimatedMinutes: s.estimatedMinutes || 30,
            notes: (s as any).guideNotes || topic.notes || "",
            objectives: s.objectives || [],
            practiceTask: s.practiceTask || "",
            codeSnippet: (s as any).codeSnippet || "",
            resources: s.resources || topic.resources || [],
            parentId: topic.id,
            parentTitle: topic.title,
            category: topic.category || "General",
          }))
        : [
            {
              id: `${topic.id}-sub-1`,
              title: `${topic.title} – Core Concepts`,
              estimatedMinutes: 45,
              notes: topic.notes || `Study the fundamentals of ${topic.title}.`,
              objectives: [`Understand ${topic.title}`],
              practiceTask: `Practice: Summarise the key concepts of ${topic.title}.`,
              codeSnippet: "",
              resources: topic.resources || [],
              parentId: topic.id,
              parentTitle: topic.title,
              category: topic.category || "General",
            },
          ];

    flatSubs.push(...subs);
  }

  // ── 2. Calculate subs-per-day to span the FULL chosen duration ───────────────
  //
  //  Problem with packing: 79 subs × 30min = 2400min. At 120min/day budget,
  //  you fill up in ~20 days — leaving 70 days empty for a 3-month plan.
  //
  //  Fix: spread evenly so the last sub-topic lands near the target end date.
  //    subsPerDay = ceil(total_subs / target_days)
  //
  //  Examples:
  //    3 months (90 days), 79 subs → 1 sub/day → 79 days used ✅
  //    2 months (60 days), 79 subs → 2 subs/day → 40 days used ✅
  //    1 month  (30 days), 79 subs → 3 subs/day → 27 days used ✅
  //
  //  Also cap at the daily time budget so we never over-schedule.
  const totalSubs = flatSubs.length;
  const avgSubMinutes = totalSubs > 0
    ? Math.round(flatSubs.reduce((sum, s) => sum + s.estimatedMinutes, 0) / totalSubs)
    : 30;

  const maxSubsByBudget = Math.max(1, Math.floor(dailyMinutesBudget / Math.max(avgSubMinutes, 1)));
  const minSubsToFill  = Math.max(1, Math.ceil(totalSubs / Math.max(targetTotalDays, 1)));

  // Use the MINIMUM needed to fill the duration, capped by the budget.
  const subsPerDay = Math.min(maxSubsByBudget, minSubsToFill);

  // ── 3. Assign sub-topics: exactly subsPerDay per day, sequential ─────────────
  const tasks: ScheduledTaskPayload[] = [];
  let orderIndex = 1;

  for (let i = 0; i < flatSubs.length; i++) {
    const sub = flatSubs[i];
    const dayOffset = Math.floor(i / subsPerDay);
    const dateStr = addDays(startDateStr, dayOffset);

    // Don't schedule beyond the target end date
    if (dateStr > calculatedEndDate) break;

    tasks.push({
      topic_id: sub.id,
      topic_title: sub.title,
      topic_category: sub.category,
      parent_topic_id: sub.parentId,
      parent_topic_title: sub.parentTitle,
      notes: sub.notes,
      objectives: sub.objectives,
      practice_task: sub.practiceTask,
      code_snippet: sub.codeSnippet,
      resources: sub.resources,
      estimated_minutes: sub.estimatedMinutes,
      scheduled_date: dateStr,
      task_type: "study",
      event_subtype: null,
      completed: false,
      is_backlog: false,
      order_index: orderIndex++,
    });
  }

  return { tasks, calculatedEndDate };
}


export function calculateBacklogExtension(params: {
  tasks: ScheduledTaskPayload[];
  todayStr: string;
  dailyHours: number;
}): {
  backlogCount: number;
  extensionDays: number;
  redistributedTasks: ScheduledTaskPayload[];
  newEndDate: string;
} {
  const { tasks, todayStr, dailyHours } = params;
  const dailyMinutesBudget = Math.max(30, Math.round(dailyHours * 60));

  const overdueTasks = tasks.filter(
    (t) => !t.completed && t.scheduled_date < todayStr && t.task_type === "study"
  );
  const totalBacklogMinutes = overdueTasks.reduce(
    (acc, t) => acc + t.estimated_minutes,
    0
  );

  if (totalBacklogMinutes === 0 || overdueTasks.length === 0) {
    return {
      backlogCount: 0,
      extensionDays: 0,
      redistributedTasks: tasks,
      newEndDate: tasks.reduce(
        (max, t) => (t.scheduled_date > max ? t.scheduled_date : max),
        todayStr
      ),
    };
  }

  const extensionDays = Math.max(
    1,
    Math.ceil(totalBacklogMinutes / dailyMinutesBudget)
  );

  let maxDate = todayStr;
  const redistributedTasks = tasks.map((t) => {
    if (
      !t.completed &&
      t.scheduled_date <= todayStr &&
      t.task_type === "study"
    ) {
      return { ...t, scheduled_date: todayStr, is_backlog: true };
    } else if (!t.completed && t.scheduled_date > todayStr) {
      const newDate = addDays(t.scheduled_date, extensionDays);
      if (newDate > maxDate) maxDate = newDate;
      return { ...t, scheduled_date: newDate };
    }
    if (t.scheduled_date > maxDate) maxDate = t.scheduled_date;
    return t;
  });

  return {
    backlogCount: overdueTasks.length,
    extensionDays,
    redistributedTasks,
    newEndDate: maxDate,
  };
}

export function applySmartLoadBalancing(
  tasks: ScheduledTaskPayload[]
): ScheduledTaskPayload[] {
  const manualEvents = tasks.filter((t) => t.task_type === "manual-event");
  if (manualEvents.length === 0) return tasks;

  const heavyEventDates = new Set(
    manualEvents
      .filter(
        (e) =>
          e.event_subtype === "interview" ||
          e.event_subtype === "test" ||
          e.event_subtype === "deadline"
      )
      .map((e) => e.scheduled_date)
  );

  return tasks.map((task) => {
    if (
      task.task_type === "study" &&
      !task.completed &&
      heavyEventDates.has(task.scheduled_date)
    ) {
      return { ...task, scheduled_date: addDays(task.scheduled_date, 1) };
    }
    return task;
  });
}
