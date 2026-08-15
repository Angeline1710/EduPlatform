import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Hero from "@/components/Hero";
import CourseCard from "@/components/CourseCard";
import Icon from "@/components/Icon";
import { CATEGORY_NAMES, categoryTheme } from "@/lib/categories";

const FEATURES = [
  {
    icon: "infinity",
    title: "Lifetime Access",
    body: "Learn at your own pace, forever.",
  },
  {
    icon: "user",
    title: "Expert Instructors",
    body: "Learn from industry professionals.",
  },
  {
    icon: "award",
    title: "Certificates",
    body: "Earn certificates to showcase your skills.",
  },
  {
    icon: "device",
    title: "Learn Anywhere",
    body: "Access on mobile, tablet, or desktop.",
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
    <div>
      {!isFiltered && <Hero courseCount={allPublished.length} />}

      <div className="mx-auto max-w-7xl px-6 pb-20">
        <section
          id="courses"
          className={`rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-panel)] sm:p-10 ${
            isFiltered ? "mt-10" : "-mt-16"
          }`}
        >
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              {isFiltered ? "Search results" : "Popular Courses"}
              <Icon name="sparkle" className="h-5 w-5 text-[var(--brand)]" />
            </h2>

            {isFiltered ? (
              <Link
                href="/"
                className="focus-ring inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand)] hover:underline"
              >
                Clear filters
              </Link>
            ) : (
              <span className="text-sm text-[var(--text-muted)]">
                {allPublished.length} courses available
              </span>
            )}
          </div>

          {/* Category filter chips */}
          <div id="categories" className="mb-8 flex flex-wrap gap-2">
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
            <div className="rounded-2xl border border-dashed border-[var(--border-strong)] px-6 py-16 text-center">
              <p className="font-semibold">No courses found</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                {isFiltered
                  ? "Try a different search term or category."
                  : "No courses published yet. Check back soon."}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  price={course.price}
                  category={course.category}
                  lessonCount={course._count.lessons}
                />
              ))}
            </div>
          )}

          {/* Features strip */}
          <div
            id="why"
            className="mt-10 grid gap-6 border-t border-[var(--border)] pt-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                  <Icon name={f.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">{f.title}</p>
                  <p className="text-sm leading-relaxed text-[var(--text-muted)]">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
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
      className={`focus-ring inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-transparent bg-[var(--brand)] text-white shadow-sm"
          : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]"
      }`}
    >
      {color && (
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: active ? "rgba(255,255,255,.8)" : color }}
        />
      )}
      {label}
    </Link>
  );
}
