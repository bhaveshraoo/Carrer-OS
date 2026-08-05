import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { geminiJson } from "@/lib/ai/gemini";

export const runtime = "nodejs";
export const maxDuration = 45;

export interface DsaCodeEvaluationResult {
  time_complexity: string;
  space_complexity: string;
  code_quality_score: number;       // 0–100 (maps to /10)
  approach_score: number;           // 0–10
  thinking_score: number;           // 0–10
  problem_solving_score: number;    // 0–10
  passed_all_edge_cases: boolean;
  edge_case_feedback: string;
  what_you_did_well: string;
  areas_to_improve: string;
  topic_verdict: "Good — Move Forward" | "Practice More" | "Restudy Topic";
  refactored_code_suggestion: string;
  key_takeaway: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { question_title, topic, student_code, language } = await request.json();

  if (!student_code || student_code.trim().length < 5) {
    return NextResponse.json(
      { error: "Student code is required." },
      { status: 400 }
    );
  }

  try {
    const result = await geminiJson<DsaCodeEvaluationResult>({
      system:
        "You are OS-Teacher — a world-class Staff Software Engineer and Technical Interview Coach at a top-tier company (Google/Meta/Amazon level). " +
        "You give honest, structured, actionable feedback like a senior mentor would in a real interview debrief.\n\n" +
        "EVALUATION CRITERIA:\n" +
        "1. time_complexity: Tightest Big-O bound (e.g. 'O(N)', 'O(N log N)').\n" +
        "2. space_complexity: Auxiliary space bound (e.g. 'O(1)', 'O(N)').\n" +
        "3. code_quality_score: 0–100. Based on correctness, edge cases, readability, naming, and optimality.\n" +
        "4. approach_score: 0–10. Did they pick the right algorithm/data structure for the problem?\n" +
        "5. thinking_score: 0–10. Is the code well-structured, logical, and readable?\n" +
        "6. problem_solving_score: 0–10. Overall: did they solve the problem correctly and efficiently?\n" +
        "7. passed_all_edge_cases: true/false.\n" +
        "8. edge_case_feedback: 2–3 sentences. Which edge cases were handled? Which were missed?\n" +
        "9. what_you_did_well: 2–3 sentences of genuine positive feedback.\n" +
        "10. areas_to_improve: 2–3 sentences of concrete, actionable improvement points.\n" +
        "11. topic_verdict: EXACTLY one of these strings: 'Good — Move Forward', 'Practice More', or 'Restudy Topic'.\n" +
        "12. key_takeaway: 1–2 sentences of senior engineering / recruiter-level advice for their next interview.\n" +
        "13. refactored_code_suggestion: MUST be a complete, production-grade, beautifully formatted MULTI-LINE solution with proper \\n line breaks and standard indentation. NEVER minified. NEVER wrapped in markdown code fences.",
      prompt: `Evaluate this candidate's DSA code for a real technical interview:

Question Title: ${question_title || "Algorithm Problem"}
Topic Category: ${topic || "DSA"}
Programming Language: ${language || "javascript"}

Candidate's Submitted Code:
\`\`\`${language || "javascript"}
${student_code}
\`\`\`

Return JSON in this EXACT schema:
{
  "time_complexity": "string",
  "space_complexity": "string",
  "code_quality_score": number,
  "approach_score": number,
  "thinking_score": number,
  "problem_solving_score": number,
  "passed_all_edge_cases": boolean,
  "edge_case_feedback": "string",
  "what_you_did_well": "string",
  "areas_to_improve": "string",
  "topic_verdict": "Good — Move Forward" | "Practice More" | "Restudy Topic",
  "key_takeaway": "string",
  "refactored_code_suggestion": "string"
}`,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Gemini DSA Code Evaluation Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to evaluate code with OS-Teacher." },
      { status: 500 }
    );
  }
}
