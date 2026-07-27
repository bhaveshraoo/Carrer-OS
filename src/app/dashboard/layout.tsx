import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { DashboardNav } from "@/components/dashboard-nav";
import { ensureUserExists } from "@/lib/user";

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

  // Ensure public.users row exists for this authenticated user via admin client
  await ensureUserExists(user.id);

  const { data: profile } = await table(supabase, "users")
    .select("*")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.full_name || profile?.username || user.email?.split("@")[0] || "there";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <DashboardNav displayName={displayName} email={user.email ?? ""} />
      <main className="mx-auto max-w-[1550px] px-3 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
}
