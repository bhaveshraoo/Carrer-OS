import type { SupabaseClient } from "@supabase/supabase-js";
import { table } from "@/lib/supabase/typed-table";

/**
 * Simple per-user rate limit backed by the `resumes` table itself — counts rows
 * created in the last `windowMinutes`. Database-backed (not an in-memory Map)
 * because this needs to work correctly across serverless instances once deployed;
 * an in-process counter would reset per instance and not actually limit anything.
 *
 * Generous enough for real testing (a student re-uploading a few times while
 * iterating on their resume), tight enough that a retry loop or bug can't run up
 * an unbounded AI bill overnight.
 */
export async function checkResumeRateLimit(
  supabase: SupabaseClient,
  userId: string,
  { maxUploads = 10, windowMinutes = 60 } = {}
): Promise<{ allowed: boolean; error?: string }> {
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  const { data, error } = await table(supabase, "resumes")
    .select("id, created_at")
    .eq("user_id", userId);

  if (error) {
    // Fail open on a rate-limit-check error — don't block real usage because
    // our own counting query hiccuped.
    return { allowed: true };
  }

  const recentCount =
    data?.filter((row) => row.created_at && row.created_at >= windowStart).length ?? 0;

  if (recentCount >= maxUploads) {
    return {
      allowed: false,
      error: `You've hit the resume upload limit (${maxUploads} per hour) — try again later.`,
    };
  }

  return { allowed: true };
}
