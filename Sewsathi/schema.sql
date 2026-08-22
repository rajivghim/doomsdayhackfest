-- =====================================================================
-- SewaSathi :: Supabase / PostgreSQL schema
-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query)
-- =====================================================================

-- Extension needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Table: reports
-- ---------------------------------------------------------------------
create table if not exists public.reports (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  description        text default '',
  category           text not null check (category in ('Roads', 'Sanitation', 'Electricity', 'Infrastructure', 'Other')),
  severity           text not null check (severity in ('Low', 'Medium', 'High')),
  upvotes            integer not null default 1,
  latitude           double precision not null,
  longitude          double precision not null,
  estimated_budget   text,
  required_crew      text,
  required_materials text,
  repair_time        text,
  image_url          text,
  reporter_name      text default 'Anonymous Nagarik',
  status             text not null default 'Reported' check (status in ('Reported', 'In Progress', 'Resolved')),
  created_at         timestamptz not null default now()
);

-- Helpful indexes for the live map + sorted feed
create index if not exists reports_upvotes_idx on public.reports (upvotes desc);
create index if not exists reports_created_at_idx on public.reports (created_at desc);
create index if not exists reports_category_idx on public.reports (category);
create index if not exists reports_location_idx on public.reports (latitude, longitude);

-- ---------------------------------------------------------------------
-- Stored Procedure: increment_upvote
-- Atomically bumps the upvote counter for a given report and returns
-- the updated row, so the "I'm Affected Too" button stays race-safe
-- even under concurrent clicks.
-- ---------------------------------------------------------------------
create or replace function public.increment_upvote(report_id uuid)
returns public.reports
language plpgsql
security definer
as $$
declare
  updated_row public.reports;
begin
  update public.reports
     set upvotes = upvotes + 1
   where id = report_id
  returning * into updated_row;

  if not found then
    raise exception 'Report % not found', report_id;
  end if;

  return updated_row;
end;
$$;

-- ---------------------------------------------------------------------
-- Row Level Security
-- Public civic-reporting app: anyone can read + submit reports and
-- anyone can upvote (via the RPC only, never a raw UPDATE) to keep
-- write-access to the counter funneled through one safe path.
-- ---------------------------------------------------------------------
alter table public.reports enable row level security;

drop policy if exists "Public can read reports" on public.reports;
create policy "Public can read reports"
  on public.reports for select
  using (true);

drop policy if exists "Public can submit reports" on public.reports;
create policy "Public can submit reports"
  on public.reports for insert
  with check (true);

-- No blanket UPDATE policy is granted; increment_upvote() runs as
-- SECURITY DEFINER so it can update rows without opening the table
-- to arbitrary client-side UPDATE statements.

-- ---------------------------------------------------------------------
-- Realtime (optional): lets the live map subscribe to new reports
-- ---------------------------------------------------------------------
alter publication supabase_realtime add table public.reports;

-- ---------------------------------------------------------------------
-- Sample seed data (safe to delete) so the map isn't empty on first run
-- ---------------------------------------------------------------------
insert into public.reports
  (title, description, category, severity, upvotes, latitude, longitude, estimated_budget, required_crew, required_materials, repair_time)
values
  ('Collapsed manhole cover near Ratna Park', 'Open manhole is a fall hazard for pedestrians at night.', 'Sanitation', 'High', 34, 27.7017, 85.3141, 'NPR 8,000 - 15,000', '2 Workers', 'Cast-iron cover, sealant', '24-48 Hours'),
  ('Pothole cluster on Kalanki-Koteshwor road', 'Multiple deep potholes causing traffic slowdowns and bike accidents.', 'Roads', 'High', 51, 27.6939, 85.2822, 'NPR 40,000 - 60,000', '4-5 Workers', 'Cold asphalt mix, roller', '48-72 Hours'),
  ('Exposed live wire in Baneshwor', 'Low-hanging electrical wire sparking during rain.', 'Electricity', 'High', 22, 27.6933, 85.3411, 'NPR 5,000 - 9,000', '2 Electricians', 'Insulated cable, clamps', '12-24 Hours'),
  ('Broken footpath tiles in Patan Durbar Square area', 'Uneven tiles are a tripping hazard for tourists.', 'Infrastructure', 'Medium', 9, 27.6727, 85.3247, 'NPR 12,000 - 18,000', '2 Workers', 'Interlocking tiles, sand base', '24-48 Hours')
on conflict do nothing;
