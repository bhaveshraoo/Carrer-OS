import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { UpgradedProfileView } from "./profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await table(supabase, "users").select("*").eq("id", user.id).single();

  const provider = user.app_metadata?.provider ?? "email";

  return (
    <UpgradedProfileView
      initialFullName={profile?.full_name ?? ""}
      initialUsername={profile?.username ?? ""}
      email={user.email ?? ""}
      provider={provider}
    />
  );
}
