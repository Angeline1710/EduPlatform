import "dotenv/config";
import { readFileSync } from "node:fs";
import path from "node:path";
import { prisma } from "../lib/prisma";

type DsaLesson = {
  order: number;
  title: string;
  description: string;
  content: string;
};

function parseLessons(source: string): DsaLesson[] {
  const lessons: DsaLesson[] = [];
  let moduleTitle = "";
  let current:
    | { order: number; title: string; moduleTitle: string; lines: string[] }
    | undefined;

  const saveCurrent = () => {
    if (!current) return;
    const body = current.lines.join("\n").trim();
    if (!body) {
      throw new Error(`Lesson ${current.order} has no content.`);
    }

    const firstParagraph =
      body
        .split(/\r?\n/)
        .map((line) => line.trim())
        .find((line) => line && !line.startsWith("#") && !line.startsWith("```")) ??
      current.title;
    const description = firstParagraph
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .slice(0, 240);

    lessons.push({
      order: current.order,
      title: `Lesson ${String(current.order).padStart(2, "0")}: ${current.title}`,
      description,
      content: `Module: ${current.moduleTitle}\n\n${body}`,
    });
  };

  for (const line of source.split(/\r?\n/)) {
    const moduleMatch = line.match(/^# MODULE \d+:\s*(.+)$/);
    if (moduleMatch) {
      moduleTitle = moduleMatch[1].trim();
      continue;
    }

    const lessonMatch = line.match(/^## Lesson (\d+):\s*(.+)$/);
    if (lessonMatch) {
      saveCurrent();
      current = {
        order: Number(lessonMatch[1]),
        title: lessonMatch[2].trim(),
        moduleTitle,
        lines: [],
      };
      continue;
    }

    if (current) current.lines.push(line);
  }
  saveCurrent();

  if (lessons.length === 0) {
    throw new Error("No lessons were found in DSA using python.txt.");
  }
  lessons.forEach((lesson, index) => {
    if (lesson.order !== index + 1) {
      throw new Error(
        `Expected lesson ${index + 1}, but found lesson ${lesson.order}.`,
      );
    }
    if (/```[a-zA-Z]*\s*```/.test(lesson.content)) {
      throw new Error(`Lesson ${lesson.order} contains an empty example placeholder.`);
    }
  });

  return lessons;
}

async function main() {
  const sourcePath = path.join(process.cwd(), "DSA using python.txt");
  const lessons = parseLessons(readFileSync(sourcePath, "utf8"));
  const dryRun = process.argv.includes("--dry-run");

  if (dryRun) {
    console.log(`Validated ${lessons.length} DSA lessons from ${sourcePath}.`);
    for (const lesson of lessons) {
      console.log(`${String(lesson.order).padStart(2, "0")}. ${lesson.title}`);
    }
    return;
  }

  const existingCourse = await prisma.course.findFirst({
    where: { title: { equals: "DSA Using Python", mode: "insensitive" } },
    select: { id: true },
  });

  const courseData = {
    title: "DSA Using Python",
    description:
      "Build problem-solving skills with Python through core data structures, algorithms, and complexity analysis.",
    topics: "Python,Data Structures,Algorithms,DSA",
    category: "Development",
    categoryCustomized: true,
    internRole: "Software Development",
  };
  const course = existingCourse
    ? await prisma.course.update({
        where: { id: existingCourse.id },
        data: courseData,
      })
    : await prisma.course.create({
        data: {
          ...courseData,
          published: true,
          price: 0,
        },
      });

  const currentLessons = await prisma.lesson.findMany({
    where: { courseId: course.id },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: { id: true },
  });

  const existingLessons = lessons.slice(0, currentLessons.length);
  await Promise.all(
    existingLessons.map((lesson) =>
      prisma.lesson.update({
        where: { id: currentLessons[lesson.order - 1].id },
        data: {
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          order: lesson.order,
        },
      }),
    ),
  );

  const newLessons = lessons.slice(currentLessons.length);
  if (newLessons.length > 0) {
    await prisma.lesson.createMany({
      data: newLessons.map((lesson) => ({ ...lesson, courseId: course.id })),
    });
  }

  const result = {
    courseId: course.id,
    updated: existingLessons.length,
    created: newLessons.length,
    preservedExtra: Math.max(currentLessons.length - lessons.length, 0),
  };

  console.log(
    `Updated DSA Using Python (${result.courseId}): ${result.updated} lessons updated, ${result.created} added.`,
  );
  if (result.preservedExtra > 0) {
    console.warn(
      `${result.preservedExtra} additional existing lessons were preserved to avoid deleting learner progress.`,
    );
  }
}

main()
  .catch((error: unknown) => {
    console.error("Unable to import DSA course lessons.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
