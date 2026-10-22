# RenderLine website and client portal

The maintained website is the Next.js application in **next-app/**. Double-click **Start RenderLine Website.cmd** for local use, or run `npm install` then `npm run dev` inside next-app.

The public navigation contains Home, Services, Portfolio, Contact and Portal. The retired /projects page redirects to /portfolio. Private client projects remain inside /portal.

The production portal uses the existing Supabase project with invited owner/team/client identities, database row-level permissions and private file storage. It does not redirect clients to a PC's localhost. The separate **studio-portal/** application retains its existing local records and integrations; it remains a local tool and is not deployed by the Next.js app.

See **next-app/PORTAL_ATTACHMENT.md** for configuration, verification and limitations. Keep all .env files, studio private data and recovery archives out of Git.
