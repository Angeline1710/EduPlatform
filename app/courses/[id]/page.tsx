import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { categoryTheme } from "@/lib/categories";
import EnrollmentFlow from "@/components/magic/EnrollmentFlow";
import SignalOnView from "@/components/owl/SignalOnView";
import Icon from "@/components/Icon";

export default async function CoursePage({
  params,
  searchParams,
}: PageProps<"/courses/[id]">) {
  const { id } = await params;
  const { purchase } = await searchParams;
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
      {/* Tells the owl this course was actually opened. */}
      <SignalOnView
        kind="course_view"
        value={course.title}
        courseId={course.id}
        category={course.category}
      />

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
              {course.gifUrl ? (
                /* Admin-supplied GIF takes the crest's place when present.
                   Plain <img> because the URL is arbitrary and cannot pass
                   through the image optimiser's host allowlist. */
                <span className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[var(--gold)] shadow-[0_0_16px_var(--academy-glow)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.gifUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </span>
              ) : (
                <span
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-white shadow-lg"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
                  }}
                >
                  <Icon name={theme.icon} className="h-7 w-7" />
                </span>
              )}
              <span
                className="accent text-xs font-bold uppercase tracking-widest"
                style={
                  {
                    "--accent-light": theme.ink,
                    "--accent-dark": theme.inkDark,
                  } as React.CSSProperties
                }
              >
                {course.category}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl font-serif text-[var(--brand)]">
              {course.title}
            </h1>
            <div className="mt-4 flex items-center gap-2 text-[var(--text-faint)]">
              <Icon name="user" className="h-4 w-4" /> Instructor: Master Scholar
              <span className="mx-2">•</span>
              <Icon name="star" className="h-4 w-4 text-[var(--gold)]" /> 4.9/5
            </div>
            
            <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-[var(--gold)] via-[var(--gold-dim)] to-transparent opacity-60"></div>
            
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-[var(--text-muted)]">
              {course.description}
            </p>

            <div className="mt-12">
              <h2 className="mb-6 flex items-center gap-3 text-[22px] font-bold font-serif text-[var(--brand)]">
                <span className="text-[var(--gold)]"><Icon name="book" className="h-6 w-6" /></span>
                Curriculum
                <span className="text-sm font-normal text-[var(--text-faint)] ml-2 border border-[var(--border)] rounded-full px-3 py-0.5 bg-[var(--surface-2)]">
                  {course.lessons.length} manuscripts
                </span>
              </h2>

              <ol className="card divide-y divide-[var(--border)] overflow-hidden border-[var(--border)] shadow-[var(--shadow-card)]">
                {course.lessons.map((lesson, i) => (
                  <li key={lesson.id} className="group relative flex items-center gap-4 px-6 py-5 hover:bg-[var(--surface-2)] transition-colors duration-300">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--gold)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border border-[var(--border)] bg-[var(--surface)] font-serif font-bold text-[var(--text-muted)] group-hover:border-[var(--gold)] group-hover:text-[var(--gold)] transition-all">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-[15px] font-medium text-[var(--text)] group-hover:text-[var(--brand)] transition-colors">
                      {lesson.title}
                    </span>
                    <span className={`transition-all duration-300 ${enrolled ? "text-[var(--gold)]" : "text-[var(--text-faint)] group-hover:text-[var(--text-muted)]"}`}>
                      <Icon name={enrolled ? "play" : "lock"} className="h-[18px] w-[18px]" />
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

            <div className="mt-8">
              {enrolled && (
                <p className="mb-3 text-center font-serif text-sm font-bold text-[var(--brand)]">
                  You are a student of this course.
                </p>
              )}
              <EnrollmentFlow
                courseId={course.id}
                courseTitle={course.title}
                priceLabel={formatPrice(course.price)}
                isFree={course.price === 0}
                initiallyEnrolled={enrolled}
                signedIn={Boolean(session?.user)}
                returningFromCheckout={purchase === "success"}
              />
            </div>

            <ul className="mt-8 space-y-4 text-sm text-[var(--text-muted)]">
              {[
                `${course.lessons.length} structured lessons`,
                "Lifetime archive access",
                "Official academy credential",
                "Learn at your own pace",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--gold)] border border-[var(--gold)]/30 shadow-[0_0_8px_var(--academy-glow)]">
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
