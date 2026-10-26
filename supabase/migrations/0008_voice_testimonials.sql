-- Voice testimonials: an optional short recording per testimonial.
-- Files live in a private bucket; the app serves them through short-lived signed URLs.

alter table public.testimonials
  add column audio_path text check (char_length(audio_path) <= 200),
  add column audio_seconds smallint check (audio_seconds between 1 and 90);

-- A testimonial needs words, a recording, or both
alter table public.testimonials drop constraint testimonials_content_check;
alter table public.testimonials
  add constraint testimonials_content_check
  check (char_length(content) <= 1000 and (char_length(content) >= 1 or audio_path is not null));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('voices', 'voices', false, 2097152, array['audio/webm', 'audio/mp4', 'audio/ogg'])
on conflict (id) do nothing;
