import { table } from "@/lib/supabase/typed-table";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Ensures a row exists in `public.users` matching `auth.users(id)`.
 * Uses admin service role client to bypass RLS policies and prevent foreign key constraint
 * violations on child tables (e.g. resumes, user_company_targets).
 */
export async function ensureUserExists(userId: string) {
  try {
    const adminSupabase = createAdminClient();
    const { error } = await table(adminSupabase, "users").upsert(
      { id: userId },
      { onConflict: "id", ignoreDuplicates: true }
    );
    if (error) {
      console.warn("Failed to ensure user exists in public.users:", error.message);
    }
  } catch (err) {
    console.warn("ensureUserExists error:", err);
  }
}
