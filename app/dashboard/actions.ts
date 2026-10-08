"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function claimCertificate({
  type,
  courseId,
  internshipId,
  issuedAt
}: {
  type: "COURSE" | "INTERNSHIP";
  courseId?: string;
  internshipId?: string;
  issuedAt: string;
}) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("User not found");

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
      issuedAt: new Date(issuedAt),
      credentialId,
    }
  });

  revalidatePath("/dashboard");
}
