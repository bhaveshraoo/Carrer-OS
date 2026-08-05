import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { DashboardOverview } from "@/components/dashboard-overview";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Query profile
  const { data: profile } = await table(supabase, "users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Query latest resume analysis
  const { data: analyses } = await table(supabase, "resume_analyses")
    .select("*");

  // Query target companies
  const { data: targets } = await table(supabase, "user_company_targets")
    .select("company_id")
    .eq("user_id", user.id);

  // Query all companies
  const { data: rawCompanies } = await table(supabase, "companies")
    .select("id, name");

  // Fast Parallel Batch Fetch (1 single roundtrip for all 2,274 questions!)
  const [chunk1, chunk2, chunk3] = await Promise.all([
    (supabase as any).from("dsa_questions").select("id, topic").range(0, 999),
    (supabase as any).from("dsa_questions").select("id, topic").range(1000, 1999),
    (supabase as any).from("dsa_questions").select("id, topic").range(2000, 2999),
  ]);

  const rawQuestions = [
    ...(chunk1.data || []),
    ...(chunk2.data || []),
    ...(chunk3.data || []),
  ];

  const targetedSet = new Set((targets ?? []).map((t) => t.company_id));
  const targetCompanies = (rawCompanies ?? [])
    .filter((c) => targetedSet.has(c.id))
    .map((c) => ({ id: c.id, name: c.name }));

  const latestAnalysis = analyses && analyses.length > 0 ? analyses[0] : null;
  const displayName = profile?.full_name || profile?.username || user.email?.split("@")[0] || "there";

  return (
    <DashboardOverview
      displayName={displayName}
      email={user.email ?? ""}
      latestResumeScore={latestAnalysis?.resume_score ?? null}
      parsedResumeJson={latestAnalysis?.report ?? null}
      targetCompanies={targetCompanies}
      allCompaniesCount={rawCompanies?.length ?? 50}
      totalQuestionsCount={rawQuestions?.length ?? 30}
      recommendedTopics={["arrays", "dp", "graphs", "strings"]}
    />
  );
}
