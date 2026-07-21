# Changelog

This is a repository-derived history, not a product release log. It summarizes the Git commits currently available on `main` and avoids claims that cannot be verified from those commits or the checked-out source.

## Major milestones

| Date | Repository evidence | Outcome |
| --- | --- | --- |
| 2026-06-07 | `b05c04c` — Initial MVP build | Initial application baseline. |
| 2026-06-08 to 2026-06-14 | Multiple luxury/mobile/homepage/tour commits | Public experience was iteratively redesigned around a mobile-first, luxury/editorial travel presentation. |
| 2026-06-10 | Image handling, gallery revalidation, local image system commits | Image handling and public/admin media behavior were developed. |
| 2026-06-12 | Tours/destinations redesign commits | Listing/filtering experiences and destination admin CRUD were added or redesigned. |
| 2026-06-13 to 2026-06-14 | Book Now, tour-detail, full CMS model commits | Trip-planner/WhatsApp flow, richer tour detail pages, and broader CMS models were introduced. |
| 2026-06-16 to 2026-06-18 | Admin users, homepage editor, Cloudinary, gallery album commits | Role-based user administration, editable homepage sections, Cloudinary with local fallback, and album-based gallery management were added. |
| 2026-06-20 to 2026-06-21 | Hero/header/mobile/featured-card commits | Cinematic hero/header behavior and mobile navigation/layout received focused refinement. |
| 2026-06-23 to 2026-07-11 | Content-type, admin reliability, upload, booking/launch commits | Activities/hotels, revalidation, settings consistency, uploads, and booking/inquiry readiness were iterated. |
| 2026-07-21 | `36097d0` — `chore: add prisma baseline migration` | Replaced the two incomplete additive migrations with the complete `prisma/migrations/0_init` baseline. |

## Important architectural decisions

- The app uses Next.js App Router, Prisma/PostgreSQL, NextAuth credentials/JWT, and a single repository rather than separate frontend/backend services.
- Public data reads use a graceful static fallback when the database is not configured or cannot be reached.
- Tours, activities, and hotels are modeled through one `Tour` table with a `contentType` discriminator.
- Gallery management is album-based with categories and multiple images per album.
- Admin authorization is role/resource based and enforced in both middleware and route handlers.
- Cloudinary is the preferred upload destination; local file upload is retained as a development fallback.

## Homepage redesign decisions

Git history explicitly records an “Editorial Cartouche” homepage redesign, later a cinematic hero/header integration, destination/carousel work, featured-tour positioning, Why Us revisions, and multiple mobile fixes. The current implementation reflects a premium/editorial direction with a hero slider, search panels, destination discovery, featured content tabs, Why Us, statistics, testimonials, and final CTA, much of which is editable from the homepage CMS.

## Admin improvements

The repository history shows additions for logout/profile, user management with roles, card-based tours/gallery administration, contact map/global/header/footer settings, homepage editor coverage, admin reliability, and content revalidation. Current code includes protected API routes for those areas.

## Booking and inquiry improvements

The history records a Book Now → Trip Planner → WhatsApp flow, a richer tour-detail booking presentation, activity/hotel detail pages, a hotel inquiry form, and final booking-flow/launch-readiness work. Current behavior remains lead/inquiry focused; no payment or reservation engine was introduced.

## Image upload improvements

History records a local image system, later migration of admin uploads to Cloudinary with local fallback, gallery multi-photo uploads, and homepage upload fixes. Current source validates types/sizes and supports Cloudinary; current production documentation requires Cloudinary for durable Hostinger uploads.

## Known design decisions

- Mobile presentation has been a repeated focus in the commit history.
- The visual direction favors deep navy, gold, serif editorial headings, large travel imagery, and local-expert messaging.
- The public experience prefers conversion to conversation/planning rather than pretending to offer instant confirmed inventory.

## Current direction

The latest committed change is `36097d0` (2026-07-21), `chore: add prisma baseline migration`. The repository now has a complete initial Prisma migration instead of the two superseded additive migrations. Current deployment direction is Hostinger for the Next.js app/domain/email, Neon PostgreSQL for production data, Cloudinary for uploads, and GitHub for reviewed source delivery.
