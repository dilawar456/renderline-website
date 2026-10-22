begin;
alter table public.studio_files add column if not exists uploader_id uuid default auth.uid() references auth.users(id);
create policy own_file_metadata on public.studio_files for select to authenticated using(uploader_id=auth.uid() and public.studio_access(project_id));
create policy upload_project_references on public.studio_files for insert to authenticated with check(
 public.studio_access(project_id) and uploader_id=auth.uid() and visibility='internal'
 and split_part(path,'/',2)=auth.uid()::text
);
-- Keep legacy storage protected; allow invited users to upload into their own project folder only.
drop policy if exists studio_storage_insert_guard on storage.objects;
create policy studio_storage_insert_guard on storage.objects as restrictive for insert to anon,authenticated with check(
 public.studio_owner() or (bucket_id='studio-files' and split_part(name,'/',2)=auth.uid()::text
 and exists(select 1 from public.studio_projects p where p.id::text=split_part(name,'/',1) and public.studio_access(p.id)))
);
create policy project_reference_upload on storage.objects for insert to authenticated with check(
 bucket_id='studio-files' and split_part(name,'/',2)=auth.uid()::text
 and exists(select 1 from public.studio_projects p where p.id::text=split_part(name,'/',1) and public.studio_access(p.id))
);
-- Permit an uploader to remove an orphaned object if saving its metadata fails.
create function public.studio_orphan_upload(object_path text) returns boolean
language sql stable security definer set search_path='' as $$
 select split_part(object_path,'/',2)=auth.uid()::text
 and not exists(select 1 from public.studio_files f where f.path=object_path);
$$;
revoke all on function public.studio_orphan_upload(text) from public;
grant execute on function public.studio_orphan_upload(text) to anon,authenticated;
drop policy if exists studio_private_files_guard on storage.objects;
create policy studio_private_files_guard on storage.objects as restrictive for select to anon,authenticated using(
 bucket_id<>'studio-files' or public.studio_owner()
 or exists(select 1 from public.studio_files f where f.path=storage.objects.name)
 or public.studio_orphan_upload(name)
);
create policy read_own_orphan_reference on storage.objects for select to authenticated using(bucket_id='studio-files' and public.studio_orphan_upload(name));
drop policy if exists studio_storage_delete_guard on storage.objects;
create policy studio_storage_delete_guard on storage.objects as restrictive for delete to anon,authenticated using(
 public.studio_owner() or (bucket_id='studio-files' and public.studio_orphan_upload(name))
);
create policy remove_orphan_reference on storage.objects for delete to authenticated using(
 bucket_id='studio-files' and public.studio_orphan_upload(name)
);
create table public.studio_feedback (
 id uuid primary key default gen_random_uuid(),
 project_id uuid not null references public.studio_projects(id) on delete cascade,
 author_id uuid not null default auth.uid() references auth.users(id),
 file_id uuid references public.studio_files(id),
 body text not null check(length(trim(body)) between 1 and 5000),
 kind text not null default 'comment' check(kind in ('comment','revision','approval')),
 created_at timestamptz not null default now(),
 check(kind<>'approval' or file_id is not null)
);
create unique index one_deliverable_approval on public.studio_feedback(author_id,file_id) where kind='approval';
create index feedback_project_order on public.studio_feedback(project_id,created_at);
alter table public.studio_feedback enable row level security;
revoke all on public.studio_feedback from anon,authenticated;
grant select,insert on public.studio_feedback to authenticated;
create policy project_conversation_read on public.studio_feedback for select to authenticated using(public.studio_access(project_id));
create policy project_conversation_add on public.studio_feedback for insert to authenticated with check(
 author_id=auth.uid() and public.studio_access(project_id)
 and (file_id is null or exists(select 1 from public.studio_files f where f.id=file_id and f.project_id=studio_feedback.project_id and f.visibility='client'))
 and (kind<>'approval' or exists(select 1 from public.studio_projects p where p.id=project_id and p.client_id=auth.uid()))
);
commit;
