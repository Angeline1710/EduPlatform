import Icon from "@/components/Icon";
import { categoryTheme } from "@/lib/categories";
import { formatIssueDate } from "@/lib/certificates";
import AcademySeal from "./magic/AcademySeal";

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
      className="paper relative overflow-hidden rounded-[4px] border-[8px] border-[var(--surface-2)] bg-[#F7F1E5] p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] sm:p-16 text-[#241026]"
    >
      {/* Inner ornamental border */}
      <div className="pointer-events-none absolute inset-2 border-[2px] border-[var(--gold)] opacity-50" />
      <div className="pointer-events-none absolute inset-3 border border-[var(--gold)] opacity-30" />

      {/* Corner wash in the course's category colour */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-15 blur-3xl mix-blend-multiply"
        style={{
          background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
        }}
      />

      {revoked && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-500">
          This credential has been revoked and is no longer valid.
        </div>
      )}

      <div className="relative flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <AcademySeal size={80} />
          <div>
            <p className="font-serif text-3xl font-bold tracking-tight text-[var(--academy-plum)]">
              EduPlatform
            </p>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#a87c33]">
              Academy of Knowledge
            </p>
          </div>
        </div>

        <span
          className="rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md border border-white/20"
          style={{
            backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
          }}
        >
          {category}
        </span>
      </div>

      <div className="text-center mt-12">
        <p className="font-serif text-lg italic text-[#6B5A63]">
          This certifies that the scholar
        </p>
        <p className="mt-4 font-serif text-5xl font-extrabold tracking-tight text-[var(--academy-purple)]">
          {holderName}
        </p>

        <div className="mx-auto mt-6 h-px w-64 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-60"></div>

        <p className="mt-6 font-serif text-lg italic text-[#6B5A63]">
          has demonstrated mastery in all {lessonCount}{" "}
          {lessonCount === 1 ? "manuscript" : "manuscripts"} of
        </p>
        <p className="mt-3 font-serif text-3xl font-bold text-[var(--academy-plum)]">
          {courseTitle}
        </p>
      </div>

      <div className="relative mt-16 flex flex-wrap items-end justify-between gap-8 border-t border-[var(--gold)]/30 pt-8">
        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#8a5a2b]">
              Inscribed On
            </p>
            <p className="mt-1 font-serif text-lg font-bold text-[#241026]">
              {formatIssueDate(issuedAt)}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#8a5a2b]">
              Seal ID
            </p>
            <p className="mt-1 font-mono text-xl font-bold tracking-wider text-[var(--academy-purple)]">
              {code}
            </p>
          </div>
          <p className="max-w-xs text-xs font-medium leading-relaxed text-[#6B5A63]">
            Verify authenticity at {verifyUrl}
          </p>
        </div>

        <div className="text-center">
          <div
            className="overflow-hidden rounded-md border border-[var(--gold)]/50 bg-white p-2 shadow-sm [&>svg]:block [&>svg]:h-32 [&>svg]:w-32 mix-blend-multiply"
            dangerouslySetInnerHTML={{ __html: qrMarkup }}
          />
          <p className="mt-3 text-[11px] font-bold uppercase tracking-widest text-[#8a5a2b]">
            Scan Sigil
          </p>
        </div>
      </div>
    </div>
  );
}
