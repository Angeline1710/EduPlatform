import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { notFound } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import { auth } from "@/lib/auth";
import EnrollButton from "@/components/EnrollButton";
import LessonViewer from "@/components/LessonViewer";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) {
    notFound();
  }

  let isEnrolled = false;
  let completedIds: string[] = [];
  let existingCertificateCode: string | null = null;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) {
      const enrollment = await prisma.courseEnrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId: id } }
      });
      if (enrollment) isEnrolled = true;

      const progress = await prisma.lessonProgress.findMany({
        where: { userId: user.id, lessonId: { in: course.lessons.map(l => l.id) } }
      });
      completedIds = progress.map(p => p.lessonId);

      const cert = await prisma.certificate.findUnique({
        where: { userId_courseId_type: { userId: user.id, courseId: id, type: "COURSE" } }
      });
      if (cert) existingCertificateCode = cert.credentialId;
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Course Overview"
        title={course.title}
        lead={course.description}
      />

      <section className="px-6 py-12 xl:px-10 text-white">
        <div className="mx-auto max-w-[1000px]">
          
          <div className="mb-10 flex flex-wrap gap-2">
            {course.topics.split(",").map((t) => (
              <span key={t.trim()} className="bg-indigo-600 text-sm text-white px-3 py-1 rounded-full">
                {t.trim()}
              </span>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-6">Syllabus & Subtopics</h2>

          {!isEnrolled ? (
            <>
              {course.lessons.length === 0 ? (
                <div className="rounded border border-dashed border-gray-700 p-8 text-center text-gray-400">
                  No lessons available yet.
                </div>
              ) : (
                <div className="space-y-4 mb-10">
                  {course.lessons.map((lesson, i) => (
                    <Reveal key={lesson.id} delay={i * 0.05}>
                      <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                            {lesson.order}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
                            <p className="mt-1 text-gray-400">{lesson.description}</p>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
              
              <div className="flex justify-center mt-8">
                {session ? (
                  <EnrollButton courseId={course.id} />
                ) : (
                  <Link href="/login" className="flex items-center gap-2 bg-[var(--gold)] hover:bg-[var(--gold-bright)] text-black font-bold py-3 px-8 rounded-full transition-all duration-300">
                    Sign in to Enroll
                  </Link>
                )}
              </div>
            </>
          ) : (
            <div className="mt-8">
              <LessonViewer
                lessons={course.lessons}
                completedIds={completedIds}
                canTrackProgress={true}
                existingCertificateCode={existingCertificateCode}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
