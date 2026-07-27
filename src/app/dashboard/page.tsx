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

  // Query DSA questions count
  const { data: rawQuestions } = await table(supabase, "dsa_questions")
    .select("id, topic");

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
