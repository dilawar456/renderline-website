-- Apply once, in a transaction, before allowing client/team accounts.
begin;
create table public.studio_profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 name text not null, email text not null unique,
 role text not null check (role in ('owner','team','client'))
);
insert into public.studio_profiles(id,name,email,role)
select id,'Dilawar Ali',lower(email),'owner' from auth.users where lower(email)='inforenderline@gmail.com';
do $$ begin
 if not exists(select 1 from public.studio_profiles where role='owner') then
 raise exception 'Create or invite inforenderline@gmail.com in Supabase Authentication before running this migration.';
 end if;
end $$;
create function public.studio_owner() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.studio_profiles where id = auth.uid() and role = 'owner');
$$;
create table public.studio_projects (
 id uuid primary key default gen_random_uuid(), title text not null check(length(title) between 1 and 200),
 brief text not null default '', client_id uuid references public.studio_profiles(id),
 status text not null default 'Planning' check(status in ('Planning','In progress','Review','Completed','On hold')),
 due_date date, created_at timestamptz not null default now()
);
create table public.studio_members (
 project_id uuid references public.studio_projects(id) on delete cascade,
 user_id uuid references public.studio_profiles(id) on delete cascade,
 primary key(project_id,user_id)
);
create function public.studio_access(pid uuid) returns boolean language sql stable security definer set search_path = '' as $$
 select public.studio_owner() or exists(select 1 from public.studio_projects where id=pid and client_id=auth.uid())
 or exists(select 1 from public.studio_members m join public.studio_profiles p on p.id=m.user_id where m.project_id=pid and m.user_id=auth.uid() and p.role='team');
$$;
create function public.studio_team(pid uuid) returns boolean language sql stable security definer set search_path = '' as $$
 select public.studio_owner() or exists(select 1 from public.studio_members m join public.studio_profiles p on p.id=m.user_id where m.project_id=pid and m.user_id=auth.uid() and p.role='team');
$$;
create table public.studio_intake (
 id uuid primary key default gen_random_uuid(), project_id uuid not null references public.studio_projects(id) on delete cascade,
 raw_text text not null check(length(raw_text) between 1 and 30000), created_at timestamptz not null default now()
);
create table public.studio_tasks (
 id uuid primary key default gen_random_uuid(), project_id uuid not null references public.studio_projects(id) on delete cascade,
 title text not null check(length(title) between 1 and 200), instructions text not null default '',
 assignee_id uuid references public.studio_profiles(id), due_date date,
 status text not null default 'To do' check(status in ('To do','In progress','Blocked','Review','Done')),
 priority text not null default 'Normal' check(priority in ('Normal','High','Urgent')),
 source_id uuid references public.studio_intake(id), source_index integer,
 created_at timestamptz not null default now(), unique(source_id,source_index)
);
create table public.studio_updates (
 id uuid primary key default gen_random_uuid(), project_id uuid not null references public.studio_projects(id) on delete cascade,
 body text not null check(length(body) between 1 and 10000), link text not null default '' check(link='' or link ~ '^https://'),
 visibility text not null default 'internal' check(visibility in ('internal','client')),
 author_id uuid not null default auth.uid() references auth.users(id), created_at timestamptz not null default now()
);
create table public.studio_invoices (
 id uuid primary key default gen_random_uuid(), project_id uuid not null references public.studio_projects(id),
 number text not null unique, bill_to text not null, currency text not null default 'PKR' check(currency in ('PKR','USD','SAR','AED','GBP','EUR')),
 items jsonb not null check(jsonb_typeof(items)='array' and jsonb_array_length(items) between 1 and 30),
 subtotal numeric(14,2) not null check(subtotal>=0), discount numeric(14,2) not null default 0 check(discount>=0 and discount<=subtotal),
 total numeric(14,2) generated always as (subtotal-discount) stored,
 paid numeric(14,2) not null default 0 check(paid>=0 and paid<=subtotal-discount),
 status text not null default 'draft' check(status in ('draft','sent','void')),
 due_date date, notes text not null default '', created_at timestamptz not null default now()
);
create table public.studio_tracking (
 id integer primary key check(id=1), enabled boolean not null default false,
 meta_pixel text not null default '' check(meta_pixel='' or meta_pixel ~ '^[0-9]{5,25}$'),
 google_tag text not null default '' check(google_tag='' or google_tag ~ '^(G-[A-Z0-9]{4,20}|AW-[0-9]{4,20})$'),
 google_ads text not null default '' check(google_ads='' or google_ads ~ '^AW-[0-9]{4,20}$'),
 google_conversion text not null default '' check(google_conversion='' or google_conversion ~ '^AW-[0-9]{4,20}/[A-Za-z0-9_-]{1,100}$')
);
-- Recompute invoice amounts inside PostgreSQL, including direct API writes.
create function public.studio_invoice_totals() returns trigger language plpgsql set search_path='' as $$
declare item jsonb; amount numeric := 0; q numeric; r numeric;
begin
 for item in select * from jsonb_array_elements(new.items) loop
 if coalesce(length(trim(item->>'description')),0)=0 or jsonb_typeof(item->'quantity') is distinct from 'number' or jsonb_typeof(item->'rate') is distinct from 'number' then raise exception 'Invalid invoice item'; end if;
 q := (item->>'quantity')::numeric; r := (item->>'rate')::numeric;
 if q<=0 or q>100000 or r<0 or r>100000000 then raise exception 'Invalid quantity or rate'; end if;
 amount := amount + round(q*r,2);
 end loop;
 new.subtotal := amount;
 return new;
end $$;
create trigger invoice_totals before insert or update on public.studio_invoices for each row execute function public.studio_invoice_totals();
insert into public.studio_tracking(id) values(1);
do $$ declare t text; begin
 foreach t in array array['studio_profiles','studio_projects','studio_members','studio_intake','studio_tasks','studio_updates','studio_invoices','studio_tracking'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('revoke all on public.%I from anon, authenticated',t);
 execute format('grant select, insert, update, delete on public.%I to authenticated',t);
 execute format('create policy owner_all on public.%I for all to authenticated using(public.studio_owner()) with check(public.studio_owner())',t);
 end loop;
end $$;
create policy profile_self on public.studio_profiles for select to authenticated using(id=auth.uid());
create policy project_read on public.studio_projects for select to authenticated using(public.studio_access(id));
create policy member_read on public.studio_members for select to authenticated using(user_id=auth.uid());
create policy task_read on public.studio_tasks for select to authenticated using(public.studio_team(project_id));
-- Team may change only status using the RPC below; cannot reassign or move tasks.
create function public.studio_task_status(task_id uuid, next_status text) returns void language plpgsql security definer set search_path='' as $$
begin
 if next_status not in ('To do','In progress','Blocked','Review','Done') then raise exception 'Invalid status'; end if;
 update public.studio_tasks set status=next_status where id=task_id and public.studio_team(project_id) and (public.studio_owner() or assignee_id=auth.uid());
 if not found then raise exception 'Task unavailable or not assigned to you'; end if;
end $$;
create policy update_read on public.studio_updates for select to authenticated using(public.studio_team(project_id) or (visibility='client' and public.studio_access(project_id)));
create policy update_add on public.studio_updates for insert to authenticated with check(public.studio_team(project_id) and author_id=auth.uid() and visibility='internal');
create policy invoice_client_read on public.studio_invoices for select to authenticated using(status<>'draft' and exists(select 1 from public.studio_projects where id=project_id and client_id=auth.uid()));
grant select on public.studio_tracking to anon;
create policy tracking_read on public.studio_tracking for select to anon,authenticated using(true);

-- Restrictive guards close ALL legacy permissive CMS policies, including unnamed ones.
-- They preserve public reads/contact submissions while restricting all CMS writes to owner.
do $$ declare t text; begin
 foreach t in array array['site_content','portfolio_items','videos','site_videos','services','messages','contacts'] loop
 if to_regclass('public.'||t) is not null then
 execute format('alter table public.%I enable row level security',t);
 execute format('create policy studio_owner_insert_guard on public.%I as restrictive for insert to anon,authenticated with check(%s)',t,case when t in ('messages','contacts') then 'true' else 'public.studio_owner()' end);
 execute format('create policy studio_owner_update_guard on public.%I as restrictive for update to anon,authenticated using(public.studio_owner()) with check(public.studio_owner())',t);
 execute format('create policy studio_owner_delete_guard on public.%I as restrictive for delete to anon,authenticated using(public.studio_owner())',t);
 if t in ('messages','contacts') then
 execute format('create policy studio_owner_read_guard on public.%I as restrictive for select to anon,authenticated using(public.studio_owner())',t);
 end if;
 execute format('create policy studio_owner_manage on public.%I for all to authenticated using(public.studio_owner()) with check(public.studio_owner())',t);
 end if;
 end loop;
end $$;
create policy studio_storage_insert_guard on storage.objects as restrictive for insert to anon,authenticated with check(public.studio_owner());
create policy studio_storage_update_guard on storage.objects as restrictive for update to anon,authenticated using(public.studio_owner()) with check(public.studio_owner());
create policy studio_storage_delete_guard on storage.objects as restrictive for delete to anon,authenticated using(public.studio_owner());
alter table public.site_content add column if not exists portfolio_order text;
alter table public.site_content add column if not exists portfolio_pinned text;
alter table public.site_content add column if not exists expertise_subtitle text;
alter table public.site_content add column if not exists tools_subtitle text;
alter table public.site_content add column if not exists tools_list text;
do $$ declare i integer; begin
 for i in 1..8 loop
 execute format('alter table public.site_content add column if not exists expertise%s_title text',i);
 execute format('alter table public.site_content add column if not exists expertise%s_desc text',i);
 end loop;
 for i in 1..6 loop
 execute format('alter table public.site_content add column if not exists service%s_modal_desc text',i);
 execute format('alter table public.site_content add column if not exists service%s_highlights text',i);
 end loop;
end $$;
-- Recover ordering previously stored by the old CMS in its phone display field.
do $$ declare previous text; begin
 if exists(select 1 from information_schema.columns where table_schema='public' and table_name='site_content' and column_name='contact_phone_display') then
 execute 'select contact_phone_display from public.site_content where id=1' into previous;
 if previous ~ '^\s*[\[{]' then
 begin
 perform previous::jsonb;
 execute 'update public.site_content set portfolio_order=coalesce(portfolio_order,$1),contact_phone_display=$2 where id=1' using previous,'0311-4544040';
 exception when invalid_text_representation then null;
 end;
 end if;
 end if;
end $$;
create index on public.studio_projects(client_id);
create index on public.studio_members(user_id);
create index on public.studio_tasks(project_id);
create index on public.studio_updates(project_id,created_at desc);
create index on public.studio_intake(project_id,created_at desc);
create index on public.studio_invoices(project_id);
revoke all on function public.studio_task_status(uuid,text) from public;
grant execute on function public.studio_task_status(uuid,text) to authenticated;
commit;
