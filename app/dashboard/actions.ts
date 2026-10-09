"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateCredentialId } from "@/lib/credentials";

export async function claimCertificate({
  type,
  courseId,
  internshipId,
}: {
  type: "COURSE" | "INTERNSHIP";
  courseId?: string;
  internshipId?: string;
}) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("User not found");

  if (type !== "COURSE" && type !== "INTERNSHIP") {
    throw new Error("Choose a valid certificate type.");
  }

  if ((type === "COURSE" && (!courseId || internshipId)) ||
      (type === "INTERNSHIP" && (!internshipId || courseId))) {
    throw new Error("Choose exactly one valid certificate type and program.");
  }

  let startDate: Date | null = null;
  let completionDate: Date | null = null;
  if (type === "COURSE" && courseId) {
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
      include: {
        course: { select: { lessons: { select: { id: true } } } },
      },
    });
    if (!enrollment) throw new Error("You must be enrolled in this course to claim its certificate.");
    startDate = enrollment.enrolledAt;
    completionDate = enrollment.completedAt ?? new Date();

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

  if (type === "INTERNSHIP" && internshipId) {
    const enrollment = await prisma.internshipEnrollment.findUnique({
      where: { userId_internshipId: { userId: user.id, internshipId } },
      select: { enrolledAt: true, completedAt: true },
    });
    if (!enrollment) {
      throw new Error("You must be enrolled in this internship to claim its certificate.");
    }
    startDate = enrollment.enrolledAt;
    completionDate = enrollment.completedAt ?? new Date();
  }

  if (!startDate || !completionDate || startDate > completionDate) {
    throw new Error("The program start date must be on or before its completion date. Ask an admin to update the dates.");
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

  const credentialId = generateCredentialId();

  await prisma.$transaction(async (transaction) => {
    await transaction.certificate.create({
      data: {
        userId: user.id,
        type,
        courseId: courseId || null,
        internshipId: internshipId || null,
        issuedAt: completionDate,
        periodStartDate: startDate,
        periodEndDate: completionDate,
        credentialId,
      }
    });

    if (type === "COURSE" && courseId) {
      await transaction.courseEnrollment.update({
        where: { userId_courseId: { userId: user.id, courseId } },
        data: { completedAt: completionDate },
      });
    } else if (type === "INTERNSHIP" && internshipId) {
      await transaction.internshipEnrollment.update({
        where: { userId_internshipId: { userId: user.id, internshipId } },
        data: { completedAt: completionDate },
      });
    }
  });

  revalidatePath("/dashboard");
  if (courseId) revalidatePath(`/courses/${courseId}`);
  return credentialId;
}
