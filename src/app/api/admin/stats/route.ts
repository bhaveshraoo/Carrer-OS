import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Registered DB Users (from Supabase Auth users table using Admin Client)
    let usersCount = 0;
    let recentUsers: any[] = [];

    try {
      const adminSupabase = createAdminClient();
      const { data: authData, error: authError } = await adminSupabase.auth.admin.listUsers();

      if (!authError && authData && authData.users && authData.users.length > 0) {
        usersCount = authData.users.length;
        recentUsers = authData.users
          .map((u: any) => ({
            id: u.id,
            full_name:
              u.user_metadata?.full_name ||
              u.user_metadata?.name ||
              (u.email ? u.email.split("@")[0] : "Registered Student"),
            email: u.email || "",
            username: u.email || u.id.slice(0, 8),
            created_at: u.created_at,
          }))
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
      }
    } catch (e) {
      console.warn("Could not list auth.users via admin client, checking public.users", e);
    }

    // Fallback to public.users if auth.users returns 0
    if (usersCount === 0) {
      try {
        const { count } = await supabase.from("users").select("*", { count: "exact", head: true });
        usersCount = count || 0;
        const { data } = await supabase
          .from("users")
          .select("id, full_name, username, created_at")
          .order("created_at", { ascending: false })
          .limit(5);
        if (data && data.length > 0) recentUsers = data;
      } catch (e) {
        usersCount = 0;
      }
    }

    // 2. Resumes Uploaded & Analyzed
    let resumesCount = 0;
    try {
      const { count } = await supabase.from("resumes").select("*", { count: "exact", head: true });
      resumesCount = count || 0;
    } catch (e) {
      resumesCount = 0;
    }

    // 3. Average ATS Resume Score from Supabase
    let avgAtsScore = 0;
    try {
      const { data } = await supabase.from("resume_analyses").select("ats_score");
      if (data && data.length > 0) {
        const validScores = data.filter((r: any) => typeof r.ats_score === "number").map((r: any) => r.ats_score);
        if (validScores.length > 0) {
          avgAtsScore = Math.round(validScores.reduce((a: number, b: number) => a + b, 0) / validScores.length);
        }
      }
    } catch (e) {
      avgAtsScore = 0;
    }

    // 4. Target Companies Count
    let companiesCount = 0;
    try {
      const { count } = await supabase.from("companies").select("*", { count: "exact", head: true });
      companiesCount = count || 0;
    } catch (e) {
      companiesCount = 0;
    }

    // 5. DSA Question Bank Count
    let dsaCount = 0;
    try {
      const { count } = await supabase.from("dsa_questions").select("*", { count: "exact", head: true });
      dsaCount = count || 0;
    } catch (e) {
      dsaCount = 0;
    }

    // 6. Active Admin Employees Count
    let employeesCount = 0;
    try {
      const { count } = await (supabase.from("admin_accounts") as any).select("*", { count: "exact", head: true });
      employeesCount = count || 0;
    } catch (e) {
      employeesCount = 0;
    }

    // 7. Active Daily Users (Created in last 24h)
    let activeDailyUsers = 0;
    try {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count } = await supabase.from("users").select("*", { count: "exact", head: true }).gte("created_at", yesterday);
      activeDailyUsers = count || 0;
    } catch (e) {
      activeDailyUsers = 0;
    }

    // 8. Recent Resumes List
    let recentResumes: any[] = [];
    try {
      const { data } = await supabase
        .from("resumes")
        .select("id, file_name, status, created_at, user_id")
        .order("created_at", { ascending: false })
        .limit(5);
      recentResumes = data || [];
    } catch (e) {
      recentResumes = [];
    }

    // 9. Recent DSA Questions List
    let recentDsa: any[] = [];
    try {
      const { data } = await supabase
        .from("dsa_questions")
        .select("id, title, topic, difficulty, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      recentDsa = data || [];
    } catch (e) {
      recentDsa = [];
    }

    return NextResponse.json({
      success: true,
      stats: {
        usersCount: usersCount || 0,
        resumesCount: resumesCount || 0,
        avgAtsScore: avgAtsScore || 0,
        companiesCount: companiesCount || 0,
        dsaCount: dsaCount || 0,
        employeesCount: employeesCount || 0,
        activeDailyUsers: activeDailyUsers || 0,
        offerConversionRate: 0,
        proSubscriberMrr: 0,
        activeInterns: 0,
        internsAttendance: 0,
        avgInternScore: 0,
        projectsCount: 0,
        applicationsCount: 0,
        revenuePayouts: 0,
        certsIssued: 0,
      },
      recentUsers,
      recentResumes,
      recentDsa,
    });
  } catch (err: any) {
    console.error("Admin stats API error:", err);
    return NextResponse.json({
      success: true,
      stats: {
        usersCount: 0,
        resumesCount: 0,
        avgAtsScore: 0,
        companiesCount: 0,
        dsaCount: 0,
        employeesCount: 0,
        activeDailyUsers: 0,
        offerConversionRate: 0,
        proSubscriberMrr: 0,
        activeInterns: 0,
        internsAttendance: 0,
        avgInternScore: 0,
        projectsCount: 0,
        applicationsCount: 0,
        revenuePayouts: 0,
        certsIssued: 0,
      },
      recentUsers: [],
      recentResumes: [],
      recentDsa: [],
    });
  }
}
