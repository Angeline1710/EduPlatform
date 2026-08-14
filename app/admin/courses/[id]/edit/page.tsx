import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import CourseForm from "@/components/CourseForm";
import LessonManager from "@/components/LessonManager";

export default async function EditCoursePage({ params }: PageProps<"/admin/courses/[id]/edit">) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!course) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/admin" className="mb-6 inline-block text-sm text-blue-600 hover:underline">
        ← Back to dashboard
      </Link>
      <h1 className="mb-6 text-3xl font-bold">Edit course</h1>

      <CourseForm course={course} />

      <h2 className="mb-4 mt-10 text-2xl font-bold">Lessons</h2>
      <LessonManager courseId={course.id} lessons={course.lessons} />
    </div>
  );
}
