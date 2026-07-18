import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { CompanyChip } from "@/components/company-chip";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const TOPIC_LABELS: Record<string, string> = {
  arrays: "Arrays",
  strings: "Strings",
  dp: "Dynamic Programming",
  graphs: "Graphs",
  trees: "Trees",
  "linked-lists": "Linked Lists",
  "stacks-queues": "Stacks & Queues",
  greedy: "Greedy",
  recursion: "Recursion",
  sql: "SQL",
  "basic-programming": "Basic Programming",
  "oop-concepts": "OOP Concepts",
  "math-number-theory": "Math & Number Theory",
  pseudocode: "Pseudocode",
  "web-development": "Web Development",
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "bg-teal-50 text-teal-700",
  medium: "bg-amber-50 text-amber-600",
  hard: "bg-red-50 text-red-600",
};

export default async function PrepPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Never gated on resume/company completion — always fully accessible.
  const { data: companies } = await table(supabase, "companies").select("*");
  const { data: targets } = await table(supabase, "user_company_targets")
    .select("*")
    .eq("user_id", user.id);
  const { data: allTopics } = await table(supabase, "company_dsa_topics").select("*");
  const { data: questions } = await table(supabase, "dsa_questions").select("*");

  const targetedCompanyIds = new Set((targets ?? []).map((t) => t.company_id));

  // Aggregate emphasis across only the user's targeted companies to find
  // "recommended" topics — falls back to nothing recommended if no companies
  // are targeted yet, which is fine, the full question bank is still browsable.
  const emphasisByTopic = new Map<string, number>();
  for (const row of allTopics ?? []) {
    if (targetedCompanyIds.has(row.company_id)) {
      emphasisByTopic.set(row.topic, (emphasisByTopic.get(row.topic) ?? 0) + row.emphasis);
    }
  }
  const recommendedTopics = new Set(
    [...emphasisByTopic.entries()].sort((a, b) => b[1] - a[1]).map(([topic]) => topic)
  );

  const questionsByTopic = new Map<string, typeof questions>();
  for (const q of questions ?? []) {
    const list = questionsByTopic.get(q.topic) ?? [];
    list.push(q);
    questionsByTopic.set(q.topic, list);
  }

  const orderedTopics = [...questionsByTopic.keys()].sort((a, b) => {
    const aRec = recommendedTopics.has(a) ? 1 : 0;
    const bRec = recommendedTopics.has(b) ? 1 : 0;
    return bRec - aRec; // recommended topics first
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy-900">DSA Prep</h1>
        <p className="text-slate-500 mt-1">
          Practice by topic. Select target companies below to see what they emphasize most —
          no need to finish your resume or pick companies elsewhere first.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Target companies</CardTitle>
          <CardDescription>Tap to select — this updates your targets everywhere in the app.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(companies ?? [])
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((c) => (
                <CompanyChip
                  key={c.id}
                  companyId={c.id}
                  name={c.name}
                  initiallyTargeted={targetedCompanyIds.has(c.id)}
                />
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {orderedTopics.map((topic) => {
          const isRecommended = recommendedTopics.has(topic);
          const topicQuestions = questionsByTopic.get(topic) ?? [];
          return (
            <div key={topic}>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="font-display text-lg font-semibold text-navy-900">
                  {TOPIC_LABELS[topic] ?? topic}
                </h2>
                {isRecommended && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-teal-600 text-white px-2 py-0.5 rounded-full">
                    <Sparkles className="size-3" /> Recommended for your targets
                  </span>
                )}
              </div>
              <div className="grid gap-3">
                {topicQuestions.map((q) => (
                  <details key={q.id} className="group rounded-xl border border-slate-200 bg-white">
                    <summary className="flex items-center gap-3 px-5 py-3.5 cursor-pointer list-none">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${DIFFICULTY_COLOR[q.difficulty]}`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="text-sm font-medium text-slate-800 flex-1">{q.title}</span>
                    </summary>
                    <div className="px-5 pb-4 space-y-2 text-sm">
                      <p className="text-slate-600">{q.prompt}</p>
                      {q.solution_explanation && (
                        <p className="text-slate-500 border-t border-slate-100 pt-2">
                          <span className="font-medium text-slate-700">Approach: </span>
                          {q.solution_explanation}
                        </p>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
