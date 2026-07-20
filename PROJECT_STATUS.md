# Project Status

Last repository inspection: 2026-07-19. This status describes the checked-out working tree, including existing uncommitted presentation/content-polish changes. It does not claim production services are configured or live.

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

The application passed the repository's previously recorded checks during the current workspace session: lint, TypeScript no-emit check, production build, and Prisma schema validation. Public routes were also loaded locally in Chrome with successful HTTP responses.

This does **not** establish launch readiness. A production launch still depends on a real PostgreSQL database, valid authentication secrets/URLs, Cloudinary configuration for uploads, production content, and end-to-end verification against those services.

## Launch blockers

1. **Fresh database migration path is incomplete in the repository.** Only additive migrations for `Destination.type/subtitle` and `Tour.contentType` are tracked; no initial migration that creates the base tables is present. Do not run the documented migration commands against a blank production database without first resolving this deliberately and safely.
2. **Production services cannot be verified from the repository.** Database, Vercel project, domain/DNS, Cloudinary account, and environment-variable configuration are external state.
3. **No delivery workflow for new inquiries.** Leads are stored in the database and can be reviewed in admin, but no email/CRM notification integration exists.
4. **Initial admin access needs production hardening.** The seed creates an initial admin user; review/reset it before production use.

## Technical debt and pending improvements

- Create and review a complete migration baseline, then document an unambiguous production migration procedure.
- Add automated test coverage and CI; no test directory or GitHub Actions workflow was found.
- Add error monitoring, uptime monitoring, and performance measurement.
- Define an operational path for inquiry notification and response ownership.
- Review the fallback strategy so database outages are observable to operators while public pages remain graceful.
- Decide whether external booking/payment/availability functionality is required; it is not implemented today.

## Known bugs / risks

- Fresh-environment Prisma migration instructions in `README.md` cannot be assumed to work from the tracked migrations alone because the initial migration is absent.
- Local image uploads are ephemeral on Vercel; homepage upload code explicitly requires Cloudinary there, and all production uploads should use Cloudinary.
- The checkout currently has pre-existing uncommitted UI/content-polish changes in seven application files. They are not part of the last commit and should be reviewed/committed separately.
- `.codex-browser-check/` is an untracked local browser-check artifact created during inspection; it is not application code.

## Current priorities

1. Preserve/review the existing uncommitted UI and content changes.
2. Make the database bootstrap/migration history safe for a blank environment.
3. Configure and verify production environment variables, Neon/PostgreSQL, Cloudinary, and the admin login.
4. Enter and publish real catalog and CMS content.
5. Test every inquiry route through to the staff response process.
