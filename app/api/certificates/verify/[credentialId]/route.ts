import { NextResponse } from 'next/server';
import {
  findCredential,
  hasConsistentCredentialRelations,
  normalizeCredentialId,
} from '@/lib/credentials';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ credentialId: string }> }
) {
  try {
    const { credentialId: rawCredentialId } = await params;
    const credentialId = normalizeCredentialId(rawCredentialId);

    if (!credentialId) {
      return NextResponse.json(
        { success: false, valid: false, error: 'Invalid credential ID format.' },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const certificate = await findCredential(credentialId);

    if (!certificate) {
      return NextResponse.json(
        { success: false, valid: false, error: 'Credential not found.' },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!hasConsistentCredentialRelations(certificate)) {
      return NextResponse.json(
        { success: false, valid: false, error: 'Credential record is inconsistent.' },
        { status: 422, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json({
      success: true,
      valid: true,
      data: {
        credentialId: certificate.credentialId,
        issuedAt: certificate.issuedAt,
        periodStartDate: certificate.periodStartDate,
        periodEndDate: certificate.periodEndDate,
        recipient: certificate.user.name,
        type: certificate.type === "COURSE" ? "Course" : "Internship",
        title: certificate.course?.title ?? certificate.internship!.title,
      },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json(
      { success: false, valid: false, error: error instanceof Error ? error.message : "Unable to verify credential." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
