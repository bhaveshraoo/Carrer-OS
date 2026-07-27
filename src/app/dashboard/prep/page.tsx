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
  const { data: rawQuestions } = await table(supabase, "dsa_questions").select("*");

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
    list.push({
      id: q.id,
      title: q.title,
      topic: q.topic,
      difficulty: q.difficulty,
      prompt: q.prompt,
      solution_explanation: q.solution_explanation,
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
