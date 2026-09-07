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
--
-- If you already ran an earlier version with 'junior' instead of 'youth' as
-- a membership_type value, run this to update the constraint (if no rows
-- use 'junior' yet - check first with:
--   select id from public.members where membership_type = 'junior';
-- and update any that exist before dropping the old constraint):
--   alter table public.members drop constraint members_membership_type_check;
--   alter table public.members add constraint members_membership_type_check
--     check (membership_type in ('single_adult', 'youth', 'family'));
--
-- If you already ran an earlier version without the Breeders Directory /
-- Communication Agreement columns, run this to add them:
--   alter table public.members
--     add column if not exists directory_opt_in boolean not null default false,
--     add column if not exists directory_farm_name text,
--     add column if not exists directory_city_state text,
--     add column if not exists directory_email text,
--     add column if not exists directory_phone text,
--     add column if not exists directory_website text,
--     add column if not exists directory_contact_methods text[] not null default '{}',
--     add column if not exists directory_colors text[] not null default '{}',
--     add column if not exists directory_colors_other text,
--     add column if not exists directory_offers text[] not null default '{}',
--     add column if not exists directory_delivery_options text[] not null default '{}',
--     add column if not exists directory_delivery_other text,
--     add column if not exists directory_focus text[] not null default '{}',
--     add column if not exists directory_notes text,
--     add column if not exists communication_opt_in boolean not null default false;
--
-- If you already ran an earlier version without the Code of Conduct
-- agreement column, run this to add it:
--   alter table public.members
--     add column if not exists code_of_conduct_agreed boolean not null default false;
--
-- If you already ran an earlier version without the directory ZIP column,
-- run this to add it:
--   alter table public.members add column if not exists directory_zip text;
--
-- If you already ran an earlier version with a combined directory_city_state
-- column, run this to split it (no rows existed with data in it as of this
-- change, so this is a straight swap rather than a data migration):
--   alter table public.members add column if not exists directory_city text;
--   alter table public.members add column if not exists directory_state text;
--   alter table public.members drop column if exists directory_city_state;

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
  membership_type text not null check (membership_type in ('single_adult', 'youth', 'family')),
  owns_geese text check (owns_geese in ('yes', 'no', 'planning')),
  primary_interests text[] not null default '{}',
  primary_interest_other text,
  poultry_orgs text[] not null default '{}',
  poultry_org_other text,
  participation_interests text[] not null default '{}',
  directory_opt_in boolean not null default false,
  directory_farm_name text,
  directory_city text,
  directory_state text,
  directory_zip text,
  directory_email text,
  directory_phone text,
  directory_website text,
  directory_contact_methods text[] not null default '{}',
  directory_colors text[] not null default '{}',
  directory_colors_other text,
  directory_offers text[] not null default '{}',
  directory_delivery_options text[] not null default '{}',
  directory_delivery_other text,
  directory_focus text[] not null default '{}',
  directory_notes text,
  communication_opt_in boolean not null default false,
  code_of_conduct_agreed boolean not null default false,
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
