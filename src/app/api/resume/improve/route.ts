import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { geminiJson } from "@/lib/ai/gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

export interface OriginalResume {
  name: string;
  subtitle?: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
  education?: {
    institution: string;
    degree: string;
    duration: string;
    location?: string;
  }[];
  projects?: {
    name: string;
    tech?: string;
    bullets: string[];
  }[];
  open_source?: string[];
  skills?: {
    languages?: string;
    developerTools?: string;
    coreCS?: string;
    currentlyExploring?: string;
    raw?: string;
  };
  experience?: {
    title: string;
    bullets: string[];
  }[];
  achievements?: string[];
}

export interface ImproveResult {
  ats_score_before: number;
  ats_score_after: number;
  page_fill_percent: number;
  missing_keywords: string[];
  section_tips: string[];
  page_length_recommendations: {
    category: string;
    title: string;
    suggestion: string;
    action_type: "expand_bullets" | "add_achievements" | "add_certifications" | "add_project";
  }[];
  suggestions: {
    section: string;
    original: string;
    improved: string;
    reason: string;
    ats_boost: number;
  }[];
  full_resume: {
    name: string;
    phone: string;
    email: string;
    linkedin: string;
    github: string;
    location: string;
    summary: string;
    education: {
      institution: string;
      location: string;
      degree: string;
      duration: string;
    }[];
    experience: {
      title: string;
      company: string;
      location: string;
      duration: string;
      bullets: string[];
    }[];
    projects: {
      name: string;
      tech: string;
      duration: string;
      bullets: string[];
    }[];
    skills: {
      languages: string;
      frameworks: string;
      developerTools: string;
      libraries: string;
    };
    achievements?: {
      title: string;
      detail: string;
    }[];
    certifications?: {
      title: string;
      issuer: string;
      duration?: string;
    }[];
  };
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: resumes } = await table(supabase, "resumes")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "analyzed");

  const latest = resumes?.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];

  if (!latest?.raw_text) {
    return NextResponse.json({ error: "No uploaded resume found" }, { status: 404 });
  }

  try {
    // Parse candidate's raw uploaded resume text into their exact original document structure
    const original_resume = await geminiJson<OriginalResume>({
      system:
        "You are an exact resume parser. Extract the candidate's original resume into structured format preserving their EXACT words, exact titles, exact subheadings, and exact bullet points. " +
        "DO NOT rewrite, summarize, or improve any wording. Return ONLY valid JSON.",
      prompt: `Parse this exact resume text into the candidate's original document structure:
{
  "name": string,
  "subtitle": string,           // e.g. "AI & Full Stack Developer | Open Source Contributor"
  "phone": string,
  "email": string,
  "linkedin": string,
  "github": string,
  "summary": string,
  "education": [
    { "institution": string, "degree": string, "duration": string, "location": string }
  ],
  "projects": [
    { "name": string, "tech": string, "bullets": string[] }
  ],
  "open_source": string[],      // any open source contributions bullets if present
  "skills": {
    "languages": string,
    "developerTools": string,
    "coreCS": string,
    "currentlyExploring": string,
    "raw": string
  },
  "experience": [
    { "title": string, "bullets": string[] }
  ],
  "achievements": string[]
}

Resume Text:
"""
${latest.raw_text}
"""`,
    });

    return NextResponse.json({
      raw_text: latest.raw_text,
      file_name: latest.file_name || "Uploaded Resume.pdf",
      created_at: latest.created_at,
      original_resume
    });
  } catch (err) {
    return NextResponse.json({
      raw_text: latest.raw_text,
      file_name: latest.file_name || "Uploaded Resume.pdf",
      created_at: latest.created_at
    });
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: resumes } = await table(supabase, "resumes")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "analyzed");

  const latest = resumes?.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];

  if (!latest?.raw_text) {
    return NextResponse.json(
      { error: "No analyzed resume found. Please upload and analyze your resume first." },
      { status: 404 }
    );
  }

  const { data: analyses } = await table(supabase, "resume_analyses")
    .select("*")
    .eq("resume_id", latest.id);

  const latestAnalysis = analyses?.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];

  const currentAts = latestAnalysis?.ats_score ?? 50;

  try {
    const result = await geminiJson<ImproveResult>({
      system:
        "You are a Principal Technical Recruiter and Staff Engineer at Google/FAANG, specializing in high-impact ATS resume optimization using Jake's Resume standard format. " +
        "CRITICAL QUALITY RULES FOR WORLD-CLASS REALISM:\n" +
        "1. GOOGLE X-Y-Z FORMULA: Every bullet point MUST follow Google's formula: 'Accomplished [X] as measured by [Y], by doing [Z]'. Start every bullet with strong technical action verbs (e.g. Engineered, Architected, Spearheaded, Benchmarked, Streamlined, Deployed, Optimized). NEVER use weak/passive verbs like 'worked on', 'helped', 'responsible for'.\n" +
        "2. PAGE LENGTH & COMPLETENESS DIAGNOSTIC: Calculate page_fill_percent (0-100%). A full single-page A4 resume should fill ~90-100%. If current content only fills 60-80% (leaving bottom empty space), generate 3-4 specific page_length_recommendations suggesting adding a 3rd bullet to projects, adding Achievements/Awards, Hackathons/Certifications, or extra project architectural depth.\n" +
        "3. AUTHENTICITY GUARD: Extract ONLY candidate contact info present in text (name, phone, email, linkedin, github, location). Return '' for missing fields. NEVER invent fake details or placeholder names.\n" +
        "4. JAKE'S SKILL CATEGORIZATION: Group skills precisely into Languages, Frameworks, Developer Tools, and Libraries.\n" +
        "Return ONLY valid JSON matching the exact schema specified.",
      prompt: `Analyze this tech candidate's resume and generate top-tier engineering improvements, A4 page length recommendations, and a complete Jake's Resume structure.

Current ATS score: ${currentAts}/100

Return this EXACT JSON shape:
{
  "ats_score_before": number,
  "ats_score_after": number,
  "page_fill_percent": number,
  "missing_keywords": string[],
  "section_tips": string[],
  "page_length_recommendations": [
    {
      "category": string,
      "title": string,
      "suggestion": string,
      "action_type": "expand_bullets" | "add_achievements" | "add_certifications" | "add_project"
    }
  ],
  "suggestions": [
    {
      "section": string,
      "original": string,
      "improved": string,
      "reason": string,
      "ats_boost": number
    }
  ],
  "full_resume": {
    "name": string,
    "phone": string,
    "email": string,
    "linkedin": string,
    "github": string,
    "location": string,
    "summary": string,
    "education": [
      {
        "institution": string,
        "location": string,
        "degree": string,
        "duration": string
      }
    ],
    "experience": [
      {
        "title": string,
        "company": string,
        "location": string,
        "duration": string,
        "bullets": string[]
      }
    ],
    "projects": [
      {
        "name": string,
        "tech": string,
        "duration": string,
        "bullets": string[]
      }
    ],
    "skills": {
      "languages": string,
      "frameworks": string,
      "developerTools": string,
      "libraries": string
    },
    "achievements": [
      {
        "title": string,
        "detail": string
      }
    ],
    "certifications": [
      {
        "title": string,
        "issuer": string,
        "duration": string
      }
    ]
  }
}

Candidate Raw Resume Text:
"""
${latest.raw_text}
"""`,
    });

    return NextResponse.json({ result });
  } catch (err) {
    console.error("Resume improve failed:", err);
    return NextResponse.json(
      { error: "Gemini analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
