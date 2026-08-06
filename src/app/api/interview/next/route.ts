import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { evaluateAnswerAndGetNextQuestion } from "@/lib/interview/engine";
import { getLocalSession, saveLocalSession } from "@/lib/interview/store";
import type { InterviewSession, InterviewQuestion, InterviewMemory } from "@/lib/interview/schema";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const {
      sessionId,
      questionId,
      transcript,
      durationSeconds = 30,
      responseDelaySeconds = 2,
    } = body;

    if (!sessionId || !questionId) {
      return NextResponse.json({ error: "Missing sessionId or questionId" }, { status: 400 });
    }

    // 1. Fetch Session from DB or Local Store
    let session: InterviewSession | null = null;
    let questionsList: InterviewQuestion[] = [];
    let memory: InterviewMemory | null = null;

    try {
      const { data: s } = await (supabase.from("interview_sessions") as any)
        .select("*")
        .eq("id", sessionId)
        .single();
      session = s;
    } catch {
      // Supabase query error
    }

    const localData = getLocalSession(sessionId);
    if (!session && localData) {
      session = localData.session;
      questionsList = localData.questions;
      memory = localData.memory;
    }

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // 2. Fetch Current Question
    let currentQuestionText = "Tell me about your technical approach.";
    let currentSection = "Technical Round";
    let questionNumber = 1;

    const matchedQ = questionsList.find((q) => q.id === questionId);
    if (matchedQ) {
      currentQuestionText = matchedQ.question_text;
      currentSection = matchedQ.section;
      questionNumber = matchedQ.question_number;
    } else {
      try {
        const { data: qData } = await (supabase.from("interview_questions") as any)
          .select("*")
          .eq("id", questionId)
          .single();
        if (qData) {
          currentQuestionText = qData.question_text;
          currentSection = qData.section;
          questionNumber = qData.question_number;
        }
      } catch {
        // Ignore
      }
    }

    // 3. Fetch Memory
    if (!memory) {
      try {
        const { data: memData } = await (supabase.from("interview_memory") as any)
          .select("*")
          .eq("session_id", sessionId)
          .single();
        memory = memData;
      } catch {
        // Ignore
      }
    }

    const currentMemory: InterviewMemory = memory || {
      session_id: sessionId,
      strong_skills: [],
      weak_skills: [],
      communication_rating: "Good",
      confidence_score: 80,
      topics_covered: [],
      questions_asked: [currentQuestionText],
      resume_references: [],
      updated_at: new Date().toISOString(),
    };

    // 4. Calculate Speaking Metrics
    const wordsCount = (transcript || "").trim().split(/\s+/).filter(Boolean).length;
    const speakingWpm = durationSeconds > 0 ? Math.round((wordsCount / durationSeconds) * 60) : 130;
    const fillerWordsRegex = /\b(um|uh|like|you know|basically|actually|sort of|kind of)\b/gi;
    const fillerWordsCount = (transcript || "").match(fillerWordsRegex)?.length || 0;

    // Calculate remaining minutes
    const startTime = new Date(session.started_at || session.created_at).getTime();
    const elapsedMinutes = Math.floor((Date.now() - startTime) / 60000);
    const remainingMinutes = Math.max(0, session.duration_minutes - elapsedMinutes);

    // 5. Call Gemini Evaluation Engine
    const evalResult = await evaluateAnswerAndGetNextQuestion({
      session,
      current_question: currentQuestionText,
      current_section: currentSection,
      question_number: questionNumber,
      transcript: transcript || "Candidate provided a concise answer.",
      duration_seconds: durationSeconds,
      remaining_minutes: remainingMinutes,
      memory: currentMemory,
      conversation_history: [],
    });

    const newMemory: InterviewMemory = {
      session_id: sessionId,
      strong_skills: evalResult.memory_update.strong_skills,
      weak_skills: evalResult.memory_update.weak_skills,
      communication_rating: evalResult.memory_update.communication_rating,
      confidence_score: evalResult.memory_update.confidence_score,
      topics_covered: Array.from(new Set([...currentMemory.topics_covered, ...evalResult.memory_update.topics_covered])),
      questions_asked: [...currentMemory.questions_asked, evalResult.next_question_text],
      resume_references: evalResult.memory_update.resume_references,
      updated_at: new Date().toISOString(),
    };

    const newAnswer = {
      id: `ans_${Date.now()}`,
      session_id: sessionId,
      question_id: questionId,
      transcript: transcript || "No spoken text recorded",
      duration_seconds: durationSeconds,
      speaking_wpm: speakingWpm,
      filler_words_count: fillerWordsCount,
      response_delay_seconds: responseDelaySeconds,
      evaluation: evalResult.evaluation,
      answered_at: new Date().toISOString(),
    };

    let nextQuestion: InterviewQuestion | null = null;
    if (!evalResult.is_final_question && evalResult.interviewer_action !== "end_interview") {
      nextQuestion = {
        id: `q_${Date.now()}_${questionNumber + 1}`,
        session_id: sessionId,
        section: evalResult.section || currentSection,
        question_number: questionNumber + 1,
        question_text: evalResult.next_question_text,
        expected_aspects: evalResult.evaluation.missing_aspects,
        asked_at: new Date().toISOString(),
      };
    }

    // Save in local store
    if (localData) {
      localData.memory = newMemory;
      localData.answers.push(newAnswer);
      if (nextQuestion) localData.questions.push(nextQuestion);
      if (evalResult.is_final_question || evalResult.interviewer_action === "end_interview") {
        localData.session.status = "completed";
      }
      saveLocalSession(localData);
    }

    // Attempt DB updates
    try {
      await (supabase.from("interview_answers") as any).insert(newAnswer);
      await (supabase.from("interview_memory") as any).upsert(newMemory);
      if (nextQuestion) {
        await (supabase.from("interview_questions") as any).insert(nextQuestion);
      }
    } catch {
      // Ignore DB errors
    }

    if (evalResult.is_final_question || evalResult.interviewer_action === "end_interview") {
      return NextResponse.json({
        isCompleted: true,
        evaluation: evalResult.evaluation,
        interviewerResponse: evalResult.interviewer_response,
      });
    }

    return NextResponse.json({
      isCompleted: false,
      evaluation: evalResult.evaluation,
      interviewerResponse: evalResult.interviewer_response,
      nextQuestion,
    });
  } catch (err: any) {
    console.error("Error evaluating next question:", err);
    return NextResponse.json({ error: err.message || "Failed to evaluate answer" }, { status: 500 });
  }
}
