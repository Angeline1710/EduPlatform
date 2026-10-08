"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { parseDateOnly, parseOneMonthPeriod } from "@/lib/certificate-dates";

function parseInternshipCompletionDate(value: string): Date {
  const date = parseDateOnly(value);
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const endExclusive = new Date(today);
  endExclusive.setUTCDate(1);
  endExclusive.setUTCMonth(endExclusive.getUTCMonth() + 1);
  const lastDayOfMonth = new Date(
    Date.UTC(endExclusive.getUTCFullYear(), endExclusive.getUTCMonth() + 1, 0),
  ).getUTCDate();
  endExclusive.setUTCDate(Math.min(today.getUTCDate(), lastDayOfMonth));

  if (date < today || date >= endExclusive) {
    throw new Error("Completion date must be from today to strictly less than one month from today.");
  }
  return date;
}

export async function claimCertificate({
  type,
  courseId,
  internshipId,
  issuedAt,
  periodStartDate,
  periodEndDate,
}: {
  type: "COURSE" | "INTERNSHIP";
  courseId?: string;
  internshipId?: string;
  issuedAt?: string;
  periodStartDate?: string;
  periodEndDate?: string;
}) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("User not found");

  if ((type === "COURSE" && (!courseId || internshipId)) ||
      (type === "INTERNSHIP" && (!internshipId || courseId))) {
    throw new Error("Choose exactly one valid certificate type and program.");
  }

  const completionPeriod = type === "COURSE"
    ? (() => {
        if (!periodStartDate || !periodEndDate) {
          throw new Error("Choose both the course start and completion dates.");
        }
        return parseOneMonthPeriod(periodStartDate, periodEndDate);
      })()
    : null;
  const completionDate = completionPeriod?.endDate
    ?? (issuedAt ? parseInternshipCompletionDate(issuedAt) : null);
  if (!completionDate) throw new Error("Choose a completion date.");

  if (type === "COURSE" && courseId) {
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
      include: {
        course: { select: { lessons: { select: { id: true } } } },
      },
    });
    if (!enrollment) throw new Error("You must be enrolled in this course to claim its certificate.");

    const lessonCount = enrollment.course.lessons.length;
    if (lessonCount === 0) throw new Error("This course has no lessons to complete.");
    const completedCount = await prisma.lessonProgress.count({
      where: {
        userId: user.id,
        lesson: { courseId },
      },
    });
    if (completedCount < Math.ceil(lessonCount * 0.85)) {
      throw new Error("Master at least 85% of the course lessons before claiming this certificate.");
    }
  }

  // Check if certificate already exists
  const existing = await prisma.certificate.findFirst({
    where: {
      userId: user.id,
      type,
      courseId: courseId || null,
      internshipId: internshipId || null,
    }
  });

  if (existing) {
    throw new Error("Certificate already claimed for this program.");
  }

  const credentialId = `EDU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  await prisma.certificate.create({
    data: {
      userId: user.id,
      type,
      courseId: courseId || null,
      internshipId: internshipId || null,
      issuedAt: completionDate,
      periodStartDate: completionPeriod?.startDate ?? null,
      periodEndDate: completionPeriod?.endDate ?? null,
      credentialId,
    }
  });

  revalidatePath("/dashboard");
  if (courseId) revalidatePath(`/courses/${courseId}`);
  return credentialId;
}
