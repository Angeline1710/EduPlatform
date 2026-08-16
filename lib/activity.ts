import { prisma } from "@/lib/prisma";

export type ActivityEvent = {
  id: string;
  kind: "enrolled" | "lesson" | "certificate" | "accolade" | "joined";
  at: Date;
  title: string;
  detail?: string;
  href?: string;
};

/**
 * A scholar's history, assembled from records that already exist.
 *
 * Nothing is logged specially for this — every entry is a real enrolment,
 * completion, credential or accolade, read back and merged. That means the
 * timeline can never drift out of step with the rest of the platform.
 */
export async function getActivity(userId: string, limit = 40): Promise<ActivityEvent[]> {
  const [user, enrollments, progress, certificates, profile] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { createdAt: true } }),
    prisma.enrollment.findMany({
      where: { userId },
      include: { course: { select: { id: true, title: true, category: true } } },
    }),
    prisma.lessonProgress.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      take: limit,
      include: {
        lesson: {
          select: { title: true, course: { select: { id: true, title: true } } },
        },
      },
    }),
    prisma.certificate.findMany({
      where: { userId, revokedAt: null },
      include: { course: { select: { title: true } } },
    }),
    prisma.profile.findUnique({
      where: { userId },
      include: { accolades: true },
    }),
  ]);

  const events: ActivityEvent[] = [];

  if (user) {
    events.push({
      id: "joined",
      kind: "joined",
      at: user.createdAt,
      title: "Joined the academy",
    });
  }

  for (const e of enrollments) {
    events.push({
      id: `enrol-${e.id}`,
      kind: "enrolled",
      at: e.purchasedAt,
      title: `Enrolled in ${e.course.title}`,
      detail: e.course.category,
      href: `/learn/${e.course.id}`,
    });
  }

  for (const p of progress) {
    events.push({
      id: `lesson-${p.id}`,
      kind: "lesson",
      at: p.completedAt,
      title: p.lesson.title,
      detail: p.lesson.course.title,
      href: `/learn/${p.lesson.course.id}`,
    });
  }

  for (const c of certificates) {
    events.push({
      id: `cert-${c.id}`,
      kind: "certificate",
      at: c.issuedAt,
      title: `Credential earned — ${c.course.title}`,
      detail: c.code,
      href: `/certificates/${c.code}`,
    });
  }

  for (const a of profile?.accolades ?? []) {
    events.push({
      id: `accolade-${a.id}`,
      kind: "accolade",
      at: a.createdAt,
      title: a.title,
      detail: [a.issuer, a.year].filter(Boolean).join(" · ") || undefined,
    });
  }

  return events.sort((x, y) => y.at.getTime() - x.at.getTime()).slice(0, limit);
}

/** Groups events by day, so the timeline reads as a diary rather than a list. */
export function groupByDay(events: ActivityEvent[]) {
  const groups = new Map<string, ActivityEvent[]>();
  for (const e of events) {
    const key = e.at.toISOString().slice(0, 10);
    const list = groups.get(key) ?? [];
    list.push(e);
    groups.set(key, list);
  }
  return [...groups.entries()].map(([date, items]) => ({ date, items }));
}
