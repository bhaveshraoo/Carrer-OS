-- CareerOS Schema Migration 0003: Calibrate Roles & Seniority Levels in Database
-- Adds explicit `role` and `seniority_level` columns to public.users and updates public.handle_new_user()

-- 1. Add role column to public.users if not exists
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'role'
  ) then
    alter table public.users add column role text not null default 'Intern'
      check (role in ('Boss', 'Manager', 'PM', 'TL', 'Post-Intern', 'Intern'));
  end if;
end $$;

-- 2. Add seniority_level column to public.users if not exists
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'users' and column_name = 'seniority_level'
  ) then
    alter table public.users add column seniority_level text not null default 'Freshers / Entry Level'
      check (seniority_level in (
        'Architect / PM Level',
        'Senior / Lead Track',
        'Mid-Level Engineer',
        'Junior Intern',
        'Freshers / Entry Level'
      ));
  end if;
end $$;

-- 3. Update public.handle_new_user() trigger function to persist role and seniority_level from raw_user_meta_data
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, full_name, username, role, seniority_level)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'username',
    coalesce(new.raw_user_meta_data ->> 'role', 'Intern'),
    coalesce(new.raw_user_meta_data ->> 'seniority_level', 'Freshers / Entry Level')
  )
  on conflict (id) do update set
    role = coalesce(excluded.role, public.users.role),
    seniority_level = coalesce(excluded.seniority_level, public.users.seniority_level);
  return new;
end;
$$;
