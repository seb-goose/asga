-- Run this once in the Supabase SQL editor (Project > SQL Editor) to create
-- the members table used by the registration flow.
--
-- If you already ran an earlier version of this file with a `full_name`
-- column, run this instead of recreating the table:
--   alter table public.members add column first_name text;
--   alter table public.members add column last_name text;
--   alter table public.members drop column full_name;
--   alter table public.members alter column first_name set not null;
--   alter table public.members alter column last_name set not null;

create table if not exists public.members (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  farm_name text,
  mailing_address text,
  city text,
  state text,
  zip text,
  phone text,
  email text not null,
  website text,
  membership_type text not null check (membership_type in ('single_adult', 'junior', 'family')),
  owns_geese text check (owns_geese in ('yes', 'no', 'planning')),
  primary_interests text[] not null default '{}',
  primary_interest_other text,
  poultry_orgs text[] not null default '{}',
  poultry_org_other text,
  participation_interests text[] not null default '{}',
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'waived')),
  created_at timestamptz not null default now()
);

alter table public.members enable row level security;

create policy "Members can view own profile"
  on public.members for select
  using (auth.uid() = id);

create policy "Members can update own profile"
  on public.members for update
  using (auth.uid() = id);

-- No insert policy: profile rows are created by the /api/auth/register
-- route using the service-role key, which bypasses RLS.

-- RLS only filters which rows a role can see/touch - it doesn't grant base
-- table access. service_role bypasses RLS but still needs an explicit
-- grant, and authenticated needs one too so account page reads work.
grant select, insert, update, delete on public.members to service_role;
grant select, update on public.members to authenticated;
