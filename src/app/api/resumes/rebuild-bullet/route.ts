import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { geminiJson } from "@/lib/ai/gemini";

export const runtime = "nodejs";
export const maxDuration = 45;

export interface BulletRebuildResult {
  original_bullet: string;
  rebuilt_bullet: string;
  action_verb_used: string;
  quantified_metric_added: string;
  target_company_alignment: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { original_bullet, target_company_id } = await request.json();

  if (!original_bullet || original_bullet.trim().length < 5) {
    return NextResponse.json(
      { error: "Original bullet text is required." },
      { status: 400 }
    );
  }

  let companyContext = "General High-Tier Technology Firm (FAANG / Product Enterprise)";
  let requiredSkills: string[] = ["React.js", "Node.js", "PostgreSQL", "REST APIs", "System Architecture"];

  if (target_company_id) {
    const { data: companies } = await table(supabase, "companies")
      .select("*")
      .eq("id", target_company_id);
    const company = companies?.[0];

    if (company) {
      const { data: intels } = await table(supabase, "company_intel")
        .select("*")
        .eq("company_id", company.id);
      const intel = intels?.[0];

      companyContext = `${company.name} (${company.metadata?.tier || "Product Tech"}) - ${company.metadata?.type || ""}`;
      if (intel?.required_skills && intel.required_skills.length > 0) {
        requiredSkills = intel.required_skills;
      }
    }
  }

  try {
    const result = await geminiJson<BulletRebuildResult>({
      system:
        "You are a Principal Engineering Recruiter and Resume Strategist. " +
        "Your task is to transform weak candidate resume bullets into ultra-high-impact STAR-format bullets " +
        "that feature strong action verbs, quantified performance metrics (%, $, ms latency, throughput), and target company skill alignment.",
      prompt: `Re-build this candidate resume bullet point for target company: ${companyContext}

Target Company Required Skills & Focus: ${JSON.stringify(requiredSkills)}

Candidate Original Bullet:
"${original_bullet}"

Return JSON in this EXACT schema:
{
  "original_bullet": "string",
  "rebuilt_bullet": "string",            // Ultra-impactful STAR bullet (e.g. 'Architected a high-concurrency Node.js REST API...')
  "action_verb_used": "string",          // e.g. "Architected" or "Engineered"
  "quantified_metric_added": "string",   // e.g. "reduced query latency by 42% under 10k RPS"
  "target_company_alignment": "string"   // Brief explanation of why this matches target company expectations
}`,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Gemini Bullet Rebuild error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to execute Gemini Bullet Rebuild" },
      { status: 500 }
    );
  }
}
