import Icon from "@/components/Icon";
import { categoryTheme } from "@/lib/categories";
import { formatIssueDate } from "@/lib/certificates";

type CertificateProps = {
  holderName: string;
  courseTitle: string;
  category: string;
  code: string;
  issuedAt: Date;
  lessonCount: number;
  qrMarkup: string;
  verifyUrl: string;
  revoked?: boolean;
};

/** The printable credential itself. Kept presentational so both the holder's
 *  page and the public verification page can render the same artifact. */
export default function Certificate({
  holderName,
  courseTitle,
  category,
  code,
  issuedAt,
  lessonCount,
  qrMarkup,
  verifyUrl,
  revoked = false,
}: CertificateProps) {
  const theme = categoryTheme(category);

  return (
    <div
      id="certificate"
      className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-panel)] sm:p-12"
    >
      {/* Corner wash in the course's category colour */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-25 blur-3xl"
        style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
      />

      {revoked && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-500">
          This credential has been revoked and is no longer valid.
        </div>
      )}

      <div className="relative flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="brand-gradient grid h-11 w-11 place-items-center rounded-xl text-white shadow-md">
            <Icon name="logo" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-bold tracking-tight">EduPlatform</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-faint)]">
              Certificate of Completion
            </p>
          </div>
        </div>

        <span
          className="rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
          style={{ backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
        >
          {category}
        </span>
      </div>

      <p className="relative mt-10 text-sm text-[var(--text-muted)]">
        This certifies that
      </p>
      <p className="relative mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
        {holderName}
      </p>

      <p className="relative mt-6 text-sm text-[var(--text-muted)]">
        has successfully completed all {lessonCount}{" "}
        {lessonCount === 1 ? "lesson" : "lessons"} of
      </p>
      <p className="relative mt-2 text-2xl font-bold sm:text-3xl">{courseTitle}</p>

      <div className="relative mt-10 flex flex-wrap items-end justify-between gap-8 border-t border-[var(--border)] pt-8">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-faint)]">
              Issued
            </p>
            <p className="mt-1 font-semibold">{formatIssueDate(issuedAt)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-faint)]">
              Credential ID
            </p>
            <p className="mt-1 font-mono text-lg font-bold tracking-wider text-[var(--brand)]">
              {code}
            </p>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-[var(--text-faint)]">
            Verify at {verifyUrl}
          </p>
        </div>

        <div className="text-center">
          <div
            className="overflow-hidden rounded-xl bg-white p-2 shadow-sm [&>svg]:block [&>svg]:h-32 [&>svg]:w-32"
            dangerouslySetInnerHTML={{ __html: qrMarkup }}
          />
          <p className="mt-2 text-xs font-medium text-[var(--text-faint)]">Scan to verify</p>
        </div>
      </div>
    </div>
  );
}
