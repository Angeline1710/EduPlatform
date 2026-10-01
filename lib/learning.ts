import { prisma } from "@/lib/prisma";

const DAY_MS = 86_400_000;

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export type Reminder = {
  id: string;
  tone: "urgent" | "nudge" | "praise";
  title: string;
  body: string;
  href?: string;
  cta?: string;
};

/**
 * Everything the student dashboard needs, derived from real progress rows.
 * Nothing here is invented: the streak comes from completion timestamps and
 * the reminders come from actual gaps in the student's record.
 */
export async function getLearningState(userId: string) {
  const [enrollments, progress, certificates] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      orderBy: { purchasedAt: "desc" },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
              select: { id: true, title: true, order: true },
            },
          },
        },
      },
    }),
    prisma.lessonProgress.findMany({
      where: { userId },
      select: { lessonId: true, completedAt: true },
      orderBy: { completedAt: "desc" },
    }),
    prisma.certificate.findMany({
      where: { userId, revokedAt: null },
      orderBy: { issuedAt: "desc" },
      include: { course: { select: { title: true, category: true } } },
    }),
  ]);

  const doneIds = new Set(progress.map((p) => p.lessonId));

  const courses = enrollments.map(({ course }) => {
    const total = course.lessons.length;
    const done = course.lessons.filter((l) => doneIds.has(l.id)).length;
    // The first unfinished lesson in order is what to resume on.
    const nextLesson = course.lessons.find((l) => !doneIds.has(l.id)) ?? null;
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      gifUrl: course.gifUrl,
      total,
      done,
      remaining: total - done,
      percent: total > 0 ? Math.round((done / total) * 100) : 0,
      nextLesson,
      complete: total > 0 && done >= total,
    };
  });

  const totalLessons = courses.reduce((s, c) => s + c.total, 0);
  const lessonsDone = courses.reduce((s, c) => s + c.done, 0);
  const completedCourses = courses.filter((c) => c.complete).length;
  const inProgress = courses
    .filter((c) => !c.complete && c.done > 0)
    .sort((a, b) => b.percent - a.percent);
  const notStarted = courses.filter((c) => c.done === 0 && !c.complete);

  // Resume the furthest-along unfinished course; failing that, start a new one.
  const upNext = inProgress[0] ?? notStarted[0] ?? null;

  const streak = computeStreak(progress.map((p) => p.completedAt));
  const studiedToday = progress.some(
    (p) =>
      startOfDay(p.completedAt).getTime() === startOfDay(new Date()).getTime(),
  );

  return {
    courses,
    inProgress,
    notStarted,
    upNext,
    certificates,
    totals: {
      courses: courses.length,
      totalLessons,
      lessonsDone,
      lessonsLeft: totalLessons - lessonsDone,
      completedCourses,
      percent:
        totalLessons > 0 ? Math.round((lessonsDone / totalLessons) * 100) : 0,
    },
    streak,
    studiedToday,
    reminders: buildReminders({
      courses,
      upNext,
      streak,
      studiedToday,
      notStarted,
      certificates,
    }),
  };
}

/**
 * Consecutive days ending today (or yesterday, if today is still unstudied —
 * a streak should not be declared broken until the day is actually over).
 */
function computeStreak(dates: Date[]) {
  if (dates.length === 0) return 0;

  const days = [...new Set(dates.map((d) => startOfDay(d).getTime()))].sort(
    (a, b) => b - a,
  );
  const today = startOfDay(new Date()).getTime();

  if (days[0] !== today && days[0] !== today - DAY_MS) return 0;

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    if (days[i - 1] - days[i] === DAY_MS) streak++;
    else break;
  }
  return streak;
}

function buildReminders({
  courses,
  upNext,
  streak,
  studiedToday,
  notStarted,
  certificates,
}: {
  courses: { title: string; remaining: number; complete: boolean }[];
  upNext: {
    id: string;
    title: string;
    nextLesson: { title: string } | null;
  } | null;
  streak: number;
  studiedToday: boolean;
  notStarted: { id: string; title: string }[];
  certificates: unknown[];
}): Reminder[] {
  const out: Reminder[] = [];

  if (courses.length === 0) {
    out.push({
      id: "enrol",
      tone: "nudge",
      title: "Your record is empty",
      body: "Choose a first course and your journey begins.",
      href: "/courses",
      cta: "Browse the archives",
    });
    return out;
  }

  if (upNext?.nextLesson) {
    out.push({
      id: "resume",
      tone: "urgent",
      title: studiedToday ? "Keep going" : "Pick up where you left off",
      body: `${upNext.title} — ${upNext.nextLesson.title}`,
      href: `/learn/${upNext.id}`,
      cta: "Resume",
    });
  }

  if (streak > 0 && !studiedToday) {
    out.push({
      id: "streak-risk",
      tone: "urgent",
      title: `Your ${streak}-day streak is at risk`,
      body: "One lesson today keeps it alive.",
      href: upNext ? `/learn/${upNext.id}` : "/courses",
      cta: "Study now",
    });
  } else if (streak >= 3 && studiedToday) {
    out.push({
      id: "streak-praise",
      tone: "praise",
      title: `${streak} days in a row`,
      body: "You have already studied today. Well held.",
    });
  }

  const nearlyDone = courses.find(
    (c) => !c.complete && c.remaining > 0 && c.remaining <= 2,
  );
  if (nearlyDone) {
    out.push({
      id: "nearly",
      tone: "nudge",
      title: "A credential is within reach",
      body: `${nearlyDone.remaining} ${
        nearlyDone.remaining === 1 ? "lesson" : "lessons"
      } left in ${nearlyDone.title}.`,
    });
  }

  if (notStarted.length > 0) {
    out.push({
      id: "untouched",
      tone: "nudge",
      title: `${notStarted.length} course${notStarted.length === 1 ? "" : "s"} not yet opened`,
      body: notStarted
        .map((c) => c.title)
        .slice(0, 2)
        .join(", "),
      href: `/learn/${notStarted[0].id}`,
      cta: "Begin",
    });
  }

  if (certificates.length > 0) {
    out.push({
      id: "creds",
      tone: "praise",
      title: `${certificates.length} credential${certificates.length === 1 ? "" : "s"} earned`,
      body: "Share or verify them any time.",
      href: "/dashboard#credentials",
      cta: "View",
    });
  }

  return out;
}
