/**
 * Fixed-locale date formatting, used everywhere instead of bare `.toLocaleDateString()`.
 *
 * Why this exists: `.toLocaleDateString()` with no arguments uses the *runtime's*
 * default locale — which is the server's locale during SSR and the browser's locale
 * during hydration. When those differ (e.g. server defaults to en-US "7/12/2026",
 * browser is set to en-GB "12/7/2026"), React's hydration fails because the
 * server-rendered HTML text doesn't match what the client renders — this bit us
 * directly in ResumeHistory. Passing an explicit locale makes the output identical
 * regardless of where it runs.
 */
export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
