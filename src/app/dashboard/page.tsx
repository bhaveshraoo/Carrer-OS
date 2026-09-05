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

  // Query user-specific resume and analysis
  const { data: userResumes } = await table(supabase, "resumes")
    .select("*")
    .eq("user_id", user.id);

  const sortedResumes = (userResumes ?? []).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const latestResume = sortedResumes[0];

  let latestAnalysis: any = null;
  if (latestResume?.status === "analyzed") {
    const { data: analyses } = await table(supabase, "resume_analyses")
      .select("*")
      .eq("resume_id", latestResume.id);
    const sortedAnalyses = (analyses ?? []).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    latestAnalysis = sortedAnalyses[0] ?? null;
  }

  // Query target companies
  const { data: targets } = await table(supabase, "user_company_targets")
    .select("company_id")
    .eq("user_id", user.id);

  // Query all companies
  const { data: rawCompanies } = await table(supabase, "companies")
    .select("id, name");

  // Fast Parallel Batch Fetch (1 single roundtrip for questions!)
  const [chunk1, chunk2, chunk3] = await Promise.all([
    (supabase as any).from("dsa_questions").select("id, title, topic, difficulty").range(0, 999),
    (supabase as any).from("dsa_questions").select("id, title, topic, difficulty").range(1000, 1999),
    (supabase as any).from("dsa_questions").select("id, title, topic, difficulty").range(2000, 2999),
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

  const displayName = profile?.full_name || profile?.username || user.email?.split("@")[0] || "there";
  const hasResume = !!latestAnalysis;

  return (
    <DashboardOverview
      displayName={displayName}
      email={user.email ?? ""}
      hasResume={hasResume}
      latestResumeScore={latestAnalysis?.resume_score ?? null}
      parsedResumeJson={latestAnalysis?.report ?? null}
      targetCompanies={targetCompanies}
      allCompaniesCount={rawCompanies?.length ?? 50}
      totalQuestionsCount={rawQuestions?.length ?? 500}
      recommendedTopics={["arrays", "dp", "graphs", "strings"]}
      allQuestions={rawQuestions}
    />
  );
}
