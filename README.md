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
routes with NextAuth JWT sessions. Set the same variable in Vercel before using the Admin CMS.

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

The public website is designed to build and run with static fallback content when no real database is configured. Admin saves and persisted inquiries require PostgreSQL.

Run migrations:

```bash
npm run prisma:migrate
```

Seed initial content and the first admin user:

```bash
npm run prisma:seed
```

Or run the combined setup:

```bash
npm run db:setup
```

Seeded admin login:

```txt
Email: admin@jacktoursluxor.com
Password: Admin2024!
```

Change this password after production setup by updating the seeded admin user in the database.

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

- `DATABASE_URL`: PostgreSQL connection string. Use Neon or another managed PostgreSQL provider for deployment.
- `NEXTAUTH_SECRET`: required locally and on Vercel for NextAuth admin sessions and protected admin routes.
- `NEXTAUTH_URL`: deployed app URL, for example `https://example.com`.
- `NEXT_PUBLIC_SITE_URL`: public canonical site URL used by metadata, robots, and sitemap.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: WhatsApp number used by public CTAs.

No secrets should be committed. `.env*` is ignored except `.env.example`.

## Deployment Recommendation

Recommended MVP deployment:

- Vercel for the Next.js application
- Neon PostgreSQL for the database
- Hostinger only for domain/DNS/email if you already use it

Hostinger shared hosting is not ideal for running this full Next.js app directly. It usually lacks the runtime, deployment workflow, and serverless/Node infrastructure expected by this project. Point the domain DNS from Hostinger to Vercel instead.

## Production Checklist

1. Create a Neon PostgreSQL database.
2. Set all environment variables in Vercel, including `NEXTAUTH_SECRET`.
3. Run Prisma migration against the production database:

```bash
npm run prisma:migrate
```

4. Seed the database:

```bash
npm run prisma:seed
```

5. Log into `/admin/login`.
6. Update site settings, tours, FAQs, gallery, and blog content.
7. Replace the seeded admin password.
8. Verify WhatsApp CTAs and trip/contact/tour inquiry forms.

## Verification Commands

```bash
npm run lint
npx tsc --noEmit --pretty false
npm run build
npx prisma validate
```

## Fallback Behavior

If `DATABASE_URL` is missing, still set to the local placeholder, or unavailable, public pages fall back to static seed-aligned content from `lib/content.ts`. Forms still open WhatsApp even if database persistence fails.
