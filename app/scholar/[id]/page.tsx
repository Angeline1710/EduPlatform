import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  getProfile,
  educationLabel,
  experienceLabel,
  accoladeLabel,
} from "@/lib/profile";
import { formatIssueDate } from "@/lib/certificates";
import { categoryTheme } from "@/lib/categories";
import { DepartmentCrest } from "@/components/Crests";
import Avatar from "@/components/profile/Avatar";
import PageHeader from "@/components/PageHeader";
import Icon from "@/components/Icon";

/**
 * A scholar's public page.
 *
 * Deliberately a narrower view than the owner's own record: email, phone and
 * date of birth are never rendered here, whatever the visitor's relationship
 * to the account. What is shown is what someone would put on a professional
 * page — standing, education, interests and what they have earned.
 */
export default async function ScholarPage({
  params,
}: PageProps<"/scholar/[id]">) {
  const { id } = await params;

  const record = await getProfile(id);
  if (!record) notFound();

  const { user, profile, interests } = record;
  const session = await auth();
  const isOwner = session?.user?.id === id;
  const isAdmin = session?.user?.role === "ADMIN";

  // A private record is invisible to everyone but its owner and the academy.
  if (!profile?.isPublic && !isOwner && !isAdmin) notFound();

  const [enrollments, certificates, lessonsDone] = await Promise.all([
    prisma.enrollment.count({ where: { userId: id } }),
    prisma.certificate.findMany({
      where: { userId: id, revokedAt: null },
      orderBy: { issuedAt: "desc" },
      include: { course: { select: { title: true, category: true } } },
    }),
    prisma.lessonProgress.count({ where: { userId: id } }),
  ]);

  const languages = profile?.languages
    ?.split(",")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <>
      <PageHeader
        eyebrow="Scholar"
        title={user.name}
        lead={profile?.headline ?? undefined}
      />

      <section className="paper min-h-[60vh] px-6 py-12 xl:px-10">
        <div className="mx-auto max-w-[1000px]">
          {/* Shown only to the people who can see a page others cannot */}
          {!profile?.isPublic && (
            <div className="mb-6 flex items-center gap-3 rounded-sm border border-[var(--border-strong)] bg-[var(--surface-2)] px-4 py-3">
              <Icon
                name="lock"
                className="h-4 w-4 shrink-0 text-[var(--text-muted)]"
              />
              <p className="text-sm text-[var(--text-muted)]">
                This record is private.{" "}
                {isOwner ? (
                  <>
                    Only you and the academy can see it.{" "}
                    <Link
                      href="/profile/settings"
                      className="font-semibold text-[var(--brand)] hover:underline"
                    >
                      Make it public
                    </Link>
                  </>
                ) : (
                  "You are seeing it as an administrator."
                )}
              </p>
            </div>
          )}

          {/* Identity */}
          <div className="mb-6 flex flex-wrap items-center gap-6 rounded-sm border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
            <Avatar name={user.name} src={profile?.avatarUrl} size={96} />

            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-3xl font-bold text-[var(--text)]">
                {user.name}
                {profile?.pronouns && (
                  <span className="ml-2 align-middle text-sm font-normal text-[var(--text-faint)]">
                    ({profile.pronouns})
                  </span>
                )}
              </h2>
              {profile?.headline && (
                <p className="mt-0.5 text-[var(--text-muted)]">
                  {profile.headline}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-[var(--text-muted)]">
                {(profile?.city || profile?.country) && (
                  <span className="inline-flex items-center gap-1.5">
                    <Icon
                      name="home"
                      className="h-3.5 w-3.5 text-[var(--gold)]"
                    />
                    {[profile.city, profile.country].filter(Boolean).join(", ")}
                  </span>
                )}
                {languages && languages.length > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <Icon
                      name="chat"
                      className="h-3.5 w-3.5 text-[var(--gold)]"
                    />
                    {languages.join(", ")}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Icon
                    name="clock"
                    className="h-3.5 w-3.5 text-[var(--gold)]"
                  />
                  Since {formatIssueDate(user.createdAt)}
                </span>
              </div>

              {(profile?.linkedinUrl ||
                profile?.githubUrl ||
                profile?.websiteUrl) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.linkedinUrl && (
                    <Chip
                      href={profile.linkedinUrl}
                      label="LinkedIn"
                      icon="linkedin"
                    />
                  )}
                  {profile.githubUrl && (
                    <Chip href={profile.githubUrl} label="GitHub" icon="code" />
                  )}
                  {profile.websiteUrl && (
                    <Chip
                      href={profile.websiteUrl}
                      label="Website"
                      icon="grid"
                    />
                  )}
                </div>
              )}
            </div>

            {isOwner && (
              <Link
                href="/profile"
                className="inline-flex shrink-0 items-center gap-2 rounded-md border border-[var(--gold)] px-4 py-2.5 text-sm font-semibold text-[var(--brand)] transition hover:bg-[var(--gold-soft)]"
              >
                My record
              </Link>
            )}
          </div>

          {/* Standing */}
          <div className="stagger mb-6 grid gap-4 sm:grid-cols-3">
            <Stat label="Courses" value={enrollments} icon="book" />
            <Stat label="Lessons mastered" value={lessonsDone} icon="check" />
            <Stat
              label="Credentials"
              value={certificates.length}
              icon="award"
              highlight
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {profile?.bio && (
              <Card title="About">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-muted)]">
                  {profile.bio}
                </p>
              </Card>
            )}

            {(profile?.educationLevel ||
              profile?.fieldOfStudy ||
              profile?.occupation) && (
              <Card title="Education & work">
                <dl className="space-y-2 text-sm">
                  <Row
                    label="Level"
                    value={educationLabel(profile?.educationLevel)}
                  />
                  <Row label="Field" value={profile?.fieldOfStudy} />
                  <Row label="Institution" value={profile?.institution} />
                  <Row label="Occupation" value={profile?.occupation} />
                  <Row
                    label="Experience"
                    value={experienceLabel(profile?.experienceLevel)}
                  />
                </dl>
              </Card>
            )}

            {interests.length > 0 && (
              <Card title="Studying">
                <div className="flex flex-wrap gap-2">
                  {interests.map((name) => {
                    const theme = categoryTheme(name);
                    return (
                      <span
                        key={name}
                        className="accent inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-sm"
                        style={
                          {
                            "--accent-light": theme.ink,
                            "--accent-dark": theme.inkDark,
                          } as React.CSSProperties
                        }
                      >
                        <DepartmentCrest name={name} className="h-4 w-4" />
                        {name}
                      </span>
                    );
                  })}
                </div>
              </Card>
            )}

            {profile?.accolades && profile.accolades.length > 0 && (
              <Card title="Competitions & certifications">
                <ul className="space-y-3">
                  {profile.accolades.map((a) => (
                    <li
                      key={a.id}
                      className="border-l-2 border-[var(--gold)] pl-3"
                    >
                      <p className="font-semibold text-[var(--text)]">
                        {a.url ? (
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {a.title}
                          </a>
                        ) : (
                          a.title
                        )}
                      </p>
                      <p className="text-xs text-[var(--text-faint)]">
                        {[accoladeLabel(a.kind), a.issuer, a.year]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* Credentials — publicly verifiable, so they belong here */}
          {certificates.length > 0 && (
            <>
              <h2 className="mb-4 mt-8 font-serif text-2xl font-bold text-[var(--brand)]">
                Credentials earned
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {certificates.map((c) => (
                  <Link
                    key={c.id}
                    href={`/verify/${c.code}`}
                    className="group rounded-sm border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:-translate-y-1 hover:border-[var(--gold)]"
                  >
                    <span className="mb-3 inline-grid h-11 w-11 place-items-center rounded-sm border border-[var(--gold)] text-[var(--gold)] transition group-hover:bg-[var(--gold-soft)]">
                      <Icon name="award" className="h-5 w-5" />
                    </span>
                    <p className="font-serif font-bold text-[var(--text)]">
                      {c.course.title}
                    </p>
                    <p className="mt-1 font-mono text-xs text-[var(--brand)]">
                      {c.code}
                    </p>
                    <p className="mt-2 text-xs text-[var(--text-faint)]">
                      Issued {formatIssueDate(c.issuedAt)} · verify
                    </p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-sm border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <h3 className="mb-4 font-serif text-lg font-bold text-[var(--brand)]">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-3">
      <dt className="w-24 shrink-0 text-xs text-[var(--text-faint)]">
        {label}
      </dt>
      <dd className="text-[var(--text)]">{value}</dd>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: number;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-sm border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <span
        className={`mb-3 inline-grid h-10 w-10 place-items-center rounded-sm border ${
          highlight
            ? "border-[var(--gold)] bg-[var(--gold-soft)] text-[var(--gold)]"
            : "border-[var(--border)] text-[var(--text-muted)]"
        }`}
      >
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <p className="font-serif text-3xl font-bold text-[var(--text)]">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
        {label}
      </p>
    </div>
  );
}

function Chip({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-muted)] transition hover:border-[var(--gold)] hover:text-[var(--text)]"
    >
      <Icon name={icon} className="h-3.5 w-3.5" />
      {label}
    </a>
  );
}
