import { NextResponse } from "next/server";
import { ProjectApplication } from "@/lib/projects/types";
import { MOCK_APPLICATIONS } from "@/lib/projects/data";

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qtyuoiwioproztlnspyf.supabase.co";
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

// In-memory server store for persistent sync fallback across sessions
const serverApplicationsStore: Map<string, ProjectApplication> = new Map(
  MOCK_APPLICATIONS.map((app) => [app.id, app as ProjectApplication])
);

/**
 * GET /api/projects/applications
 * Query params: projectId (optional)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    let dbRecords: ProjectApplication[] = [];
    if (SUPABASE_URL && SERVICE_KEY) {
      try {
        let fetchUrl = `${SUPABASE_URL}/rest/v1/project_applications?select=*&order=appliedAt.desc`;
        if (projectId) {
          fetchUrl = `${SUPABASE_URL}/rest/v1/project_applications?select=*&projectId=eq.${projectId}&order=appliedAt.desc`;
        }

        const res = await fetch(fetchUrl, {
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
          },
          cache: "no-store",
        });

        if (res.ok) {
          const raw = await res.json();
          if (Array.isArray(raw) && raw.length > 0) {
            dbRecords = raw;
          }
        }
      } catch (err) {
        console.warn("Supabase project_applications fetch warning:", err);
      }
    }

    // Combine DB records with server in-memory store
    const appMap = new Map<string, ProjectApplication>();

    // First load mock/server memory store defaults
    serverApplicationsStore.forEach((val, key) => {
      appMap.set(key, val);
    });

    // Then overwrite/append DB records
    dbRecords.forEach((rec) => {
      appMap.set(rec.id, rec);
    });

    let result = Array.from(appMap.values());
    if (projectId) {
      result = result.filter((a) => !a.projectId || a.projectId === projectId);
    }

    return NextResponse.json({
      success: true,
      applications: result,
      count: result.length,
    });
  } catch (error: any) {
    console.error("GET /api/projects/applications error:", error);
    return NextResponse.json(
      { success: false, applications: Array.from(serverApplicationsStore.values()), error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/applications
 * Create a new application submitted by candidate
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.applicantName || !body.email) {
      return NextResponse.json({ success: false, error: "Name and Email are required." }, { status: 400 });
    }

    const newApp: ProjectApplication = {
      id: body.id || `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      projectId: body.projectId || "proj-crm",
      applicantName: body.applicantName,
      email: body.email,
      domain: body.domain || "Full Stack",
      experience: body.experience || "Fresh Graduate / Candidate",
      resumeUrl: body.resumeUrl || "#",
      githubUrl: body.githubUrl || "https://github.com",
      status: body.status || "under_review",
      appliedAt: body.appliedAt || new Date().toISOString().split("T")[0],
    };

    // 1. Store in memory
    serverApplicationsStore.set(newApp.id, newApp);

    // 2. Persist to Supabase DB if configured
    if (SUPABASE_URL && SERVICE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/project_applications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify(newApp),
        });
      } catch (err) {
        console.warn("Supabase insert application warning:", err);
      }
    }

    return NextResponse.json({
      success: true,
      application: newApp,
      message: "Application submitted successfully to PM console!",
    });
  } catch (error: any) {
    console.error("POST /api/projects/applications error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/projects/applications
 * Update application status, interview details, or team allocation
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, interviewDate, interviewTime, meetUrl, assignedTeamId, assignedTeamName, assignedTLName } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Application ID is required." }, { status: 400 });
    }

    const existing = serverApplicationsStore.get(id) || {
      id,
      projectId: "proj-crm",
      applicantName: "Candidate",
      email: "candidate@example.com",
      domain: "Full Stack",
      experience: "Developer",
      resumeUrl: "#",
      githubUrl: "https://github.com",
      status: "under_review",
      appliedAt: new Date().toISOString().split("T")[0],
    };

    const updated: ProjectApplication = {
      ...existing,
      ...(status && { status }),
      ...(interviewDate && { interviewDate }),
      ...(interviewTime && { interviewTime }),
      ...(meetUrl && { meetUrl }),
      ...(assignedTeamId && { assignedTeamId }),
      ...(assignedTeamName && { assignedTeamName }),
      ...(assignedTLName && { assignedTLName }),
    };

    // Update memory store
    serverApplicationsStore.set(id, updated);

    // Update Supabase DB
    if (SUPABASE_URL && SERVICE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/project_applications?id=eq.${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
          },
          body: JSON.stringify(updated),
        });
      } catch (err) {
        console.warn("Supabase update application warning:", err);
      }
    }

    return NextResponse.json({
      success: true,
      application: updated,
      message: "Application status updated successfully!",
    });
  } catch (error: any) {
    console.error("PATCH /api/projects/applications error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
