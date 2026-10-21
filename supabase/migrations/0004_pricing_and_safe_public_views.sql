-- Stage 1 (additive, safe while the previous app version is live)

-- ---------------------------------------------------------------- lifetime plan
alter table public.subscriptions
  add column if not exists lifetime boolean not null default false,
  add column if not exists stripe_payment_intent_id text unique;

create or replace function public.is_pro(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.subscriptions s
    where s.user_id = uid
      and (
        s.lifetime
        or (
          s.status in ('active', 'trialing')
          and (s.current_period_end is null or s.current_period_end > now())
        )
      )
  );
$$;

-- The signed-in user's own plan: 'free' | 'pro' | 'lifetime'. Never takes a user id.
create or replace function public.my_plan()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select case
        when s.lifetime then 'lifetime'
        when s.status in ('active', 'trialing')
          and (s.current_period_end is null or s.current_period_end > now()) then 'pro'
        else 'free'
      end
      from public.subscriptions s
      where s.user_id = auth.uid()
    ),
    'free'
  );
$$;

revoke execute on function public.my_plan() from public, anon;
grant execute on function public.my_plan() to authenticated;

-- ---------------------------------------------------------------- free plan: 20 approved
create or replace function public.enforce_approved_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  owner uuid;
begin
  if new.approved and (tg_op = 'INSERT' or not old.approved) then
    select user_id into owner from public.spaces where id = new.space_id;
    if not public.is_pro(owner)
       and (
         select count(*) from public.testimonials t
         join public.spaces s on s.id = t.space_id
         where s.user_id = owner and t.approved and t.id <> new.id
       ) >= 20 then
      raise exception 'free_plan_testimonial_limit' using errcode = 'P0001';
    end if;
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------- public view of spaces
-- Public pages only need these four columns. Exposing the whole table (with user_id)
-- through a public-read policy leaks every owner's id.
create or replace view public.public_spaces as
select id, name, slug, headline from public.spaces;

grant select on public.public_spaces to anon, authenticated;

-- ---------------------------------------------------------------- abuse limits on submissions
create or replace function public.enforce_submission_limits()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (
    select count(*) from public.testimonials
    where space_id = new.space_id and created_at > now() - interval '10 minutes'
  ) >= 20 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  if (
    select count(*) from public.testimonials
    where space_id = new.space_id and not approved
  ) >= 500 then
    raise exception 'inbox_full' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists testimonials_enforce_submission_limits on public.testimonials;
create trigger testimonials_enforce_submission_limits
  before insert on public.testimonials
  for each row execute function public.enforce_submission_limits();

-- Anonymous inserts may not set an avatar URL (the column is unused and would be attacker-controlled)
drop policy if exists "testimonials_public_insert" on public.testimonials;
create policy "testimonials_public_insert" on public.testimonials
  for insert to anon, authenticated
  with check (approved = false and client_avatar is null);
