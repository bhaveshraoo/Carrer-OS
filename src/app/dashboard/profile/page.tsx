import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProfileForm } from "./profile-form";

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
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy-900">Profile</h1>
        <p className="text-slate-500 mt-1">Manage your account details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            {user.email} · signed in via {provider === "google" ? "Google" : provider === "email" ? "email" : provider}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            initialFullName={profile?.full_name ?? ""}
            initialUsername={profile?.username ?? ""}
          />
        </CardContent>
      </Card>
    </div>
  );
}
