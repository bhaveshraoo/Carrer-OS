import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { geminiJson } from "@/lib/ai/gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

export interface BuildResult {
  ats_score: number;
  resume: {
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
  };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { name, email, phone, linkedin, github, summary, expText, eduText, skillsText, projectsText } = body;

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  try {
    const result = await geminiJson<BuildResult>({
      system:
        "You are a Principal Technical Writer and FAANG Engineering Manager building industry-standard software engineering resumes in Jake's Resume format. " +
        "WORLD-CLASS REALISM RULES:\n" +
        "1. GOOGLE X-Y-Z FORMULA: Write bullet points following 'Accomplished [X] as measured by [Y], by doing [Z]'. Start every bullet with high-impact action verbs (Engineered, Architected, Spearheaded, Benchmarked, Optimized, Deployed). Avoid all passive phrases.\n" +
        "2. TECHNICAL PRECISION: Write specific tech stack implementation details with realistic engineering metrics (% latency reduction, throughput, dataset scale).\n" +
        "3. AUTHENTIC DATA: Use ONLY candidate contact details provided. Return '' for empty fields.\n" +
        "4. JAKE'S SKILLS: Categorize skills into Languages, Frameworks, Developer Tools, and Libraries.\n" +
        "Return ONLY valid JSON matching the specified schema.",
      prompt: `Build a complete, FAANG-ready software engineering resume in Jake's Resume format using ONLY the user's authentic details below.

Return this EXACT JSON shape:
{
  "ats_score": number,              // estimated ATS score (85-97)
  "resume": {
    "name": string,
    "phone": string,
    "email": string,
    "linkedin": string,
    "github": string,
    "location": string,
    "summary": string,              // 2-sentence executive technical summary stating domain & core tech stack
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
        "bullets": string[]         // Google X-Y-Z formula bullets with tech depth & metrics
      }
    ],
    "projects": [
      {
        "name": string,
        "tech": string,
        "duration": string,
        "bullets": string[]         // Google X-Y-Z formula bullets
      }
    ],
    "skills": {
      "languages": string,
      "frameworks": string,
      "developerTools": string,
      "libraries": string
    }
  }
}

User's authentic details:
- Full Name: ${name}
- Email: ${email}
- Phone: ${phone || ""}
- LinkedIn: ${linkedin || ""}
- GitHub: ${github || ""}
- Summary (raw): ${summary || ""}
- Experience (raw):
${expText || ""}
- Education (raw):
${eduText || ""}
- Skills (raw):
${skillsText || ""}
- Projects (raw):
${projectsText || ""}`,
    });

    return NextResponse.json({ result });
  } catch (err) {
    console.error("Resume build failed:", err);
    return NextResponse.json(
      { error: "Gemini generation failed. Please try again." },
      { status: 500 }
    );
  }
}
