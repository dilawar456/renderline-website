begin;
create table public.studio_files (
 id uuid primary key default gen_random_uuid(),
 project_id uuid not null references public.studio_projects(id) on delete cascade,
 name text not null check(length(name) between 1 and 240),
 path text not null unique,
 size bigint not null check(size between 1 and 20971520),
 visibility text not null default 'internal' check(visibility in ('internal','client')),
 created_at timestamptz not null default now(),
 check(split_part(path,'/',1)=project_id::text)
);
alter table public.studio_files enable row level security;
revoke all on public.studio_files from anon,authenticated;
grant select,insert,update,delete on public.studio_files to authenticated;
create policy owner_files on public.studio_files for all to authenticated using(public.studio_owner()) with check(public.studio_owner());
create policy project_files on public.studio_files for select to authenticated using(public.studio_team(project_id) or (visibility='client' and public.studio_access(project_id)));
create index on public.studio_files(project_id);
insert into storage.buckets(id,name,public,file_size_limit) values('studio-files','studio-files',false,20971520) on conflict(id) do update set public=false,file_size_limit=20971520;
create policy studio_file_upload on storage.objects for insert to authenticated with check(bucket_id='studio-files' and public.studio_owner());
create policy studio_file_delete on storage.objects for delete to authenticated using(bucket_id='studio-files' and public.studio_owner());
create policy studio_file_read on storage.objects for select to authenticated using(bucket_id='studio-files' and (public.studio_owner() or exists(select 1 from public.studio_files f where f.path=storage.objects.name)));
-- Restrict private files even if an old permissive storage policy allowed all reads.
create policy studio_private_files_guard on storage.objects as restrictive for select to anon,authenticated using(bucket_id<>'studio-files' or public.studio_owner() or exists(select 1 from public.studio_files f where f.path=storage.objects.name));
commit;
