import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * Credential codes are read aloud, typed by hand, and printed, so the alphabet
 * excludes characters that are easy to confuse (0/O, 1/I/L, 5/S, 8/B).
 */
const ALPHABET = "ACDEFGHJKMNPQRTUVWXY2346789";

function randomBlock(length: number) {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

/** e.g. EDU-7K3M-QP4X-9RTD */
export function generateCredentialCode() {
  return `EDU-${randomBlock(4)}-${randomBlock(4)}-${randomBlock(4)}`;
}

/** True when the student has completed every lesson in the course. */
export async function hasCompletedCourse(userId: string, courseId: string) {
  const [total, done] = await Promise.all([
    prisma.lesson.count({ where: { courseId } }),
    prisma.lessonProgress.count({ where: { userId, lesson: { courseId } } }),
  ]);
  return total > 0 && done >= total;
}

/**
 * Issues a certificate if the course is complete and the student does not
 * already hold one. Safe to call repeatedly — returns the existing credential
 * rather than minting a duplicate.
 */
export async function issueCertificateIfEarned(
  userId: string,
  courseId: string,
) {
  const existing = await prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) return existing;

  if (!(await hasCompletedCourse(userId, courseId))) return null;

  // The unique constraint on `code` is the real guard; retry on the rare clash.
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await prisma.certificate.create({
        data: { code: generateCredentialCode(), userId, courseId },
      });
    } catch (err) {
      const code = (err as { code?: string }).code;
      // P2002 = unique violation. On userId_courseId another request won the
      // race, so return what it created rather than erroring.
      if (code === "P2002") {
        const raced = await prisma.certificate.findUnique({
          where: { userId_courseId: { userId, courseId } },
        });
        if (raced) return raced;
        continue;
      }
      throw err;
    }
  }
  return null;
}

export function formatIssueDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
