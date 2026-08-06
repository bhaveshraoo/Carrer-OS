import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateFinalInterviewReport } from "@/lib/interview/engine";
import { getLocalSession, saveLocalSession } from "@/lib/interview/store";
import type { InterviewSession, InterviewMemory } from "@/lib/interview/schema";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { sessionId, analyticsData } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    let session: InterviewSession | null = null;
    let memory: InterviewMemory | null = null;
    let fullTranscript: any[] = [];

    try {
      const { data: s } = await (supabase.from("interview_sessions") as any)
        .select("*")
        .eq("id", sessionId)
        .single();
      session = s;
    } catch {
      // Supabase error
    }

    const localData = getLocalSession(sessionId);
    if (!session && localData) {
      session = localData.session;
      memory = localData.memory;
      fullTranscript = localData.answers.map((a, i) => ({
        question: localData.questions[i]?.question_text || "Interview Question",
        answer: a.transcript || "",
        evaluation: a.evaluation,
      }));
    }

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (!memory) {
      memory = {
        session_id: sessionId,
        strong_skills: [],
        weak_skills: [],
        communication_rating: "Good",
        confidence_score: 80,
        topics_covered: [],
        questions_asked: [],
        resume_references: [],
        updated_at: new Date().toISOString(),
      };
    }

    const analytics = {
      avg_speaking_speed_wpm: analyticsData?.avg_speaking_speed_wpm || 135,
      filler_words_total: analyticsData?.filler_words_total || 3,
      long_pauses_count: analyticsData?.long_pauses_count || 1,
      face_visible_pct: analyticsData?.face_visible_pct || 98,
      low_noise_pct: analyticsData?.low_noise_pct || 90,
    };

    // Generate Recruiter Report via Gemini
    const reportData = await generateFinalInterviewReport({
      session,
      memory,
      full_transcript: fullTranscript,
      analytics,
    });

    const reportObj = {
      id: `rep_${Date.now()}`,
      session_id: sessionId,
      ...reportData,
      created_at: new Date().toISOString(),
    };

    if (localData) {
      localData.report = reportObj;
      localData.session.status = "completed";
      saveLocalSession(localData);
    }

    // Save in DB if available
    try {
      await (supabase.from("interview_reports") as any).insert(reportObj);
      await (supabase.from("interview_sessions") as any)
        .update({ status: "completed", ended_at: new Date().toISOString() })
        .eq("id", sessionId);
    } catch {
      // Ignore DB errors
    }

    return NextResponse.json({
      success: true,
      reportId: reportObj.id,
      report: reportData,
    });
  } catch (err: any) {
    console.error("Error ending interview & generating report:", err);
    return NextResponse.json({ error: err.message || "Failed to generate report" }, { status: 500 });
  }
}
