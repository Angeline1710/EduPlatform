import { prisma } from "@/lib/prisma";

/** A user counts as online if they were seen inside this window. */
export const PRESENCE_WINDOW_MS = 5 * 60_000;

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function daysAgo(n: number) {
  const d = startOfDay(new Date());
  d.setDate(d.getDate() - n);
  return d;
}

/**
 * Revenue figures.
 *
 * There is no cost or refund data source in this system, so "net" here means
 * captured revenue only — money that actually reached PAID. Pending and
 * failed are reported separately rather than folded in, so the headline
 * number is never inflated by attempts that did not complete.
 */
export async function getRevenue() {
  const [paid, pending, failed, last30] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.payment.aggregate({
      where: { status: "PENDING" },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.payment.aggregate({
      where: { status: "FAILED" },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.payment.findMany({
      where: { status: "PAID", createdAt: { gte: daysAgo(29) } },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // Bucket the last 30 days so the chart has an entry for quiet days too.
  const buckets = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    buckets.set(daysAgo(i).toISOString().slice(0, 10), 0);
  }
  for (const p of last30) {
    const key = startOfDay(p.createdAt).toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + p.amount);
  }

  const series = [...buckets.entries()].map(([date, amount]) => ({
    date,
    amount,
  }));

  // Trend: this 15-day half against the previous one.
  const half = Math.floor(series.length / 2);
  const recent = series.slice(half).reduce((s, d) => s + d.amount, 0);
  const prior = series.slice(0, half).reduce((s, d) => s + d.amount, 0);
  const trendPct =
    prior === 0
      ? recent > 0
        ? 100
        : 0
      : Math.round(((recent - prior) / prior) * 100);

  return {
    captured: paid._sum.amount ?? 0,
    capturedCount: paid._count,
    pending: pending._sum.amount ?? 0,
    pendingCount: pending._count,
    failed: failed._sum.amount ?? 0,
    failedCount: failed._count,
    series,
    trendPct,
    recent,
    prior,
  };
}

/** Users seen inside the presence window, newest first. */
export async function getLiveUsers() {
  const since = new Date(Date.now() - PRESENCE_WINDOW_MS);
  const users = await prisma.user.findMany({
    where: { lastSeenAt: { gte: since } },
    orderBy: { lastSeenAt: "desc" },
    select: { id: true, name: true, email: true, role: true, lastSeenAt: true },
    take: 25,
  });
  return users;
}

export async function getPlatformStats() {
  const [
    courses,
    published,
    students,
    admins,
    enrollments,
    certificates,
    completions,
  ] = await Promise.all([
    prisma.course.count(),
    prisma.course.count({ where: { published: true } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.enrollment.count(),
    prisma.certificate.count({ where: { revokedAt: null } }),
    prisma.lessonProgress.count(),
  ]);

  const signups7 = await prisma.user.count({
    where: { createdAt: { gte: daysAgo(6) } },
  });
  const enrollments7 = await prisma.enrollment.count({
    where: { purchasedAt: { gte: daysAgo(6) } },
  });

  return {
    courses,
    published,
    drafts: courses - published,
    students,
    admins,
    enrollments,
    certificates,
    lessonsCompleted: completions,
    signups7,
    enrollments7,
  };
}

/** Courses ranked by enrollment, for the admin's performance table. */
export async function getTopCourses(limit = 6) {
  const courses = await prisma.course.findMany({
    include: {
      _count: { select: { enrollments: true, lessons: true } },
      payments: { where: { status: "PAID" }, select: { amount: true } },
    },
  });

  return courses
    .map((c) => ({
      id: c.id,
      title: c.title,
      category: c.category,
      published: c.published,
      price: c.price,
      enrollments: c._count.enrollments,
      lessons: c._count.lessons,
      revenue: c.payments.reduce((s, p) => s + p.amount, 0),
    }))
    .sort((a, b) => b.revenue - a.revenue || b.enrollments - a.enrollments)
    .slice(0, limit);
}
