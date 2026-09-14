import { NextResponse } from "next/server";
import { MOCK_PROJECTS } from "@/lib/projects/data";
import { Project, SeniorityTag } from "@/lib/projects/types";

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qtyuoiwioproztlnspyf.supabase.co";
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

// In-memory fallback map for system stability
const projectsStore: Map<string, Project> = new Map(
  MOCK_PROJECTS.map((p) => {
    // Ensure seniorityTag is populated according to difficulty
    const seniorityTag: SeniorityTag =
      p.seniorityTag ||
      (p.difficulty === "Beginner"
        ? "Freshers / Entry Level"
        : p.difficulty === "Intermediate"
        ? "Junior Intern"
        : p.difficulty === "Advanced"
        ? "Senior / Lead Track"
        : "Architect / PM Level");
    return [p.id, { ...p, seniorityTag }];
  })
);

/**
 * GET /api/projects
 * Returns projects from Supabase database with Seniority Tag enrichment.
 * Query Params:
 *  - seniority (optional): "Freshers / Entry Level" | "Junior Intern" | "Mid-Level Engineer" | "Senior / Lead Track" | "Architect / PM Level"
 *  - category (optional)
 *  - search (optional)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const seniorityFilter = searchParams.get("seniority");
    const categoryFilter = searchParams.get("category");
    const searchFilter = searchParams.get("search")?.toLowerCase();

    let dbProjects: Project[] = [];

    if (SUPABASE_URL && SERVICE_KEY) {
      try {
        let fetchUrl = `${SUPABASE_URL}/rest/v1/projects?select=*&order=created_at.desc`;
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
            dbProjects = raw.map((item: any) => ({
              ...item,
              seniorityTag:
                item.seniority_tag ||
                item.seniorityTag ||
                (item.difficulty === "Beginner"
                  ? "Freshers / Entry Level"
                  : item.difficulty === "Intermediate"
                  ? "Junior Intern"
                  : item.difficulty === "Advanced"
                  ? "Senior / Lead Track"
                  : "Architect / PM Level"),
            }));
          }
        }
      } catch (err) {
        console.warn("Supabase projects fetch warning:", err);
      }
    }

    // Overwrite / merge DB records into memory store
    dbProjects.forEach((p) => {
      projectsStore.set(p.id, p);
    });

    let result = Array.from(projectsStore.values());

    // Apply Seniority Tag filtering
    if (seniorityFilter && seniorityFilter !== "All") {
      result = result.filter(
        (p) => p.seniorityTag?.toLowerCase() === seniorityFilter.toLowerCase()
      );
    }

    // Apply Category filtering
    if (categoryFilter && categoryFilter !== "All") {
      result = result.filter(
        (p) =>
          p.category === categoryFilter ||
          (categoryFilter === "AI Track" && (p.category === "AI Track" || p.category === "AI"))
      );
    }

    // Apply Search filtering
    if (searchFilter) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchFilter) ||
          p.description.toLowerCase().includes(searchFilter) ||
          p.techStack.some((t) => t.toLowerCase().includes(searchFilter)) ||
          p.seniorityTag?.toLowerCase().includes(searchFilter)
      );
    }

    return NextResponse.json({
      success: true,
      projects: result,
      count: result.length,
    });
  } catch (error: any) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { success: false, projects: Array.from(projectsStore.values()), error: error.message },
      { status: 500 }
    );
  }
}
