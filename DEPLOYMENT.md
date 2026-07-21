# Deployment Guide

## Intended production topology

| Service | Role |
| --- | --- |
| GitHub | Source repository and reviewed `main` branch |
| Hostinger | Next.js application runtime, domain, DNS, and email |
| Neon PostgreSQL | Production Prisma database |
| Cloudinary | Durable admin-uploaded images |

Avoid a VPS unless the managed Hostinger application runtime cannot support the required Node.js version, environment variables, `npm run build`, and a persistent `npm run start` process.

## GitHub workflow

No GitHub Actions workflow is present. Use this release discipline:

1. Work in a focused branch and keep unrelated changes out of the release.
2. Review the diff and run lint, TypeScript/build, and Prisma validation locally.
3. Merge or push the reviewed commit to GitHub `main`.
4. Deploy that exact commit through the approved Hostinger Git/Node.js workflow.
5. Never make production database commands an automatic side effect of an unreviewed application deployment.

## Hostinger setup

1. Select a Hostinger plan/runtime that supports the Node.js requirement for Next.js 16.
2. Connect or pull the GitHub repository through Hostinger's supported Git deployment workflow.
3. Configure `npm install`/`npm ci`, `npm run build`, and `npm run start` according to the Hostinger Node.js application controls.
4. Set all production environment variables in Hostinger; do not upload a tracked `.env` file.
5. Configure the canonical HTTPS domain and use it for `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL`.
6. Confirm the application can reach Neon and Cloudinary before public launch.

Hostinger dashboard capabilities vary by plan. If the selected managed plan cannot run this Next.js server persistently, stop and reassess the plan before considering a VPS.

## Environment variables

| Variable | Production requirement |
| --- | --- |
| `DATABASE_URL` | Required. Use the production Neon PostgreSQL connection URL intended for the application runtime. |
| `NEXTAUTH_SECRET` | Required. Strong, random, stable secret; changing it invalidates existing sessions. |
| `NEXTAUTH_URL` | Required. Canonical production HTTPS origin. |
| `NEXT_PUBLIC_SITE_URL` | Required. Canonical production HTTPS origin for metadata, robots, sitemap, and JSON-LD URLs. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Required for correct CTA routing. |
| `CLOUDINARY_CLOUD_NAME` | Required for production uploads. |
| `CLOUDINARY_API_KEY` | Required for production uploads. |
| `CLOUDINARY_API_SECRET` | Required for production uploads. Keep secret. |

Do not commit values to Git or expose them in logs. Development/test environments must not accidentally write to production Neon or Cloudinary resources.

## Prisma and database safety

The repository contains the complete baseline at `prisma/migrations/0_init/migration.sql`. It was generated from the current Prisma schema, tested successfully on a blank PostgreSQL 18 database, and committed as `36097d0`. The existing Neon production database has `0_init` registered as applied.

Production rules:

- Do not rerun `prisma migrate resolve --applied 0_init`.
- Do not run the `0_init` SQL against the existing production tables.
- Never use `prisma migrate dev`, `prisma db push`, `prisma migrate reset`, or any seed command on production.
- For a future schema change, create and review a new migration locally, back up production, test on an isolated Neon branch/database, and run `prisma migrate deploy` only as a separately approved production step.
- Application deployment must not silently run seed or mutation commands.

For a new blank local or disposable test database, `npx prisma migrate deploy` can apply `0_init`. Keep that database isolated from production.

## Cloudinary

Production uploads must use Cloudinary. The local `public/uploads` path is a development fallback and must not be treated as durable Hostinger storage across builds, restarts, or releases.

The upload code accepts JPEG, PNG, and WebP files up to 5 MB and writes Cloudinary assets below `jack-tours/`. The homepage upload handler also contains a legacy platform-specific fallback rejection inherited from the implementation; that condition does not change Hostinger as the production target or the requirement to configure Cloudinary.

## Safe deployment steps

1. Confirm the exact GitHub commit, clean source state, and absence of accidental secrets/generated files.
2. Run:

   ```powershell
   npm run lint
   npx tsc --noEmit --pretty false
   npm run build
   npx prisma validate
   ```

3. Verify Hostinger environment variables, Node.js runtime, build command, start command, and HTTPS domain.
4. Confirm the latest production database backup and review whether the release contains a new migration. Do not run a database command when no schema change exists.
5. Deploy the exact reviewed GitHub commit through Hostinger.
6. Verify public pages, sitemap, robots, metadata, WhatsApp links, navigation, and image delivery.
7. Sign in to `/admin/login`; verify role restrictions, CMS saves/revalidation, Cloudinary upload, and inquiry status changes.
8. Submit contact, planner, tour, and hotel leads; verify Neon records and the human follow-up process.
9. Keep the previous known-good application release available for rollback.

## Rollback recommendations

- Restore the previous known-good Hostinger application release or Git commit if the application release fails.
- Treat database rollback separately: restore from the verified backup or use an explicit reviewed forward-fix migration.
- Do not delete Cloudinary assets during a code rollback unless their references are understood.
- Restore authentication URL/secret configuration carefully; changing `NEXTAUTH_SECRET` invalidates sessions.

## Common deployment mistakes

- Deploying to a Hostinger plan that cannot persistently run the required Next.js/Node.js server.
- Deploying without `NEXTAUTH_SECRET`, canonical URLs, Neon `DATABASE_URL`, or Cloudinary credentials.
- Rerunning `0_init` or baseline registration on the existing production database.
- Running `migrate dev`, `db push`, `db setup`, or seed commands on production.
- Relying on local uploads instead of Cloudinary.
- Leaving seed/default admin access unchanged.
- Verifying only fallback-powered public pages while skipping admin saves and persisted inquiries.
- Treating a WhatsApp CTA as proof of email/CRM notification; no notification integration exists.
