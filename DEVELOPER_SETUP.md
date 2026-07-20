# Developer Setup (Fresh Windows Installation)

## Required software

| Software | Recommended version / note |
| --- | --- |
| Git | Current stable Git for Windows |
| Node.js | Node 20 LTS or later compatible with Next.js 16; use the version required by your deployment platform where possible |
| npm | Bundled with Node.js; this repository has `package-lock.json` |
| VS Code | Current stable version |
| PostgreSQL | Local PostgreSQL 15+ for local data, or a managed PostgreSQL database such as Neon |
| Cloudinary account | Required for durable production image uploads |
| Vercel account/CLI | Needed only when deploying to Vercel |

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

## Database setup — important migration warning

The Prisma schema is complete, but the repository only tracks two additive migration folders and does **not** contain an initial migration that creates the base schema. Therefore, `npm run prisma:migrate` / `prisma migrate dev` must not be assumed to initialize a blank database successfully.

For a disposable local development database, after reviewing the schema, the practical bootstrap command is:

```powershell
npx prisma db push
npm run prisma:seed
```

This synchronizes the current schema without creating migration history. It is **not** a substitute for a reviewed production migration strategy. Before building a production environment, create/recover and commit a proper initial migration baseline, or have the database owner provide the established schema and migration history.

Useful Prisma commands:

```powershell
npm run prisma:generate
npx prisma validate
npx prisma db push
npm run prisma:seed
npm run prisma:studio
```

`npm run db:setup` and `npm run prisma:migrate` are present in `package.json`, but the migration warning above applies to a blank database.

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

This repository has no Vercel project metadata or scripted deployment command. After linking the correct Vercel project and setting environment variables, typical manual CLI commands are:

```powershell
npx vercel link
npx vercel
npx vercel --prod
```

Run production database schema work only using the reviewed migration plan for that environment; do not use `db push` casually against production.

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
| Uploads fail on Vercel | Set all three Cloudinary variables. Local filesystem uploads are not durable on Vercel. |
| Images fall back to Karnak image | The image source is not an allowed local path or one of the trusted remote hosts in `lib/images.ts`. |
| Fresh `prisma migrate` fails | See the missing-initial-migration warning above; do not improvise production migration repairs. |
