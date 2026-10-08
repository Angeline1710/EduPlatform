"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const COURSE_CATEGORIES = ["Development", "Data", "Design", "Business", "Security", "Communication", "General"];

type CourseWriteData = {
  title: string;
  description: string;
  topics: string;
  internRole: string;
  category: string;
  price: number;
  thumbnailUrl: string | null;
  gifUrl: string | null;
  published: boolean;
};

function validateCourseData(data: CourseWriteData): CourseWriteData {
  if (!data.title.trim() || !data.description.trim()) {
    throw new Error("Course title and description are required.");
  }
  if (!COURSE_CATEGORIES.includes(data.category)) {
    throw new Error("Choose a valid course category.");
  }
  if (!Number.isFinite(data.price) || data.price < 0) {
    throw new Error("Course price must be a non-negative number.");
  }
  for (const [label, value] of [["Thumbnail URL", data.thumbnailUrl], ["Course GIF URL", data.gifUrl]] as const) {
    if (value) {
      let url: URL;
      try {
        url = new URL(value);
      } catch {
        throw new Error(`${label} must be a valid URL.`);
      }
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        throw new Error(`${label} must use HTTP or HTTPS.`);
      }
    }
  }

  return {
    ...data,
    title: data.title.trim(),
    description: data.description.trim(),
    topics: data.topics.trim(),
    internRole: data.internRole.trim(),
    thumbnailUrl: data.thumbnailUrl?.trim() || null,
    gifUrl: data.gifUrl?.trim() || null,
  };
}

function revalidateCoursePages() {
  revalidatePath("/admin");
  revalidatePath("/courses");
  revalidatePath("/", "page");
  revalidatePath("/departments");
  revalidatePath("/dashboard");
  revalidatePath("/courses/[id]", "page");
  revalidatePath("/api/recommendations");
}

export async function addCourse(data: CourseWriteData) {
  await prisma.course.create({ data: validateCourseData(data) });
  revalidateCoursePages();
}

export async function updateCourse(id: string, data: CourseWriteData) {
  await prisma.course.update({ where: { id }, data: validateCourseData(data) });
  revalidateCoursePages();
}

export async function deleteCourse(id: string) {
  await prisma.course.delete({ where: { id } });
  revalidateCoursePages();
}

export async function removeEnrollment(enrollmentId: string) {
  await prisma.courseEnrollment.delete({ where: { id: enrollmentId } });
  revalidatePath("/admin");
}

export async function updateLesson(id: string, data: { title: string; description: string; content: string }) {
  await prisma.lesson.update({ where: { id }, data });
  revalidatePath("/admin");
}

export async function addLesson(courseId: string, data: { title: string; description: string; content: string }) {
  const title = data.title.trim();
  const description = data.description.trim();
  const content = data.content.trim();
  if (!title || !description || !content) {
    throw new Error("Lesson title, description, and content are required.");
  }

  const lastLesson = await prisma.lesson.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const lesson = await prisma.lesson.create({
    data: { courseId, title, description, content, order: (lastLesson?.order ?? 0) + 1 },
  });
  revalidatePath("/admin");
  revalidatePath(`/courses/${courseId}`);
  return lesson;
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
