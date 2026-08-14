import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import BuyButton from "@/components/BuyButton";

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

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/" className="mb-6 inline-block text-sm text-blue-600 hover:underline">
        ← Back to courses
      </Link>

      <div className="rounded-lg border border-gray-200 bg-white p-8">
        <h1 className="mb-3 text-3xl font-bold">{course.title}</h1>
        <p className="mb-6 text-gray-600">{course.description}</p>

        <div className="mb-8 flex items-center gap-4">
          <span className="text-2xl font-bold">{formatPrice(course.price)}</span>
          {enrolled ? (
            <Link
              href={`/learn/${course.id}`}
              className="rounded bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700"
            >
              Go to course
            </Link>
          ) : session?.user ? (
            <BuyButton courseId={course.id} />
          ) : (
            <Link
              href="/login"
              className="rounded bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
            >
              Sign in to buy
            </Link>
          )}
        </div>

        <h2 className="mb-3 text-lg font-semibold">
          Course content · {course.lessons.length} lessons
        </h2>
        <ol className="divide-y divide-gray-100 rounded border border-gray-200">
          {course.lessons.map((lesson, i) => (
            <li key={lesson.id} className="flex items-center gap-3 px-4 py-3 text-sm">
              <span className="w-6 text-gray-400">{i + 1}</span>
              <span>{lesson.title}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
