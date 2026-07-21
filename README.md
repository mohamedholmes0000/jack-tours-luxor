# Jack Egypt Tour MVP

Premium MVP website and admin CMS for Jack Egypt Tour, built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and NextAuth.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env
```

3. Fill in `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXTAUTH_SECRET="generate-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="201096586292"
```

`NEXTAUTH_SECRET` is required for admin sessions in production. Generate a strong value before deploying.
It is also required in local development because the admin middleware protects `/admin/*`
routes with NextAuth JWT sessions. Set the same variable in the Hostinger production environment before using the Admin CMS.

Generate a strong local value with:

```bash
openssl rand -base64 32
```

4. Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Database Setup

The public website can build and run with static fallback content when no real database is configured. Admin saves and persisted inquiries require the production Neon PostgreSQL database.

A complete Prisma baseline is tracked at `prisma/migrations/0_init/migration.sql`. It was tested against a blank PostgreSQL 18 database, and production has already registered `0_init` as applied.

For a new blank local or disposable test database only:

```bash
npx prisma migrate deploy
```

The seed is development/bootstrap data and changes CMS records and the initial admin account. Run it only on a disposable local database after reviewing `prisma/seed.ts`:

```bash
npm run prisma:seed
```

`npm run prisma:migrate` uses `prisma migrate dev` and `npm run db:setup` also runs the seed. Both are local-development commands and must never be used against production.

Do not run `migrate resolve` again on production, do not use `db push` on production, and do not seed production. Future schema changes require a reviewed migration, a fresh backup, testing on an isolated branch/database, and an approved `prisma migrate deploy` step.

## Admin CMS

Admin URL:

```txt
/admin/login
```

Current MVP admin supports:

- Dashboard metrics
- Tours CRUD
- Inquiries status management
- Blog CRUD
- FAQ management
- Gallery image URL management
- Site settings

Admin API routes are protected by session/auth.

## Environment Variables

- `DATABASE_URL`: Neon PostgreSQL connection string for production; use a separate local/disposable PostgreSQL database for development and migration testing.
- `NEXTAUTH_SECRET`: required locally and in the Hostinger production environment for NextAuth admin sessions and protected admin routes.
- `NEXTAUTH_URL`: deployed app URL, for example `https://example.com`.
- `NEXT_PUBLIC_SITE_URL`: public canonical site URL used by metadata, robots, and sitemap.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: WhatsApp number used by public CTAs.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: required for durable production uploads.

No secrets should be committed. `.env*` is ignored except `.env.example`.

## Deployment Recommendation

Current production direction:

- Hostinger for the Next.js application, domain, DNS, and email
- Neon PostgreSQL for production data
- Cloudinary for durable production uploads
- GitHub `main` as the reviewed source branch

Use a Hostinger plan that supports the Node.js version required by Next.js 16, environment variables, `npm run build`, and a persistent `npm run start` process. Avoid a VPS unless the managed Hostinger application runtime cannot satisfy those requirements.

## Production Checklist

1. Confirm `main` is clean, reviewed, and pushed to GitHub.
2. Confirm the Hostinger runtime supports the required Node.js and Next.js versions.
3. Set `DATABASE_URL` for the existing Neon PostgreSQL production database.
4. Set `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL`, and `NEXT_PUBLIC_WHATSAPP_NUMBER` in Hostinger.
5. Configure all three Cloudinary variables before enabling admin uploads.
6. Do not rerun `0_init`, `migrate resolve`, `db push`, or the seed on production.
7. Build and start the application through the approved Hostinger workflow.
8. Log into `/admin/login` and confirm the production admin credential is not the seed/default credential.
9. Verify public pages, WhatsApp CTAs, admin saves, uploads, and all inquiry forms end to end.

## Verification Commands

```bash
npm run lint
npx tsc --noEmit --pretty false
npm run build
npx prisma validate
```

## Fallback Behavior

If `DATABASE_URL` is missing, set to the local placeholder, or unavailable, public pages fall back to static seed-aligned content from `lib/content.ts`. Forms still open WhatsApp even if database persistence fails.
