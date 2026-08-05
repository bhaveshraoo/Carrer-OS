import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { PrepWorkspace, QuestionData, CompanyData } from "@/components/prep/prep-workspace";

export default async function PrepPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rawCompanies } = await table(supabase, "companies").select("*");
  const { data: targets }      = await table(supabase, "user_company_targets").select("*").eq("user_id", user.id);
  const { data: allTopics }    = await table(supabase, "company_dsa_topics").select("*");
  // Fast Parallel Batch Fetch (1 single roundtrip for all 2,274 questions!)
  const [chunk1, chunk2, chunk3] = await Promise.all([
    (supabase as any).from("dsa_questions").select("*").range(0, 999),
    (supabase as any).from("dsa_questions").select("*").range(1000, 1999),
    (supabase as any).from("dsa_questions").select("*").range(2000, 2999),
  ]);

  const rawQuestions = [
    ...(chunk1.data || []),
    ...(chunk2.data || []),
    ...(chunk3.data || []),
  ];

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
  for (const q of rawQuestions ?? []) {
    const list = questionsByTopic[q.topic] || [];
    const roadmapMatch = (q.solution_explanation || "").match(/Roadmaps:\s*([^\n]+)/i);
    const roadmaps = roadmapMatch
      ? roadmapMatch[1].split(",").map((s: string) => s.trim().toLowerCase())
      : ["easy-to-medium"];

    list.push({
      id: q.id,
      title: q.title,
      topic: q.topic,
      difficulty: q.difficulty,
      prompt: q.prompt,
      solution_javascript: q.solution_javascript,
      solution_python: q.solution_python,
      solution_cpp: q.solution_cpp,
      solution_explanation: q.solution_explanation,
      roadmaps,
    });
    questionsByTopic[q.topic] = list;
  }

  const companies: CompanyData[] = (rawCompanies ?? [])
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({ id: c.id, name: c.name }));

  return (
    <PrepWorkspace
      companies={companies}
      targetedCompanyIds={targetedCompanyIds}
      recommendedTopics={recommendedTopics}
      questionsByTopic={questionsByTopic}
    />
  );
}
