-- Wallify initial schema: spaces + testimonials with RLS

create table public.spaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 60),
  headline text not null default 'Send us some love!' check (char_length(headline) <= 120),
  created_at timestamptz not null default now()
);

-- Public URL is /collect/[slug] with no user in it, so slugs are globally unique
create unique index spaces_slug_key on public.spaces (slug);
create index spaces_user_id_idx on public.spaces (user_id);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  content text not null check (char_length(content) between 1 and 1000),
  client_name text not null check (char_length(client_name) between 1 and 80),
  client_title text check (char_length(client_title) <= 80),
  client_avatar text check (char_length(client_avatar) <= 500),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index testimonials_space_idx on public.testimonials (space_id, approved, created_at desc);

alter table public.spaces enable row level security;
alter table public.testimonials enable row level security;

-- Spaces: owner full access; anyone can read (needed for the public collect page + widget)
create policy "spaces_owner_all" on public.spaces
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "spaces_public_read" on public.spaces
  for select to anon, authenticated
  using (true);

-- Testimonials: anyone can submit, but only as unapproved
create policy "testimonials_public_insert" on public.testimonials
  for insert to anon, authenticated
  with check (approved = false);

-- Anyone can read approved ones (widget)
create policy "testimonials_public_read_approved" on public.testimonials
  for select to anon, authenticated
  using (approved = true);

-- Space owner can read / update / delete everything in their spaces
create policy "testimonials_owner_select" on public.testimonials
  for select to authenticated
  using (exists (select 1 from public.spaces s where s.id = space_id and s.user_id = auth.uid()));

create policy "testimonials_owner_update" on public.testimonials
  for update to authenticated
  using (exists (select 1 from public.spaces s where s.id = space_id and s.user_id = auth.uid()))
  with check (exists (select 1 from public.spaces s where s.id = space_id and s.user_id = auth.uid()));

create policy "testimonials_owner_delete" on public.testimonials
  for delete to authenticated
  using (exists (select 1 from public.spaces s where s.id = space_id and s.user_id = auth.uid()));

-- Dashboard metrics per space
create or replace view public.space_stats with (security_invoker = true) as
select
  s.id as space_id,
  count(t.id) as total,
  count(t.id) filter (where t.approved) as approved_count,
  coalesce(round(avg(t.rating)::numeric, 1), 0) as avg_rating
from public.spaces s
left join public.testimonials t on t.space_id = s.id
group by s.id;
