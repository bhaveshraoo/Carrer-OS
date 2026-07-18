# CareerOS — 30-Day Build Guide (Zero → Live)

**Scope for this sprint:** Resume AI + Company Intelligence (details, prep roadmaps, materials) + DSA question bank mapped to companies.
**Explicitly NOT in this sprint:** mock interviews, mass apply, abroad study, courses, payments. See "What NOT to Build" at the bottom — protecting that boundary is what makes 30 days realistic.
**Assumes:** full-time, focused days, solo, coding via Claude Code. If this is evenings/weekends only, stretch every "day" below into 2 days and expect a 7-8 week timeline instead — the order of tasks doesn't change, only the pace.

---

## The Fastest-Path Stack for Month 1

This deliberately **simplifies** the long-term AWS architecture from the SAD. That architecture is correct for scale; it is the wrong place to spend Week 1 of a solo 30-day sprint. Everything below still runs on Postgres + Next.js, so migrating to the full AWS setup later is additive, not a rewrite.

| Layer | Month-1 choice | Why |
|---|---|---|
| App | Next.js (single app, API routes) | No separate microservices yet — one deployable unit |
| Database + Auth + Storage | Supabase (Postgres + pgvector + Auth + Storage bundled) | Skips weeks of VPC/RDS/Cognito setup; generous free tier |
| Hosting | Vercel | Deploys on `git push`, zero DevOps |
| AI | Claude API (Anthropic) | Resume scoring, extraction, company data structuring |
| UI | Tailwind + shadcn/ui | Fast, clean defaults, no design system to build |
| Email (OTP) | Resend | Simple transactional email API |
| Analytics / Errors | PostHog (free tier) / Sentry (free tier) | Both add in under an hour each |
| Domain | Namecheap / GoDaddy | Buy Day 1, point it Day 27 |

---

## Day 0: Claude Code Setup

- Install (native installer is Anthropic's recommended method — no Node.js dependency, auto-updates):
  - Or via npm (needs Node.js 18+): `npm install -g @anthropic-ai/claude-code`
- Claude Code requires a Pro, Max, Team, or Enterprise plan, or an Anthropic Console account billed at API rates — the free Claude.ai plan doesn't include Claude Code access.
- `cd` into your project folder, run `claude`, then run `/init` — this scans your codebase and generates a starter `CLAUDE.md`.
- **Keep `CLAUDE.md` updated all month.** This is the single highest-leverage habit for vibecoding a 30-day sprint: it's what stops Claude Code from re-guessing your schema, conventions, and stack every session. After each major decision (schema change, new API pattern), add a line to it.

## Pre-Day 1 Checklist

- [ ] GitHub account + new repo
- [ ] Anthropic Console account + API key ([console.anthropic.com](https://console.anthropic.com))
- [ ] Supabase account + new project (save the project URL + anon/service keys)
- [ ] Vercel account, linked to GitHub
- [ ] Domain registered
- [ ] Node.js 22+ installed locally
- [ ] Claude Code installed and authenticated (Day 0 above)

---

## Week 1 — Foundation (Days 1–7)

**Day 1 — Skeleton + first deploy**
- `npx create-next-app@latest careeros --typescript --tailwind --app`
- Push to GitHub, connect to Vercel, deploy immediately — you want a live URL from Day 1, not Day 27, so every future day ends in "deploy and confirm it works," never "it works on my machine."
- Install shadcn/ui, set up base layout and design tokens.
- Claude Code prompt: *"Here's my Phase 1 scope: [paste scope from top of this doc]. Update CLAUDE.md with the stack, the folder structure you'd recommend for a single Next.js app with API routes, and our coding conventions."*

**Day 2 — Database schema**
- Create the Supabase project, enable the `pgvector` extension.
- Migrate the Phase 1 schema (trimmed from the full SAD):

| Table | Purpose |
|---|---|
| `users` | Core profile, auth link |
| `resumes` | Uploaded file metadata, S3/Supabase Storage path |
| `resume_analyses` | Scores + AI report per resume |
| `companies` | Name, metadata, career page URL |
| `company_intel` | Overview, hiring process, culture, prep roadmap (per company) |
| `dsa_questions` | Original questions: topic, difficulty, explanation |
| `company_dsa_topics` | Which topics a company is known to emphasize |
| `user_company_targets` | Which companies a user is prepping for |

- Claude Code prompt: *"Write the Supabase migration SQL for this schema [paste table above], plus a generated TypeScript types file."*

**Day 3 — Auth**
- Enable Supabase Auth's built-in Email OTP and Google OAuth providers — both are pre-built, no custom OAuth flow to write.
- Build login/signup pages, session middleware, protected routes.
- Test the full loop: sign up → session persists → redirect to dashboard.

**Day 4 — App shell**
- Landing page: hero, value prop, signup CTA.
- Dashboard skeleton with empty states for each pillar (resume, companies, prep).
- Navigation + basic profile page.
- Deploy checkpoint.

**Day 5 — File upload infrastructure**
- Supabase Storage bucket for resumes (private, signed URLs).
- Drag-and-drop upload UI → creates a `resumes` row on upload.

**Day 6 — Hardening**
- Fix whatever broke in Days 1–5 (something always does).
- Add error boundaries and loading states across what exists so far.
- Deploy checkpoint, smoke-test signup → upload end to end.

**Day 7 — Buffer**
- Catch up on anything slipped. Re-plan Week 2 if you're behind — better to know now than Day 14.

---

## Week 2 — Resume AI (Days 8–14)

**Day 8 — Parsing pipeline**
- Add `pdf-parse` (PDF) and `mammoth` (DOCX). Build `/api/resume/parse`: file → raw text, stored against the resume row.
- Scanned/image-only PDFs: detect and flag "couldn't read this file" rather than building OCR now — that's a post-launch addition, not a Month-1 blocker.

**Day 9 — Structured extraction**
- Claude API call with a JSON-schema-constrained prompt: extract skills, experience, education, certifications, projects into structured fields.
- Claude Code prompt: *"Write a Claude API call that takes raw resume text and returns strict JSON matching this schema: [paste fields]. Include retry-with-correction if the response doesn't parse."*

**Day 10 — Scoring engine**
- Second Claude call producing Resume Score, ATS Score, Recruiter Score, HR Readability Score, Industry Match Score, each with a short explanation — as structured JSON, stored in `resume_analyses`.

**Day 11 — Analysis report UI**
- Score cards, detailed breakdown per section, simple bar/radar chart of the five scores.

**Day 12 — Rewrite suggestions**
- Third Claude call: bullet-point rewrites, ATS keyword suggestions, missing-section flags. Keep this a separate prompt template from scoring — separate concerns, easier to iterate on independently.

**Day 13 — Edge cases + polish**
- Bad files, empty resumes, very short resumes, non-English content — handle gracefully with clear messaging rather than silent failures.

**Day 14 — Buffer + real-world test**
- Run 10–15 real resumes (yours, friends', anything you can get) through the full pipeline. Fix what breaks. This is the most valuable testing day of the month — synthetic test data won't surface what real resumes will.

---

## Week 3 — Company Intelligence + DSA Prep (Days 15–21)

**Day 15 — Company shortlist**
- Pick 30–50 companies most relevant to Indian campus placements: IT services (TCS, Infosys, Wipro, Accenture, Cognizant), product/tech (Amazon, Google, Microsoft, Adobe, Flipkart), and a few core-engineering/consulting names. Seed the `companies` table.

**Day 16 — Populate company profiles**
- For each company, compile overview, hiring-process stages, required skills, and a prep outline — **sourced only from public official material** (company careers pages, published process descriptions), not scraped from paid databases or copyrighted review sites. Use Claude to help structure and summarize what you've gathered, not to invent facts it wasn't given.
- Claude Code prompt: *"Given this raw public info about [Company]'s hiring process [paste], structure it into our `company_intel` JSON schema."*

**Day 17 — Company intelligence UI**
- Company profile page: overview, process timeline, "what to prepare" section.

**Day 18 — DSA question bank**
- Write **original** questions per topic (arrays, strings, DP, graphs, trees, etc.) — not reproductions of any platform's proprietary question bank. Claude can help you draft original practice problems and explanations quickly; topic-level patterns (e.g. "graphs are common at X") are public knowledge and fine to reference — exact proprietary question text from other platforms is not.
- Tag each question by topic and difficulty.

**Day 19 — Company ↔ DSA mapping**
- Map each company to the topics it's publicly known to emphasize, and build the "prep roadmap" page that ties a user's resume gaps + target companies' topics into one checklist.

**Day 20 — RAG wiring**
- Embed `company_intel` content into `pgvector`. Build a simple retrieval endpoint so a future "ask about this company" feature (or today's search) is grounded in your own stored data, not the model's general knowledge.

**Day 21 — Buffer**
- Polish company + DSA UI, deploy checkpoint.

---

## Before Week 4: Admin Panel (adds ~2-3 days — do this before deployment, not during the initial sprint)

Added to the plan after real friction: managing company/DSA data by hand-writing
SQL in the Supabase editor works for the first 20 entries and stops scaling almost
immediately after. Building this *now* (post-Phase-1-features, pre-deployment)
rather than during the original 30-day sprint is deliberate — you need to know
what's actually painful to manage by hand before building tools to manage it.

**What this covers:**

- **Content management (highest priority — fixes the actual pain today):** forms
  for creating/editing `companies`, `company_intel`, and `dsa_questions` instead of
  hand-written SQL. This is the only piece worth building before launch — the other
  two below can wait.
- **User visibility (view signups, resumes, scores):** low priority with zero
  users, but worth having ready fast once real users show up. Don't over-build this
  before you have anyone to look at.
- **"Post new jobs":** this is really the first piece of the Job Discovery pillar
  (Wave 2, not Phase 1) wearing an admin-panel hat. Build it as part of the actual
  jobs feature later, not as a one-off form now — otherwise it gets built twice.

**What this needs that nothing else in Phase 1 has:** real access control. An
`is_admin` flag (or a dedicated role) on `users`, checked server-side on every
admin route/action — not just "logged in," since right now "logged in" and
"founder" are the same person, and that assumption breaks the moment anyone else
gets an account. Decide this properly even though it's a team of one today.

**Sequencing:** do this after Week 3 (company/DSA data) and before the Week 4
deployment steps below (Days 27-30) — you want the content-management pain fully
felt (not hypothetical) before designing the forms that fix it, but you also want
it done before you're relying on hand-written SQL in front of real users.

---

## Week 4 — Integration, Testing, Launch (Days 22–30)

**Day 22 — Onboarding flow**
- First-time path: upload resume → pick 3–5 target companies → land on a personalized dashboard. This single flow is the entire first impression — give it the most polish of anything this month.

**Day 23 — Unified dashboard**
- One view: resume score, target companies, DSA progress, and a clear "next best action."

**Day 24 — Analytics + error tracking**
- PostHog events: signup, resume uploaded, analysis viewed, company viewed. Sentry wired in for error visibility. Both are under an hour each and you'll be blind without them from Day 1 of real users.

**Day 25 — Mobile + cross-browser pass**
- Most of your users will be on phones. Test on an actual phone, not just a resized browser window.

**Day 26 — Legal basics**
- Draft a privacy policy and terms of service (Claude can draft a first pass from your actual data practices — flag for real legal review before you scale or take payments). Add a basic data export/delete request stub — cheap now, painful to retrofit.

**Day 27 — Domain + landing polish**
- Point your custom domain at Vercel, add basic SEO (meta tags, sitemap, OG image).

**Day 28 — Buffer**
- Full regression pass on the entire user journey, start to finish, as a brand-new user would experience it.

**Day 29 — Soft launch**
- Invite 20–50 real people from your own network (college groups, LinkedIn, WhatsApp/Discord communities). Watch a few of them use it live if you can — you'll learn more from 30 minutes of watching a stranger get confused than from a week of your own testing. Fix anything critical.

**Day 30 — Public launch**
- Ship the Day 29 fixes, then post publicly (LinkedIn, relevant student communities, X/Twitter, Reddit where appropriate). Spend the rest of the day monitoring and responding to real users, not building new features.

---

## What NOT to Build This Month

Protecting this list is what makes the 30 days realistic:

- Mock interviews / voice AI
- Mass apply / job aggregation
- Abroad study / admissions
- Courses marketplace
- Payments (validate retention first — add monetization in Month 2 once you know people come back)
- Native mobile apps (responsive web is enough for launch)
- OCR for scanned resumes (flag-and-skip is fine for now)

---

## After Launch: Weeks 5+

Once Wave 1 has real users and real signal, the next moves (per the earlier roadmap) are: job discovery, company-specific DSA kits, and your first institutional pilot conversations — all building on the same schema and AI orchestration patterns you'll have already shipped, not a new architecture.
