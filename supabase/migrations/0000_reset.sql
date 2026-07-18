-- Run this FIRST, before re-running 0001_phase1_schema.sql, to remove the
-- previous (ChatGPT-designed) schema and start from one clean source of truth.
--
-- Safe to run even if some of these tables/objects don't exist — IF EXISTS on
-- everything. This assumes no real user data needs to be preserved yet (pre-launch
-- testing phase) — if you've already got real signups/resumes you care about,
-- stop and export that data first instead of running this.

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Child tables first (though CASCADE would handle order anyway, being explicit
-- makes it clear what's being removed).
drop table if exists public.resume_versions cascade;
drop table if exists public.ats_scores cascade;
drop table if exists public.ai_suggestions cascade;
drop table if exists public.resume_sections cascade;
drop table if exists public.resume_skills cascade;
drop table if exists public.user_company_targets cascade;
drop table if exists public.company_dsa_topics cascade;
drop table if exists public.dsa_questions cascade;
drop table if exists public.company_intel cascade;
drop table if exists public.companies cascade;
drop table if exists public.resume_analyses cascade;
drop table if exists public.resumes cascade;
drop table if exists public.users cascade;

-- Storage: remove the bucket's policies and the bucket itself, if they exist.
drop policy if exists "Users can upload to own folder" on storage.objects;
drop policy if exists "Users can read own files" on storage.objects;
drop policy if exists "Users can delete own files" on storage.objects;
delete from storage.buckets where id = 'resumes';
