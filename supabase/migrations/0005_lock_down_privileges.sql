-- Stage 2 (hardening): apply only AFTER the app version that reads public_spaces and my_plan()
-- is deployed, because these statements remove access the previous version relied on.

-- ---------------------------------------------------------------- spaces are no longer publicly readable
drop policy if exists "spaces_public_read" on public.spaces;

-- ---------------------------------------------------------------- function execute rights
-- Postgres grants EXECUTE to PUBLIC by default, which includes the anonymous role.
revoke execute on function public.is_pro(uuid) from public, anon, authenticated;
revoke execute on function public.enforce_space_limit() from public, anon, authenticated;
revoke execute on function public.enforce_approved_limit() from public, anon, authenticated;
revoke execute on function public.enforce_submission_limits() from public, anon, authenticated;

-- The widget and wall page need to know if a space's owner is Pro (to hide the badge)
revoke execute on function public.space_is_pro(uuid) from public;
grant execute on function public.space_is_pro(uuid) to anon, authenticated;

-- ---------------------------------------------------------------- table privileges (least privilege)
-- RLS filters rows, but it does not govern TRUNCATE / REFERENCES / TRIGGER, and Supabase grants
-- every privilege to anon and authenticated by default.
revoke all on public.subscriptions from anon, authenticated;
grant select on public.subscriptions to authenticated;

revoke all on public.spaces from anon;
revoke truncate, references, trigger on public.spaces from authenticated;

revoke all on public.testimonials from anon;
grant select, insert on public.testimonials to anon;
revoke truncate, references, trigger on public.testimonials from authenticated;

revoke all on public.space_stats from anon;
revoke insert, update, delete, truncate, references, trigger on public.space_stats from authenticated;

revoke all on public.public_spaces from anon, authenticated;
grant select on public.public_spaces to anon, authenticated;
