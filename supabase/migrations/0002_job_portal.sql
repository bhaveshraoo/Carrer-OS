-- Job Portal Schema: Jobs, Wishlists, and Swipe Logs

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  role text not null,
  description text not null,
  domain text not null default 'Software Engineering',
  location text not null default 'India / Remote',
  ctc_range text not null default '₹12L - ₹24L PA',
  tech_stack text[] not null default '{}',
  interview_types text[] not null default '{}',
  application_url text not null,
  last_date timestamptz not null,
  status text not null default 'active' check (status in ('active', 'expired')),
  created_at timestamptz not null default now()
);

create table if not exists public.job_wishlists (
  user_id uuid not null references public.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  swiped_at timestamptz not null default now(),
  primary key (user_id, job_id)
);

create table if not exists public.job_swipes_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  direction text not null check (direction in ('left', 'right')),
  swiped_at timestamptz not null default now()
);

-- RLS Configuration
alter table public.jobs enable row level security;
alter table public.job_wishlists enable row level security;
alter table public.job_swipes_log enable row level security;

-- Public jobs policy (Read-only for all logged in users)
drop policy if exists "Jobs are viewable by authenticated users" on public.jobs;
create policy "Jobs are viewable by authenticated users" on public.jobs
  for select using (auth.role() = 'authenticated');

-- User Wishlist policies
drop policy if exists "Users can view own wishlists" on public.job_wishlists;
create policy "Users can view own wishlists" on public.job_wishlists
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own wishlists" on public.job_wishlists;
create policy "Users can insert own wishlists" on public.job_wishlists
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can delete own wishlists" on public.job_wishlists;
create policy "Users can delete own wishlists" on public.job_wishlists
  for delete using (auth.uid() = user_id);

-- User Swipe Log policies
drop policy if exists "Users can view own swipe logs" on public.job_swipes_log;
create policy "Users can view own swipe logs" on public.job_swipes_log
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own swipe logs" on public.job_swipes_log;
create policy "Users can insert own swipe logs" on public.job_swipes_log
  for insert with check (auth.uid() = user_id);
