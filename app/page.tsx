import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export default async function HomePage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { lessons: true } } },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-10">
        <h1 className="mb-2 text-4xl font-bold">Learn something new today</h1>
        <p className="text-gray-600">
          {courses.length} expert-led courses. Buy once, keep lifetime access.
        </p>
      </section>

      {courses.length === 0 ? (
        <p className="text-gray-600">No courses published yet. Check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 transition hover:shadow-md"
            >
              <h2 className="mb-2 text-lg font-semibold">{course.title}</h2>
              <p className="mb-4 flex-1 text-sm text-gray-600">{course.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold">{formatPrice(course.price)}</span>
                <span className="text-xs text-gray-500">{course._count.lessons} lessons</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
