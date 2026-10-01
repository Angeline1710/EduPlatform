import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { issueCertificateIfEarned } from "@/lib/certificates";

const schema = z.object({
  lessonId: z.string().min(1),
  completed: z.boolean(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { lessonId, completed } = parsed.data;
  const userId = session.user.id;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, courseId: true },
  });
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  // Progress may only be recorded for a course the student actually owns.
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: lesson.courseId } },
  });
  if (!enrollment) {
    return NextResponse.json(
      { error: "You do not own this course." },
      { status: 403 },
    );
  }

  if (completed) {
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {},
      create: { userId, lessonId },
    });
  } else {
    await prisma.lessonProgress.deleteMany({ where: { userId, lessonId } });
  }

  const [total, done] = await Promise.all([
    prisma.lesson.count({ where: { courseId: lesson.courseId } }),
    prisma.lessonProgress.count({
      where: { userId, lesson: { courseId: lesson.courseId } },
    }),
  ]);

  // Completing the final lesson mints the credential.
  const certificate = completed
    ? await issueCertificateIfEarned(userId, lesson.courseId)
    : null;

  return NextResponse.json({
    completed,
    total,
    done,
    percent: total > 0 ? Math.round((done / total) * 100) : 0,
    certificateCode: certificate?.code ?? null,
  });
}
