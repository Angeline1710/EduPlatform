import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import crypto from 'crypto';

function generateCredentialId() {
  const randomChars = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `EDU-${randomChars}`;
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    const url = new URL(req.url);
    const courseId = url.searchParams.get('courseId');
    const internshipId = url.searchParams.get('internshipId');
    const type = url.searchParams.get('type'); // "COURSE" | "INTERNSHIP"

    // To allow testing without auth, we can create a dummy user or just require auth
    // Wait, let's just create a dummy if not logged in to make testing easier
    let userId = "demo-user-id";
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (user) userId = user.id;
    } else {
      // Create a dummy user for demo if it doesn't exist
      const demo = await prisma.user.upsert({
        where: { email: "demo@eduplatform.com" },
        update: {},
        create: {
          id: "demo-user-id",
          name: "Demo Student",
          email: "demo@eduplatform.com",
          passwordHash: "demo",
        },
      });
      userId = demo.id;
    }

    if (!courseId && !internshipId) {
      return NextResponse.json({ error: 'Must provide courseId or internshipId' }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({ error: 'Must provide type (COURSE or INTERNSHIP)' }, { status: 400 });
    }

    let existingCertificate = null;

    if (courseId) {
      existingCertificate = await prisma.certificate.findUnique({
        where: {
          userId_courseId_type: { userId, courseId, type },
        },
      });
    } else if (internshipId) {
      existingCertificate = await prisma.certificate.findUnique({
        where: {
          userId_internshipId_type: { userId, internshipId, type },
        },
      });
    }

    if (existingCertificate) {
      return NextResponse.redirect(new URL(`/verify/${existingCertificate.credentialId}`, req.url));
    }

    // Generate new certificate
    let isUnique = false;
    let newCredentialId = '';

    while (!isUnique) {
      newCredentialId = generateCredentialId();
      const duplicate = await prisma.certificate.findUnique({
        where: { credentialId: newCredentialId },
      });
      if (!duplicate) {
        isUnique = true;
      }
    }

    const newCertificate = await prisma.certificate.create({
      data: {
        credentialId: newCredentialId,
        type,
        userId: userId,
        courseId: courseId || null,
        internshipId: internshipId || null,
      },
    });

    return NextResponse.redirect(new URL(`/verify/${newCertificate.credentialId}`, req.url));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
