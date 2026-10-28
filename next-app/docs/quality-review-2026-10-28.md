# RenderLine website quality review - 28 October 2026

## Implemented
- Continued the approved black/gold Apple-inspired design across shared controls, estimator, rate disclosures, FAQs, service timelines, project guide and media viewer. A single hero and thin footer remain.
- Kept two-column mobile image galleries, with separate responsive video grids. Corrected mobile film-card clipping and the portfolio detail service handoff.
- Added image-failure states and accessible guide stage navigation, focus movement and retained values. Floating contact hides at the footer and while an image dialog is open.
- Removed 10 unreachable legacy component/style files, an empty fix script, 141 obsolete selector arms, unused alternate hero construction and three unused web-font packages. Installed skills and unrelated studio-portal material were not removed.
- Centralized public canonical/share metadata. Added a generated 1200x630 social image, branded icon, service/breadcrumb/studio structured data, public portfolio sitemap entries and visible pricing explanations.
- Kept private routes out of indexing, added private API no-store behavior, browser framing/type/referrer/permissions protections and a limited CSP for base URLs, object embedding and ancestors.
- Hardened bearer parsing and authorization availability errors; owner authorization remains enforced on privileged API handlers. Added bounded streamed JSON parsing and safe errors, validated account/input sizes and exact YouTube host/identifier handling. Legacy admin video previews now create DOM nodes instead of interpolating URL fragments into HTML.
- Added a repeatable release verification command: npm run verify:release -- http://127.0.0.1:3111

## Verification
- Production build and TypeScript: pass.
- Full project ESLint: pass, no warnings.
- Unit/database tests: 26 pass. Includes real local PostgreSQL RLS checks for project isolation, client/team permissions, forged author IDs, revoked access, file uploads and exact-file approvals; bounded JSON and unsafe video URL regressions are covered.
- HTTP/SEO/auth integration checks: 28 pass across 17 public routes, protected APIs, private indexing headers, 308 path/query preservation, structured data, generated image and portfolio sitemap.
- Production dependency audit: zero reported vulnerabilities at the time checked.
- Source credential scanner: no privileged credential findings in 191 scanned source files.
- Responsive/browser review: 320px and 390px mobile, 1440px desktop, dark/light themes, dialog arrows/Escape/focus return, menu focus wrapping, guide value retention, calculator and FAQ behavior.
- Earlier 453-second local stability probe: 540 successful requests, zero failures, median 4ms / p95 9ms server responses. This measures localhost HTTP response time, not field Core Web Vitals or real-user page loading.
- Built CSS totals: 167077 raw / 32047 gzip bytes versus 185685 / 35535 before this pass; no remaining font-face rules. Totals span all built CSS chunks rather than one page's critical transfer.

## Scope and deployment
These changes are local on the design branch and have not been pushed or deployed. Existing production data/accounts were not modified during this review. Live authenticated client/owner write flows and current production database policy state were not re-exercised; RLS verification used the repository migrations in local PostgreSQL. Hosting-level MFA, WAF/rate limits and backup configuration were not changed. The CSP intentionally does not impose a new script-src policy on the existing inline/legacy CMS and consented analytics. Structured data and clear content support discovery; no ranking, AI citation or rich-result guarantee is made.
