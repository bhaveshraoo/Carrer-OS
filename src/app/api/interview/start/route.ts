import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateInterviewBlueprint } from "@/lib/interview/engine";
import { saveLocalSession } from "@/lib/interview/store";
import type { InterviewSession, InterviewQuestion, InterviewMemory } from "@/lib/interview/schema";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await req.json();
    const {
      job_role,
      company_name,
      job_description,
      experience,
      tech_stack,
      difficulty,
      interview_type,
      duration_minutes,
      language,
      personality,
      resume_text,
      resume_id,
    } = body;

    if (!job_role || !company_name) {
      return NextResponse.json({ error: "Missing required fields: job_role and company_name" }, { status: 400 });
    }

    const userId = user?.id || "00000000-0000-0000-0000-000000000000";

    // 1. Generate Interview Blueprint via Gemini 3.1 Flash Lite
    const blueprint = await generateInterviewBlueprint({
      job_role,
      company_name,
      job_description: job_description || "General Software Engineering Role",
      experience: experience || "2-4 years",
      tech_stack: tech_stack || ["React", "Node.js", "TypeScript"],
      difficulty: difficulty || "Medium",
      interview_type: interview_type || "Technical",
      duration_minutes: duration_minutes ? parseInt(duration_minutes, 10) : 30,
      personality: personality || "Professional HR",
      resume_text: resume_text || "",
    });

    // Optionally fetch resume metadata (ATS score + filename) if resume_id provided
    let resume_ats_score: number | null = null;
    let resume_file_name: string | null = null;
    if (resume_id) {
      try {
        const { data: resumeRow } = await (supabase.from("resumes") as any)
          .select("file_name, ats_score")
          .eq("id", resume_id)
          .single();
        if (resumeRow) {
          resume_ats_score = resumeRow.ats_score ?? null;
          resume_file_name = resumeRow.file_name ?? null;
        }
      } catch {
        // Resume data not critical — continue
      }
    }

    const fallbackSessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    let session: InterviewSession = {
      id: fallbackSessionId,
      user_id: userId,
      job_role,
      company_name,
      job_description: job_description || "General Software Engineering Role",
      experience: experience || "2-4 years",
      tech_stack: tech_stack || ["React", "Node.js", "TypeScript"],
      difficulty: difficulty || "Medium",
      interview_type: interview_type || "Technical",
      duration_minutes: duration_minutes ? parseInt(duration_minutes, 10) : 30,
      language: language || "English",
      personality: personality || "Professional HR",
      blueprint,
      status: "in_progress",
      created_at: new Date().toISOString(),
      started_at: new Date().toISOString(),
      resume_id: resume_id ?? null,
      resume_ats_score,
      resume_file_name,
    };

    // Attempt Supabase insert gracefully
    try {
      const { data: dbSession, error: sessionErr } = await (supabase.from("interview_sessions") as any)
        .insert({
          user_id: userId,
          job_role,
          company_name,
          job_description: job_description || "General Software Engineering Role",
          experience: experience || "2-4 years",
          tech_stack: tech_stack || ["React", "Node.js", "TypeScript"],
          difficulty: difficulty || "Medium",
          interview_type: interview_type || "Technical",
          duration_minutes: duration_minutes ? parseInt(duration_minutes, 10) : 30,
          language: language || "English",
          personality: personality || "Professional HR",
          blueprint,
          status: "in_progress",
          started_at: new Date().toISOString(),
          resume_id: resume_id ?? null,
          resume_ats_score,
          resume_file_name,
        })
        .select()
        .single();

      if (!sessionErr && dbSession) {
        session = dbSession;
      }
    } catch (err) {
      console.warn("Supabase session insert notice (using in-memory session):", err);
    }

    const firstQuestion: InterviewQuestion = {
      id: `q_${Date.now()}_1`,
      session_id: session.id,
      section: "Welcome & Greeting",
      question_number: 1,
      question_text: `Hey! Welcome to your ${job_role} interview at ${company_name}. I'm your AI interviewer for today's session. Are you ready to get started?`,
      expected_aspects: ["Readiness", "Greeting", "Introduction"],
      asked_at: new Date().toISOString(),
    };

    const initialMemory: InterviewMemory = {
      session_id: session.id,
      strong_skills: [],
      weak_skills: [],
      communication_rating: "Good",
      confidence_score: 80,
      topics_covered: [],
      questions_asked: [firstQuestion.question_text],
      resume_references: [],
      updated_at: new Date().toISOString(),
    };

    // Save in memory store
    saveLocalSession({
      session,
      questions: [firstQuestion],
      answers: [],
      memory: initialMemory,
    });

    // Also attempt Supabase inserts for memory and questions if DB available
    try {
      await (supabase.from("interview_memory") as any).insert(initialMemory);
      await (supabase.from("interview_questions") as any).insert(firstQuestion);
    } catch (err) {
      // Ignore Supabase table missing errors
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      blueprint,
      firstQuestion,
    });
  } catch (err: any) {
    console.error("Error starting AI interview:", err);
    return NextResponse.json({ error: err.message || "Failed to start interview" }, { status: 500 });
  }
}
