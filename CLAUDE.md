# CareerOS — Project Context

@AGENTS.md

Read this before making changes. Keep it updated after every significant decision —
this file is what keeps every Claude Code session consistent instead of re-guessing
the stack each time.

## What this is

Phase 1 of CareerOS: an AI-native career platform for Indian students prepping for
campus placements. This build covers exactly three pillars — **Resume Intelligence**,
**Company Intelligence**, and **DSA Prep mapped to companies**. Nothing else yet.

Full plan: `docs/30-day-build-guide.md`. Longer-term architecture reference (Wave 2/3,
AWS-scale target state): `docs/architecture.md`.

## Stack (Month 1 — deliberately simplified from the long-term architecture)

- **Framework:** Next.js (App Router), TypeScript, single deployable app — no
  microservices yet. API routes live under `src/app/api/`.
- **Database / Auth / Storage:** Supabase (Postgres + pgvector + Auth + Storage).
- **Hosting:** Vercel.
- **AI:** Provider-agnostic — all AI calls go through `generateJson()` in
  `src/lib/ai/index.ts`, which routes to Gemini or Claude based on the `AI_PROVIDER`
  env var. Currently set to `gemini` (free tier) for Weeks 2-3 development/testing —
  switch to `anthropic` before real user data flows through this (Gemini's free tier
  ToS allows Google to use prompts/responses to improve their products; that's not
  acceptable for real users' resumes). Never call `@anthropic-ai/sdk` or
  `@google/genai` directly from a route — always go through `generateJson()`.
- **UI:** Tailwind v4 (CSS-based theme in `src/app/globals.css`) + hand-built
  shadcn-style components in `src/components/ui/` (the shadcn CLI needs
  `ui.shadcn.com`, which may not be reachable from a sandboxed environment — add new
  primitives by hand-porting from shadcn's docs, same pattern as the existing ones).
- **Fonts:** Fraunces (display, `font-display`) + Inter (body/UI, `font-sans`), loaded
  via CSS `@import` in `globals.css` — not `next/font/google`, which needs build-time
  network access that a sandboxed build environment won't have. Works identically in
  a normal local/CI/Vercel build.

## Brand tokens

Defined in `src/app/globals.css` under `@theme inline`:
`navy-900 #0F1E3D` (primary/dark) · `teal-600 #0D9488` (growth/CTA) ·
`amber-500 #F5A623` (accent) · body text `slate-*` (Tailwind default).
Reuse these — don't introduce new brand colors without updating this file.

## Database

Schema lives in `supabase/migrations/0001_phase1_schema.sql`, preceded by
`0000_reset.sql` (drops a previous ChatGPT-designed schema that diverged
significantly — extra tables like `resume_skills`/`ai_suggestions`/`ats_scores`/
`resume_versions`, extra columns on `users`/`resumes`/`resume_analyses`). Reconciled
by keeping what was genuinely useful (`file_size`/`mime_type`/`parsed_at`/
`analyzed_at` on resumes; `ai_provider`/`model_name`/`processing_time_ms` on
resume_analyses; an `ats_breakdown` sub-score object inside the report JSON) and
dropping premature normalization (separate tables for skills/sections/suggestions/
ats-scores/versions — the `report` JSONB on resume_analyses already captures all of
that; normalize later only if cross-user analytics on skills becomes a real feature).

0001 is now fully idempotent — every `create policy` is preceded by
`drop policy if exists`, so it's always safe to re-run on its own after 0000.

Phase 1 tables: `users`, `resumes`, `resume_analyses`, `companies`, `company_intel`,
`dsa_questions`, `company_dsa_topics`, `user_company_targets`. RLS is on for
user-owned tables; company/DSA content is public-read, service-role-write.

Don't add job/application/mass-apply tables yet — those are Wave 2+, out of scope
for this sprint. If schema changes happen outside this project again (another AI
tool, Supabase's dashboard assistant, etc.), paste the resulting structure here
before continuing — reconciling early is much cheaper than reconciling after more
code has been built on top of the divergence.

## Conventions

- Server Components by default; `"use client"` only where interactivity is needed
  (forms, the score ring's future live updates, etc.).
- Supabase client: `src/lib/supabase/client.ts` (browser) vs `server.ts` (server
  components / route handlers) — use the right one, they're not interchangeable.
- All Claude API calls: server-side only, in route handlers under `src/app/api/`.
  Use structured/JSON-schema-constrained prompts for anything that feeds a UI element
  (scores, extracted fields) — see the 30-day guide, Week 2, for the pattern.
- Company data and DSA questions: public sources / original content only — see the
  "Content Sourcing" note in the 30-day guide before adding either.
- Resume uploads are rate-limited (`src/lib/resume/rate-limit.ts`, DB-backed so it
  works correctly once this is actually deployed across serverless instances) —
  10/hour per user by default. If you add other AI-calling routes, rate-limit them
  too; API cost control matters more than it looks like it does at this stage.
- Error boundaries: `src/app/error.tsx` (global) and `src/app/dashboard/error.tsx`
  (keeps the nav visible on a dashboard-page error) — add a scoped one for any new
  top-level route segment that does real data fetching.
- Dates: always use `formatDate()` from `src/lib/format.ts`, never bare
  `.toLocaleDateString()` — the latter caused a real hydration mismatch (server and
  browser had different default locales, so SSR and client rendered different date
  strings for the same value). Same risk applies to any other locale-dependent
  formatting (numbers, currency) — route it through a fixed-locale helper too.

## Current status

Day 1-2 done: landing page, auth (email OTP + Google via Supabase), protected
`/dashboard` shell, and the full Phase 1 schema — including the auto-create-user
trigger, Storage bucket + RLS policies, and enum CHECK constraints (all added during
Day 2 review; the first draft was missing the trigger and the resume_analyses INSERT
policy, both of which would have caused real failures on first use — fixed now).

The resume upload → parse → extract → score → rewrite pipeline (originally Week 2
scope) is also already built and wired to the `AI_PROVIDER` switch (Gemini free tier
by default). `database.types.ts` gives full type safety on every Supabase query via
`src/lib/supabase/typed-table.ts` — see the comment there before touching Supabase
queries; it's a deliberate workaround for a real upstream typing bug, not something
to "clean up."

Company browsing UI exists at `/dashboard/companies` but has no data yet (Week 3).

**Auth:** supports both password (name + username + email + password) and
passwordless (email OTP + Google) — user's explicit choice, not a default. Both
paths converge on the same `on_auth_user_created` trigger, which populates
`public.users.full_name`/`username` from `raw_user_meta_data` when present.
Username is optional at the DB level (nullable + unique) since OTP/Google signups
don't collect one. Toggle UI lives in both `/signup` and `/login`.

**Every OAuth/OTP `redirectTo`/`emailRedirectTo` must point at
`/auth/callback?next=/dashboard`, never directly at `/dashboard`.** Found this the
hard way — all five occurrences originally pointed straight at `/dashboard`, which
skips the code-exchange step entirely (`/auth/callback/route.ts` is what actually
calls `exchangeCodeForSession`). Symptom was Google/OTP login silently failing:
the code sat unused in the URL, middleware saw no session and bounced to `/login`,
carrying the leftover `?code=...` along since `proxy.ts` only rewrites the
pathname, not the query string. Fixed now — if a new auth flow gets added, route
its redirect through `/auth/callback` too, not the destination page directly.

**Plan update:** an Admin Panel step was added to `docs/30-day-build-guide.md`,
positioned after Week 3 (company/DSA data) and before the Week 4 deployment steps
— content management (companies/DSA CRUD forms) is the priority piece; user
visibility and job-posting are explicitly deferred (the latter belongs to Wave 2's
Job Discovery pillar, not a standalone admin form). Needs a real `is_admin` check,
not just "logged in" — decide that properly even though it's one person today.

**Product decision — DSA Prep is never gated.** The original Day 1 dashboard card
showed DSA Prep as permanently "Locked" pending resume + company completion — that
was a hardcoded placeholder from before the page existed, not real logic, and it
never actually unlocked once the other two pieces were built. Removed entirely.
`/dashboard/prep` is now a normal, always-accessible page — full DSA question bank,
grouped by topic, with company targeting built directly into the page itself
(reusing `toggleCompanyTarget` from the companies page — same underlying
`user_company_targets` data, just editable from either place). Topics matching
the user's currently-targeted companies are marked "Recommended" and sorted first;
with zero companies targeted, the full bank is still completely browsable.

**Next up (Day 19 remainder + Day 20-21 in the guide):** extend
`company_dsa_topics` emphasis tagging to the 15 general-pattern companies (only
the 5 verified ones have it so far); RAG wiring (embed `company_intel` into
`pgvector`, build retrieval); then Days 22-23 (onboarding flow, unified dashboard).

**Company data (Week 3, Days 15-17) — done.** 20 IT-services-heavy companies,
seeded via `npm run seed` (`scripts/seed-companies.ts`) — **this is the canonical
seed source, not raw SQL.** A separate `supabase/seed/companies.sql` was written
independently earlier in the same session before this TS script was noticed
already existing (properly wired into `package.json`, using upsert semantics) —
reconciled by merging the 5 companies unique to the SQL version (Deloitte,
Mphasis, Virtusa, Cyient, L&T Technology Services) into the TS script and
deleting the SQL file, rather than leaving two competing sources of company data
around. Also reconciled a topic-slug mismatch between the two: the TS script
used `dynamic-programming`/`basic-math`/`basic-coding` where `dsa_questions.sql`
used `dp`/`basic-programming` — aliased to one canonical set so the company↔DSA
mapping actually resolves to real questions instead of silently matching nothing.
Explicit two-tier confidence system: 5 companies (`metadata.verified: true` —
TCS, Infosys, Wipro, Accenture, Cognizant) were individually researched with real
`source_urls`; the other 15 are honest, clearly-labeled general-pattern entries,
not padded to look equally rigorous. The `/dashboard/companies` UI already
surfaces this distinction (verified badge vs. general-pattern warning banner) —
don't remove it when this data gets refreshed; enrich Tier 2 entries with real
research instead of just deleting the warning. **If you ever find another
seed-data file for something already covered elsewhere, stop and reconcile
before adding more data on top — this is the second time in this project a
duplicate source of truth appeared (first was the ChatGPT schema, now this).**

**Day 14 (real-world test) — done, and it worked well.** First live resume through
the full Gemini pipeline produced consistent, non-fabricated, resume-specific
feedback (see the "never invent metrics" guardrail correctly outputting `[Insert %]`
placeholders instead of fake numbers). One known quality gap, deliberately deferred:
`missing_ats_keywords` in `suggestRewrites()` (`src/lib/resume/prompts.ts`) suggests
generic software-engineer keywords (DSA, CI/CD, Agile) rather than role-specific
ones for candidates who are clearly AI/ML-focused (should suggest MLOps, RAG, vector
DBs, prompt engineering instead). **Decision: fix this when switching `AI_PROVIDER`
to `anthropic`**, not now on Gemini — revisit the prompt's role-inference instructions
at that point, don't forget it.
