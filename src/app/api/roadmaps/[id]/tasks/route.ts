import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { toYmd, addDays } from "@/lib/roadmaps/planner";
import {
  getLocalTasks,
  updateLocalTask,
  saveLocalTask,
  getLocalStreak,
  saveLocalStreak,
  saveLocalCertificate,
  updateLocalRoadmap,
  getLocalRoadmap,
} from "@/lib/roadmaps/store";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: roadmapId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || DEMO_USER_ID;

    const body = await req.json();
    const { taskId, completed, scheduled_date, scheduled_time } = body;

    if (!taskId) {
      return NextResponse.json({ success: false, error: "Task ID is required" }, { status: 400 });
    }

    const todayStr = toYmd(new Date());

    // 1. Update task in DB & Local Store
    const updatePayload: any = {};
    if (typeof completed === "boolean") {
      updatePayload.completed = completed;
      updatePayload.completed_at = completed ? new Date().toISOString() : null;
    }
    if (scheduled_date) updatePayload.scheduled_date = scheduled_date;
    if (scheduled_time !== undefined) updatePayload.scheduled_time = scheduled_time;

    try {
      await table(supabase, "roadmap_tasks").update(updatePayload).eq("id", taskId);
    } catch (e) {}

    updateLocalTask(taskId, updatePayload);

    // 2. Handle Streak Update
    let updatedStreak: any = null;
    if (completed === true) {
      let existingStreak = getLocalStreak(userId);
      try {
        const { data } = await (supabase.from("user_streaks") as any)
          .select("*")
          .eq("user_id", userId)
          .single();
        if (data) existingStreak = data;
      } catch (e) {}

      const lastActive = existingStreak.last_active_date;
      let newCurrent = existingStreak.current_streak || 0;

      if (lastActive === todayStr) {
        // Already active today
      } else if (lastActive === addDays(todayStr, -1)) {
        newCurrent += 1;
      } else {
        newCurrent = 1;
      }

      const newLongest = Math.max(existingStreak.longest_streak || 0, newCurrent);
      const streakObj = {
        id: `streak-${Date.now()}`,
        user_id: userId,
        current_streak: newCurrent,
        longest_streak: newLongest,
        last_active_date: todayStr,
        updated_at: new Date().toISOString(),
      };

      try {
        await table(supabase, "user_streaks").upsert(streakObj, { onConflict: "user_id" });
      } catch (e) {}

      saveLocalStreak(userId, streakObj);
      updatedStreak = streakObj;

      // 3. Check 100% Completion for Certificate
      const allTasks = getLocalTasks(roadmapId);
      const studyTasks = allTasks.filter((t: any) => t.task_type === "study");
      const completedStudy = studyTasks.filter((t: any) => t.completed);

      if (studyTasks.length > 0 && completedStudy.length === studyTasks.length) {
        updateLocalRoadmap(roadmapId, { status: "completed" });
        try {
          await table(supabase, "roadmaps").update({ status: "completed" }).eq("id", roadmapId);
        } catch (e) {}

        const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "CareerOS Student";
        const certSlug = `cert-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
        const rmRecord = getLocalRoadmap(roadmapId);

        const certObj = {
          id: `cert-${Date.now()}`,
          roadmap_id: roadmapId,
          user_id: userId,
          user_name: userName,
          track_title: rmRecord?.title || "Specialized Study Track",
          duration_label: `${rmRecord?.daily_hours || 2} Hours/Day Plan`,
          issued_date: todayStr,
          certificate_slug: certSlug,
          created_at: new Date().toISOString(),
        };

        try {
          await table(supabase, "roadmap_certificates").insert(certObj);
        } catch (e) {}

        saveLocalCertificate(certObj);

        return NextResponse.json({
          success: true,
          roadmapCompleted: true,
          certificateSlug: certSlug,
          streak: updatedStreak,
        });
      }
    }

    return NextResponse.json({ success: true, streak: updatedStreak });
  } catch (err: any) {
    console.error("PATCH /api/roadmaps/[id]/tasks error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: roadmapId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || DEMO_USER_ID;

    const body = await req.json();
    const { title, event_subtype, scheduled_date, scheduled_time, notes } = body;

    if (!title || !scheduled_date) {
      return NextResponse.json({ success: false, error: "Title and Date are required for manual events" }, { status: 400 });
    }

    const newManualTask = {
      id: `manual-${Date.now()}`,
      roadmap_id: roadmapId,
      user_id: userId,
      scheduled_date,
      scheduled_time: scheduled_time || "09:00",
      topic_id: `evt-${Date.now()}`,
      topic_title: title,
      topic_category: "Real-World Event",
      notes: notes || `Manual event: ${title}`,
      resources: [],
      estimated_minutes: 60,
      task_type: "manual-event" as const,
      event_subtype: (event_subtype || "test") as "test" | "class" | "interview" | "deadline" | "note",
      completed: false,
      completed_at: null,
      is_backlog: false,
      order_index: 9999,
      created_at: new Date().toISOString(),
    };

    try {
      await table(supabase, "roadmap_tasks").insert(newManualTask);
    } catch (e) {}

    saveLocalTask(newManualTask);

    return NextResponse.json({ success: true, task: newManualTask });
  } catch (err: any) {
    console.error("POST manual event error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
