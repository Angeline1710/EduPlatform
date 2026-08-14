import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LessonViewer from "@/components/LessonViewer";

export default async function LearnPage({ params }: PageProps<"/learn/[courseId]">) {
  const { courseId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!course) notFound();

  const isAdmin = session.user.role === "ADMIN";
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
  });

  if (!enrollment && !isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="mb-3 text-2xl font-bold">You do not own this course</h1>
        <p className="mb-6 text-gray-600">Purchase it to unlock all lessons.</p>
        <Link
          href={`/courses/${course.id}`}
          className="inline-block rounded bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
        >
          View course
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">{course.title}</h1>
      <LessonViewer lessons={course.lessons} />
    </div>
  );
}
