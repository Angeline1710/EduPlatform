import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categoryTheme } from "@/lib/categories";
import Icon from "@/components/Icon";

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { purchase } = await searchParams;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    orderBy: { purchasedAt: "desc" },
    include: { course: { include: { _count: { select: { lessons: true } } } } },
  });

  const totalLessons = enrollments.reduce((sum, e) => sum + e.course._count.lessons, 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {purchase === "success" && (
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
            <Icon name="check" className="h-4 w-4" />
          </span>
          Payment successful. Your course is unlocked below.
        </div>
      )}

      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">My learning</h1>
        <p className="mt-2 text-[var(--text-muted)]">Welcome back, {session.user.name}.</p>

        {enrollments.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Stat label="Courses" value={enrollments.length} />
            <Stat label="Lessons" value={totalLessons} />
          </div>
        )}
      </header>

      {enrollments.length === 0 ? (
        <div className="card px-6 py-16 text-center">
          <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
            <Icon name="book" className="h-6 w-6" />
          </span>
          <p className="text-lg font-semibold">No courses yet</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Browse the catalog and start learning today.
          </p>
          <Link href="/" className="btn btn-primary mt-6">
            Browse courses
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {enrollments.map(({ id, course }) => {
            const theme = categoryTheme(course.category);
            return (
              <Link
                key={id}
                href={`/learn/${course.id}`}
                className="focus-ring group card flex flex-col p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
              >
                <span
                  className="mb-4 grid h-12 w-12 place-items-center rounded-2xl text-white shadow-md transition group-hover:scale-105"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
                  }}
                >
                  <Icon name={theme.icon} className="h-5 w-5" />
                </span>

                <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                  {course.category}
                </span>
                <h2 className="mb-1.5 font-bold leading-snug">{course.title}</h2>
                <p className="mb-5 line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
                  {course.description}
                </p>

                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand)]">
                  Continue
                  <Icon name="arrowRight" className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  <span className="ml-auto font-normal text-[var(--text-faint)]">
                    {course._count.lessons} lessons
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card px-5 py-3">
      <p className="text-2xl font-bold leading-none">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[var(--text-faint)]">
        {label}
      </p>
    </div>
  );
}
