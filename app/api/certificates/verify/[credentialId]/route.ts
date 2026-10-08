import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ credentialId: string }> }
) {
  try {
    const { credentialId } = await params;

    if (!credentialId) {
      return NextResponse.json({ error: 'Credential ID is required' }, { status: 400 });
    }

    const certificate = await prisma.certificate.findUnique({
      where: { credentialId },
      include: {
        user: {
          select: { name: true, email: true },
        },
        course: {
          select: { title: true },
        },
        internship: {
          select: { title: true },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found or invalid' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        credentialId: certificate.credentialId,
        issuedAt: certificate.issuedAt,
        periodStartDate: certificate.periodStartDate,
        periodEndDate: certificate.periodEndDate,
        recipient: certificate.user.name,
        type: certificate.course ? 'Course' : 'Internship',
        title: certificate.course?.title || certificate.internship?.title,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to verify certificate." },
      { status: 500 },
    );
  }
}
