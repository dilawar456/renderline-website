-- Retained legacy records are owner-only. The hosted portal uses studio_* tables.
begin;
do $$ declare legacy_table text; begin
 foreach legacy_table in array array['project_updates','page_views'] loop
  if to_regclass('public.'||legacy_table) is not null then
   execute format('alter table public.%I enable row level security',legacy_table);
   execute format('create policy legacy_private_guard on public.%I as restrictive for all to anon,authenticated using(public.studio_owner()) with check(public.studio_owner())',legacy_table);
   execute format('create policy legacy_owner_manage on public.%I for all to authenticated using(public.studio_owner()) with check(public.studio_owner())',legacy_table);
  end if;
 end loop;
end $$;
commit;
