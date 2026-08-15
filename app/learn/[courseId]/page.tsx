import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LessonViewer from "@/components/LessonViewer";
import Icon from "@/components/Icon";
import { categoryTheme } from "@/lib/categories";

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
  const [enrollment, progress, certificate] = await Promise.all([
    prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    }),
    prisma.lessonProgress.findMany({
      where: { userId: session.user.id, lesson: { courseId } },
      select: { lessonId: true },
    }),
    prisma.certificate.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
      select: { code: true, revokedAt: true },
    }),
  ]);

  if (!enrollment && !isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
          <Icon name="lock" className="h-6 w-6" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight">You do not own this course</h1>
        <p className="mt-2 text-[var(--text-muted)]">Purchase it to unlock all lessons.</p>
        <Link href={`/courses/${course.id}`} className="btn btn-primary mt-7">
          View course
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const theme = categoryTheme(course.category);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Link
        href="/dashboard"
        className="focus-ring mb-6 inline-flex items-center gap-2 rounded-full text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
      >
        <span className="rotate-180">
          <Icon name="arrowRight" className="h-4 w-4" />
        </span>
        My learning
      </Link>

      <div className="mb-8 flex items-center gap-4">
        <span
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white shadow-lg"
          style={{ backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
        >
          <Icon name={theme.icon} className="h-6 w-6" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
            {course.category}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">{course.title}</h1>
        </div>

        {isAdmin && !enrollment && (
          <span className="ml-auto hidden rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] sm:block">
            Admin preview
          </span>
        )}
      </div>

      <LessonViewer
        lessons={course.lessons}
        completedIds={progress.map((p) => p.lessonId)}
        canTrackProgress={Boolean(enrollment)}
        existingCertificateCode={certificate && !certificate.revokedAt ? certificate.code : null}
      />
    </div>
  );
}
