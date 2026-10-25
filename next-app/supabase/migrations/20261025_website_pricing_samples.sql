-- Public marketing content only. Preserve the existing site_content row and policies.
alter table public.site_content add column if not exists pricing_config jsonb;
alter table public.site_content add column if not exists drawing_samples jsonb not null default '[]'::jsonb;
comment on column public.site_content.pricing_config is 'Public PKR guide rates. Validated owner-only website endpoint saves this configuration.';
comment on column public.site_content.drawing_samples is 'Approved public sample PDFs and image previews, never client-private documents.';
