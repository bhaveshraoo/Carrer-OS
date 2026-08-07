import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { toYmd, distributeTopicsAcrossDays } from "@/lib/roadmaps/planner";
import { getLocalRoadmap, getLocalTasks, getLocalStreak, getLocalCertificate, saveLocalRoadmap, deleteLocalRoadmap } from "@/lib/roadmaps/store";
import { PREDEFINED_TRACKS } from "@/lib/roadmaps/tracks-data";
import { SEED_ROADMAPS } from "@/lib/roadmaps/seed-roadmaps";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: roadmapId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || DEMO_USER_ID;

    // 1. Fetch Roadmap Record
    let roadmap: any = null;
    try {
      const { data } = await (supabase.from("roadmaps") as any)
        .select("*")
        .eq("id", roadmapId)
        .single();
      if (data) roadmap = data;
      else roadmap = getLocalRoadmap(roadmapId);
    } catch (e) {
      roadmap = getLocalRoadmap(roadmapId);
    }

    // Auto-fallback for seed roadmaps if not found in store
    if (!roadmap) {
      const seedMatch = SEED_ROADMAPS.find((r) => r.id === roadmapId || r.track_id === roadmapId);
      if (seedMatch) {
        roadmap = {
          id: seedMatch.id,
          user_id: userId,
          track_id: seedMatch.track_id,
          title: seedMatch.title,
          is_custom: seedMatch.is_custom,
          start_date: seedMatch.start_date,
          target_end_date: seedMatch.target_end_date,
          daily_hours: seedMatch.daily_hours,
          status: seedMatch.status,
          created_at: new Date().toISOString(),
        };
      }
    }

    // 2. Fetch Tasks for this Roadmap
    let tasks: any[] = [];
    try {
      const { data } = await (supabase.from("roadmap_tasks") as any)
        .select("*")
        .eq("roadmap_id", roadmapId)
        .order("order_index", { ascending: true });
      if (data && data.length > 0) tasks = data;
      else tasks = getLocalTasks(roadmapId);
    } catch (e) {
      tasks = getLocalTasks(roadmapId);
    }

    // Auto-generate or upgrade tasks if missing or old format
    const needsGen = tasks.length === 0 || (tasks.length > 0 && !tasks[0].parent_topic_id);
    if (needsGen && roadmap.track_id && roadmap.track_id !== "custom") {
      const track = PREDEFINED_TRACKS.find((tr) => tr.id === roadmap.track_id) || PREDEFINED_TRACKS[0];
      const startDate = roadmap.start_date ? new Date(roadmap.start_date) : new Date();
      const endDate = roadmap.target_end_date ? new Date(roadmap.target_end_date) : new Date(Date.now() + 90 * 86400000);
      const months = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))) || 3;

      const { tasks: generatedTasks } = distributeTopicsAcrossDays({
        topics: track.topics,
        startDateStr: roadmap.start_date || toYmd(new Date()),
        dailyHours: roadmap.daily_hours || 2,
        durationMonths: months,
      });
      tasks = generatedTasks.map((t, idx) => ({
        ...t,
        id: `task-gen-${roadmapId}-${idx}`,
        roadmap_id: roadmapId,
        user_id: userId,
        completed_at: null,
        created_at: new Date().toISOString(),
      }));
      saveLocalRoadmap(roadmap, tasks);
    }

    const todayStr = toYmd(new Date());

    // 3. Compute Backlog Tasks
    const backlogTasks = tasks.filter(
      (t: any) => !t.completed && t.scheduled_date < todayStr && t.task_type === "study"
    );

    // 4. Compute Streak for User
    let streak: any = null;
    try {
      const { data } = await (supabase.from("user_streaks") as any)
        .select("*")
        .eq("user_id", userId)
        .single();
      if (data) streak = data;
      else streak = getLocalStreak(userId);
    } catch (e) {
      streak = getLocalStreak(userId);
    }

    // 5. Check if Roadmap is 100% Completed
    const studyTasks = tasks.filter((t: any) => t.task_type === "study");
    const completedStudyTasks = studyTasks.filter((t: any) => t.completed);
    const isFullyCompleted = studyTasks.length > 0 && completedStudyTasks.length === studyTasks.length;

    // Check certificate if completed
    let certificate: any = null;
    if (isFullyCompleted) {
      try {
        const { data } = await (supabase.from("roadmap_certificates") as any)
          .select("*")
          .eq("roadmap_id", roadmapId)
          .single();
        if (data) certificate = data;
        else certificate = getLocalCertificate(roadmapId);
      } catch (e) {
        certificate = getLocalCertificate(roadmapId);
      }
    }

    return NextResponse.json({
      success: true,
      roadmap,
      tasks,
      todayStr,
      backlogCount: backlogTasks.length,
      isFullyCompleted,
      certificate,
      streak,
    });
  } catch (err: any) {
    console.error("GET /api/roadmaps/[id] error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: roadmapId } = await params;
    const supabase = await createClient();

    try {
      await table(supabase, "roadmap_tasks").delete().eq("roadmap_id", roadmapId);
      await table(supabase, "roadmaps").delete().eq("id", roadmapId);
    } catch (e) {}

    deleteLocalRoadmap(roadmapId);

    return NextResponse.json({ success: true, message: "Roadmap deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
