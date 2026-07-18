# CareerOS

Day 1 scaffold — Next.js + Supabase + Claude API. See `CLAUDE.md` for project
context and `docs/30-day-build-guide.md` for the full day-by-day plan.

## What's here already

- Landing page with the Resume Score hero
- Auth: Email OTP + Google sign-in (Supabase Auth)
- Protected `/dashboard` shell with empty states for Resume, Companies, DSA Prep
- Phase 1 database schema (`supabase/migrations/0001_phase1_schema.sql`)
- Brand theme (navy/teal/amber, Fraunces + Inter) wired into Tailwind

## What's not wired up yet (by design — these are the next days in the guide)

- Resume upload doesn't hit Storage yet (Day 5)
- No resume parsing/scoring (Days 8–13)
- No company data (Days 15–20)

## Get it running

### 1. Create your accounts (if you haven't yet)

- [Supabase](https://supabase.com) → New Project
- [Anthropic Console](https://console.anthropic.com) → API key
- [Vercel](https://vercel.com) → new project, import from GitHub (once you push this)

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in from your Supabase project (Settings → API):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (keep this one server-only, never expose to the client)

And from Anthropic Console:
- `ANTHROPIC_API_KEY`

### 3. Apply the database schema

Open your Supabase project → SQL Editor.

- **If this is a fresh project:** paste and run `supabase/migrations/0001_phase1_schema.sql`.
- **If you'd previously run a different schema** (e.g. from another AI tool):
  run `supabase/migrations/0000_reset.sql` first to cleanly drop it, then run
  `0001_phase1_schema.sql`. 0001 is fully idempotent, so re-running it alone is
  always safe too — it's only needed once per fresh database.
- **Then seed company data:** run `npm run seed` (uses `scripts/seed-companies.ts`,
  requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`) to populate 20 companies
  (5 individually researched, 15 general-pattern starter entries — see the note
  at the top of that file). This upserts, so it's always safe to re-run after
  editing an entry.
- **Then seed DSA questions:** run `supabase/seed/dsa_questions.sql` in the SQL
  Editor to populate the question bank (original questions, not scraped from any
  platform). Idempotent — safe to re-run.

(Once you're comfortable with it, switch to the Supabase CLI —
`supabase link` + `supabase db push` — for real migration history instead of
pasting SQL by hand.)

### 4. Enable auth providers

In Supabase → Authentication → Providers:
- **Email:** already on by default (this is what powers the OTP link flow).
- **Google:** toggle on, add your OAuth client ID/secret from
  [Google Cloud Console](https://console.cloud.google.com/apis/credentials) — set
  the authorized redirect URI to the one Supabase shows you on that screen.

### 5. Run it

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

### 6. Deploy

Push to GitHub, import the repo in Vercel, add the same environment variables in
Vercel's project settings, deploy. Update `NEXT_PUBLIC_SITE_URL` and your Supabase
Auth redirect URLs to your real domain once it's live.

## Continuing with Claude Code

```bash
claude
```

`CLAUDE.md` has the full project context loaded automatically. Just tell it which
day of `docs/30-day-build-guide.md` you're on.
