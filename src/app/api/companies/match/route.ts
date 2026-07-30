import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { geminiJson } from "@/lib/ai/gemini";

export const runtime = "nodejs";
export const maxDuration = 45;

export interface CompanyMatchResult {
  match_score: number; // e.g. 82 (out of 100)
  verdict: string; // e.g. "Strong Match", "Moderate Fit", "High Skill Gap"
  matched_skills: string[];
  missing_skills: string[];
  top_dsa_focus: string[];
  tailored_advice: string;
  sprint_plan: {
    week: string;
    focus: string;
    action_items: string[];
  }[];
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { company_id } = await request.json();

  if (!company_id) {
    return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
  }

  // Fetch company info & intel
  const { data: companies } = await table(supabase, "companies")
    .select("*")
    .eq("id", company_id);

  const company = companies?.[0];
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const { data: intels } = await table(supabase, "company_intel")
    .select("*")
    .eq("company_id", company_id);
  const intel = intels?.[0];

  const { data: dsaTopics } = await table(supabase, "company_dsa_topics")
    .select("*")
    .eq("company_id", company_id);

  // Fetch user's latest analyzed resume
  const { data: resumes } = await table(supabase, "resumes")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "analyzed");

  const latestResume = resumes?.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];

  if (!latestResume?.raw_text) {
    return NextResponse.json(
      { error: "No analyzed resume found. Please upload and analyze your resume first before running AI Match." },
      { status: 400 }
    );
  }

  const candidateText = latestResume.raw_text;

  try {
    const result = await geminiJson<CompanyMatchResult>({
      system:
        "You are a Principal Engineering Recruiter and Technical Hiring Manager at FAANG/Top Product Tech companies in India. " +
        "Your task is to analyze a tech candidate's resume against a target company's exact hiring expectations, interview rounds, and DSA weightages. " +
        "Provide honest, actionable, metrics-backed feedback and a 14-day interview sprint plan.",
      prompt: `Analyze candidate's resume against target company hiring requirements.

Target Company: ${company.name}
Company Tier: ${company.metadata?.tier || "Technology"}
Company Overview: ${intel?.overview || "Top Technology Firm"}
Required Skills: ${JSON.stringify(intel?.required_skills || [])}
Priority DSA Topics: ${JSON.stringify(dsaTopics?.map(t => t.topic) || [])}

Candidate Resume Text:
"""
${candidateText}
"""

Return JSON in this EXACT schema:
{
  "match_score": number,             // 0-100 score representing match against this company's standards
  "verdict": string,                 // e.g. "Strong Technical Match", "Moderate Fit - Needs DSA Focus", "High Skill Gap"
  "matched_skills": string[],        // 4-6 skills candidate has that match this company
  "missing_skills": string[],        // 3-5 critical tech/dsa skills missing for this company
  "top_dsa_focus": string[],         // 3 priority DSA topics to grind for this specific company
  "tailored_advice": string,         // 2-3 sentence strategic advice for clearing their hiring rounds
  "sprint_plan": [                   // 2 week actionable sprint plan
    {
      "week": "Week 1: Core Fundamentals & High-Weight DSA",
      "focus": string,
      "action_items": string[]
    },
    {
      "week": "Week 2: Mock Interviews & System Design / CS Core",
      "focus": string,
      "action_items": string[]
    }
  ]
}`,
    });

    return NextResponse.json({ result });
  } catch (err) {
    console.error("Company match analysis failed:", err);
    return NextResponse.json(
      { error: "AI Company match analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
