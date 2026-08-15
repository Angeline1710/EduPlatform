import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Hero from "@/components/Hero";
import CourseCard from "@/components/CourseCard";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { DiamondHeading } from "@/components/Ornament";
import { CATEGORY_NAMES, categoryTheme } from "@/lib/categories";

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

  return (
    <>
      {!isFiltered && <Hero courseCount={allPublished.length} />}

      {/* Parchment catalogue band */}
      <section id="courses" className="bg-[var(--bg)] px-6 py-14 xl:px-10">
        <div className="mx-auto max-w-[1400px]">
          <DiamondHeading>
            {isFiltered ? "Search Results" : "Popular Courses"}
          </DiamondHeading>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-[var(--text-muted)]">
            {isFiltered ? (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-semibold text-[var(--brand)] hover:underline"
              >
                Clear filters
              </Link>
            ) : (
              <span>{allPublished.length} courses available</span>
            )}
          </div>

          {/* Category chips */}
          <div
            id="categories"
            className="mb-9 mt-7 flex flex-wrap justify-center gap-2"
          >
            <CategoryChip active={!category} href="/" label="All" />
            {usedCategories.map((name) => {
              const theme = categoryTheme(name);
              return (
                <CategoryChip
                  key={name}
                  active={category === name}
                  href={`/?category=${encodeURIComponent(name)}`}
                  label={name}
                  color={theme.from}
                />
              );
            })}
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

function CategoryChip({
  href,
  label,
  active,
  color,
}: {
  href: string;
  label: string;
  active: boolean;
  color?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-all duration-300 ${
        active
          ? "border-[var(--gold)] bg-[var(--gold-soft)] font-semibold text-[var(--brand)] shadow-[0_0_12px_rgb(212_162_76/0.25)]"
          : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--gold)] hover:text-[var(--text)]"
      }`}
    >
      {color && (
        <span
          className="h-2 w-2 rotate-45"
          style={{ background: active ? "var(--gold)" : color }}
        />
      )}
      {label}
    </Link>
  );
}
