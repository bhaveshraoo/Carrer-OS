import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await table(supabase, "users")
    .select("*")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.full_name || profile?.username || user.email?.split("@")[0] || "there";

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav displayName={displayName} email={user.email ?? ""} />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
