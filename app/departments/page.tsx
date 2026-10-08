import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCourseCategory } from "@/lib/course-categories";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Departments · EduPlatform",
  description: "Browse courses organized by department.",
};

const CATEGORIES = [
  {
    name: "Development",
    emoji: "💻",
    gradient: "from-violet-600/20 to-indigo-600/10",
    border: "border-violet-500/30",
    badge: "bg-violet-500/20 text-violet-300",
    dot: "bg-violet-400",
  },
  {
    name: "Data",
    emoji: "📊",
    gradient: "from-emerald-600/20 to-teal-600/10",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/20 text-emerald-300",
    dot: "bg-emerald-400",
  },
  {
    name: "Design",
    emoji: "🎨",
    gradient: "from-rose-600/20 to-pink-600/10",
    border: "border-rose-500/30",
    badge: "bg-rose-500/20 text-rose-300",
    dot: "bg-rose-400",
  },
  {
    name: "Business",
    emoji: "📈",
    gradient: "from-amber-600/20 to-yellow-600/10",
    border: "border-amber-500/30",
    badge: "bg-amber-500/20 text-amber-300",
    dot: "bg-amber-400",
  },
  {
    name: "Security",
    emoji: "🔒",
    gradient: "from-blue-600/20 to-sky-600/10",
    border: "border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-300",
    dot: "bg-blue-400",
  },
  {
    name: "Communication",
    emoji: "🗣️",
    gradient: "from-pink-600/20 to-fuchsia-600/10",
    border: "border-pink-500/30",
    badge: "bg-pink-500/20 text-pink-300",
    dot: "bg-pink-400",
  },
  {
    name: "General",
    emoji: "📚",
    gradient: "from-purple-600/20 to-violet-600/10",
    border: "border-purple-500/30",
    badge: "bg-purple-500/20 text-purple-300",
    dot: "bg-purple-400",
  },
];

export default async function DepartmentsPage() {
  const allCourses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
  });

  // Group courses by category
  const grouped: Record<string, typeof allCourses> = {};
  for (const course of allCourses) {
    const resolvedCategory = getCourseCategory(course);
    const cat = CATEGORIES.some((category) => category.name === resolvedCategory)
      ? resolvedCategory
      : "General";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(course);
  }

  return (
    <>
      <PageHeader
        eyebrow="The Academy"
        title="Departments"
        lead="Explore courses organized by discipline. Click a department to browse its courses."
      />

      <section className="px-6 py-12 xl:px-10 text-white">
        <div className="mx-auto max-w-[1400px]">

          {/* Summary stats bar */}
          <div className="mb-10 flex flex-wrap gap-4">
            {CATEGORIES.map((cat) => {
              const count = grouped[cat.name]?.length ?? 0;
              return (
                <a
                  key={cat.name}
                  href={`#dept-${cat.name.toLowerCase()}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border ${cat.border} ${cat.badge} text-sm font-medium transition hover:scale-105`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                  <span className="ml-1 bg-black/20 px-2 py-0.5 rounded-full text-xs">{count}</span>
                </a>
              );
            })}
          </div>

          {/* Department sections */}
          <div className="space-y-16">
            {CATEGORIES.map((cat, ci) => {
              const courses = grouped[cat.name] ?? [];
              return (
                <div key={cat.name} id={`dept-${cat.name.toLowerCase()}`}>
                  <Reveal delay={ci * 0.05}>
                    <div className={`flex items-center gap-3 mb-6 pb-3 border-b border-white/10`}>
                      <span className="text-3xl">{cat.emoji}</span>
                      <div>
                        <h2 className="text-2xl font-bold">{cat.name}</h2>
                        <p className="text-sm text-gray-400">{courses.length} course{courses.length !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                  </Reveal>

                  {courses.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/15 p-8 text-center text-gray-500 text-sm">
                      No courses in this department yet.
                    </div>
                  ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {courses.map((course, i) => (
                        <Reveal key={course.id} delay={ci * 0.05 + i * 0.06}>
                          <Link
                            href={`/courses/${course.id}`}
                            className="group block h-full"
                          >
                            <div
                              className={`relative h-full rounded-xl border ${cat.border} bg-gradient-to-br ${cat.gradient} p-5 transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(255,255,255,0.05)]`}
                            >
                              {/* Category badge */}
                              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${cat.badge}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${cat.dot}`} />
                                {cat.name}
                              </span>

                              <h3 className="text-base font-bold text-white group-hover:text-yellow-300 transition-colors leading-snug mb-2">
                                {course.title}
                              </h3>
                              <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                                {course.description}
                              </p>

                              {/* Topics */}
                              <div className="flex flex-wrap gap-1.5">
                                {course.topics.split(",").filter((topic) => topic.trim()).slice(0, 3).map((t) => (
                                  <span
                                    key={t.trim()}
                                    className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded"
                                  >
                                    {t.trim()}
                                  </span>
                                ))}
                              </div>

                              {/* Arrow */}
                              <div className="absolute bottom-4 right-4 text-gray-600 group-hover:text-yellow-400 transition-colors text-lg">
                                →
                              </div>
                            </div>
                          </Link>
                        </Reveal>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
