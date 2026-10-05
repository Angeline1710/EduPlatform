import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

export const metadata = {
  title: "Courses · EduPlatform",
  description: "Browse all courses.",
};

export default async function CoursesPage() {
  const allCourses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader
        eyebrow="The Academy"
        title="Courses"
        lead="Browse all courses offered by the academy."
      />

      <section className="px-6 py-12 xl:px-10 text-white">
        <div className="mx-auto max-w-[1400px]">
          
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-gray-700 pb-4">
            <p className="text-sm text-gray-400">
              {allCourses.length === 0 ? (
                "No courses available yet."
              ) : (
                <>Showing <span className="font-bold text-white">{allCourses.length}</span> courses.</>
              )}
            </p>
          </div>

          {allCourses.length === 0 ? (
            <div className="mx-auto mt-10 max-w-lg rounded border border-dashed border-gray-700 px-6 py-14 text-center">
              <p className="font-serif text-2xl font-bold text-white">
                No courses available yet.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {allCourses.map((course, i) => (
                <Reveal key={course.id} delay={(i % 3) * 0.06}>
                  <Link href={`/courses/${course.id}`} className="block h-full transition hover:scale-[1.02]">
                    <div className="bg-gray-800 p-6 rounded shadow border border-gray-700 h-full">
                      <h3 className="text-xl font-bold text-white">{course.title}</h3>
                      <p className="mt-2 text-sm text-gray-400">{course.description}</p>
                      <div className="mt-4 flex gap-2 flex-wrap">
                        {course.topics.split(',').map(t => (
                           <span key={t.trim()} className="bg-indigo-600 text-xs text-white px-2 py-1 rounded">{t.trim()}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
