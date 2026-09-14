import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface ProjectAttendancePayload {
  id?: string;
  projectId: string;
  userId: string;
  userName: string;
  userRole: "TL" | "Intern";
  teamId?: string;
  teamName?: string;
  date: string; // YYYY-MM-DD
  status: "present" | "leave" | "half_day" | "absent";
  requestReason?: string;
  approvalStatus?: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  remark?: string;
  verifiedByTL?: boolean;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qtyuoiwioproztlnspyf.supabase.co";
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

// In-memory server cache fallback to guarantee persistence during session
const serverAttendanceStore: Map<string, ProjectAttendancePayload> = new Map();

/**
 * GET /api/projects/attendance
 * Fetch attendance records filtered by projectId, userId, or date
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || "proj-crm";
    const userId = searchParams.get("userId");
    const date = searchParams.get("date");

    // Try fetching from Supabase DB
    let dbRecords: ProjectAttendancePayload[] = [];
    if (SUPABASE_URL && SERVICE_KEY) {
      try {
        let fetchUrl = `${SUPABASE_URL}/rest/v1/project_attendance?select=*&projectId=eq.${projectId}`;
        if (userId) fetchUrl += `&userId=eq.${userId}`;
        if (date) fetchUrl += `&date=eq.${date}`;

        const res = await fetch(fetchUrl, {
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
          },
          cache: "no-store",
        });

        if (res.ok) {
          dbRecords = await res.json();
        }
      } catch (err) {
        console.error("Supabase attendance fetch warning:", err);
      }
    }

    // Merge in-memory server fallback records
    const inMemoryRecords = Array.from(serverAttendanceStore.values()).filter((rec) => {
      if (rec.projectId !== projectId) return false;
      if (userId && rec.userId !== userId) return false;
      if (date && rec.date !== date) return false;
      return true;
    });

    const combinedMap = new Map<string, ProjectAttendancePayload>();
    [...dbRecords, ...inMemoryRecords].forEach((rec) => {
      const key = `${rec.userId || rec.userName}_${rec.date}_${rec.projectId}`;
      combinedMap.set(key, rec);
    });

    return NextResponse.json({
      success: true,
      records: Array.from(combinedMap.values()),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch attendance records" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/attendance
 * Mark attendance for today. Enforces ONCE-PER-DAY per user rule!
 */
export async function POST(req: Request) {
  try {
    const body: ProjectAttendancePayload = await req.json();

    if (!body.userId || !body.date) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: userId and date are required." },
        { status: 400 }
      );
    }

    const targetDate = body.date;
    const targetUserId = body.userId;
    const targetUserName = body.userName || "User";
    const targetProjectId = body.projectId || "proj-crm";
    const uniqueKey = `${targetUserId}_${targetDate}_${targetProjectId}`;

    // 1. Check strict once-per-day rule in server cache
    if (serverAttendanceStore.has(uniqueKey)) {
      const existing = serverAttendanceStore.get(uniqueKey)!;
      return NextResponse.json(
        {
          success: false,
          alreadyMarked: true,
          error: `Attendance for ${targetUserName} has already been recorded for ${targetDate} (${existing.status.replace("_", " ")}). Attendance can only be taken once per day.`,
          record: existing,
        },
        { status: 400 }
      );
    }

    // 2. Check strict once-per-day rule in Supabase DB
    if (SUPABASE_URL && SERVICE_KEY) {
      try {
        const checkUrl = `${SUPABASE_URL}/rest/v1/project_attendance?select=*&userId=eq.${targetUserId}&date=eq.${targetDate}&projectId=eq.${targetProjectId}`;
        const checkRes = await fetch(checkUrl, {
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
          },
          cache: "no-store",
        });

        if (checkRes.ok) {
          const existingDb: any[] = await checkRes.json();
          if (existingDb && existingDb.length > 0) {
            const existingRecord = existingDb[0];
            serverAttendanceStore.set(uniqueKey, existingRecord);
            return NextResponse.json(
              {
                success: false,
                alreadyMarked: true,
                error: `Attendance for ${targetUserName} has already been recorded for ${targetDate} (${existingRecord.status.replace("_", " ")}). Attendance can only be taken once per day.`,
                record: existingRecord,
              },
              { status: 400 }
            );
          }
        }
      } catch (err) {
        console.error("Supabase check error:", err);
      }
    }

    // 3. Create new attendance record
    const newRecord: ProjectAttendancePayload = {
      id: body.id || `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      projectId: targetProjectId,
      userId: targetUserId,
      userName: targetUserName,
      userRole: body.userRole || "Intern",
      teamId: body.teamId || "team-1",
      teamName: body.teamName || "Team 1 - Frontend & AI Pipeline",
      date: targetDate,
      status: body.status || "present",
      requestReason: body.requestReason || "",
      approvalStatus: body.approvalStatus || (body.status === "present" ? "approved" : "pending"),
      reviewedBy: body.reviewedBy || (body.status === "present" ? "TL Ananya Roy" : undefined),
      remark: body.remark || (body.status === "present" ? "Checked in for daily standup." : undefined),
      verifiedByTL: body.verifiedByTL ?? (body.status === "present"),
    };

    // Store in server cache
    serverAttendanceStore.set(uniqueKey, newRecord);

    // Try inserting into Supabase DB table `project_attendance`
    if (SUPABASE_URL && SERVICE_KEY) {
      try {
        const insertUrl = `${SUPABASE_URL}/rest/v1/project_attendance`;
        await fetch(insertUrl, {
          method: "POST",
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify(newRecord),
        });
      } catch (err) {
        console.error("Supabase insert error (falling back to server store):", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Attendance marked successfully for ${targetUserName} on ${targetDate}.`,
      record: newRecord,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to record attendance." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/projects/attendance
 * Update existing attendance record (e.g. TL / Manager approval decision)
 */
export async function PATCH(req: Request) {
  try {
    const { id, approvalStatus, reviewedBy, remark, status } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing record id for update." },
        { status: 400 }
      );
    }

    let updatedRecord: ProjectAttendancePayload | null = null;

    // Update server store
    for (const [key, rec] of serverAttendanceStore.entries()) {
      if (rec.id === id) {
        // If leave request was approved by TL, automatically confirm status to 'leave' / 'absent'
        let finalStatus = status || rec.status;
        if (approvalStatus === "approved" && (rec.status === "leave" || rec.status === "absent")) {
          finalStatus = "leave";
        }
        updatedRecord = {
          ...rec,
          status: finalStatus,
          approvalStatus,
          reviewedBy,
          remark,
          verifiedByTL: approvalStatus === "approved",
        };
        serverAttendanceStore.set(key, updatedRecord);
        break;
      }
    }

    // Update Supabase DB if available
    if (SUPABASE_URL && SERVICE_KEY) {
      try {
        const updateUrl = `${SUPABASE_URL}/rest/v1/project_attendance?id=eq.${id}`;
        await fetch(updateUrl, {
          method: "PATCH",
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            approvalStatus,
            reviewedBy,
            remark,
            verifiedByTL: approvalStatus === "approved",
            ...(status ? { status } : approvalStatus === "approved" ? { status: "leave" } : {}),
          }),
        });
      } catch (err) {
        console.error("Supabase patch error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Attendance decision updated.",
      record: updatedRecord,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update attendance." },
      { status: 500 }
    );
  }
}
