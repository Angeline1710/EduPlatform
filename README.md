# EduPlatform

An online course platform with two separate logins (admin and student), course purchases via Stripe, and full course/lesson management.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma ORM with SQLite (swap the datasource to PostgreSQL for production)
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

Set up the database and seed sample data:

```bash
npx prisma migrate dev && npx prisma db seed
```

Start the dev server:

```bash
npm run dev
```

## Containerized setup

This project is ready to run via Docker with persistent storage for both dependencies and the SQLite database.

```bash
docker compose up --build
```

The compose file uses named volumes for:

- `node_modules` to keep package installs out of the host filesystem
- `prisma_data` to persist SQLite data at `./prisma/dev.db`

The app will be available at `http://localhost:3000`.

## Seeded accounts

| Role    | Email             | Password   |
| ------- | ----------------- | ---------- |
| Admin   | admin@edu.local   | admin123   |
| Student | student@edu.local | student123 |

Change these before deploying anywhere public.

## Routes

| Path                       | Who      | Purpose                                  |
| -------------------------- | -------- | ---------------------------------------- |
| `/`                        | Public   | Course catalog                           |
| `/courses/[id]`            | Public   | Course detail + buy button               |
| `/login`, `/register`      | Public   | Student auth                             |
| `/admin/login`             | Public   | Admin auth                               |
| `/admin`                   | Admin    | Dashboard: courses, enrollments, revenue |
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

## Switching to PostgreSQL

In `prisma/schema.prisma`, change the datasource provider to `postgresql`, swap the adapter in [lib/prisma.ts](lib/prisma.ts) for `@prisma/adapter-pg`, point `DATABASE_URL` at your database, and re-run `npx prisma migrate dev`.
