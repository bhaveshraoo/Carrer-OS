-- CareerOS Phase 1 schema: Resume AI + Company Intelligence + DSA Prep
-- Run 0000_reset.sql first if you're replacing a different schema. This file is
-- safe to re-run on its own after that — every statement is idempotent
-- (IF NOT EXISTS / OR REPLACE / DROP ... IF EXISTS before CREATE).

create extension if not exists vector;
create extension if not exists pgcrypto;

-- Supabase Auth already provides auth.users. This table holds app-specific profile
-- data, linked 1:1 to an auth user. Deliberately NOT duplicating `email` here —
-- auth.users already has it, and a copy here would just be one more place for it
-- to drift out of sync. Read it from the session (`user.email`) instead.
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  created_at timestamptz not null default now()
);

-- Auto-create the public.users row whenever someone signs up (any provider — email
-- OTP, Google, password). Without this, the first insert into `resumes` for a new
-- user fails with a foreign key violation, since public.users would otherwise stay
-- empty until something explicitly inserts into it.
-- full_name/username come from raw_user_meta_data, populated two ways:
--   - password signup: supabase.auth.signUp({ options: { data: { full_name, username } } })
--   - Google OAuth: Google's profile claims map to full_name automatically; no username
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, full_name, username)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'username'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  file_size bigint,          -- bytes; enforced <=8MB at the API layer, stored for reference
  mime_type text,
  raw_text text,
  status text not null default 'uploaded'
    check (status in ('uploaded', 'parsed', 'analyzed', 'error')),
  version int not null default 1,
  parsed_at timestamptz,     -- set when text extraction completes
  analyzed_at timestamptz,   -- set when scoring completes
  created_at timestamptz not null default now()
);

create table if not exists public.resume_analyses (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  resume_score int,
  ats_score int,
  recruiter_score int,
  hr_readability_score int,
  industry_match_score int,
  report jsonb not null default '{}'::jsonb, -- extracted data, scores, strengths/weaknesses,
                                              -- rewrite suggestions, and the ATS sub-score
                                              -- breakdown (contact/skills/experience/keywords/
                                              -- formatting/education) — see ResumeScores type
  ai_provider text,      -- 'gemini' | 'anthropic' — which AI_PROVIDER generated this analysis
  model_name text,       -- exact model string, e.g. 'gemini-2.5-flash' or 'claude-sonnet-5'
  processing_time_ms int,
  created_at timestamptz not null default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  logo_url text,
  career_page_url text,
  metadata jsonb not null default '{}'::jsonb, -- industry, size, tier (product/service/MNC/etc.)
  created_at timestamptz not null default now()
);

create table if not exists public.company_intel (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  overview text,
  hiring_process jsonb not null default '[]'::jsonb, -- ordered stages
  required_skills text[] not null default '{}',
  prep_roadmap text,
  source_urls text[] not null default '{}', -- public sources this was compiled from
  embedding vector(1536),
  updated_at timestamptz not null default now()
);

-- One company_intel row per company — required for the seed script's
-- upsert(..., { onConflict: "company_id" }) to work correctly; without a unique
-- constraint there's no conflict target and every re-run would insert duplicates.
-- Wrapped in a check so this stays safe to re-run against a database where this
-- migration already ran before this constraint existed. Checking pg_constraint by
-- name directly (rather than try/catch on a specific error code) avoids a real bug
-- hit earlier: a bare ALTER TABLE ADD CONSTRAINT retried against an already-added
-- constraint raises duplicate_table (42P07), not duplicate_object — a narrow
-- exception handler catching only one of those will fail on retries either way,
-- so checking existence up front instead of relying on catching the right error is
-- the more robust fix, not just a different way of writing the same fix.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'company_intel_company_id_key'
  ) then
    alter table public.company_intel add constraint company_intel_company_id_key unique (company_id);
  end if;
end $$;

create table if not exists public.dsa_questions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  topic text not null, -- arrays | strings | dp | graphs | trees | ...
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  prompt text not null,
  solution_explanation text,
  created_at timestamptz not null default now()
);

-- One row per question title. Same robust pattern as the company_intel constraint
-- above — check pg_constraint directly rather than relying on catching a specific
-- exception code, which is what actually broke on the company_intel version.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'dsa_questions_title_key'
  ) then
    alter table public.dsa_questions add constraint dsa_questions_title_key unique (title);
  end if;
end $$;

create table if not exists public.company_dsa_topics (
  company_id uuid not null references public.companies(id) on delete cascade,
  topic text not null,
  emphasis int not null default 1, -- 1-5, how commonly this topic appears for this company
  primary key (company_id, topic)
);

create table if not exists public.user_company_targets (
  user_id uuid not null references public.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, company_id)
);

-- Row Level Security: every user can only read/write their own data.
alter table public.users enable row level security;
alter table public.resumes enable row level security;
alter table public.resume_analyses enable row level security;
alter table public.user_company_targets enable row level security;

drop policy if exists "Users can view own profile" on public.users;
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

drop policy if exists "Users can manage own resumes" on public.resumes;
create policy "Users can manage own resumes" on public.resumes
  for all using (auth.uid() = user_id);

drop policy if exists "Users can view own resume analyses" on public.resume_analyses;
create policy "Users can view own resume analyses" on public.resume_analyses
  for select using (
    auth.uid() = (select user_id from public.resumes where id = resume_id)
  );

drop policy if exists "Users can insert analyses for own resumes" on public.resume_analyses;
create policy "Users can insert analyses for own resumes" on public.resume_analyses
  for insert with check (
    auth.uid() = (select user_id from public.resumes where id = resume_id)
  );

drop policy if exists "Users can manage own company targets" on public.user_company_targets;
create policy "Users can manage own company targets" on public.user_company_targets
  for all using (auth.uid() = user_id);

-- companies, company_intel, dsa_questions, company_dsa_topics are public read data —
-- no RLS needed there, everyone can read; writes happen via the service role key only.

-- Storage: private bucket for resume files, one folder per user (storage_path is
-- `{user_id}/{filename}` — see src/app/api/resume/upload/route.ts). Policies below
-- restrict each user to their own folder, same pattern as the table RLS above.
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

drop policy if exists "Users can upload to own folder" on storage.objects;
create policy "Users can upload to own folder" on storage.objects
  for insert with check (
    bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can read own files" on storage.objects;
create policy "Users can read own files" on storage.objects
  for select using (
    bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete own files" on storage.objects;
create policy "Users can delete own files" on storage.objects
  for delete using (
    bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text
  );
