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

  const credentialId = generateCredentialId();

  const issuedCredentialId = await prisma.$transaction(async (transaction) => {
    if (type === "COURSE" && courseId) {
      const existingCourseCertificate = await transaction.certificate.findUnique({
        where: {
          userId_courseId_type: { userId: user.id, courseId, type: "COURSE" },
        },
        select: {
          credentialId: true,
          issuedAt: true,
          periodStartDate: true,
          periodEndDate: true,
        },
      });

      const courseStartDate =
        existingCourseCertificate?.periodStartDate ?? startDate;
      const courseCompletionDate =
        existingCourseCertificate?.periodEndDate ??
        existingCourseCertificate?.issuedAt ??
        completionDate;
      const courseIssuedAt =
        existingCourseCertificate?.issuedAt ?? courseCompletionDate;

      if (!existingCourseCertificate) {
        await transaction.certificate.create({
          data: {
            userId: user.id,
            type: "COURSE",
            courseId,
            issuedAt: courseIssuedAt,
            periodStartDate: courseStartDate,
            periodEndDate: courseCompletionDate,
            credentialId,
          },
        });
      }

      const existingInternshipCertificate = await transaction.certificate.findFirst({
        where: {
          userId: user.id,
          type: "INTERNSHIP",
          courseId,
          internshipId: null,
        },
        select: { id: true },
      });
      if (!existingInternshipCertificate) {
        await transaction.certificate.create({
          data: {
            userId: user.id,
            type: "INTERNSHIP",
            courseId,
            issuedAt: courseIssuedAt,
            periodStartDate: courseStartDate,
            periodEndDate: courseCompletionDate,
            credentialId: generateCredentialId(),
          },
        });
      }

      await transaction.courseEnrollment.update({
        where: { userId_courseId: { userId: user.id, courseId } },
        data: { completedAt: courseCompletionDate },
      });

      return existingCourseCertificate?.credentialId ?? credentialId;
    }

    if (type === "INTERNSHIP" && internshipId) {
      const existingInternshipCertificate = await transaction.certificate.findUnique({
        where: {
          userId_internshipId_type: {
            userId: user.id,
            internshipId,
            type: "INTERNSHIP",
          },
        },
        select: { credentialId: true },
      });
      if (existingInternshipCertificate) {
        throw new Error("Certificate already claimed for this program.");
      }

      await transaction.certificate.create({
        data: {
          userId: user.id,
          type: "INTERNSHIP",
          internshipId,
          issuedAt: completionDate,
          periodStartDate: startDate,
          periodEndDate: completionDate,
          credentialId,
        },
      });

      await transaction.internshipEnrollment.update({
        where: { userId_internshipId: { userId: user.id, internshipId } },
        data: { completedAt: completionDate },
      });
    }

    return credentialId;
  });

  revalidatePath("/dashboard");
  if (courseId) revalidatePath(`/courses/${courseId}`);
  return issuedCredentialId;
}
