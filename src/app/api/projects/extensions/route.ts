import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface TenureExtensionApplication {
  id: string;
  projectId?: string;
  projectTitle?: string;
  userId?: string;
  internName: string;
  email: string;
  domain: string;
  currentEndDate: string;
  extensionMonths: number;
  newEndDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewRemark?: string;
  appliedAt: string;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qtyuoiwioproztlnspyf.supabase.co";
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

// Initial seed extensions for demo & testing
const MOCK_EXTENSIONS: TenureExtensionApplication[] = [
  {
    id: "ext-101",
    projectId: "proj-crm",
    projectTitle: "Enterprise SaaS CRM Workspace",
    userId: "mem-2",
    internName: "Bhavesh Rao",
    email: "bhavesh.rao@careeros.dev",
    domain: "Full Stack Lead",
    currentEndDate: "2026-11-05",
    extensionMonths: 2,
    newEndDate: "2027-01-05",
    reason: "Delivering Phase 2 AI Autonomous Pipelines and mentorship of incoming cohort intern team.",
    status: "pending",
    appliedAt: "2026-09-06",
  },
  {
    id: "ext-102",
    projectId: "proj-crm",
    projectTitle: "Enterprise SaaS CRM Workspace",
    userId: "mem-3",
    internName: "Dev Patel",
    email: "dev.patel@careeros.dev",
    domain: "Backend & Systems",
    currentEndDate: "2026-10-15",
    extensionMonths: 1,
    newEndDate: "2026-11-15",
    reason: "Finalizing Rust microservice deployment and Redis caching optimizations.",
    status: "approved",
    reviewedBy: "Project Manager (Approved)",
    reviewRemark: "Approved based on stellar attendance and sprint velocity.",
    appliedAt: "2026-09-02",
  },
];

const serverExtensionsStore: Map<string, TenureExtensionApplication> = new Map(
  MOCK_EXTENSIONS.map((ext) => [ext.id, ext])
);

/**
 * GET /api/projects/extensions
 * Fetch all tenure extension applications
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    let dbRecords: TenureExtensionApplication[] = [];
    if (SUPABASE_URL && SERVICE_KEY) {
      try {
        let fetchUrl = `${SUPABASE_URL}/rest/v1/project_tenure_extensions?select=*&order=appliedAt.desc`;
        if (projectId) {
          fetchUrl = `${SUPABASE_URL}/rest/v1/project_tenure_extensions?select=*&projectId=eq.${projectId}&order=appliedAt.desc`;
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
        console.warn("Supabase tenure extensions fetch warning:", err);
      }
    }

    const map = new Map<string, TenureExtensionApplication>();
    serverExtensionsStore.forEach((v, k) => map.set(k, v));
    dbRecords.forEach((rec) => map.set(rec.id, rec));

    let list = Array.from(map.values());
    if (projectId) {
      list = list.filter((item) => !item.projectId || item.projectId === projectId);
    }

    return NextResponse.json({
      success: true,
      extensions: list,
      count: list.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, extensions: Array.from(serverExtensionsStore.values()), error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/extensions
 * Submit new tenure extension request to PM
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.internName || !body.extensionMonths) {
      return NextResponse.json({ success: false, error: "Intern name and extension duration required." }, { status: 400 });
    }

    const currentEnd = new Date(body.currentEndDate || "2026-11-05");
    const newEnd = new Date(currentEnd);
    newEnd.setMonth(newEnd.getMonth() + (Number(body.extensionMonths) || 1));

    const newExt: TenureExtensionApplication = {
      id: body.id || `ext-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      projectId: body.projectId || "proj-crm",
      projectTitle: body.projectTitle || "Enterprise SaaS CRM Workspace",
      userId: body.userId || "mem-2",
      internName: body.internName,
      email: body.email || "intern@careeros.dev",
      domain: body.domain || "Full Stack",
      currentEndDate: body.currentEndDate || "2026-11-05",
      extensionMonths: Number(body.extensionMonths) || 1,
      newEndDate: body.newEndDate || newEnd.toISOString().split("T")[0],
      reason: body.reason || "Desire to contribute to additional feature sprints.",
      status: "pending",
      appliedAt: new Date().toISOString().split("T")[0],
    };

    serverExtensionsStore.set(newExt.id, newExt);

    if (SUPABASE_URL && SERVICE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/project_tenure_extensions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify(newExt),
        });
      } catch (err) {
        console.warn("Supabase insert tenure extension warning:", err);
      }
    }

    return NextResponse.json({
      success: true,
      extension: newExt,
      message: "Tenure extension request submitted to Project Manager (PM)!",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/projects/extensions
 * PM Approve or Reject Tenure Extension
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, reviewedBy, reviewRemark } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "ID and status are required." }, { status: 400 });
    }

    const existing = serverExtensionsStore.get(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Extension application not found." }, { status: 404 });
    }

    const updated: TenureExtensionApplication = {
      ...existing,
      status,
      reviewedBy: reviewedBy || `PM (${status === "approved" ? "Approved" : "Rejected"})`,
      reviewRemark: reviewRemark || (status === "approved" ? "Tenure extension granted." : "Extension request declined."),
    };

    serverExtensionsStore.set(id, updated);

    if (SUPABASE_URL && SERVICE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/project_tenure_extensions?id=eq.${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
          },
          body: JSON.stringify(updated),
        });
      } catch (err) {
        console.warn("Supabase patch tenure extension warning:", err);
      }
    }

    return NextResponse.json({
      success: true,
      extension: updated,
      message: `Tenure extension application ${status} successfully!`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
