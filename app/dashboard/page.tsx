import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categoryTheme } from "@/lib/categories";
import { formatIssueDate } from "@/lib/certificates";
import Icon from "@/components/Icon";
import CountUp from "@/components/CountUp";
import ProgressRing from "@/components/ProgressRing";
import Reveal from "@/components/Reveal";

function greeting(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { purchase } = await searchParams;
  const userId = session.user.id;

  const [enrollments, progress, certificates] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      orderBy: { purchasedAt: "desc" },
      include: { course: { include: { _count: { select: { lessons: true } } } } },
    }),
    prisma.lessonProgress.findMany({
      where: { userId },
      select: { lesson: { select: { courseId: true } }, completedAt: true },
    }),
    prisma.certificate.findMany({
      where: { userId, revokedAt: null },
      orderBy: { issuedAt: "desc" },
      include: { course: { select: { title: true, category: true } } },
    }),
  ]);

  const doneByCourse = new Map<string, number>();
  for (const p of progress) {
    const id = p.lesson.courseId;
    doneByCourse.set(id, (doneByCourse.get(id) ?? 0) + 1);
  }

  const courses = enrollments.map(({ course }) => {
    const total = course._count.lessons;
    const done = doneByCourse.get(course.id) ?? 0;
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      total,
      done,
      percent: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  });

  const totalLessons = courses.reduce((s, c) => s + c.total, 0);
  const lessonsDone = courses.reduce((s, c) => s + c.done, 0);
  const completedCourses = courses.filter((c) => c.total > 0 && c.done >= c.total).length;
  const overall = totalLessons > 0 ? Math.round((lessonsDone / totalLessons) * 100) : 0;

  // Next thing to pick up: the furthest-along course that isn't finished.
  const inProgress = courses
    .filter((c) => c.percent < 100)
    .sort((a, b) => b.percent - a.percent);
  const continueCourse = inProgress[0] ?? null;

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <div className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 h-96">
        <div
          className="absolute -left-24 -top-32 h-96 w-96 rounded-full opacity-60 blur-3xl"
          style={{ background: "var(--blob-a)" }}
        />
        <div
          className="absolute right-0 top-0 h-80 w-80 rounded-full opacity-50 blur-3xl"
          style={{ background: "var(--blob-c)" }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {purchase === "success" && (
          <div className="animate-pop-in mb-8 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
              <Icon name="check" className="h-4 w-4" />
            </span>
            Payment successful. Your course is unlocked below.
          </div>
        )}

        {/* Greeting */}
        <header className="animate-fade-up mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--brand)] glow-text">
            ✨ {greeting(new Date())}
          </p>
          <h1 className="mt-1.5 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Welcome back, <span className="bg-gradient-to-r from-[var(--brand)] via-[var(--glow)] to-[var(--brand)] bg-clip-text text-transparent animate-glow-pulse">{firstName}</span>
          </h1>
          <div className="mt-2 h-1 w-32 bg-gradient-to-r from-[var(--brand)] to-[var(--glow)] rounded-full opacity-60"></div>
          <p className="mt-3 text-lg text-[var(--text-muted)]">
            {courses.length === 0
              ? "✨ Your magical learning journey starts here."
              : completedCourses > 0
                ? `🎯 You've completed ${completedCourses} of ${courses.length} courses. Keep the momentum!`
                : `📚 ${lessonsDone} of ${totalLessons} lessons mastered across ${courses.length} courses.`}
          </p>
        </header>

        {courses.length > 0 && (
          <>
            {/* Stat row */}
            <div className="stagger mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon="book" label="Courses" value={courses.length} />
              <StatCard icon="check" label="Lessons done" value={lessonsDone} />
              <StatCard icon="award" label="Certificates" value={certificates.length} />
              <StatCard icon="chart" label="Overall" value={overall} suffix="%" highlight />
            </div>

            {/* Continue learning */}
            {continueCourse && (
              <Reveal className="mb-10">
                <Link
                  href={`/learn/${continueCourse.id}`}
                  className="lift press group card relative flex flex-wrap items-center gap-6 overflow-hidden p-6 sm:p-8"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
                    style={{
                      background: `linear-gradient(135deg, ${
                        categoryTheme(continueCourse.category).from
                      }, ${categoryTheme(continueCourse.category).to})`,
                    }}
                  />

                  <ProgressRing
                    percent={continueCourse.percent}
                    size={88}
                    stroke={8}
                    gradientId="continue-ring"
                    from={categoryTheme(continueCourse.category).from}
                    to={categoryTheme(continueCourse.category).to}
                  />

                  <div className="relative min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-faint)]">
                      Continue learning
                    </p>
                    <p className="mt-1 truncate text-2xl font-bold tracking-tight">
                      {continueCourse.title}
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      {continueCourse.done} of {continueCourse.total} lessons complete
                    </p>
                  </div>

                  <span className="brand-gradient animate-pulse-ring relative grid h-14 w-14 shrink-0 place-items-center rounded-full text-white shadow-lg transition group-hover:scale-105">
                    <Icon name="arrowRight" className="h-6 w-6" />
                  </span>
                </Link>
              </Reveal>
            )}
          </>
        )}

        {/* Course grid */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">My courses</h2>
          {courses.length > 0 && (
            <Link
              href="/"
              className="focus-ring text-sm font-semibold text-[var(--brand)] hover:underline"
            >
              Find more
            </Link>
          )}
        </div>

        {courses.length === 0 ? (
          <div className="card animate-pop-in px-6 py-16 text-center">
            <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
              <Icon name="book" className="h-6 w-6" />
            </span>
            <p className="text-lg font-semibold">No courses yet</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Browse the catalog and start learning today.
            </p>
            <Link href="/" className="btn btn-primary press mt-6">
              Browse courses
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course, i) => {
              const theme = categoryTheme(course.category);
              const finished = course.percent === 100;
              return (
                <Reveal key={course.id} delay={i * 0.05}>
                  <Link
                    href={`/learn/${course.id}`}
                    className="lift press group card flex h-full flex-col p-5"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span
                        className="grid h-12 w-12 place-items-center rounded-2xl text-white shadow-md transition group-hover:scale-105"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
                        }}
                      >
                        <Icon name={theme.icon} className="h-5 w-5" />
                      </span>

                      <ProgressRing
                        percent={course.percent}
                        size={52}
                        stroke={5}
                        gradientId={`ring-${course.id}`}
                        from={theme.from}
                        to={theme.to}
                      />
                    </div>

                    <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                      {course.category}
                    </span>
                    <h3 className="mb-1.5 font-bold leading-snug">{course.title}</h3>
                    <p className="mb-5 line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm font-semibold">
                      {finished ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                          <Icon name="check" className="h-4 w-4" />
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[var(--brand)]">
                          Continue
                          <Icon
                            name="arrowRight"
                            className="h-4 w-4 transition group-hover:translate-x-0.5"
                          />
                        </span>
                      )}
                      <span className="ml-auto font-normal text-[var(--text-faint)]">
                        {course.done}/{course.total}
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <>
            <h2 className="mb-4 mt-12 text-2xl font-bold tracking-tight">
              My certificates
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((cert, i) => {
                const theme = categoryTheme(cert.course.category);
                return (
                  <Reveal key={cert.id} delay={i * 0.05}>
                    <Link
                      href={`/certificates/${cert.code}`}
                      className="lift press group card flex h-full flex-col p-5"
                    >
                      <span
                        className="mb-4 grid h-11 w-11 place-items-center rounded-xl text-white shadow-md transition group-hover:rotate-6"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
                        }}
                      >
                        <Icon name="award" className="h-5 w-5" />
                      </span>
                      <p className="font-bold leading-snug">{cert.course.title}</p>
                      <p className="mt-1 font-mono text-xs text-[var(--brand)]">
                        {cert.code}
                      </p>
                      <p className="mt-auto pt-4 text-xs text-[var(--text-faint)]">
                        Issued {formatIssueDate(cert.issuedAt)}
                      </p>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  suffix,
  highlight,
}: {
  icon: string;
  label: string;
  value: number;
  suffix?: string;
  highlight?: boolean;
}) {
  return (
    <div className="card lift p-5">
      <span
        className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${
          highlight
            ? "brand-gradient text-white shadow-md"
            : "bg-[var(--brand-soft)] text-[var(--brand)]"
        }`}
      >
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <p className="text-3xl font-bold tracking-tight">
        <CountUp value={value} suffix={suffix} />
      </p>
      <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
        {label}
      </p>
    </div>
  );
}
