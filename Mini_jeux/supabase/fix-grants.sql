-- Correctif si tu as déjà exécuté schema.sql sans les GRANT
-- À coller dans le SQL Editor Supabase puis exécuter une fois

grant usage on schema public to anon, authenticated;

grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;

grant select, insert, update on public.user_progress to authenticated;

grant select on public.scores to anon, authenticated;
grant insert on public.scores to authenticated;

grant select on public.leaderboard to anon, authenticated;
