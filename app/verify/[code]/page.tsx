import Link from "next/link";
import { auth } from "@/lib/auth";
import Certificate from "@/components/Certificate";
import DownloadCertificate from "@/components/DownloadCertificate";
import VerifyForm from "@/components/VerifyForm";
import Icon from "@/components/Icon";
import {
  findCredential,
  findUserCredentials,
  ensureCourseInternshipCertificate,
  getCredentialInternRole,
  getCredentialProgramTitle,
  hasConsistentCredentialRelations,
  normalizeCredentialId,
} from "@/lib/credentials";

export const dynamic = "force-dynamic";

export default async function VerifyResultPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const normalized = normalizeCredentialId(code);
  const record = normalized ? await findCredential(normalized) : null;
  const valid = Boolean(record && hasConsistentCredentialRelations(record));
  const certificate = valid ? record : null;
  const foundButInconsistent = Boolean(record && !valid);
  const session = certificate?.type === "COURSE" ? await auth() : null;
  if (
    certificate?.type === "COURSE" &&
    session?.user?.id === certificate.userId
  ) {
    await ensureCourseInternshipCertificate(certificate);
  }
  const certificates = certificate
    ? (await findUserCredentials(certificate.userId)).filter(
        hasConsistentCredentialRelations,
      )
    : [];

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
            {valid
              ? "Valid credential"
              : foundButInconsistent
                ? "Credential record is inconsistent"
                : "Credential not found"}
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            {valid
              ? `Issued by EduPlatform on ${new Date(certificate!.issuedAt).toLocaleDateString()}.`
              : foundButInconsistent
                ? "This credential record does not match a valid program type. Contact EduPlatform support."
                : `No certificate matches ${normalized ?? code.trim().toUpperCase()}.`}
          </p>
        </div>
      </div>

      {certificate && normalized ? (
        <div className="space-y-6">
          <section
            aria-label="Verified credential details"
            className="grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                Recipient
              </p>
              <p className="mt-1 font-semibold text-[var(--text)]">
                {certificate.user.title} {certificate.user.name}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                {certificate.type === "COURSE" ? "Course certificate" : "Internship certificate"}
              </p>
              <p className="mt-1 font-semibold text-[var(--text)]">
                {getCredentialProgramTitle(certificate)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                Credential ID
              </p>
              <p className="mt-1 break-all font-mono text-sm font-semibold text-[var(--text)]">
                {certificate.credentialId}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                Issued on
              </p>
              <p className="mt-1 font-semibold text-[var(--text)]">
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "UTC",
                }).format(certificate.issuedAt)}
              </p>
            </div>
          </section>
          <section aria-label="Course and internship certificates" className="space-y-8">
            <h2 className="font-serif text-2xl font-bold text-[var(--text)]">
              Course and internship certificates
            </h2>
            {certificates.map((issuedCertificate) => (
              <CertificateView
                key={issuedCertificate.id}
                certificate={issuedCertificate}
              />
            ))}
          </section>
        </div>
      ) : (
        <div className="card p-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
          <p className="mb-4 font-semibold text-white">
            {foundButInconsistent
              ? "This credential cannot be verified."
              : "Check the ID and try again"}
          </p>
          <VerifyForm initialCode={normalized ?? code.trim()} />
        </div>
      )}
    </div>
  );
}

function CertificateView({
  certificate,
}: {
  certificate: NonNullable<Awaited<ReturnType<typeof findCredential>>>;
}) {
  const code = certificate.credentialId;
  const type = certificate.type === "COURSE" ? "Course" : "Internship";
  const title = getCredentialProgramTitle(certificate);
  if (!title) {
    throw new Error(`Credential ${code} has no associated program title.`);
  }

  return (
    <DownloadCertificate filename={`${code}-${type}`}>
      <Certificate
        holderName={`${certificate.user.title} ${certificate.user.name}`}
        title={title}
        type={type as "Course" | "Internship"}
        credentialId={code}
        issuedAt={certificate.issuedAt}
        internRole={getCredentialInternRole(certificate)}
        periodStartDate={certificate.periodStartDate}
        periodEndDate={certificate.periodEndDate}
      />
    </DownloadCertificate>
  );
}
