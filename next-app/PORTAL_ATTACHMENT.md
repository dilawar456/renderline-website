# RenderLine client portal — 22 October 2026

## Website and portal

The website entry **/portal** now renders the hosted Supabase client workspace directly. **/portal/legacy** redirects there. The public Projects menu has been removed; the old /projects URL redirects to /portfolio. Clients retain private assigned projects within the portal.

Clients can sign in, follow their approved brief/stage/delivery date, read published updates/invoices, upload project references, download their own references and shared deliverables, ask questions, request changes and approve an exact delivered file. Each upload uses a new immutable path. Duplicate approvals are rejected by the database.

Owners can create and assign accounts/projects, manage shared briefs, tasks and membership, revoke a teammate's project access, review private source notes, publish updates and deliverables, and maintain invoices. Team notes and raw/payment conversations remain protected by database access rules. Account creation requires the server secret below. AI organization is optional and stays disabled until connected; manual briefs/tasks work without it.

## Hosting

Deploy the **next-app** directory as Next.js on the existing Vercel project/domain. Production configuration:

- NEXT_PUBLIC_SUPABASE_URL — existing project URL.
- NEXT_PUBLIC_SUPABASE_ANON_KEY — existing publishable/anon key (public client configuration).
- SUPABASE_SERVICE_ROLE_KEY — production server secret only, for owner-authorized account creation. Never prefix it NEXT_PUBLIC or place it in source files.
- OPENAI_API_KEY / OPENAI_MODEL — optional AI organization; no key is required for ordinary project/client work.

Apply migrations in order: 20260907_studio.sql, 20260920_project_files.sql, 20261022_portal_collaboration.sql. The first two were already present; the collaboration migration was applied successfully to the existing live project on 22 October 2026. Do not rerun applied migrations blindly.

Set Supabase Auth Site URL to https://dilawarali.com and allow https://dilawarali.com/portal (and localhost /portal for development) for password recovery. Password email delivery depends on configured Supabase email service/SMTP; test real delivery before onboarding clients at scale.

## Local studio preservation

The standalone **studio-portal/** retains its existing records, accounts and encrypted WhatsApp vault at **D:\ai work\renderline-website\studio-portal**. Its local URL remains http://127.0.0.1:4173. The website launcher starts both tools; the public website's portal uses Supabase. These stores are separate; no client records were silently migrated.

Keep studio-portal/data and backups private and excluded from Git/deployment. Preserve the WhatsApp vault with its matching encryption key. WhatsApp automatic capture in the local tool is separate from the hosted client portal.

## Validation

Run npm test and npm run build in next-app. Database tests exercise real PostgreSQL-compatible role/row policies, invoice arithmetic, client uploads, project isolation, author forgery, exact-file approval, duplicate approval and access revocation. Run npm test in studio-portal for its isolated local regression suite. Browser QA checks navigation, recovery entry, gallery keyboard navigation and mobile resizing. Live owner/client sign-in, email recovery delivery and end-to-end upload/download still need live acceptance verification after the new code is deployed.
