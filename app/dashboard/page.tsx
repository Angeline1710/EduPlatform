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
import SuccessFlow from "@/components/magic/SuccessFlow";
import HoverCard from "@/components/magic/HoverCard";

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
          <SuccessFlow studentName={session.user.name ?? "Scholar"} />
        )}

        <header className="animate-fade-up mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[var(--border)] pb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--gold)] flex items-center gap-2">
              <Icon name="sun" className="h-4 w-4" /> {greeting(new Date())}
            </p>
            <h1 className="mt-2 font-serif text-4xl font-extrabold tracking-tight sm:text-5xl text-[var(--brand)]">
              Welcome to your desk, <span className="bg-gradient-to-r from-[var(--gold-bright)] to-[var(--gold)] bg-clip-text text-transparent animate-glow-pulse">{firstName}</span>
            </h1>
            <p className="mt-4 text-lg text-[var(--text-muted)] max-w-2xl">
              {courses.length === 0
                ? "Your scholar's desk awaits its first manuscript."
                : completedCourses > 0
                  ? `You have mastered ${completedCourses} of your ${courses.length} tomes. Knowledge grows.`
                  : `${lessonsDone} pages read across ${courses.length} active manuscripts.`}
            </p>
          </div>
          <div className="flex items-center gap-3 bg-[var(--surface-2)] p-4 rounded-lg border border-[var(--gold)]/30 shadow-[0_0_15px_var(--academy-glow)] relative">
            {/* Streak Tracker */}
            <Icon name="sun" className="h-8 w-8 text-[var(--gold)] animate-spin-slow" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-faint)]">Scholar's Streak</p>
              <p className="font-serif text-2xl font-bold text-[var(--gold)]">3 Days</p>
            </div>
            {/* Particles container */}
            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white shadow-[0_0_8px_4px_white] animate-sparkle" />
          </div>
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
          <div className="card animate-pop-in px-6 py-16 text-center border border-[var(--gold)]/30 bg-[var(--surface-2)] shadow-[0_0_15px_var(--academy-glow)]">
            <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dim)] text-[#241026] shadow-lg">
              <Icon name="book" className="h-8 w-8" />
            </span>
            <p className="text-xl font-serif font-bold text-[var(--brand)]">Your desk is empty</p>
            <p className="mt-2 text-[15px] text-[var(--text-muted)]">
              Visit the archives to find your first manuscript.
            </p>
            <Link href="/" className="rune-edge inline-flex items-center gap-2 rounded-md border border-[var(--gold-bright)] bg-gradient-to-b from-[var(--gold)] to-[var(--gold-dim)] px-6 py-3 font-semibold text-[#241026] shadow-[0_0_18px_rgb(212_162_76/0.35)] transition hover:brightness-110 mt-8">
              Browse Archives
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course, i) => {
              const theme = categoryTheme(course.category);
              const finished = course.percent === 100;
              return (
                <Reveal key={course.id} delay={i * 0.05}>
                  <HoverCard className="w-full h-full">
                    <Link
                      href={`/learn/${course.id}`}
                      className="group relative flex h-[280px] w-full flex-col justify-end overflow-hidden rounded-r-xl rounded-l-md border-l-[12px] border-y-2 border-r-2 bg-[var(--surface-2)] p-6 shadow-[10px_10px_20px_rgba(0,0,0,0.4)]"
                      style={{
                        borderLeftColor: theme.from,
                        borderColor: "var(--border)",
                        backgroundImage: `linear-gradient(to right, ${theme.from}15, transparent)`,
                      }}
                    >
                    {/* Spine details */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-black/20 bg-black/10 mix-blend-overlay" />
                    <div className="absolute left-2 top-8 h-1 w-6 bg-black/20" />
                    <div className="absolute left-2 bottom-8 h-1 w-6 bg-black/20" />
                    
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <span
                          className="grid h-12 w-12 place-items-center rounded-full text-[#241026] shadow-md transition group-hover:scale-105 group-hover:rotate-6"
                          style={{
                            backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
                            boxShadow: `0 0 12px ${theme.from}80`,
                          }}
                        >
                          <Icon name={theme.icon} className="h-6 w-6" />
                        </span>

                        <ProgressRing
                          percent={course.percent}
                          size={52}
                          stroke={4}
                          gradientId={`ring-${course.id}`}
                          from={theme.from}
                          to={theme.to}
                        />
                      </div>

                      <span className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[var(--gold)]">
                        {course.category}
                      </span>
                      <h3 className="mb-2 font-serif text-xl font-bold leading-snug text-[var(--brand)] line-clamp-2">{course.title}</h3>
                      <p className="line-clamp-2 flex-1 text-[13px] leading-relaxed text-[var(--text-muted)]">
                        {course.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4 text-sm font-semibold">
                        {finished ? (
                          <span className="inline-flex items-center gap-1.5 text-[var(--gold)]">
                            <Icon name="check" className="h-4 w-4" />
                            Mastered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[var(--text)] group-hover:text-[var(--gold)] transition-colors">
                            Continue Reading
                            <Icon
                              name="arrowRight"
                              className="h-4 w-4 transition-transform group-hover:translate-x-1"
                            />
                          </span>
                        )}
                        <span className="font-mono text-[11px] font-normal text-[var(--text-faint)]">
                          PG {course.done}/{course.total}
                        </span>
                      </div>
                    </div>
                    </Link>
                  </HoverCard>
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
