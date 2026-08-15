import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { categoryTheme } from "@/lib/categories";
import BuyButton from "@/components/BuyButton";
import Icon from "@/components/Icon";

export default async function CoursePage({ params }: PageProps<"/courses/[id]">) {
  const { id } = await params;
  const session = await auth();

  const course = await prisma.course.findUnique({
    where: { id },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!course || !course.published) notFound();

  const enrolled = session?.user
    ? Boolean(
        await prisma.enrollment.findUnique({
          where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
        })
      )
    : false;

  const theme = categoryTheme(course.category);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 opacity-60 blur-3xl"
        style={{ background: `linear-gradient(120deg, ${theme.from}33, ${theme.to}22)` }}
      />

      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link
          href="/"
          className="focus-ring mb-8 inline-flex items-center gap-2 rounded-full text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
        >
          <span className="rotate-180">
            <Icon name="arrowRight" className="h-4 w-4" />
          </span>
          Back to courses
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span
                className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-white shadow-lg"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
                }}
              >
                <Icon name={theme.icon} className="h-7 w-7" />
              </span>
              <span
                className="accent text-xs font-bold uppercase tracking-widest"
                style={
                  {
                    "--accent-light": theme.text,
                    "--accent-dark": theme.textDark,
                  } as React.CSSProperties
                }
              >
                {course.category}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {course.title}
            </h1>
            <div className="mt-3 h-1 w-20 bg-gradient-to-r from-[var(--brand)] to-[var(--glow)] rounded-full opacity-60"></div>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)]">
              ✨ {course.description}
            </p>

            <div className="mt-10">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold glow-text">
                📚 Course content
                <span className="text-sm font-normal text-[var(--text-muted)]">
                  {course.lessons.length} lessons
                </span>
              </h2>

              <ol className="card divide-y divide-[var(--border)] overflow-hidden border-[var(--border)] hover:border-[var(--glow)] transition-all">
                {course.lessons.map((lesson, i) => (
                  <li key={lesson.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--surface-2)] transition group">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--surface-2)] text-sm font-semibold text-[var(--text-muted)] group-hover:bg-gradient-to-br group-hover:from-[var(--brand)] group-hover:to-[var(--glow)] group-hover:text-white transition">
                      {i + 1}
                    </span>
                    <span className="flex-1 font-medium group-hover:text-[var(--brand)] transition">{lesson.title}</span>
                    <span className={`transition ${enrolled ? "text-[var(--brand)]" : "text-[var(--text-faint)]"}`}>
                      <Icon name={enrolled ? "play" : "lock"} className="h-4 w-4" />
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Purchase panel */}
          <aside className="card sticky top-24 p-6">
            <p className="text-4xl font-extrabold tracking-tight">
              {formatPrice(course.price)}
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              One-time payment · lifetime access
            </p>

            <div className="mt-6">
              {enrolled ? (
                <Link
                  href={`/learn/${course.id}`}
                  className="btn btn-primary w-full"
                >
                  Go to course
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
              ) : session?.user ? (
                <BuyButton courseId={course.id} />
              ) : (
                <Link href="/login" className="btn btn-primary w-full">
                  Sign in to buy
                </Link>
              )}
            </div>

            <ul className="mt-6 space-y-3 text-sm text-[var(--text-muted)]">
              {[
                `${course.lessons.length} on-demand lessons`,
                "Lifetime access",
                "Certificate of completion",
                "Learn on any device",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                    <Icon name="check" className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
