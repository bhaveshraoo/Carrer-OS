import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { calculateBacklogExtension, toYmd } from "@/lib/roadmaps/planner";
import { getLocalRoadmap, getLocalTasks, updateLocalTask, updateLocalRoadmap } from "@/lib/roadmaps/store";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: roadmapId } = await params;
    const supabase = await createClient();

    let roadmap: any = getLocalRoadmap(roadmapId);
    try {
      const { data } = await (supabase.from("roadmaps") as any)
        .select("*")
        .eq("id", roadmapId)
        .single();
      if (data) roadmap = data;
    } catch (e) {}

    if (!roadmap) {
      return NextResponse.json({ success: false, error: "Roadmap not found" }, { status: 404 });
    }

    let tasksList: any[] = getLocalTasks(roadmapId);
    try {
      const { data } = await (supabase.from("roadmap_tasks") as any)
        .select("*")
        .eq("roadmap_id", roadmapId)
        .order("order_index", { ascending: true });
      if (data && data.length > 0) tasksList = data;
    } catch (e) {}

    if (!tasksList || tasksList.length === 0) {
      return NextResponse.json({ success: false, error: "No tasks found" }, { status: 400 });
    }

    const todayStr = toYmd(new Date());
    const dailyHours = roadmap.daily_hours || 2;

    const { backlogCount, extensionDays, redistributedTasks, newEndDate } = calculateBacklogExtension({
      tasks: tasksList as any,
      todayStr,
      dailyHours,
    });

    if (backlogCount === 0) {
      return NextResponse.json({ success: true, message: "No overdue backlog tasks to extend." });
    }

    for (const t of redistributedTasks) {
      try {
        await table(supabase, "roadmap_tasks")
          .update({ scheduled_date: t.scheduled_date, is_backlog: t.is_backlog })
          .eq("id", (t as any).id);
      } catch (e) {}
      updateLocalTask((t as any).id, { scheduled_date: t.scheduled_date, is_backlog: t.is_backlog });
    }

    try {
      await table(supabase, "roadmaps").update({ target_end_date: newEndDate }).eq("id", roadmapId);
    } catch (e) {}
    updateLocalRoadmap(roadmapId, { target_end_date: newEndDate });

    return NextResponse.json({
      success: true,
      backlogCount,
      extensionDays,
      newEndDate,
      message: `Plan extended by ${extensionDays} days! Incomplete tasks redistributed to target end date (${newEndDate}).`,
    });
  } catch (err: any) {
    console.error("POST /api/roadmaps/[id]/extend error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
