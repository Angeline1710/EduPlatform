"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addCourse(data: { title: string; description: string; topics: string; internRole: string }) {
  await prisma.course.create({ data });
  revalidatePath("/admin/courses");
  revalidatePath("/admin");
}

export async function updateCourse(id: string, data: { title: string; description: string; topics: string; internRole: string }) {
  await prisma.course.update({ where: { id }, data });
  revalidatePath("/admin/courses");
  revalidatePath("/admin");
}

export async function deleteCourse(id: string) {
  await prisma.course.delete({ where: { id } });
  revalidatePath("/admin/courses");
  revalidatePath("/admin");
}

export async function removeEnrollment(enrollmentId: string) {
  await prisma.courseEnrollment.delete({ where: { id: enrollmentId } });
  revalidatePath("/admin/courses");
  revalidatePath("/admin");
}

export async function updateLesson(id: string, data: { title: string; description: string; content: string }) {
  await prisma.lesson.update({ where: { id }, data });
  revalidatePath("/admin");
}

export async function getUserDetails(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      courseEnrollments: { include: { course: true } },
      internshipEnrollments: { include: { internship: true } },
      certificates: { include: { course: true, internship: true } },
      lessonProgress: true,
      loginLogs: { orderBy: { loginAt: 'desc' } }
    }
  });
}
