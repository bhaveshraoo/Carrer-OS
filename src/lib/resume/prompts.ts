import { generateJson } from "@/lib/ai";
import type { ExtractedResume, ResumeScores, RewriteSuggestions } from "./types";

export async function extractResumeData(resumeText: string): Promise<ExtractedResume> {
  return generateJson<ExtractedResume>({
    system:
      "You extract structured data from resumes for an Indian campus-placement prep platform. " +
      "Only extract what is actually present in the text — never invent skills, employers, or dates. " +
      "Return ONLY valid JSON matching the schema in the prompt, no markdown fences, no commentary.",
    prompt: `Extract structured data from this resume text into this exact JSON shape:
{
  "skills": string[],
  "experience": [{ "title": string, "company": string, "duration": string, "bullets": string[] }],
  "education": [{ "degree": string, "institution": string, "duration": string }],
  "certifications": string[],
  "projects": [{ "name": string, "description": string, "technologies": string[] }],
  "missing_sections": string[]  // e.g. "no contact info", "no projects listed" — sections a strong campus-placement resume usually has but this one lacks
}

Resume text:
"""
${resumeText}
"""`,
  });
}

export async function scoreResume(
  resumeText: string,
  extracted: ExtractedResume
): Promise<ResumeScores> {
  return generateJson<ResumeScores>({
    system:
      "You are an experienced campus recruiter and ATS specialist evaluating resumes for " +
      "entry-level roles at Indian tech and services companies. Be honest and specific — " +
      "generic high scores help no one. Return ONLY valid JSON, no markdown fences, no commentary.",
    prompt: `Score this resume on five headline dimensions plus a six-part ATS breakdown, each 0-100, based on the extracted data and raw text below.

- resume_score: overall quality for a campus-placement context
- ats_score: how well it would parse through common ATS systems (formatting, keywords, structure)
- recruiter_score: how quickly a human recruiter could assess fit in a 6-second skim
- hr_readability_score: clarity, grammar, professional tone
- industry_match_score: how well the skills/projects align with a coherent target role (assume the most obvious target role from the content)

Return this exact JSON shape:
{
  "resume_score": number,
  "ats_score": number,
  "ats_breakdown": {
    "contact_info": number,   // 0-100: is contact info complete and parseable
    "skills_match": number,   // 0-100: skills section presence and relevance
    "experience": number,     // 0-100: experience section structure and clarity
    "education": number,      // 0-100: education section completeness
    "keywords": number,       // 0-100: presence of role-relevant keywords
    "formatting": number      // 0-100: ATS-parseable formatting (no tables/columns/graphics issues)
  },
  "recruiter_score": number,
  "hr_readability_score": number,
  "industry_match_score": number,
  "summary": string,        // 2-3 sentences, direct and specific
  "strengths": string[],    // 2-4 concrete strengths
  "weaknesses": string[]    // 2-4 concrete, actionable weaknesses
}

Extracted data:
${JSON.stringify(extracted, null, 2)}

Raw resume text:
"""
${resumeText}
"""`,
  });
}

export async function suggestRewrites(
  extracted: ExtractedResume
): Promise<RewriteSuggestions> {
  return generateJson<RewriteSuggestions>({
    system:
      "You rewrite resume bullet points to be more specific, quantified, and ATS-friendly for " +
      "Indian campus-placement candidates. Never invent metrics or achievements that aren't " +
      "plausible from context — flag where a real number is needed instead of fabricating one. " +
      "Return ONLY valid JSON, no markdown fences, no commentary.",
    prompt: `Given this extracted resume data, suggest improvements:

{
  "bullet_rewrites": [
    { "original": string, "improved": string, "reason": string }
    // pick up to 6 of the weakest bullets across all experience/projects
  ],
  "missing_ats_keywords": string[],  // keywords a target role would expect that are absent
  "section_suggestions": string[]    // e.g. "Add a projects section", "Quantify the impact in your internship bullets"
}

Extracted data:
${JSON.stringify(extracted, null, 2)}`,
  });
}
