import { prisma } from "@/lib/prisma";
import { CATEGORY_NAMES } from "@/lib/categories";
import { parseInterests } from "@/lib/profile-fields";

/**
 * The owl's reasoning.
 *
 * This is deliberately a small, explainable scoring model rather than
 * anything opaque: every recommendation can name the signals that produced
 * it, which is what makes the owl's advice trustworthy instead of magical
 * hand-waving. Nothing is invented — if a visitor has done nothing, the owl
 * says so and offers a starting point instead of guessing.
 */

/** How much each kind of act says about intent. */
const WEIGHT: Record<string, number> = {
  enrolled: 10,
  enroll_intent: 6,
  course_view: 3,
  search: 2.5,
  category_view: 1.5,
};

/** Interest fades. A signal loses about half its force each fortnight. */
const HALF_LIFE_DAYS = 14;

function decay(at: Date, now = Date.now()) {
  const days = (now - at.getTime()) / 86_400_000;
  return Math.pow(0.5, days / HALF_LIFE_DAYS);
}

export type Recommendation = {
  courseId: string;
  title: string;
  category: string;
  price: number;
  lessons: number;
  /** Why this was suggested, in plain words. */
  reason: string;
};

export type InterestProfile = {
  hasHistory: boolean;
  signalCount: number;
  /** Departments ranked by weighted, decayed interest. */
  affinities: { category: string; score: number; share: number }[];
  topCategory: string | null;
  recentSearches: string[];
  viewedCourses: {
    id: string;
    title: string;
    category: string;
    views: number;
  }[];
  recommendations: Recommendation[];
  /** One short encouraging line for the proactive nudge. */
  nudge: string;
};

type Who = { userId?: string | null; anonId?: string | null };

function whereFor({ userId, anonId }: Who) {
  // A signed-in user's own history wins; otherwise fall back to the
  // anonymous id this browser has been carrying.
  if (userId) return { userId };
  if (anonId) return { anonId };
  return null;
}

export async function getInterestProfile(who: Who): Promise<InterestProfile> {
  const where = whereFor(who);

  const empty = (nudge: string): InterestProfile => ({
    hasHistory: false,
    signalCount: 0,
    affinities: [],
    topCategory: null,
    recentSearches: [],
    viewedCourses: [],
    recommendations: [],
    nudge,
  });

  if (!where)
    return empty("Tell me what you would like to learn and I will find it.");

  const [signals, enrollments, published, profile] = await Promise.all([
    prisma.signal.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 300,
    }),
    who.userId
      ? prisma.enrollment.findMany({
          where: { userId: who.userId },
          select: { courseId: true },
        })
      : Promise.resolve([]),
    prisma.course.findMany({
      where: { published: true },
      include: { _count: { select: { lessons: true, enrollments: true } } },
    }),
    who.userId
      ? prisma.profile.findUnique({
          where: { userId: who.userId },
          select: {
            interests: true,
            fieldOfStudy: true,
            experienceLevel: true,
          },
        })
      : Promise.resolve(null),
  ]);

  // Stated preferences count even before anyone has browsed, so a scholar who
  // filled in their record is never told the owl knows nothing about them.
  const declared = parseInterests(profile?.interests);

  if (signals.length === 0 && declared.length === 0) {
    return empty(
      "Search for a subject and I will point you somewhere worth starting.",
    );
  }

  const now = Date.now();
  const owned = new Set(enrollments.map((e) => e.courseId));

  // --- category affinity ---
  const scores = new Map<string, number>();
  for (const s of signals) {
    if (!s.category) continue;
    const w = (WEIGHT[s.kind] ?? 1) * decay(s.createdAt, now);
    scores.set(s.category, (scores.get(s.category) ?? 0) + w);
  }

  // Search terms that name a department count toward it too.
  for (const s of signals) {
    if (s.kind !== "search") continue;
    const term = s.value.toLowerCase();
    for (const name of CATEGORY_NAMES) {
      if (term.includes(name.toLowerCase())) {
        const w = WEIGHT.search * decay(s.createdAt, now);
        scores.set(name, (scores.get(name) ?? 0) + w);
      }
    }
  }

  // Declared interests carry real weight and never decay — a stated
  // preference is a fact about the person, not a passing click.
  const DECLARED_WEIGHT = 8;
  for (const name of declared) {
    scores.set(name, (scores.get(name) ?? 0) + DECLARED_WEIGHT);
  }

  // A field of study naming a department counts toward it too.
  if (profile?.fieldOfStudy) {
    const field = profile.fieldOfStudy.toLowerCase();
    for (const name of CATEGORY_NAMES) {
      if (field.includes(name.toLowerCase())) {
        scores.set(name, (scores.get(name) ?? 0) + 4);
      }
    }
  }

  const total = [...scores.values()].reduce((a, b) => a + b, 0);
  const affinities = [...scores.entries()]
    .map(([category, score]) => ({
      category,
      score: +score.toFixed(2),
      share: total > 0 ? Math.round((score / total) * 100) : 0,
    }))
    .sort((a, b) => b.score - a.score);

  const topCategory = affinities[0]?.category ?? null;

  // --- recent searches, de-duplicated, newest first ---
  const recentSearches = [
    ...new Set(
      signals
        .filter((s) => s.kind === "search")
        .map((s) => s.value.trim())
        .filter(Boolean),
    ),
  ].slice(0, 6);

  // --- courses actually looked at ---
  const viewCounts = new Map<string, number>();
  for (const s of signals) {
    if (s.kind === "course_view" && s.courseId) {
      viewCounts.set(s.courseId, (viewCounts.get(s.courseId) ?? 0) + 1);
    }
  }
  const viewedCourses = [...viewCounts.entries()]
    .map(([id, views]) => {
      const c = published.find((p) => p.id === id);
      return c ? { id, title: c.title, category: c.category, views } : null;
    })
    .filter((v): v is NonNullable<typeof v> => v !== null)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // --- recommendations ---
  const candidates = published.filter((c) => !owned.has(c.id));

  const ranked = candidates
    .map((c) => {
      const affinity = scores.get(c.category) ?? 0;
      const views = viewCounts.get(c.id) ?? 0;

      // Matching a search term the visitor actually typed is strong evidence.
      const searchHit = recentSearches.some(
        (term) =>
          c.title.toLowerCase().includes(term.toLowerCase()) ||
          c.description.toLowerCase().includes(term.toLowerCase()),
      );

      // Beginners should not be handed the longest course in the archive,
      // and someone advanced should not be sent the shortest.
      const level = profile?.experienceLevel;
      let levelFit = 0;
      if (level === "BEGINNER") levelFit = c._count.lessons <= 5 ? 2 : -1;
      else if (level === "ADVANCED")
        levelFit = c._count.lessons >= 5 ? 1.5 : -1;

      const score =
        affinity * 1.0 +
        views * 4 +
        (searchHit ? 6 : 0) +
        levelFit +
        Math.min(c._count.enrollments, 5) * 0.4;

      let reason = "Popular with other scholars";
      if (views > 0)
        reason = `You looked at this ${views === 1 ? "once" : `${views} times`}`;
      else if (searchHit) reason = "Matches what you searched for";
      else if (declared.includes(c.category))
        reason = `You said ${c.category} interests you`;
      else if (affinity > 0 && c.category === topCategory)
        reason = `You keep returning to ${c.category}`;
      else if (affinity > 0) reason = `Close to your interest in ${c.category}`;

      return {
        courseId: c.id,
        title: c.title,
        category: c.category,
        price: c.price,
        lessons: c._count.lessons,
        reason,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const recommendations: Recommendation[] = ranked.map(
    ({ score: _score, ...r }) => r,
  );

  return {
    hasHistory: true,
    signalCount: signals.length,
    affinities,
    topCategory,
    recentSearches,
    viewedCourses,
    recommendations,
    nudge: buildNudge({
      topCategory,
      viewedCourses,
      recentSearches,
      recommendations,
    }),
  };
}

/** A short, warm line — never pushy, and always tied to something real. */
function buildNudge({
  topCategory,
  viewedCourses,
  recentSearches,
  recommendations,
}: {
  topCategory: string | null;
  viewedCourses: { title: string }[];
  recentSearches: string[];
  recommendations: Recommendation[];
}) {
  if (viewedCourses.length > 0) {
    return `You have been reading about ${viewedCourses[0].title}. It is a good choice — shall I show you where it leads?`;
  }
  if (recentSearches.length > 0) {
    return `You were looking for “${recentSearches[0]}”. I found something that fits.`;
  }
  if (topCategory) {
    return `${topCategory} suits you. There is a course here I think you would enjoy.`;
  }
  if (recommendations.length > 0) {
    return `${recommendations[0].title} is where many scholars begin. Worth a look.`;
  }
  return "The archives are open. Ask me for a direction whenever you like.";
}

/* =================================================================
   Admin side: what everyone collectively wants.
   ================================================================= */

export type AdminBrief = {
  windowDays: number;
  totalSignals: number;
  activeProfiles: number;
  /** Departments ranked by demand across all visitors. */
  demand: { category: string; score: number; share: number; courses: number }[];
  /** What people actually typed, most frequent first. */
  topSearches: { term: string; count: number }[];
  /** Searches that matched no published course — unmet demand. */
  unmetSearches: { term: string; count: number }[];
  /** Looked at often but rarely bought — a pricing or positioning problem. */
  conversionGaps: {
    courseId: string;
    title: string;
    category: string;
    views: number;
    enrollments: number;
    rate: number;
  }[];
};

export async function getAdminBrief(windowDays = 30): Promise<AdminBrief> {
  const since = new Date(Date.now() - windowDays * 86_400_000);

  const [signals, courses] = await Promise.all([
    prisma.signal.findMany({ where: { createdAt: { gte: since } } }),
    prisma.course.findMany({
      where: { published: true },
      include: { _count: { select: { enrollments: true } } },
    }),
  ]);

  // --- demand by department ---
  const demandScores = new Map<string, number>();
  for (const s of signals) {
    if (!s.category) continue;
    demandScores.set(
      s.category,
      (demandScores.get(s.category) ?? 0) + (WEIGHT[s.kind] ?? 1),
    );
  }
  const demandTotal = [...demandScores.values()].reduce((a, b) => a + b, 0);
  const demand = [...demandScores.entries()]
    .map(([category, score]) => ({
      category,
      score: +score.toFixed(1),
      share: demandTotal > 0 ? Math.round((score / demandTotal) * 100) : 0,
      courses: courses.filter((c) => c.category === category).length,
    }))
    .sort((a, b) => b.score - a.score);

  // --- searches ---
  const searchCounts = new Map<string, number>();
  for (const s of signals) {
    if (s.kind !== "search") continue;
    const term = s.value.trim().toLowerCase();
    if (term.length < 2) continue;
    searchCounts.set(term, (searchCounts.get(term) ?? 0) + 1);
  }
  const topSearches = [...searchCounts.entries()]
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  // A search matching nothing published is a course worth commissioning.
  const unmetSearches = topSearches.filter(
    ({ term }) =>
      !courses.some(
        (c) =>
          c.title.toLowerCase().includes(term) ||
          c.description.toLowerCase().includes(term) ||
          c.category.toLowerCase().includes(term),
      ),
  );

  // --- conversion gaps ---
  const viewsByCourse = new Map<string, number>();
  for (const s of signals) {
    if (s.kind === "course_view" && s.courseId) {
      viewsByCourse.set(s.courseId, (viewsByCourse.get(s.courseId) ?? 0) + 1);
    }
  }
  const conversionGaps = courses
    .map((c) => {
      const views = viewsByCourse.get(c.id) ?? 0;
      const enrollments = c._count.enrollments;
      return {
        courseId: c.id,
        title: c.title,
        category: c.category,
        views,
        enrollments,
        rate: views > 0 ? Math.round((enrollments / views) * 100) : 0,
      };
    })
    // Only meaningful once a course has been seen a few times.
    .filter((c) => c.views >= 3)
    .sort((a, b) => a.rate - b.rate || b.views - a.views)
    .slice(0, 8);

  const profiles = new Set(
    signals.map((s) => s.userId ?? s.anonId).filter(Boolean) as string[],
  );

  return {
    windowDays,
    totalSignals: signals.length,
    activeProfiles: profiles.size,
    demand,
    topSearches,
    unmetSearches,
    conversionGaps,
  };
}

/** Per-person interest, for the admin's user list. */
export async function getUserInterestSummaries(limit = 40) {
  const users = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { id: true, name: true, email: true, lastSeenAt: true },
  });

  return Promise.all(
    users.map(async (u) => {
      const p = await getInterestProfile({ userId: u.id });
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        lastSeenAt: u.lastSeenAt,
        signalCount: p.signalCount,
        topCategory: p.topCategory,
        affinities: p.affinities.slice(0, 3),
        recentSearches: p.recentSearches.slice(0, 3),
        wants: p.recommendations.slice(0, 2).map((r) => r.title),
      };
    }),
  );
}
