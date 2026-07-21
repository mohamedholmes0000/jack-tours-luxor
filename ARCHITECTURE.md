# Architecture

## Application shape

```text
Browser
  ├─ Public App Router pages ──> lib/data/public.ts + lib/data/settings.ts
  │                                ├─ Prisma/PostgreSQL when configured
  │                                └─ lib/content.ts fallback when unavailable
  └─ Admin pages ──> NextAuth middleware + role checks ──> /api/admin/* ──> Prisma
                                                        └─ revalidatePath()

Public forms ──> POST /api/inquiries ──> Inquiry table
Admin image upload ──> Cloudinary when configured / local public/uploads fallback
```

## Folder organization

| Folder | Contents |
| --- | --- |
| `app/` | Route segments, layouts, route handlers, robots and sitemap |
| `app/(admin)/admin/` | Admin pages grouped without changing `/admin` paths |
| `app/api/admin/` | Content, settings, account, and upload route handlers |
| `components/` | Feature-oriented React components; admin, forms, home, layout, content, tours, destination, gallery, shared |
| `lib/` | Framework-independent helpers plus data-access/auth/storage modules |
| `prisma/` | Schema, seed, and migrations |
| `public/` | Static photos and local development uploads |
| `types/` | NextAuth type augmentation |

## App Router structure

- The root `app/layout.tsx` loads fonts, metadata defaults, global CSS, and `SiteChrome`.
- Public routes include `/`, `/tours`, `/activities`, `/hotels`, `/destinations`, `/blog`, `/gallery`, `/faq`, `/about`, `/contact`, and `/trip-planner`, plus slug detail routes.
- `app/(admin)/admin/layout.tsx` applies the admin shell to protected management pages.
- `proxy.ts` protects `/admin/*` except the login route.
- Route handlers live under `app/api/`; there is no pages-router API directory.

## Components and rendering

Components are organized by page/domain rather than a single design-system folder. Shared public chrome is in `components/layout/`, form controls in `components/forms/`, and reusable public presentation in `components/shared/`.

Server pages fetch data and pass serializable values to client-interactive listing, form, gallery, and admin components. React Hook Form is used for form state; no Redux, Zustand, React Query, or other global client state library is present.

## Data layer and Prisma

`lib/prisma.ts` creates the Prisma client. `lib/data/safe-db.ts` defines the public database guard:

- It treats a missing URL or the sample localhost URL as “no configured database.”
- `tryDatabase(operation, fallback)` catches database errors and returns fallback data.

`lib/data/public.ts` maps Prisma records to public presentation types and reads only published/active public records. It deliberately falls back to static tours, destinations, blogs, FAQs, and gallery content. Activities and hotels use no static fallback catalog.

`lib/data/admin.ts` supplies management views and summaries. Settings reads/mapping are split between `lib/data/settings.ts` and `lib/homepage-settings.ts`.

## Authentication and authorization

NextAuth Credentials authentication in `lib/auth.ts` verifies bcrypt hashes from `AdminUser`, stores role/active state in the JWT, and exposes the values through the session type augmentation.

Authorization is layered:

1. `proxy.ts` protects admin page navigation with `withAuth`.
2. `lib/admin/permissions.ts` maps URL paths and role capabilities.
3. `requireAdminApi()` in `lib/api/admin-guard.ts` authorizes server-side write routes.

This layering must be retained for new admin resources: add page-path mapping, write permission behavior, and API guards together.

## Admin and API routes

Admin CRUD is implemented for tours (also activities/hotels through `contentType`), destinations, blog posts, FAQs, gallery albums/categories/images, homepage data, contact-page settings, header/footer settings, global settings, profile, and users. Inquiries have management controls for status and deletion.

Admin APIs parse/validate inputs with schemas in `lib/validations.ts`. Content/settings updates generally call `revalidatePath()` so public pages update after CMS writes. New write APIs should follow the same sequence: authenticate/authorize, parse, persist, then revalidate relevant routes.

## Image pipeline

1. Admin upload routes check role permission.
2. `uploadAdminImage()` restricts MIME type to JPEG/PNG/WebP and size to 5 MB.
3. Cloudinary is used when fully configured; otherwise files are placed under `public/uploads`.
4. Local upload route handlers validate folder/file segments and only serve supported image extensions.
5. `lib/images.ts` ensures stored image values are allowed local paths or trusted remote hosts before public rendering.

Local storage is a development fallback. Hostinger is the production target, and production requires Cloudinary for durable user-uploaded media across builds and releases.

## SEO and deployment architecture

The root layout produces global metadata from public settings. Individual pages define their own metadata as needed. `app/robots.ts` and `app/sitemap.ts` expose crawl metadata. JSON-LD helpers cover organization, FAQ, blog posts, and tours.

The intended deployed topology is Hostinger hosting the Next.js application/domain/email, Neon PostgreSQL providing the production database, Cloudinary storing production media, and GitHub carrying reviewed source. No automated deployment pipeline, CI workflow, or Hostinger configuration file is checked into this repository.
