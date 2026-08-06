import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getLocalSession } from "@/lib/interview/store";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    let session: any = null;
    let questions: any[] = [];
    let answers: any[] = [];
    let memory: any = null;
    let report: any = null;

    try {
      const { data: s } = await (supabase.from("interview_sessions") as any)
        .select("*")
        .eq("id", id)
        .single();
      session = s;

      if (session) {
        const { data: q } = await (supabase.from("interview_questions") as any)
          .select("*")
          .eq("session_id", id)
          .order("question_number", { ascending: true });
        questions = q || [];

        const { data: a } = await (supabase.from("interview_answers") as any)
          .select("*")
          .eq("session_id", id)
          .order("answered_at", { ascending: true });
        answers = a || [];

        const { data: m } = await (supabase.from("interview_memory") as any)
          .select("*")
          .eq("session_id", id)
          .single();
        memory = m;

        const { data: r } = await (supabase.from("interview_reports") as any)
          .select("*")
          .eq("session_id", id)
          .single();
        report = r;
      }
    } catch {
      // Supabase query failed or table missing
    }

    // Fallback to local memory store if session not in DB
    if (!session) {
      const local = getLocalSession(id);
      if (local) {
        session = local.session;
        questions = local.questions;
        answers = local.answers;
        memory = local.memory;
        report = local.report || null;
      }
    }

    if (!session) {
      return NextResponse.json({ error: "Interview session not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      session,
      questions,
      answers,
      memory,
      report,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch interview details" }, { status: 500 });
  }
}
