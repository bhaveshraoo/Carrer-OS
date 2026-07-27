import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

type Tables = Database["public"]["Tables"];

/**
 * Workaround for a real upstream type-inference bug: as of @supabase/ssr@0.12.0 +
 * @supabase/supabase-js@2.110.x, `supabase.from("table")` resolves every Row/Insert/
 * Update type to `never` regardless of how the client itself is typed (confirmed via
 * isolated probes — our Database type itself is correct). Rather than sprinkling casts
 * at every call site, this defines exactly the query surface this app uses, typed
 * against our own Database type directly.
 *
 * Usage: `table(supabase, "resumes").select("*").eq("id", x).single()` instead of
 * `supabase.from("resumes")...` — same runtime behavior, correct types.
 *
 * Revisit if a future @supabase/ssr or @supabase/supabase-js release fixes the
 * upstream inference — at that point this can be deleted and call sites reverted to
 * plain `supabase.from(...)`.
 */
export function table<T extends keyof Tables>(supabase: SupabaseClient, name: T) {
  type Row = Tables[T]["Row"];
  type Insert = Tables[T]["Insert"];
  type Update = Tables[T]["Update"];

  // Deliberate type-erasure boundary: this is the one point where we step outside
  // strict typing on purpose, so the return type below can be the accurate,
  // hand-written one instead of whatever upstream infers.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const builder = (supabase as any).from(name as string);

  interface Filterable<R> {
    eq(column: string, value: unknown): Filterable<R>;
    single(): PromiseLike<{ data: R | null; error: { message: string } | null }>;
    then: PromiseLike<{ data: R[] | null; error: { message: string } | null }>["then"];
  }

  return {
    select(columns = "*"): Filterable<Row> {
      return builder.select(columns);
    },
    insert(values: Insert) {
      return builder.insert(values) as {
        select(): { single(): PromiseLike<{ data: Row | null; error: { message: string } | null }> };
        then: PromiseLike<{ data: null; error: { message: string } | null }>["then"];
      };
    },
    upsert(values: Insert, options?: { onConflict?: string; ignoreDuplicates?: boolean }) {
      return builder.upsert(values, options) as PromiseLike<{ data: Row | null; error: { message: string } | null }>;
    },
    update(values: Update): Filterable<Row> {
      return builder.update(values);
    },
    delete(): Filterable<Row> {
      return builder.delete();
    },
  };
}
