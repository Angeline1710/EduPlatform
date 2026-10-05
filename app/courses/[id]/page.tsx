import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { notFound } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

          {course.lessons.length === 0 ? (
            <div className="rounded border border-dashed border-gray-700 p-8 text-center text-gray-400">
              No lessons available yet.
            </div>
          ) : (
            <div className="space-y-4">
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

          <div className="mt-16 pt-10 border-t border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center">Achievements & Certificates</h2>
            <p className="text-gray-400 text-center mb-8">
              Complete the course to earn your Course Completion and Internship certificates.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href={`/api/certificates/generate?courseId=${course.id}&type=COURSE`}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                <Icon name="medal" className="h-5 w-5" />
                Claim Course Certificate
              </a>
              
              <a
                href={`/api/certificates/generate?courseId=${course.id}&type=INTERNSHIP`}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                <Icon name="briefcase" className="h-5 w-5" />
                Claim Internship Certificate
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
