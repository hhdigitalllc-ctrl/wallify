-- Stage 2 (apply AFTER the app version that submits through the server is deployed).
-- Testimonials can no longer be inserted straight through the public API: the only way in is
-- the server action, which validates input and applies per-visitor rate limits.
drop policy if exists "testimonials_public_insert" on public.testimonials;
revoke insert on public.testimonials from anon, authenticated;
