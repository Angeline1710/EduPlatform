import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { qrSvg, verificationUrl } from "@/lib/qr";
import { formatIssueDate } from "@/lib/certificates";
import Certificate from "@/components/Certificate";
import VerifyForm from "@/components/VerifyForm";
import Icon from "@/components/Icon";

export default async function VerifyResultPage({ params }: PageProps<"/verify/[code]">) {
  const { code } = await params;
  const normalized = decodeURIComponent(code).trim().toUpperCase();

  const certificate = await prisma.certificate.findUnique({
    where: { code: normalized },
    include: {
      user: { select: { name: true } },
      course: {
        select: { title: true, category: true, _count: { select: { lessons: true } } },
      },
    },
  });

  const valid = Boolean(certificate && !certificate.revokedAt);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/verify"
        className="focus-ring mb-8 inline-flex items-center gap-2 rounded-full text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
      >
        <span className="rotate-180">
          <Icon name="arrowRight" className="h-4 w-4" />
        </span>
        Verify another
      </Link>

      {/* Verdict banner */}
      <div
        className={`animate-pop-in mb-8 flex items-center gap-4 rounded-2xl border px-6 py-5 ${
          valid
            ? "border-emerald-500/30 bg-emerald-500/10"
            : "border-red-500/30 bg-red-500/10"
        }`}
      >
        <span
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-white ${
            valid ? "bg-emerald-500" : "bg-red-500"
          }`}
        >
          <Icon name={valid ? "check" : "lock"} className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p
            className={`text-lg font-bold ${
              valid ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
            }`}
          >
            {valid
              ? "Valid credential"
              : certificate
                ? "Credential revoked"
                : "Credential not found"}
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            {valid
              ? `Issued by EduPlatform on ${formatIssueDate(certificate!.issuedAt)}.`
              : certificate
                ? "This certificate was issued but has since been revoked."
                : `No certificate matches ${normalized}.`}
          </p>
        </div>
      </div>

      {certificate ? (
        <CertificateView code={normalized} certificate={certificate} />
      ) : (
        <div className="card p-8">
          <p className="mb-4 font-semibold">Check the ID and try again</p>
          <VerifyForm initialCode={normalized} />
        </div>
      )}
    </div>
  );
}

async function CertificateView({
  code,
  certificate,
}: {
  code: string;
  certificate: {
    issuedAt: Date;
    revokedAt: Date | null;
    user: { name: string };
    course: { title: string; category: string; _count: { lessons: number } };
  };
}) {
  const verifyUrl = verificationUrl(code);
  const qrMarkup = await qrSvg(verifyUrl);

  return (
    <Certificate
      holderName={certificate.user.name}
      courseTitle={certificate.course.title}
      category={certificate.course.category}
      code={code}
      issuedAt={certificate.issuedAt}
      lessonCount={certificate.course._count.lessons}
      qrMarkup={qrMarkup}
      verifyUrl={verifyUrl}
      revoked={Boolean(certificate.revokedAt)}
    />
  );
}
