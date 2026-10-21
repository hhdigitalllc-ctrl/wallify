-- Stage 1 (additive): per-visitor submission log. Only the server (service role) touches it.
-- ip_hash is an HMAC of the visitor's IP, so the raw address is never stored.
create table if not exists public.submission_log (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  space_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists submission_log_ip_idx on public.submission_log (ip_hash, created_at desc);
create index if not exists submission_log_created_idx on public.submission_log (created_at);

alter table public.submission_log enable row level security;
revoke all on public.submission_log from anon, authenticated;
