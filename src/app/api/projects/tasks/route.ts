import { NextResponse } from "next/server";
import { Task } from "@/lib/projects/types";
import { MOCK_TASKS } from "@/lib/projects/data";

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qtyuoiwioproztlnspyf.supabase.co";
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const serverTasksStore: Map<string, Task> = new Map(
  MOCK_TASKS.map((t) => [t.id, t as Task])
);

/**
 * GET /api/projects/tasks
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || "proj-crm";

    let dbTasks: Task[] = [];
    if (SUPABASE_URL && SERVICE_KEY) {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/project_tasks?select=*`, {
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
          },
          cache: "no-store",
        });
        if (res.ok) {
          const raw = await res.json();
          if (Array.isArray(raw) && raw.length > 0) {
            dbTasks = raw;
          }
        }
      } catch (err) {
        console.warn("Supabase tasks fetch warning:", err);
      }
    }

    const taskMap = new Map<string, Task>();
    serverTasksStore.forEach((t, id) => taskMap.set(id, t));
    dbTasks.forEach((t) => taskMap.set(t.id, t));

    const result = Array.from(taskMap.values());
    return NextResponse.json({ success: true, tasks: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, tasks: Array.from(serverTasksStore.values()), error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/tasks
 * Create a new task (by Manager or TL)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newTask: Task = {
      id: body.id || `task-${Date.now()}`,
      title: body.title || "New Project Task",
      description: body.description || "",
      status: body.status || "todo",
      priority: body.priority || "medium",
      assignedTo: body.assignedTo || "Unassigned",
      assignedToType: body.assignedToType || "member",
      assignedTeamId: body.assignedTeamId,
      assignedTeamName: body.assignedTeamName,
      assignedMemberId: body.assignedMemberId,
      assignedMemberName: body.assignedMemberName,
      assignedMemberAvatar: body.assignedMemberAvatar,
      assignedMemberRole: body.assignedMemberRole,
      createdByRole: body.createdByRole || "Manager",
      createdByName: body.createdByName || "Manager",
      dueDate: body.dueDate || "2026-09-20",
      points: body.points || 50,
      tags: body.tags || ["Feature"],
      internRemarks: body.internRemarks,
      deliverableUrl: body.deliverableUrl,
    };

    serverTasksStore.set(newTask.id, newTask);

    if (SUPABASE_URL && SERVICE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/project_tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify(newTask),
        });
      } catch (err) {
        console.warn("Supabase insert task warning:", err);
      }
    }

    return NextResponse.json({ success: true, task: newTask });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/projects/tasks
 * Update task status, assignment, remarks, or deliverable URL
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Task ID required" }, { status: 400 });
    }

    const existing = serverTasksStore.get(id) || {
      id,
      title: "Task",
      description: "",
      status: "todo",
      priority: "medium",
      assignedTo: "Team Member",
      dueDate: "2026-09-20",
      points: 50,
      tags: [],
    };

    const updatedTask: Task = {
      ...existing,
      ...updates,
    };

    serverTasksStore.set(id, updatedTask);

    if (SUPABASE_URL && SERVICE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/project_tasks?id=eq.${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
          },
          body: JSON.stringify(updatedTask),
        });
      } catch (err) {
        console.warn("Supabase update task warning:", err);
      }
    }

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
