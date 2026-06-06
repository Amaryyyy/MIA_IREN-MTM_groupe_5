-- Gameverse — schéma Supabase
-- Exécuter dans le SQL Editor du dashboard Supabase

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  current_level_index integer not null default 0 check (current_level_index >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  level_index integer not null check (level_index >= 0),
  score integer not null check (score >= 0),
  time_seconds integer not null check (time_seconds >= 0),
  attempts integer not null default 1 check (attempts >= 1),
  created_at timestamptz not null default now()
);

create index if not exists scores_user_id_idx on public.scores (user_id);
create index if not exists scores_level_index_idx on public.scores (level_index);

create or replace view public.leaderboard as
select
  p.id as user_id,
  p.username,
  p.avatar_url,
  coalesce(sum(best.best_score), 0)::integer as total_score
from public.profiles p
left join (
  select user_id, level_index, max(score) as best_score
  from public.scores
  group by user_id, level_index
) best on best.user_id = p.id
group by p.id, p.username, p.avatar_url
order by total_score desc;

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.scores enable row level security;

create policy "profiles_select_all"
  on public.profiles for select
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "user_progress_select_own"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "user_progress_insert_own"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "user_progress_update_own"
  on public.user_progress for update
  using (auth.uid() = user_id);

create policy "scores_select_all"
  on public.scores for select
  using (true);

create policy "scores_insert_own"
  on public.scores for insert
  with check (auth.uid() = user_id);

-- Droits PostgREST (sans eux, les requêtes renvoient 403 Forbidden)
grant usage on schema public to anon, authenticated;

grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;

grant select, insert, update on public.user_progress to authenticated;

grant select on public.scores to anon, authenticated;
grant insert on public.scores to authenticated;

grant select on public.leaderboard to anon, authenticated;
