import { NextResponse } from "next/server";
import { ProjectTeam } from "@/lib/projects/types";

export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qtyuoiwioproztlnspyf.supabase.co";
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

// Default Initial Mock Teams Store
const defaultTeams: ProjectTeam[] = [
  {
    id: "team-1",
    teamName: "Team 1 — Full Stack & AI Pipeline",
    teamLeaderName: "Ananya Roy",
    teamLeaderEmail: "ananya.roy@careeros.in",
    maxSeats: 5,
    filledSeats: 3,
    members: [
      { id: "mem-1", name: "Ananya Roy", email: "ananya.roy@careeros.in", domain: "Full Stack", role: "Team Leader (TL)", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
      { id: "mem-2", name: "Bhavesh Rao", email: "bhavesh@careeros.in", domain: "Frontend", role: "UI & Component Intern", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" },
      { id: "mem-3", name: "Riya Mehta", email: "riya.m@gmail.com", domain: "AI/ML", role: "Lead Scoring Intern", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
    ],
  },
  {
    id: "team-2",
    teamName: "Team 2 — Backend & Database Systems",
    teamLeaderName: "Karan Mehta",
    teamLeaderEmail: "karan.m@careeros.in",
    maxSeats: 4,
    filledSeats: 2,
    members: [
      { id: "mem-4", name: "Karan Mehta", email: "karan.m@careeros.in", domain: "Backend", role: "Team Leader (TL)", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
      { id: "mem-5", name: "Arjun Nair", email: "arjun.n@gmail.com", domain: "Database", role: "PostgreSQL & Prisma Intern", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
    ],
  },
];

const serverTeamsStore: Map<string, ProjectTeam> = new Map(
  defaultTeams.map((t) => [t.id, t])
);

/**
 * GET /api/projects/teams
 */
export async function GET(req: Request) {
  try {
    let dbTeams: ProjectTeam[] = [];
    if (SUPABASE_URL && SERVICE_KEY) {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/project_teams?select=*`, {
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
          },
          cache: "no-store",
        });
        if (res.ok) {
          const raw = await res.json();
          if (Array.isArray(raw) && raw.length > 0) {
            dbTeams = raw;
          }
        }
      } catch (err) {
        console.warn("Supabase teams fetch warning:", err);
      }
    }

    const teamMap = new Map<string, ProjectTeam>();
    serverTeamsStore.forEach((t, id) => teamMap.set(id, t));
    dbTeams.forEach((t) => teamMap.set(t.id, t));

    const result = Array.from(teamMap.values());
    return NextResponse.json({ success: true, teams: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, teams: Array.from(serverTeamsStore.values()), error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/teams
 * Create a new team
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teamName, teamLeaderName, teamLeaderEmail, maxSeats } = body;

    const newTeam: ProjectTeam = {
      id: `team-${Date.now()}`,
      teamName: teamName || "New Engineering Team",
      teamLeaderName: teamLeaderName || "Team Leader",
      teamLeaderEmail: teamLeaderEmail || "tl@careeros.in",
      maxSeats: maxSeats || 4,
      filledSeats: 1,
      members: [
        {
          id: `mem-${Date.now()}`,
          name: teamLeaderName || "Team Leader",
          email: teamLeaderEmail || "tl@careeros.in",
          domain: "Engineering",
          role: "Team Leader (TL)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        },
      ],
    };

    serverTeamsStore.set(newTeam.id, newTeam);

    if (SUPABASE_URL && SERVICE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/project_teams`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify(newTeam),
        });
      } catch (err) {
        console.warn("Supabase insert team warning:", err);
      }
    }

    return NextResponse.json({ success: true, team: newTeam });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/projects/teams
 * Promote member or update member role across teams
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { action, memberId, newRole, targetTeamId, member } = body;

    if (action === "add_member" && targetTeamId && member) {
      const team = serverTeamsStore.get(targetTeamId);
      if (team) {
        const updatedTeam = {
          ...team,
          filledSeats: team.filledSeats + 1,
          members: [...team.members.filter((m) => m.id !== member.id), member],
        };
        serverTeamsStore.set(targetTeamId, updatedTeam);
      }
    } else if (action === "promote" && memberId && newRole) {
      // Find team containing member and promote them
      serverTeamsStore.forEach((team, teamId) => {
        const memIdx = team.members.findIndex((m) => m.id === memberId || m.name === memberId);
        if (memIdx !== -1) {
          const updatedMembers = [...team.members];
          updatedMembers[memIdx] = {
            ...updatedMembers[memIdx],
            role: newRole,
          };
          const updatedTeam = {
            ...team,
            ...(newRole.includes("TL") || newRole.includes("Leader")
              ? { teamLeaderName: updatedMembers[memIdx].name, teamLeaderEmail: updatedMembers[memIdx].email }
              : {}),
            members: updatedMembers,
          };
          serverTeamsStore.set(teamId, updatedTeam);
        }
      });
    }

    return NextResponse.json({
      success: true,
      teams: Array.from(serverTeamsStore.values()),
      message: "Teams updated successfully!",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
