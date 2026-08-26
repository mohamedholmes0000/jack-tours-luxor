# Jack Luxor Tour — Permanent AI Context

## Project overview

Jack Luxor Tour is a premium, English-language travel website and lightweight CMS for private Egypt trips. It presents tours, activities, hotels, destinations, gallery albums, editorial content, and trip-planning/contact entry points. The repository is a Next.js application with an authenticated admin area and PostgreSQL-backed content when a database is configured.

The public site deliberately remains usable without a configured or reachable database by using static fallback content in `lib/content.ts`. Admin writes and persisted inquiries require PostgreSQL.

## Business goals and audience

| Area | Current intent |
| --- | --- |
| Business goal | Turn interest in private Egypt travel into qualified inquiries and WhatsApp conversations, while giving the operator an internal content-management surface. |
| Core offering | Private tours, activities, hotels, tailor-made itineraries, destination guidance, and DMC-style local support. |
| Audience | International travelers planning Egypt trips, especially travelers wanting curated or private experiences. |
| Primary conversion | Trip Planner, tour/hotel inquiry forms, contact form, and WhatsApp CTAs. |

## Technology stack

| Layer | Implementation |
| --- | --- |
| Framework | Next.js 16.2.7 App Router with React 19 and TypeScript |
| Styling | Tailwind CSS 4 plus `app/globals.css` design tokens and component classes |
| Database | PostgreSQL through Prisma 6 |
| Authentication | NextAuth v4 credentials provider with JWT sessions |
| Forms and validation | React Hook Form, Zod, and `@hookform/resolvers` |
| Media | Cloudinary when configured; local `public/uploads` fallback for development |
| Icons | `lucide-react` |

## Repository map

| Path | Responsibility |
| --- | --- |
| `app/` | Public pages, admin route group, route handlers, global layout, SEO endpoints |
| `app/(admin)/admin/` | Protected admin screens; the route group does not change the `/admin` URL |
| `app/api/` | Inquiry, auth, admin CRUD, upload, and local-upload handlers |
| `components/home/` | Homepage sections, hero slider, destination carousel, featured tabs |
| `components/forms/` | Contact, trip-planner, and tour inquiry forms |
| `components/admin/` | Admin forms, CMS editors, tables, side navigation, access notices |
| `components/content/`, `components/tours/`, `components/destinations/`, `components/gallery/` | Public listing/detail interactions |
| `components/layout/` | Navbar, mobile navigation, footer, shared site chrome |
| `lib/data/` | Safe public/admin reads and settings mapping |
| `lib/content.ts` | Static fallback seed-aligned public content and shared presentation types |
| `lib/auth.ts`, `proxy.ts`, `lib/api/admin-guard.ts` | Authentication, route protection, and API authorization |
| `lib/admin-upload.ts`, `lib/cloudinary.ts`, `lib/local-upload-response.ts` | Image validation, storage, and local image serving |
| `prisma/` | Prisma schema, seed script, and the migration files currently tracked |
| `public/photos/` | Bundled image assets; `public/uploads/` is the local upload fallback |

## Main architecture

Public pages are server-rendered App Router pages that call `lib/data/public.ts` and `lib/data/settings.ts`. Those functions use `tryDatabase()` and return static fallback content if `DATABASE_URL` is absent, is the placeholder URL, or the database request fails.

The admin UI calls protected `/api/admin/*` route handlers. Those routes validate payloads with Zod, enforce a role/resource/action check, write through Prisma, and generally call `revalidatePath()` for the affected public and admin pages.

There is no separate backend service, message queue, email provider, payment provider, or client-side global state library in this repository.

## Data and database overview

Prisma models cover:

- Admin users and roles: `AdminUser`, `AdminRole`.
- Main catalog: `Tour` with `ContentType` (`TOUR`, `ACTIVITY`, `HOTEL`) and `Destination` with `DestinationType`.
- Editorial/supporting content: `BlogPost`, `FAQ`, `Testimonial`.
- Lead capture: `Inquiry`.
- Gallery: `GalleryCategory`, `GalleryAlbum`, `GalleryImage`.
- CMS settings: `SiteSetting`, `HomepageSettings`, listing-page settings, About/Contact/Gallery/Trip Planner page settings, `GlobalSettings`, and `HeaderFooter`.

`prisma/migrations/0_init/migration.sql` is the complete initial migration baseline. It was tested on blank PostgreSQL 18 and registered as applied on the existing Neon production database. `prisma/seed.ts` upserts CMS content and an admin user; it is development/bootstrap data and must not be run on production.

## Authentication and admin architecture

- NextAuth uses an email/password credentials provider and bcrypt password comparison.
- Sessions use JWT strategy; `/admin/*` other than `/admin/login` is protected by `proxy.ts`.
- `lib/api/admin-guard.ts` repeats authorization in write APIs; UI protection is not the only guard.
- Roles are `SUPER_ADMIN`, `ADMIN`, `EDITOR`, and `VIEWER`.
- `SUPER_ADMIN` manages users. `ADMIN` has content access without user management. `EDITOR` can edit specified content but cannot delete. `VIEWER` is read-only.
- A hard-coded development-only admin fallback exists in `lib/auth.ts`; it is disabled when `NODE_ENV === "production"`.

## Public homepage architecture

`components/home/homepage.tsx` composes the homepage. Its editable content is primarily stored in the singleton `HomepageSettings` row, with customization-trip settings mapped through `SiteSetting` keys. The homepage editor exposes the configured sections including hero, destinations, featured content, Why Us, Our World, statistics, testimonials, and final CTA.

The homepage search panels submit URL query parameters to tours, activities, or hotels listings. They are discovery/filter inputs, not a booking engine.

## Forms, booking, and inquiries

- Contact, trip-planner, tour inquiry, and hotel availability forms collect lead data.
- Forms submit to `POST /api/inquiries`; successful persistence creates an `Inquiry` record.
- Date validation rejects past arrivals and departures that are not after arrivals.
- WhatsApp links are built in `lib/whatsapp.ts`; forms and CTAs use them as a direct contact path.
- There is no payment capture, availability inventory, reservation confirmation, email delivery, or external booking-provider integration.

## Image upload system

- Admin uploads accept JPEG, PNG, and WebP files up to 5 MB.
- If all Cloudinary environment variables exist, images go to `jack-tours/<folder>` in Cloudinary with automatic quality/format transformation.
- Without Cloudinary, uploads are written to `public/uploads/<folder>` and served by local upload route handlers.
- Production uploads must use Cloudinary. The homepage handler also contains a legacy platform-specific fallback rejection inherited from the implementation, but Hostinger is the production target.
- Trusted image sources are local allowed paths plus Unsplash, i.ibb.co, and Cloudinary; `lib/images.ts` enforces this for admin image sources.

## Design, responsive, and UX rules

- Design direction: restrained, editorial, luxury Egypt travel rather than a generic booking marketplace.
- Primary visual system is deep navy, gold, ivory/off-white, and gray tokens defined in `app/globals.css` and consumed as CSS variables such as `--color-navy` and `--color-gold`.
- Body font is DM Sans; expressive headings use Cormorant Garamond. Geist variables are also loaded.
- Preserve the mobile-first responsive intent: compact navigation, mobile menu behavior, horizontally practical listings/carousels, touch-sized controls, and no desktop-only interaction requirement.
- Prefer clear itineraries, trust cues, local-expert language, visible prices when present, and an easy path to WhatsApp or the planner. Do not imply confirmed availability or guaranteed bookings when the system only records an inquiry.

## Coding and safety conventions

- TypeScript path alias is `@/*`.
- Validate public/admin request payloads with Zod before persistence.
- Use safe data helpers instead of calling Prisma directly from public rendering code when fallback behavior is required.
- Keep server credentials in environment variables; `.env*` is ignored except `.env.example`.
- Revalidate relevant paths after admin updates.
- Preserve safe image-source validation and admin authorization for any new content or upload capability.
- This project uses a Next.js version with repository-specific rules: before editing application code, read the relevant guide under `node_modules/next/dist/docs/` as required by `AGENTS.md`.

## Deployment philosophy and production safety

- Production target: Hostinger for the Next.js app, domain, DNS, and email; Neon PostgreSQL for data; Cloudinary for durable media; GitHub for reviewed source delivery.
- Confirm the selected Hostinger plan supports the required Node.js version, environment variables, `npm run build`, and a persistent `npm run start` process. Avoid a VPS unless managed hosting cannot satisfy those requirements.
- Do not rely on local filesystem uploads in production; configure Cloudinary first.
- Do not expose or commit `DATABASE_URL`, `NEXTAUTH_SECRET`, or Cloudinary credentials.
- Set a unique strong `NEXTAUTH_SECRET`, production `NEXTAUTH_URL`, and canonical `NEXT_PUBLIC_SITE_URL` before deployment.
- Change/remove any seeded initial admin credential before granting production access.
- `0_init` is already registered on production. Do not rerun it, resolve it again, use `db push`, or run seed on production.
- Future migrations require a backup, isolated testing, review, and a separately approved `prisma migrate deploy` step.

## AI and Codex workflow

1. Read this file, `PROJECT_STATUS.md`, `ARCHITECTURE.md`, and `AGENTS.md` before changing behavior.
2. Check `git status --short`; this repository may contain intentional user changes. Do not overwrite or reset them.
3. Inspect the relevant route, component, validation schema, and Prisma model together before implementing a feature.
4. For Next.js changes, read the applicable local Next.js 16 documentation before writing code.
5. Keep authorization, input validation, fallback behavior, upload safety, and `revalidatePath()` coverage aligned with existing patterns.
6. Verify proportionally with `npm run lint`, `npx tsc --noEmit --pretty false`, `npm run build`, and `npx prisma validate`; exercise the affected browser flow when possible.
7. Never treat static fallback content as proof that database-backed admin writes work. Test with a configured database for CMS/inquiry changes.

## Files to modify cautiously

| File/path | Why it is sensitive |
| --- | --- |
| `prisma/schema.prisma` | Database contract for all CMS and inquiry data |
| `prisma/seed.ts` | Upserts baseline records and an initial admin user |
| `lib/data/safe-db.ts` | Controls public fallback behavior when the database is unavailable |
| `lib/auth.ts`, `proxy.ts`, `lib/api/admin-guard.ts`, `lib/admin/permissions.ts` | Authentication and authorization boundary |
| `lib/admin-upload.ts`, `lib/cloudinary.ts`, `lib/local-upload-response.ts`, `lib/images.ts` | Upload validation, storage, and path safety boundary |
| `app/globals.css` | Shared design tokens and cross-site responsive behavior |
| `lib/homepage-settings.ts` and `components/admin/homepage-editor.tsx` | Coupled homepage CMS data contract |

## Intentional constraints and known limitations

- Activities and hotels have no static fallback catalog; they remain empty until published database records exist.
- The safe database wrapper can keep public pages visible during a database outage, but it can also mask database failures from visitors; admin writes and inquiries will fail rather than silently succeed.
- Inquiry capture stores leads only. It does not send email notifications or create a reservation.
- No automated test suite, CI workflow, Hostinger deployment configuration, or deployment workflow file is checked into the repository.
- A complete `0_init` baseline is tracked and production has it registered as applied. Future migration safety still depends on backup, isolated testing, review, and controlled deployment.

## Forward roadmap suggested by the current codebase

These are gaps visible in the implementation, not committed business promises:

- Add production lead notification/CRM handling and an inquiry follow-up workflow.
- Add automated tests and CI before frequent production releases.
- Populate and operate activities, hotels, destinations, gallery albums, and editorial content through the CMS.
- Consider an actual availability/booking/payment integration only if the business requires confirmed online bookings.
