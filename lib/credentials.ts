import { prisma } from "@/lib/prisma";
import { randomBytes } from "node:crypto";

const credentialIdPattern = /^EDU-[A-Z0-9]+(?:-[A-Z0-9]+)*$/;

export function normalizeCredentialId(value: string): string | null {
  const normalized = value.trim().toUpperCase();
  if (normalized.length < 8 || normalized.length > 64) return null;
  return credentialIdPattern.test(normalized) ? normalized : null;
}

export function generateCredentialId(): string {
  return `EDU-${randomBytes(12).toString("hex").toUpperCase()}`;
}

export async function findCredential(credentialId: string) {
  return prisma.certificate.findUnique({
    where: { credentialId },
    include: {
      user: { select: { name: true, title: true } },
      course: { select: { title: true, internRole: true } },
      internship: { select: { title: true } },
    },
  });
}

export async function findUserCredentials(userId: string) {
  return prisma.certificate.findMany({
    where: { userId },
    include: {
      user: { select: { name: true, title: true } },
      course: { select: { title: true, internRole: true } },
      internship: { select: { title: true } },
    },
    orderBy: [{ type: "asc" }, { issuedAt: "desc" }],
  });
}

type CredentialRecord = NonNullable<Awaited<ReturnType<typeof findCredential>>>;

export function getCredentialProgramTitle(certificate: {
  type: string;
  course: { title: string } | null;
  internship: { title: string } | null;
}): string | null {
  if (certificate.type === "COURSE") {
    return certificate.course?.title ?? null;
  }
  if (certificate.type === "INTERNSHIP") {
    return certificate.internship?.title ?? certificate.course?.title ?? null;
  }
  return null;
}

export function hasConsistentCredentialRelations(
  certificate: CredentialRecord,
): boolean {
  if (!certificate.user.name.trim()) return false;

  const hasCourseRelation =
    certificate.type === "COURSE" &&
    Boolean(certificate.course?.title.trim()) &&
    certificate.internship === null;
  // Older internship claims were stored against a course instead of an internship.
  const hasInternshipRelation =
    certificate.type === "INTERNSHIP" &&
    ((Boolean(certificate.internship?.title.trim()) && certificate.course === null) ||
      (Boolean(certificate.course?.title.trim()) && certificate.internship === null));

  if (!hasCourseRelation && !hasInternshipRelation) return false;

  if (Boolean(certificate.periodStartDate) !== Boolean(certificate.periodEndDate)) {
    return false;
  }

  if (certificate.periodStartDate && certificate.periodEndDate) {
    if (certificate.periodStartDate > certificate.periodEndDate) {
      return false;
    }
    if (
      certificate.periodEndDate.toISOString().slice(0, 10) !==
      certificate.issuedAt.toISOString().slice(0, 10)
    ) {
      return false;
    }
  }

  return true;
}
