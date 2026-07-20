# Deployment Guide

## Intended production topology

| Service | Role |
| --- | --- |
| GitHub | Source repository and change history |
| Vercel | Next.js build and hosting target |
| Neon or equivalent managed PostgreSQL | Prisma database |
| Cloudinary | Durable admin-uploaded images |
| Domain/DNS provider | Custom domain and DNS; the existing README mentions Hostinger as a suitable DNS/email provider, not as the app host |

## GitHub workflow

No GitHub Actions workflow is present. Recommended release discipline based on the current repository:

1. Work in a focused branch and keep unrelated working-tree changes out of the release.
2. Review `git diff` and run lint, TypeScript, build, and Prisma validation locally.
3. Push the reviewed branch and merge through the repository’s chosen GitHub review process.
4. Let the linked Vercel project build the resulting commit, or deploy intentionally with the Vercel CLI.

## Vercel setup

1. Import/link the GitHub repository in Vercel.
2. Set the production environment variables below.
3. Configure the production custom domain and update `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS URL.
4. Ensure the production database is reachable from Vercel.
5. Configure Cloudinary before allowing production admin uploads.
6. Deploy and complete the production checklist.

Typical optional CLI commands after authenticating and linking the correct project:

```powershell
npx vercel link
npx vercel
npx vercel --prod
```

## Environment variables

| Variable | Production requirement |
| --- | --- |
| `DATABASE_URL` | Required. Use the connection URL appropriate to the managed PostgreSQL provider and Prisma runtime. |
| `NEXTAUTH_SECRET` | Required. Strong, random, stable secret; changing it invalidates existing sessions. |
| `NEXTAUTH_URL` | Required. Canonical production HTTPS origin. |
| `NEXT_PUBLIC_SITE_URL` | Required. Canonical production HTTPS origin for metadata, robots, sitemap, and JSON-LD URLs. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Required for correct default CTA routing. |
| `CLOUDINARY_CLOUD_NAME` | Required for production uploads. |
| `CLOUDINARY_API_KEY` | Required for production uploads. |
| `CLOUDINARY_API_SECRET` | Required for production uploads. Keep secret. |

Do not commit values to Git. Set Preview and Production values intentionally; preview environments should not accidentally write to production data unless that is an explicit controlled choice.

## Prisma and database safety

The current repository does not include a complete initial Prisma migration. Only two additive migration folders are tracked. As a result:

- Do **not** run `prisma migrate dev` or `prisma migrate deploy` on a blank production database assuming it will create all tables.
- Do **not** use `prisma db push` casually on production as a workaround; it can bypass reviewed migration history.
- First establish a reviewed initial migration baseline or recover the authoritative migration history/database schema from the production database owner.
- Back up the database, apply and verify schema changes in staging/disposable data first, then use a reviewed production migration command.

After schema is safely established, run the seed only after reviewing its upserts and initial-admin behavior. Change the initial admin credential immediately.

## Cloudinary

The app writes Cloudinary assets to folders beginning `jack-tours/`. Uploads are restricted to JPEG, PNG, and WebP, 5 MB maximum. If Cloudinary is absent, the code can write to local `public/uploads`, but that storage is not durable on Vercel. Homepage uploads explicitly return an error on Vercel if Cloudinary is unavailable.

## Safe deployment steps

1. Confirm clean/reviewed source state and no accidental `.env` or generated files.
2. Run:

   ```powershell
   npm run lint
   npx tsc --noEmit --pretty false
   npm run build
   npx prisma validate
   ```

3. Verify Vercel environment variables and production integrations.
4. Take a database backup and use the reviewed migration plan.
5. Deploy to a preview first when possible.
6. Verify public pages, sitemap, robots, metadata, WhatsApp links, desktop/mobile navigation, and image delivery.
7. Sign in to `/admin/login`; verify role restrictions, save/revalidation, Cloudinary upload, and inquiry status changes.
8. Submit contact, planner, tour, and hotel leads; verify database records and the human follow-up process.
9. Promote to production only after the above checks pass.

## Rollback recommendations

- Keep the previous Vercel deployment available and promote/redeploy it if an application release fails.
- Treat database rollback separately: restore from backup or use an explicit forward-fix migration. Do not assume rolling back code safely rolls back a changed schema.
- Do not delete Cloudinary assets as part of a code rollback unless their references are understood.
- If authentication configuration was changed, restore the known-good secret/URL values carefully; users may need to sign in again.

## Common deployment mistakes

- Deploying without `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, or canonical site URL.
- Expecting a blank database to initialize from the current tracked migration folders.
- Using local upload fallback in Vercel instead of configuring Cloudinary.
- Leaving seed/default admin access unchanged.
- Verifying only public pages, while not testing admin saves and persisted inquiries against the production database.
- Treating a WhatsApp CTA as proof of email/CRM notification; no such notification integration exists in the codebase.
