import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

// Server-side Supabase client — use in Server Components, Route Handlers, and Server Actions.
//
// The `as unknown as SupabaseClient<Database>` cast below is a deliberate workaround,
// not sloppiness: as of @supabase/ssr@0.12.0 + @supabase/supabase-js@2.110.x, the two
// packages' generic type signatures don't compose — createServerClient<Database>()
// silently resolves every table's Row/Insert/Update type to `never` instead of erroring,
// even though the Database type itself is correct (verified in isolation). Casting through
// supabase-js's own SupabaseClient<Database> type directly restores real type checking.
// Re-check this the next time you bump either package — if a future release fixes the
// upstream inference, this cast becomes unnecessary (harmless either way).
export async function createClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component that can't set cookies — middleware handles refresh instead.
          }
        },
      },
    }
  ) as unknown as SupabaseClient<Database>;
}
