# Developer Setup (Fresh Windows Installation)

## Required software

| Software | Recommended version / note |
| --- | --- |
| Git | Current stable Git for Windows |
| Node.js | Node 20 LTS or later compatible with Next.js 16; use the version required by your deployment platform where possible |
| npm | Bundled with Node.js; this repository has `package-lock.json` |
| VS Code | Current stable version |
| PostgreSQL | Local PostgreSQL 15+ for development; production uses Neon PostgreSQL |
| Cloudinary account | Required for durable production image uploads |
| Hostinger account/plan | Required for the production Next.js app, domain, DNS, and email; confirm managed Node.js support |

Recommended VS Code extensions: ESLint, Prisma, Tailwind CSS IntelliSense, EditorConfig (if adopted later), and GitLens (optional).

## Clone and install

```powershell
git clone https://github.com/mohamedholmes0000/jack-tours-luxor.git
cd jack-tours-luxor
npm install
```

On Windows systems where PowerShell blocks `npm.ps1`, use `npm.cmd` instead:

```powershell
npm.cmd install
```

## Environment variables

Copy `.env.example` to `.env` and set these values. Do not commit `.env`.

| Variable | Required locally | Required in production | Purpose |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes for persistent admin/content/inquiries | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Yes | Signs NextAuth JWT sessions |
| `NEXTAUTH_URL` | Yes | Yes | Base URL for NextAuth; local value is `http://localhost:3000` |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Yes | Canonical public URL used by metadata, sitemap, and robots |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Recommended | Yes | Default public WhatsApp CTA number |
| `CLOUDINARY_CLOUD_NAME` | Optional | Yes for uploads | Cloudinary account name |
| `CLOUDINARY_API_KEY` | Optional | Yes for uploads | Cloudinary credential |
| `CLOUDINARY_API_SECRET` | Optional | Yes for uploads | Cloudinary secret |

Generate a strong local authentication secret, for example:

```powershell
openssl rand -base64 32
```

If OpenSSL is unavailable, generate an equivalently strong random secret with a trusted local secret-management tool.

## Database setup — Prisma baseline

The complete baseline migration is tracked at `prisma/migrations/0_init/migration.sql`. It was tested successfully on a blank PostgreSQL 18 database. Production uses Neon PostgreSQL and already has `0_init` registered as applied.

For a new blank local or disposable development database:

```powershell
npx prisma migrate deploy
```

The seed is optional development/bootstrap data. Review `prisma/seed.ts` first and run it only against a disposable local database:

```powershell
npm run prisma:seed
```

Command boundaries:

- `npm run prisma:migrate` invokes `prisma migrate dev`. Use it only to author migrations against a local/disposable development database.
- `npm run db:setup` also runs the seed. It is local-only and must never target production.
- `prisma db push` is not part of the production workflow.
- Never rerun `0_init` or `migrate resolve` on the existing Neon production database.
- Future production migrations require a backup, isolated testing, review, and a separately approved `prisma migrate deploy` step.

Useful safe local commands:

```powershell
npm run prisma:generate
npx prisma validate
npm run prisma:studio
```

## Day-to-day commands

```powershell
npm run dev
npm run lint
npx tsc --noEmit --pretty false
npm run build
npm run start
```

`npm run dev` and `npm run build` run `prisma generate` first. Development site URL: `http://localhost:3000`. Admin login URL: `http://localhost:3000/admin/login`.

Do not carry the seed admin credential into production. Reset it after database setup and use normal user-management controls thereafter.

## Deployment commands

The production target is Hostinger, with Neon PostgreSQL and Cloudinary. This repository contains no generic deployment script because the exact Git/build/start controls depend on the selected Hostinger plan.

Configure the Hostinger application to install dependencies, run `npm run build`, and start with `npm run start`. Set production environment variables in Hostinger rather than committing an `.env` file. Do not attach migration, seed, or database setup commands to the application deployment.

Avoid a VPS unless the managed Hostinger runtime cannot support the required Next.js 16 Node.js process.

## Git workflow

1. Start by checking `git status --short` and preserve any existing user changes.
2. Create a focused branch, conventionally `codex/<short-description>` for Codex-created work.
3. Make one scoped change at a time.
4. Run lint, TypeScript, build, and relevant browser checks before committing.
5. Do not commit `.env`, generated `.next`, `node_modules`, logs, or local browser artifacts.

After a Windows reinstall, Git may report “dubious ownership.” For this repository only, use:

```powershell
git config --global --add safe.directory "G:/jack tours luxor"
```

Run that only when the path is your intended trusted working copy.

## Troubleshooting

| Symptom | Likely cause and action |
| --- | --- |
| `npm` is blocked by PowerShell execution policy | Run `npm.cmd` / `npx.cmd`, or repair the execution policy according to your organization’s policy. |
| Public site shows fallback content | `DATABASE_URL` is missing, equals the placeholder, or database access failed. Check server logs and database connectivity. |
| Admin cannot save / inquiries return 503 | Database is unavailable or unconfigured; public fallback does not make writes work. |
| Admin login loops to login | Set `NEXTAUTH_SECRET` and correct `NEXTAUTH_URL`; ensure the admin user exists and is active. |
| Uploads fail in production | Set all three Cloudinary variables. The local filesystem fallback is development-only and must not be treated as durable Hostinger storage. |
| Images fall back to Karnak image | The image source is not an allowed local path or one of the trusted remote hosts in `lib/images.ts`. |
| Fresh local migration fails | Confirm the database is blank/disposable and run `npx prisma migrate deploy` so the tracked `0_init` baseline is applied. Never improvise against production. |
