# Project Status

Last repository inspection: 2026-07-21. The Prisma baseline is committed at `36097d0`, pushed to `main`, tested on blank PostgreSQL 18 and schema-audit databases, and registered as applied on production. This does not claim the Hostinger application runtime or all production integrations are configured and live.

## Completed features

- Public pages exist for home, tours, activities, hotels, destinations, blog, gallery albums, FAQ, About, Contact, and Trip Planner.
- Tour, activity, and hotel content share a typed catalog model and have detail/listing experiences.
- Protected admin area exists for dashboard, tours, activities, hotels, destinations, blog, FAQs, inquiries, gallery albums/categories, homepage, contact page, global settings, header/footer settings, profile, and users.
- Credentials authentication, JWT sessions, roles, route middleware, and API-level write checks are implemented.
- Public content has a static fallback path for unavailable/unconfigured database access.
- Inquiry records can be validated and stored in PostgreSQL.
- Cloudinary uploads with a local development fallback are implemented.
- Metadata, robots, sitemap, organization JSON-LD, FAQ JSON-LD, blog JSON-LD, and tour JSON-LD are implemented.

## Area status

| Area | Status | Evidence |
| --- | --- | --- |
| Homepage | Implemented | Editable multi-section homepage with hero slider, searches, destination carousel, featured tabs, content sections, and CTAs. |
| Admin | Implemented, database-dependent | Role-based screens and protected CRUD routes exist. |
| Booking | Inquiry-oriented | Forms and WhatsApp capture interest; no online payment, stock, or confirmed booking workflow. |
| Inquiries | Implemented, database-dependent | `POST /api/inquiries` writes `Inquiry`; admin lists, changes status, and can delete. |
| Uploads | Implemented | Cloudinary is preferred; local disk fallback is development-only in practice. |
| SEO | Baseline implemented | Page metadata, sitemap/robots, and selected schema.org JSON-LD exist. |
| Performance | Baseline only | Next/Image remote host configuration and font display settings exist; no measured performance budget or monitoring was found. |

## Production readiness

`npx prisma validate` and `npm run build` pass on commit `36097d0`. Source lint also passes; `eslint.config.mjs` now excludes only the generated `.codex-browser-check/**` artifact so real project lint errors remain visible.

The complete `0_init` migration baseline is committed and was tested on a blank PostgreSQL 18 database. The existing Neon production database has `0_init` registered as applied without executing baseline SQL or changing application row counts.

Launch readiness still depends on verified Hostinger runtime/environment configuration, Cloudinary, production authentication, and end-to-end checks of admin saves and inquiries.

## Launch blockers

1. **Hostinger runtime and environment are external state.** Confirm the selected plan supports the required Node.js/Next.js runtime, build/start commands, HTTPS domain, and all required environment variables.
2. **Production integrations need end-to-end verification.** Neon PostgreSQL is the production database and the baseline is registered, but admin authentication, persisted inquiries, and Cloudinary uploads still need verification through the deployed application.
3. **No delivery workflow for new inquiries.** Leads are stored in PostgreSQL and reviewed in admin, but no email/CRM notification integration exists.
4. **Initial admin access needs production hardening.** Do not use the seed/default credential in production.

## Technical debt and pending improvements

- Keep every future Prisma schema change in a reviewed migration, test it on an isolated database, back up production, and use only the approved production migration procedure.
- Add automated test coverage and CI; no test directory or GitHub Actions workflow was found.
- Add error monitoring, uptime monitoring, and performance measurement.
- Define an operational path for inquiry notification and response ownership.
- Review the fallback strategy so database outages are observable to operators while public pages remain graceful.
- Decide whether external booking/payment/availability functionality is required; it is not implemented today.

## Known bugs / risks

- Production must use Cloudinary for durable uploads; the local `public/uploads` fallback is development-only and should not be relied on across Hostinger builds or releases.
- The seed upserts CMS records and an initial admin account. It is not an approved production data-loading command.
- Public fallback content can keep pages visible while database-backed admin saves and inquiries fail; operational verification must include those write paths.
- `.codex-browser-check/` is a generated browser-testing artifact. ESLint ignores that folder only; application source remains linted.

## Current priorities

1. Configure and verify the Hostinger Node.js runtime and production environment variables.
2. Verify Neon-backed admin login, CMS writes, and inquiry persistence through the deployed application.
3. Configure and test Cloudinary production uploads.
4. Confirm the production admin credential is unique and not seed-derived.
5. Enter final catalog/CMS content and test every inquiry route through the staff response process.
