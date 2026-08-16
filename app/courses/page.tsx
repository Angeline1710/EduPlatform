import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CourseCard from "@/components/CourseCard";
import PageHeader from "@/components/PageHeader";
import DepartmentFilter from "@/components/DepartmentFilter";
import QuillSearch from "@/components/magic/QuillSearch";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import SignalOnView from "@/components/owl/SignalOnView";
import { CATEGORY_NAMES } from "@/lib/categories";

export const metadata = {
  title: "The Archives · EduPlatform",
  description: "Every course in the academy, by department.",
};

type SortKey = "newest" | "price-asc" | "price-desc" | "lessons";

export default async function CoursesPage({ searchParams }: PageProps<"/courses">) {
  const params = await searchParams;
  const one = (v: string | string[] | undefined) =>
    (Array.isArray(v) ? v[0] : v)?.trim() ?? "";

  const query = one(params.q);
  const category = one(params.category);
  const sort = (one(params.sort) || "newest") as SortKey;

  const allPublished = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { lessons: true, enrollments: true } } },
  });

  // SQLite has no case-insensitive `contains` in Prisma, so filter here.
  const needle = query.toLowerCase();
  let courses = allPublished.filter((c) => {
    const matchesQuery =
      !needle ||
      c.title.toLowerCase().includes(needle) ||
      c.description.toLowerCase().includes(needle) ||
      c.category.toLowerCase().includes(needle);
    return matchesQuery && (!category || c.category === category);
  });

  courses = [...courses].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "lessons") return b._count.lessons - a._count.lessons;
    return 0; // already newest-first from the query
  });

  const usedCategories = CATEGORY_NAMES.filter((n) =>
    allPublished.some((c) => c.category === n),
  );

  const suggestions = [
    ...allPublished.map((c) => ({ label: c.title, kind: "course" as const })),
    ...usedCategories.map((c) => ({ label: c, kind: "department" as const })),
  ];

  const isFiltered = Boolean(query || category);

  return (
    <>
      {/* A search or a department filter is a statement of interest. */}
      {query && <SignalOnView kind="search" value={query} category={category || undefined} />}
      {category && !query && <SignalOnView kind="category_view" value={category} category={category} />}

      <PageHeader
        eyebrow="The Academy"
        title="The Archives"
        lead="Every course held by the academy. Search by name, or narrow to a single department."
      >
        <QuillSearch initialQuery={query} suggestions={suggestions} />
      </PageHeader>

      <section className="paper border-b border-[var(--border)] px-6 py-12 xl:px-10">
        <div className="mx-auto max-w-[1400px]">
          <DepartmentFilter
            categories={usedCategories}
            active={category}
            basePath="/courses"
          />

          {/* Result line + sort */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
            <p className="text-sm text-[var(--text-muted)]">
              {courses.length === 0 ? (
                "The archives hold no matching course."
              ) : (
                <>
                  The archives revealed{" "}
                  <span className="font-serif text-base font-bold text-[var(--brand)]">
                    {courses.length}
                  </span>{" "}
                  {courses.length === 1 ? "course" : "courses"}
                  {category && ` in ${category}`}
                  {query && ` for “${query}”`}.
                </>
              )}
            </p>

            <div className="flex items-center gap-3">
              {isFiltered && (
                <Link
                  href="/courses"
                  className="text-sm font-semibold text-[var(--brand)] hover:underline"
                >
                  Clear
                </Link>
              )}
              <SortLinks current={sort} query={query} category={category} />
            </div>
          </div>

          {courses.length === 0 ? (
            <EmptyArchive query={query} categories={usedCategories} />
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course, i) => (
                <Reveal key={course.id} delay={(i % 3) * 0.06}>
                  <CourseCard
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    price={course.price}
                    category={course.category}
                    lessonCount={course._count.lessons}
                    gifUrl={course.gifUrl}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function SortLinks({
  current,
  query,
  category,
}: {
  current: SortKey;
  query: string;
  category: string;
}) {
  const options: { key: SortKey; label: string }[] = [
    { key: "newest", label: "Newest" },
    { key: "price-asc", label: "Price ↑" },
    { key: "price-desc", label: "Price ↓" },
    { key: "lessons", label: "Longest" },
  ];

  const href = (key: SortKey) => {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (category) p.set("category", category);
    if (key !== "newest") p.set("sort", key);
    const s = p.toString();
    return s ? `/courses?${s}` : "/courses";
  };

  return (
    <div className="flex items-center gap-1">
      {options.map((o) => (
        <Link
          key={o.key}
          href={href(o.key)}
          aria-current={current === o.key ? "true" : undefined}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            current === o.key
              ? "bg-[var(--gold-soft)] text-[var(--brand)]"
              : "text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          {o.label}
        </Link>
      ))}
    </div>
  );
}

/** Designed empty state, with real alternatives to try. */
function EmptyArchive({ query, categories }: { query: string; categories: string[] }) {
  return (
    <div className="mx-auto mt-10 max-w-lg rounded-sm border border-dashed border-[var(--border-strong)] px-6 py-14 text-center">
      <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full border border-[var(--gold)] text-[var(--gold)]">
        <Icon name="search" className="h-6 w-6" />
      </span>
      <p className="font-serif text-2xl font-bold text-[var(--brand)]">
        The archives hold no matching course.
      </p>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        {query
          ? `Nothing matches “${query}”. Try another subject, skill, or keyword.`
          : "Try another subject, skill, or keyword."}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {categories.slice(0, 5).map((c) => (
          <Link
            key={c}
            href={`/courses?category=${encodeURIComponent(c)}`}
            className="rounded-full border border-[var(--border)] px-3.5 py-1.5 text-sm text-[var(--text-muted)] transition hover:border-[var(--gold)] hover:text-[var(--text)]"
          >
            {c}
          </Link>
        ))}
      </div>
    </div>
  );
}
