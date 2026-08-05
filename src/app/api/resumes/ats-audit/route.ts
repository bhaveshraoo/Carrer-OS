import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { geminiJson } from "@/lib/ai/gemini";

export const runtime = "nodejs";
export const maxDuration = 45;

export interface AtsAuditResult {
  ats_score: number; // 0 - 100
  quantified_impact_score: number; // 0 - 100
  format_verdict: string;
  action_verb_replacements: {
    original_phrase: string;
    recommended_verb: string;
    reason: string;
  }[];
  matched_skills: string[];
  missing_critical_skills: string[];
  jakes_alignment_notes: string;
  priority_actions: string[];
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Fetch candidate's latest analyzed resume
  const { data: resumes } = await table(supabase, "resumes")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "analyzed");

  const latestResume = resumes?.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];

  if (!latestResume?.raw_text) {
    return NextResponse.json(
      { error: "No analyzed resume text found. Please upload a resume first." },
      { status: 400 }
    );
  }

  const candidateText = latestResume.raw_text;

  try {
    const result = await geminiJson<AtsAuditResult>({
      system:
        "You are an expert ATS Resume Auditor and Technical Hiring Specialist for top technology firms. " +
        "Your job is to perform a rigorous 5-benchmark ATS audit on a candidate's resume: " +
        "1. ATS Hard-Failure & Formatting Detection\n" +
        "2. Quantified Impact Score (detecting missing metrics %, $, 10k+, ms)\n" +
        "3. Action Verb Strength (replacing weak passive phrases like 'worked on' with power engineering verbs)\n" +
        "4. Technical Keyword Density vs 2026 Tech Standards\n" +
        "5. Jake's Resume Format Alignment (1-page single-column suitability).\n" +
        "Provide honest, analytical, actionable feedback in clean JSON.",
      prompt: `Audit this candidate resume text across 5 ATS benchmarks:

Candidate Resume Text:
"""
${candidateText}
"""

Return JSON in this EXACT schema:
{
  "ats_score": number,                         // Overall ATS Score (0-100)
  "quantified_impact_score": number,            // Quantified Impact Score (0-100)
  "format_verdict": "string",                   // e.g. "ATS Friendly Single-Column" or "Formatting Risk Detected"
  "action_verb_replacements": [
    {
      "original_phrase": "string",
      "recommended_verb": "string",
      "reason": "string"
    }
  ],
  "matched_skills": ["string"],                 // Core tech skills detected
  "missing_critical_skills": ["string"],        // Modern tech skills missing (e.g. AWS, Docker, REST, Microservices)
  "jakes_alignment_notes": "string",           // Evaluation against Jake's Resume standard
  "priority_actions": ["string"]                // Top 3 priority fix actions
}`,
    });

    // ── SYNC GEMINI ATS SCORE TO SUPABASE SO ALL REPORT CARDS MATCH 100% ──
    const geminiScore = Math.max(0, Math.min(100, result.ats_score));

    // Fetch existing analysis for this resume if present
    const { data: existingAnalyses } = await table(supabase, "resume_analyses")
      .select("*")
      .eq("resume_id", latestResume.id);
    const existingAnalysis = existingAnalyses?.[0];

    if (existingAnalysis) {
      const currentReport = (existingAnalysis.report as any) || {};
      const updatedReport = {
        ...currentReport,
        overallScore: geminiScore,
        scores: {
          ...(currentReport.scores || {}),
          resume_score: geminiScore,
          ats_score: geminiScore,
        },
      };

      await table(supabase, "resume_analyses")
        .update({
          resume_score: geminiScore,
          report: updatedReport,
        })
        .eq("id", existingAnalysis.id);
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Gemini ATS Audit error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to execute Gemini ATS Audit" },
      { status: 500 }
    );
  }
}
