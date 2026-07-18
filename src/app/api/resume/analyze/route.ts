import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { extractResumeText, UnreadableFileError } from "@/lib/resume/parse";
import { extractResumeData, scoreResume, suggestRewrites } from "@/lib/resume/prompts";
import { GEMINI_MODEL } from "@/lib/ai/gemini";
import { MODEL as ANTHROPIC_MODEL } from "@/lib/anthropic/client";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Days 8-12 pipeline in one route: parse -> extract -> score -> rewrite suggestions.
 * Split into three sequential Claude calls (not one mega-prompt) per CLAUDE.md —
 * separate concerns, each independently testable/iterable, and scoring can see the
 * cleaned extracted data rather than re-parsing the raw text itself.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { resumeId } = await request.json();
  if (!resumeId) {
    return NextResponse.json({ error: "resumeId is required" }, { status: 400 });
  }

  const { data: resume, error: fetchError } = await table(supabase, "resumes")
    .select("*")
    .eq("id", resumeId)
    .eq("user_id", user.id) // belt-and-suspenders alongside RLS
    .single();

  if (fetchError || !resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  try {
    const startedAt = Date.now();

    // 1. Download the file from Storage and extract raw text
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("resumes")
      .download(resume.storage_path);

    if (downloadError || !fileData) {
      throw new Error(downloadError?.message ?? "Could not download file");
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    const resumeText = await extractResumeText(buffer, resume.file_name);

    await table(supabase, "resumes")
      .update({ raw_text: resumeText, status: "parsed", parsed_at: new Date().toISOString() })
      .eq("id", resumeId);

    // 2. Structured extraction
    const extracted = await extractResumeData(resumeText);

    // 3. Scoring (sees the extracted data, not just raw text)
    const scores = await scoreResume(resumeText, extracted);

    // 4. Rewrite suggestions
    const suggestions = await suggestRewrites(extracted);

    const provider = process.env.AI_PROVIDER || "gemini";
    const modelName = provider === "anthropic" ? ANTHROPIC_MODEL : GEMINI_MODEL;

    const { data: analysis, error: insertError } = await table(supabase, "resume_analyses")
      .insert({
        resume_id: resumeId,
        resume_score: scores.resume_score,
        ats_score: scores.ats_score,
        recruiter_score: scores.recruiter_score,
        hr_readability_score: scores.hr_readability_score,
        industry_match_score: scores.industry_match_score,
        report: { extracted, scores, suggestions },
        ai_provider: provider,
        model_name: modelName,
        processing_time_ms: Date.now() - startedAt,
      })
      .select()
      .single();

    if (insertError) throw new Error(insertError.message);

    await table(supabase, "resumes")
      .update({ status: "analyzed", analyzed_at: new Date().toISOString() })
      .eq("id", resumeId);

    return NextResponse.json({ analysis });
  } catch (err) {
    await table(supabase, "resumes").update({ status: "error" }).eq("id", resumeId);

    if (err instanceof UnreadableFileError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }

    console.error("Resume analysis failed:", err);
    return NextResponse.json(
      { error: "Something went wrong analyzing your resume. Please try again." },
      { status: 500 }
    );
  }
}
