-- Billing: Stripe subscription state + free-plan limits enforced in the database

create table public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text not null,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

-- Users can read their own row; only the service role (webhook) writes.
create policy "subscriptions_owner_select" on public.subscriptions
  for select to authenticated
  using (user_id = auth.uid());

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
      and s.status in ('active', 'trialing')
      and (s.current_period_end is null or s.current_period_end > now())
  );
$$;

-- Lets the public widget know whether to show the badge / apply the free cap
create or replace function public.space_is_pro(space uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_pro(s.user_id) from public.spaces s where s.id = space;
$$;

grant execute on function public.space_is_pro(uuid) to anon, authenticated;
revoke execute on function public.is_pro(uuid) from anon;

-- Free plan: 1 space
create or replace function public.enforce_space_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_pro(new.user_id)
     and (select count(*) from public.spaces where user_id = new.user_id) >= 1 then
    raise exception 'free_plan_space_limit' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger spaces_enforce_limit
  before insert on public.spaces
  for each row execute function public.enforce_space_limit();

-- Free plan: 10 approved testimonials per user
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
       ) >= 10 then
      raise exception 'free_plan_testimonial_limit' using errcode = 'P0001';
    end if;
  end if;
  return new;
end;
$$;

create trigger testimonials_enforce_approved_limit
  before insert or update of approved on public.testimonials
  for each row execute function public.enforce_approved_limit();
