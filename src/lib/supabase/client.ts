import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Client-side Supabase client — safe to use in "use client" components.
// See the comment in server.ts for why this cast is here (upstream type-inference
// mismatch between @supabase/ssr and @supabase/supabase-js, not a shortcut).
export function createClient(): SupabaseClient<Database> {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ) as unknown as SupabaseClient<Database>;
}
