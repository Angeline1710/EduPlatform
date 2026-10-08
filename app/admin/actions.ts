"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addCourse(data: { title: string; description: string; topics: string; internRole: string }) {
  await prisma.course.create({ data });
  revalidatePath("/admin");
  revalidatePath("/courses");
}

export async function updateCourse(id: string, data: { title: string; description: string; topics: string; internRole: string }) {
  await prisma.course.update({ where: { id }, data });
  revalidatePath("/admin");
  revalidatePath("/courses");
}

export async function deleteCourse(id: string) {
  await prisma.course.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/courses");
}

export async function removeEnrollment(enrollmentId: string) {
  await prisma.courseEnrollment.delete({ where: { id: enrollmentId } });
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
      loginLogs: { orderBy: { loginAt: "desc" } },
    },
  });
}

export async function grantCourseAccess(userId: string, courseId: string) {
  await prisma.courseEnrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId },
    update: {},
  });
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function deleteUser(userId: string) {
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function promoteToAdmin(userId: string) {
  await prisma.user.update({ where: { id: userId }, data: { role: "ADMIN" } });
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}
