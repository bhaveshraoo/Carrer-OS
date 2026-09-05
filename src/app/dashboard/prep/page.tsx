import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { PrepWorkspace, QuestionData, CompanyData } from "@/components/prep/prep-workspace";
import { SEED_DSA_QUESTIONS } from "@/lib/prep/seed-questions";
import { SEED_COMPANIES } from "@/lib/companies/seed-data";

export default async function PrepPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Execute all database queries in parallel for instant page loads
  let rawCompanies: any[] = [];
  let targets: any[] = [];
  let allTopics: any[] = [];
  let rawQuestions: any[] = [];

  try {
    const [companiesRes, targetsRes, topicsRes, chunk1Res, chunk2Res] = await Promise.all([
      table(supabase, "companies").select("*"),
      table(supabase, "user_company_targets").select("*").eq("user_id", user.id),
      table(supabase, "company_dsa_topics").select("*"),
      (supabase as any)
        .from("dsa_questions")
        .select("id, title, topic, difficulty, prompt, solution_explanation")
        .range(0, 999),
      (supabase as any)
        .from("dsa_questions")
        .select("id, title, topic, difficulty, prompt, solution_explanation")
        .range(1000, 1999),
    ]);

    rawCompanies = companiesRes.data || [];
    targets = targetsRes.data || [];
    allTopics = topicsRes.data || [];
    rawQuestions = [
      ...(chunk1Res.data || []),
      ...(chunk2Res.data || []),
    ];
  } catch (err) {
    console.warn("DSA prep data fetch notice:", err);
  }

  const targetedCompanyIds = (targets ?? []).map((t) => t.company_id);
  const targetedSet        = new Set(targetedCompanyIds);

  const emphasisByTopic = new Map<string, number>();
  for (const row of allTopics ?? []) {
    if (targetedSet.has(row.company_id)) {
      emphasisByTopic.set(row.topic, (emphasisByTopic.get(row.topic) ?? 0) + row.emphasis);
    }
  }

  const recommendedTopics = [...emphasisByTopic.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([topic]) => topic);

  const questionsByTopic: Record<string, QuestionData[]> = {};

  if (rawQuestions.length > 0) {
    for (const q of rawQuestions) {
      const list = questionsByTopic[q.topic] || [];
      const roadmapMatch = (q.solution_explanation || "").match(/Roadmaps:\s*([^\n]+)/i);

      let roadmaps: string[] = [];
      if (roadmapMatch) {
        roadmaps = roadmapMatch[1].split(",").map((s: string) => s.trim().toLowerCase());
      } else {
        const diff = (q.difficulty || "easy").toLowerCase();
        roadmaps = [];
        if (diff === "easy" || diff === "medium") roadmaps.push("easy-to-medium");
        if (diff === "medium" || diff === "hard") roadmaps.push("medium-to-hard");
        roadmaps.push("sde");
        if (["arrays", "strings", "web-development", "sql", "oop-concepts"].includes(q.topic)) roadmaps.push("web-dev");
        if (["math-number-theory", "matrices", "recursion", "arrays", "dp"].includes(q.topic)) roadmaps.push("ai-ml");
        if (["oop-concepts", "pseudocode", "basic-programming"].includes(q.topic)) roadmaps.push("lld-oop");
      }

      list.push({
        id: q.id,
        title: q.title,
        topic: q.topic,
        difficulty: (q.difficulty || "easy").toLowerCase() as "easy" | "medium" | "hard",
        prompt: q.prompt,
        solution_javascript: "",
        solution_python: "",
        solution_cpp: "",
        solution_explanation: q.solution_explanation,
        roadmaps,
      });
      questionsByTopic[q.topic] = list;
    }
  } else {
    // Seed fallback questions so page NEVER renders blank
    for (const q of SEED_DSA_QUESTIONS) {
      const list = questionsByTopic[q.topic] || [];
      list.push({
        id: q.id,
        title: q.title,
        topic: q.topic,
        difficulty: q.difficulty.toLowerCase() as "easy" | "medium" | "hard",
        prompt: q.prompt,
        solution_javascript: q.solution_javascript,
        solution_python: q.solution_python,
        solution_cpp: q.solution_cpp,
        solution_explanation: q.solution_explanation,
        roadmaps: q.roadmaps,
      });
      questionsByTopic[q.topic] = list;
    }
  }

  const companySource = (rawCompanies && rawCompanies.length > 0) ? rawCompanies : SEED_COMPANIES;
  const companies: CompanyData[] = companySource
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({ id: c.id, name: c.name }));

  return (
    <PrepWorkspace
      companies={companies}
      targetedCompanyIds={targetedCompanyIds}
      recommendedTopics={recommendedTopics.length > 0 ? recommendedTopics : ["arrays", "strings", "dp", "system-design"]}
      questionsByTopic={questionsByTopic}
    />
  );
}
