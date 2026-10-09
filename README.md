# EduPlatform

An online course platform with two separate logins (admin and student), course purchases via Stripe, and full course/lesson management.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma ORM with PostgreSQL
- NextAuth (credentials provider, JWT sessions) with `ADMIN` / `STUDENT` roles
- Stripe Checkout + webhooks

## Getting started

```bash
npm install
```

Copy the environment template and fill in your values:

```bash
cp .env.example .env
```

Start the local PostgreSQL container and seed sample data:

```bash
docker compose up -d db
npx prisma migrate dev
npx prisma db seed
```

Start the dev server:

```bash
npm run dev
```

## Containerized setup

This project is ready to run via Docker with persistent storage for dependencies and PostgreSQL data.

```bash
docker compose up --build
```

The compose file uses named volumes for:

- `node_modules` to keep package installs out of the host filesystem
- `postgres_data` to persist the PostgreSQL database

The app will be available at `http://localhost:3000`.

## Seeded accounts

| Role    | Email             | Password   |
| ------- | ----------------- | ---------- |
| Admin   | admin@edu.local   | admin123   |
| Student | student@edu.local | student123 |

These accounts are created only in development. Production seeding requires `ADMIN_EMAIL` and `ADMIN_PASSWORD` and never creates these demo accounts.

## Routes

| Path                       | Who      | Purpose                                  |
| -------------------------- | -------- | ---------------------------------------- |
| `/`                        | Public   | Course catalog                           |
| `/courses/[id]`            | Public   | Course detail + buy button               |
| `/login`, `/register`      | Public   | Student auth                             |
| `/admin/login`             | Public   | Admin auth                               |
| `/admin`                   | Admin    | Dashboard: KPIs, user activity, course management |
| `/admin/courses/new`       | Admin    | Create a course                          |
| `/admin/courses/[id]/edit` | Admin    | Edit course + manage lessons             |
| `/dashboard`               | Student  | Purchased courses                        |
| `/learn/[courseId]`        | Enrolled | Lesson viewer                            |

Route protection lives in [middleware.ts](middleware.ts); API routes independently re-check the session, so the admin endpoints are not protected by middleware alone.

## Stripe setup

1. Put your test keys in `.env` (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).
2. Forward webhooks to your local server:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

3. Copy the `whsec_...` value it prints into `STRIPE_WEBHOOK_SECRET`.

Enrollment is created by the webhook on `checkout.session.completed`, not on the success redirect — so a user closing the tab mid-redirect still gets access.

## Vercel deployment

1. Provision a managed PostgreSQL database and import this repository into Vercel.
2. Add these environment variables in Vercel for Production:
	- `DATABASE_URL`: the managed PostgreSQL connection string
	- `NEXTAUTH_SECRET`: a unique random secret
	- `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: production Stripe keys
	- `STRIPE_WEBHOOK_SECRET`: the signing secret for the webhook endpoint
3. Use `npm run build` as Vercel's Build Command. The build generates Prisma Client but does not connect to or modify the production database. Apply schema migrations separately, from a runner that can reach the database, with `npx prisma migrate deploy` before deploying schema changes.
4. Register `https://<your-domain>/api/webhooks/stripe` in Stripe and subscribe to `checkout.session.completed`.
5. Seed the production database once from a trusted terminal with `NODE_ENV=production`, `DATABASE_URL`, `ADMIN_NAME`, `ADMIN_EMAIL`, and a strong `ADMIN_PASSWORD` set. Run `npx prisma db seed`; do not use the development demo credentials in production.

The build generates Prisma Client automatically. The PostgreSQL migrations are in `prisma/migrations-postgresql`; the older SQLite migration history is retained separately and is not used by the current Prisma config. Existing local SQLite data is not copied to the production database. Database-backed pages are rendered at request time so builds do not need a live database connection.

Leave `AUTH_URL` and `NEXTAUTH_URL` unset for local development. Auth.js detects
the active request host, and browser auth requests use the relative `/api/auth`
path, so localhost, `127.0.0.1`, and alternate development ports remain on the
app that is currently open. Set either URL only when a deployment requires a
fixed canonical origin, and make sure it matches the hostname users visit.
