import { generateJson } from "@/lib/ai";
import type { ExtractedResume, ResumeScores, RewriteSuggestions } from "./types";

export async function extractResumeData(resumeText: string): Promise<ExtractedResume> {
  return generateJson<ExtractedResume>({
    system:
      "You extract structured data from resumes for a top-tier tech career platform. " +
      "Only extract what is actually present in the text — never invent skills, employers, or dates. " +
      "Return ONLY valid JSON matching the schema in the prompt, no markdown fences, no commentary.",
    prompt: `Extract structured data from this resume text into this exact JSON shape:
{
  "skills": string[],
  "experience": [{ "title": string, "company": string, "duration": string, "bullets": string[] }],
  "education": [{ "degree": string, "institution": string, "duration": string }],
  "certifications": string[],
  "projects": [{ "name": string, "description": string, "technologies": string[] }],
  "missing_sections": string[]
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
      "You are a Staff Technical Recruiter at FAANG evaluating software engineering candidates. Be honest, rigorous, and specific — " +
      "evaluate candidates against top tech industry hiring standards. Return ONLY valid JSON, no markdown fences, no commentary.",
    prompt: `Score this resume on five headline dimensions plus a six-part ATS breakdown, each 0-100, based on the extracted data and raw text below.

- resume_score: overall quality for top tech product & service companies
- ats_score: how well it parses through Workday/Greenhouse/Lever ATS systems
- recruiter_score: how quickly a FAANG recruiter assesses fit in a 6-second skim
- hr_readability_score: clarity, grammar, professional technical tone
- industry_match_score: alignment of skills/projects with modern SDE/Full-Stack/AI roles

Return this exact JSON shape:
{
  "resume_score": number,
  "ats_score": number,
  "ats_breakdown": {
    "contact_info": number,   // 0-100: complete & parseable contact details
    "skills_match": number,   // 0-100: presence of in-demand tech stack
    "experience": number,     // 0-100: Google X-Y-Z action bullet quality & quantification
    "education": number,      // 0-100: education completeness
    "keywords": number,       // 0-100: presence of role-relevant ATS keywords
    "formatting": number      // 0-100: single-column ATS parseable structure
  },
  "recruiter_score": number,
  "hr_readability_score": number,
  "industry_match_score": number,
  "summary": string,        // 2-3 sentences, direct, technical, executive tone
  "strengths": string[],    // 2-4 concrete technical strengths
  "weaknesses": string[]    // 2-4 concrete, actionable engineering weaknesses
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
      "You are a Principal Engineering Coach rewriting resume bullet points for software engineers. " +
      "CRITICAL RULE: Every single rewritten bullet MUST follow Google's X-Y-Z formula: 'Accomplished [X] as measured by [Y], by doing [Z]'. " +
      "Start every bullet with a high-impact technical action verb (Engineered, Architected, Spearheaded, Benchmarked, Streamlined, Deployed, Optimized). " +
      "Incorporate precise technical stack details and realistic metrics. " +
      "Return ONLY valid JSON, no markdown fences, no commentary.",
    prompt: `Given this extracted resume data, suggest FAANG-ready engineering improvements:

{
  "bullet_rewrites": [
    { "original": string, "improved": string, "reason": string }
    // pick up to 6 weakest bullets across experience/projects
  ],
  "missing_ats_keywords": string[],  // 6-10 in-demand tech keywords missing
  "section_suggestions": string[]    // strategic structural/technical suggestions
}

Extracted data:
${JSON.stringify(extracted, null, 2)}`,
  });
}
