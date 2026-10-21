-- space_stats is only used by the signed-in dashboard. Spaces are publicly readable (the collect
-- page needs that), so without this filter the view would return stats for every user's spaces.
create or replace view public.space_stats with (security_invoker = true) as
select
  s.id as space_id,
  count(t.id) as total,
  count(t.id) filter (where t.approved) as approved_count,
  coalesce(round(avg(t.rating)::numeric, 1), 0) as avg_rating
from public.spaces s
left join public.testimonials t on t.space_id = s.id
where s.user_id = auth.uid()
group by s.id;
