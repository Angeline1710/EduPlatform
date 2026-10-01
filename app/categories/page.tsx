import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { DepartmentCrest } from "@/components/Crests";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import { formatPrice } from "@/lib/format";
import { CATEGORY_NAMES, categoryTheme } from "@/lib/categories";

export const metadata = {
  title: "Departments · EduPlatform",
  description: "The academy's departments and what each one teaches.",
};

/** Written by hand rather than derived — each department needs a voice. */
const BLURB: Record<string, string> = {
  Development:
    "The craft of building. Languages, frameworks, and the habits of shipping real software.",
  Data: "Reading meaning from numbers. Analysis, modelling, and the tools that make data speak.",
  Design:
    "Form and clarity. Layout, typography, colour, and interfaces people actually enjoy.",
  Business:
    "Turning work into value. Strategy, marketing, and the mechanics of growth.",
  Security:
    "Guarding what matters. Threats, defences, and staying safe by default.",
  Communication:
    "Being understood. Writing, speaking, and carrying a room with confidence.",
  General: "Foundations that serve every discipline in the academy.",
};

export default async function CategoriesPage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    select: {
      category: true,
      price: true,
      _count: { select: { lessons: true } },
    },
  });

  const departments = CATEGORY_NAMES.map((name) => {
    const mine = courses.filter((c) => c.category === name);
    const lessons = mine.reduce((s, c) => s + c._count.lessons, 0);
    const from = mine.length ? Math.min(...mine.map((c) => c.price)) : 0;
    return { name, count: mine.length, lessons, from };
  }).filter((d) => d.count > 0);

  return (
    <>
      <PageHeader
        eyebrow="The Academy"
        title="Departments"
        lead="Seven disciplines, each with its own crest and its own path through the archives."
      />

      <section className="paper border-b border-[var(--border)] px-6 py-14 xl:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-5 md:grid-cols-2 xl:grid-cols-3">
          {departments.map((dept, i) => {
            const theme = categoryTheme(dept.name);
            return (
              <Reveal key={dept.name} delay={(i % 3) * 0.06}>
                <Link
                  href={`/courses?category=${encodeURIComponent(dept.name)}`}
                  className="group relative flex h-full flex-col rounded-sm border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)] hover:shadow-[var(--shadow-lift)]"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-[var(--gold)] opacity-0 transition-opacity group-hover:opacity-100"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-[var(--gold)] opacity-0 transition-opacity group-hover:opacity-100"
                  />

                  <span
                    className="accent mb-4 transition-transform duration-500 group-hover:scale-110"
                    style={
                      {
                        "--accent-light": theme.ink,
                        "--accent-dark": theme.inkDark,
                      } as React.CSSProperties
                    }
                  >
                    <DepartmentCrest name={dept.name} className="h-14 w-14" />
                  </span>

                  <h2
                    className="accent font-serif text-2xl font-bold"
                    style={
                      {
                        "--accent-light": theme.ink,
                        "--accent-dark": theme.inkDark,
                      } as React.CSSProperties
                    }
                  >
                    {dept.name}
                  </h2>

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
                    {BLURB[dept.name] ?? BLURB.General}
                  </p>

                  <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-[var(--border)] pt-4 text-center">
                    <Stat label="Courses" value={String(dept.count)} />
                    <Stat label="Lessons" value={String(dept.lessons)} />
                    <Stat label="From" value={formatPrice(dept.from)} />
                  </dl>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand)]">
                    Enter department
                    <Icon
                      name="arrowRight"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dd className="font-serif text-lg font-bold text-[var(--text)]">
        {value}
      </dd>
      <dt className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-faint)]">
        {label}
      </dt>
    </div>
  );
}
