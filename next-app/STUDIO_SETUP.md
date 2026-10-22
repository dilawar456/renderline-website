# RenderLine Studio setup status — 2026-09-21

## Applied to live Supabase

User chose the existing `website` project (`ywqtjgtqwbylkgofogxe`); no organization/account transfer is now required. Both SQL migrations in `supabase/migrations` were applied through its SQL editor and returned Success. The existing auth account `inforenderline@gmail.com` was assigned the owner profile. No auth password was changed.

## Application

Code is local and not deployed. Production preview runs with `npm run start -- --port 3100` after `npm run build`. `/portal` is the workspace and `/admin.html` is the legacy website editor. The owner can log in using their existing website authentication credentials (Supabase dashboard login is separate).

Owner workflow: create project; add client and team accounts; assign members; paste WhatsApp notes into Inbox; save and organize; review draft; approve shared brief/tasks; publish client updates/files; create and publish invoices. Team members only see assigned projects, can update their assigned task statuses and add internal progress updates. Clients see their project brief, stage, published updates/files and published invoices.

WhatsApp currently uses manual copy/paste, not automatic synchronization. AI reads pasted text, not uploaded attachments or linked documents. Invoice PDF is browser Print / Save as PDF; no payment gateway or automatic email is enabled.

## Remaining configuration

Existing public Supabase URL and anon key are in `.env.local`. Add these secrets only to server environment settings, never public variables or chat:

- `SUPABASE_SERVICE_ROLE_KEY`: needed for owner-created team/client accounts.
- `OPENAI_API_KEY`: needed for AI organization.
- `OPENAI_MODEL`: optional; defaults to `gpt-4.1-mini`.

Owner enters their actual Meta Pixel / Google tag / Ads conversion IDs in portal Tracking. Tracking is disabled by default and public-site analytics require visitor consent.

Before deployment: configure server secrets, verify owner login, exercise authenticated project/invoice/upload flows, confirm destination hosting. Existing legacy `clients`, `projects`, `project_updates`, `page_views`, and `testimonials` tables were inventoried but not migrated into new studio tables. Inspect their existing data/security before making changes. Public data snapshot in ignored work folder is not a complete database/auth/storage backup.

## Validation

Latest production build passed with 13 routes. Database regression test (`node --test tests/studio.test.mjs`) passes against PostgreSQL-compatible PGlite, covering role isolation, private notes/files, invoice calculations and legacy CMS write guards. Admin inline JavaScript parses. ESLint has no errors and six existing/performance-navigation warnings. No authenticated end-to-end test or deployment has been completed.
