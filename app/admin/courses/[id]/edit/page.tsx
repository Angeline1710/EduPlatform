import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import CourseForm from "@/components/CourseForm";
import LessonManager from "@/components/LessonManager";
import Icon from "@/components/Icon";

export default async function EditCoursePage({
  params,
}: PageProps<"/admin/courses/[id]/edit">) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!course) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/admin"
        className="focus-ring mb-6 inline-flex items-center gap-2 rounded-full text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
      >
        <span className="rotate-180">
          <Icon name="arrowRight" className="h-4 w-4" />
        </span>
        Back to dashboard
      </Link>

      <h1 className="mb-8 text-4xl font-extrabold tracking-tight">
        Edit course
      </h1>

      <CourseForm course={course} />

      <h2 className="mb-4 mt-12 text-2xl font-bold tracking-tight">Lessons</h2>
      <LessonManager courseId={course.id} lessons={course.lessons} />
    </div>
  );
}
