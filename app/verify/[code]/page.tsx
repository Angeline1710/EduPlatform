import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Certificate from "@/components/Certificate";
import DownloadCertificate from "@/components/DownloadCertificate";
import VerifyForm from "@/components/VerifyForm";
import Icon from "@/components/Icon";

export default async function VerifyResultPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const normalized = decodeURIComponent(code).trim().toUpperCase();

  const certificate = await prisma.certificate.findUnique({
    where: { credentialId: normalized },
    include: {
      user: { select: { name: true, title: true } },
      course: { select: { title: true, internRole: true } },
      internship: { select: { title: true } },
    },
  });

  const valid = Boolean(certificate);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12">
      <Link
        href="/verify"
        className="focus-ring mb-8 inline-flex items-center gap-2 rounded-full text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
      >
        <span className="rotate-180">
          <Icon name="arrowRight" className="h-4 w-4" />
        </span>
        Verify another
      </Link>

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
            {valid ? "Valid credential" : "Credential not found"}
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            {valid
              ? `Issued by EduPlatform on ${new Date(certificate!.issuedAt).toLocaleDateString()}.`
              : `No certificate matches ${normalized}.`}
          </p>
        </div>
      </div>

      {certificate ? (
        <CertificateView code={normalized} certificate={certificate} />
      ) : (
        <div className="card p-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
          <p className="mb-4 font-semibold text-white">Check the ID and try again</p>
          <VerifyForm initialCode={normalized} />
        </div>
      )}
    </div>
  );
}

function CertificateView({
  code,
  certificate,
}: {
  code: string;
  certificate: any;
}) {
  const type = certificate.type === 'COURSE' ? 'Course' : 'Internship';
  const title = certificate.course?.title || certificate.internship?.title || 'Unknown Program';
  const internRole = certificate.course?.internRole || 'Software Development';

  return (
    <DownloadCertificate filename={`${code}-${type}`}>
      <Certificate
        holderName={`${certificate.user.title} ${certificate.user.name}`}
        title={title}
        type={type as "Course" | "Internship"}
        internRole={internRole}
        credentialId={code}
        issuedAt={certificate.issuedAt}
      />
    </DownloadCertificate>
  );
}
