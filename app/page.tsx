import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Hero from "@/components/Hero";
import CourseCard from "@/components/CourseCard";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { Diamond } from "@/components/Ornament";
import { AcademyCrest } from "@/components/Crests";
import DepartmentFilter from "@/components/DepartmentFilter";
import LivingInk from "@/components/magic/LivingInk";
import { auth } from "@/lib/auth";
import { getLearningState } from "@/lib/learning";
import { CATEGORY_NAMES } from "@/lib/categories";

const FEATURES = [
  {
    icon: "crown",
    title: "Lifetime Access",
    body: "Learn at your own pace, anytime, anywhere.",
  },
  {
    icon: "learners",
    title: "Expert Instructors",
    body: "Industry professionals with real-world experience.",
  },
  {
    icon: "book",
    title: "Premium Content",
    body: "High-quality lessons and hands-on projects.",
  },
  {
    icon: "headset",
    title: "24/7 Support",
    body: "We're here to help you succeed always.",
  },
];

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const rawQuery = params.q;
  const query = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery)?.trim() ?? "";
  const rawCategory = params.category;
  const category = (Array.isArray(rawCategory) ? rawCategory[0] : rawCategory)?.trim() ?? "";

  const allPublished = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { lessons: true } } },
  });

  // SQLite has no case-insensitive `contains` mode in Prisma, so filter here.
  const needle = query.toLowerCase();
  const courses = allPublished.filter((c) => {
    const matchesQuery =
      !needle ||
      c.title.toLowerCase().includes(needle) ||
      c.description.toLowerCase().includes(needle);
    const matchesCategory = !category || c.category === category;
    return matchesQuery && matchesCategory;
  });

  const isFiltered = Boolean(query || category);
  const usedCategories = CATEGORY_NAMES.filter((name) =>
    allPublished.some((c) => c.category === name),
  );

  // Only a signed-in scholar with an unfinished course has a "today's study".
  // A signed-out visitor is shown nothing here rather than a fabricated one.
  const session = await auth();
  const todaysStudy = session?.user
    ? (await getLearningState(session.user.id)).upNext
    : null;

  return (
    <>
      {!isFiltered && <Hero courseCount={allPublished.length} />}

      {/* Today's study — only shown when there is a real lesson to resume. */}
      {!isFiltered && todaysStudy && (
        <section className="border-b border-[var(--border)] bg-[var(--surface-2)] px-6 py-14 xl:px-10">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="mb-6 flex items-center gap-3 font-serif text-[28px] font-bold text-[var(--brand)]">
              <Icon name="sun" className="h-6 w-6" />
              Today&rsquo;s Study
            </h2>
            <div className="flex flex-col items-start justify-between gap-4 rounded-sm border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] md:flex-row md:items-center">
              <div className="min-w-0">
                <p className="mb-1 text-sm font-semibold text-[var(--gold-dim)]">
                  {todaysStudy.remaining}{" "}
                  {todaysStudy.remaining === 1 ? "lesson" : "lessons"} left ·{" "}
                  {todaysStudy.percent}% done
                </p>
                <h3 className="font-serif text-[22px] font-bold text-[var(--text)]">
                  {todaysStudy.title}
                </h3>
                <p className="mt-1 text-[var(--text-muted)]">
                  {todaysStudy.nextLesson
                    ? `Continue from: ${todaysStudy.nextLesson.title}`
                    : "Ready for your final review"}
                </p>
              </div>
              <Link
                href={`/learn/${todaysStudy.id}`}
                className="rune-edge inline-flex shrink-0 items-center gap-2 rounded-md border border-[var(--gold-bright)] bg-gradient-to-b from-[var(--gold)] to-[var(--gold-dim)] px-5 py-2.5 font-semibold text-[var(--on-gold)] shadow-[0_0_18px_var(--academy-glow)] transition hover:brightness-110"
              >
                Continue <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Parchment catalogue band */}
      <section
        id="courses"
        className="paper relative border-y border-[var(--border)] px-6 py-16 xl:px-10"
      >
        {/* Corner flourishes, as on the reference band */}
        <Flourish className="left-3 top-3" />
        <Flourish className="right-3 top-3 -scale-x-100" />
        <Flourish className="bottom-3 left-3 -scale-y-100" />
        <Flourish className="bottom-3 right-3 -scale-100" />

        <div className="mx-auto max-w-[1400px]">
          {/* Crest ornament above the heading */}
          <div className="mb-5 flex items-center justify-center gap-3" aria-hidden="true">
            <span className="rule-fade w-20 sm:w-28" />
            <span className="text-[var(--gold)]">
              <AcademyCrest size={26} />
            </span>
            <span className="rule-fade w-20 sm:w-28" />
          </div>

          <h2 className="text-center font-serif text-[38px] leading-none tracking-tight text-[var(--brand)] sm:text-[46px]">
            <LivingInk>{isFiltered ? "The Archives" : "Popular Courses"}</LivingInk>
          </h2>

          <div className="mt-4 flex items-center justify-center gap-2.5" aria-hidden="true">
            <span className="rule-fade w-16" />
            <Diamond size={5} />
            <span className="rule-fade w-16" />
          </div>

          <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
            {isFiltered ? (
              <Link href="/" className="font-semibold text-[var(--brand)] hover:underline">
                Return to all departments
              </Link>
            ) : (
              `${allPublished.length} courses available`
            )}
          </p>

          <div className="mb-10 mt-8">
            <DepartmentFilter categories={usedCategories} active={category} />
          </div>

          {courses.length === 0 ? (
            <div className="rounded-sm border border-dashed border-[var(--border-strong)] px-6 py-16 text-center">
              <p className="font-serif text-lg font-bold">No courses found</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                {isFiltered
                  ? "Try a different search term or category."
                  : "No courses published yet. Check back soon."}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course, i) => (
                <Reveal key={course.id} delay={(i % 3) * 0.06}>
                  <CourseCard
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    price={course.price}
                    category={course.category}
                    lessonCount={course._count.lessons}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How Learning Works */}
      {!isFiltered && (
        <section className="border-b border-[var(--border)] bg-[var(--surface)] px-6 py-16 xl:px-10">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="text-center font-serif text-[34px] font-bold text-[var(--brand)] mb-12">How Learning Works</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative">
              {/* Optional connecting line can be drawn behind items */}
              {[
                { step: "DISCOVER", icon: "search", desc: "Find your path in the archives" },
                { step: "LEARN", icon: "book", desc: "Study expert manuscripts" },
                { step: "PRACTICE", icon: "code", desc: "Apply knowledge directly" },
                { step: "MASTER", icon: "award", desc: "Earn your credentials" }
              ].map((item, i) => (
                <div key={item.step} className="flex flex-col items-center text-center relative z-10 group">
                  <div className="h-16 w-16 rounded-full border border-[var(--gold)] bg-[var(--surface-2)] text-[var(--gold)] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-[0_0_12px_var(--academy-glow)]">
                    <Icon name={item.icon} className="h-7 w-7" />
                  </div>
                  <h3 className="font-serif font-bold tracking-wider text-[var(--text)] mb-2">{item.step}</h3>
                  <p className="text-sm text-[var(--text-muted)] max-w-[200px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dark feature bar */}
      <section id="why" className="shell-panel border-t border-[var(--shell-line)]">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-6 py-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 xl:px-10">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`group flex items-start gap-3.5 lg:px-7 ${
                i > 0 ? "lg:border-l lg:border-[var(--shell-line-soft)]" : ""
              }`}
            >
              <span className="mt-0.5 shrink-0 text-[var(--gold)] transition-transform duration-300 group-hover:scale-110">
                <Icon name={f.icon} className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <p className="font-serif font-bold text-[var(--shell-text)]">{f.title}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-[var(--shell-text-muted)]">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/** Engraved corner mark for the parchment band. */
function Flourish({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={`pointer-events-none absolute h-9 w-9 text-[var(--gold)] opacity-45 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    >
      <path d="M1 12V4a3 3 0 0 1 3-3h8" />
      <path d="M6 16V9a3 3 0 0 1 3-3h7" strokeWidth="0.8" opacity="0.7" />
      <path d="M12 6c4 0 7 1.5 9 4" strokeWidth="0.8" opacity="0.5" />
      <circle cx="4.5" cy="4.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
