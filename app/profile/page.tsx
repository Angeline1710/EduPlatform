import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getProfile,
  educationLabel,
  experienceLabel,
  accoladeLabel,
} from "@/lib/profile";
import { formatIssueDate } from "@/lib/certificates";
import { categoryTheme } from "@/lib/categories";
import { DepartmentCrest } from "@/components/Crests";
import PageHeader from "@/components/PageHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import Avatar from "@/components/profile/Avatar";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";

export const metadata = { title: "My Record · EduPlatform" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const record = await getProfile(session.user.id);
  if (!record) redirect("/login");

  const { user, profile, age, interests, completeness } = record;

  const [enrollments, certificates, lessonsDone] = await Promise.all([
    prisma.enrollment.count({ where: { userId: user.id } }),
    prisma.certificate.count({ where: { userId: user.id, revokedAt: null } }),
    prisma.lessonProgress.count({ where: { userId: user.id } }),
  ]);

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <>
      <PageHeader
        eyebrow="The Academy"
        title="My Record"
        lead="What the academy knows about you — and what the owl uses to guide you."
      />

      <section className="paper min-h-[60vh] px-6 py-12 xl:px-10">
        <div className="mx-auto max-w-[1100px]">
          <ProfileTabs />

          {/* Identity */}
          <div className="mb-6 flex flex-wrap items-start gap-6 rounded-sm border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
            <Avatar name={user.name} src={profile?.avatarUrl} size={88} />

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
                <p className="mt-0.5 text-[var(--text-muted)]">{profile.headline}</p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="chat" className="h-3.5 w-3.5 text-[var(--gold)]" />
                  {user.email}
                </span>
                {age !== null && (
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="user" className="h-3.5 w-3.5 text-[var(--gold)]" />
                    {age} years old
                  </span>
                )}
                {(profile?.city || profile?.country) && (
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="home" className="h-3.5 w-3.5 text-[var(--gold)]" />
                    {[profile.city, profile.country].filter(Boolean).join(", ")}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="clock" className="h-3.5 w-3.5 text-[var(--gold)]" />
                  Joined {formatIssueDate(user.createdAt)}
                </span>
              </div>

              {(profile?.linkedinUrl || profile?.githubUrl || profile?.websiteUrl) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.linkedinUrl && <LinkChip href={profile.linkedinUrl} label="LinkedIn" icon="linkedin" />}
                  {profile.githubUrl && <LinkChip href={profile.githubUrl} label="GitHub" icon="code" />}
                  {profile.websiteUrl && <LinkChip href={profile.websiteUrl} label="Website" icon="grid" />}
                </div>
              )}
            </div>

            <Link
              href="/profile/edit"
              className="rune-edge inline-flex shrink-0 items-center gap-2 rounded-md border border-[var(--gold-bright)] bg-gradient-to-b from-[var(--gold)] to-[var(--gold-dim)] px-5 py-2.5 text-sm font-semibold text-[var(--on-gold)] transition hover:brightness-110"
            >
              Edit record
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>

          {/* Completeness — asks for specific things, not a nag */}
          {completeness.percent < 100 && (
            <Reveal className="mb-6">
              <div className="rounded-sm border border-[var(--gold)]/50 bg-[var(--gold-soft)] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[var(--brand)]">
                      Your record is {completeness.percent}% complete
                    </h3>
                    <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                      Each of these makes the owl's suggestions sharper.
                    </p>
                  </div>
                  <span className="font-serif text-2xl font-bold text-[var(--gold-dim)]">
                    {completeness.done}/{completeness.total}
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--surface)]">
                  <div
                    className="h-full rounded-full bg-[var(--gold)]"
                    style={{
                      width: `${completeness.percent}%`,
                      transition: "width 0.8s var(--ease-academy)",
                    }}
                  />
                </div>

                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {completeness.missing.slice(0, 4).map((m) => (
                    <li key={m.key} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rotate-45 bg-[var(--gold)]" />
                      <span>
                        <span className="font-semibold text-[var(--text)]">{m.label}</span>
                        <span className="block text-xs text-[var(--text-muted)]">{m.helps}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}

          {/* Standing */}
          <div className="stagger mb-6 grid gap-4 sm:grid-cols-3">
            <Stat label="Courses" value={enrollments} icon="book" />
            <Stat label="Lessons mastered" value={lessonsDone} icon="check" />
            <Stat label="Credentials" value={certificates} icon="award" highlight />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Education */}
            <Card title="Education & work">
              {!profile?.educationLevel && !profile?.fieldOfStudy && !profile?.occupation ? (
                <Blank>Nothing recorded yet.</Blank>
              ) : (
                <dl className="space-y-3">
                  <Row label="Level" value={educationLabel(profile?.educationLevel)} />
                  <Row label="Field of study" value={profile?.fieldOfStudy} />
                  <Row label="Institution" value={profile?.institution} />
                  <Row
                    label="Graduated"
                    value={profile?.graduationYear ? String(profile.graduationYear) : null}
                  />
                  <Row label="Occupation" value={profile?.occupation} />
                  <Row label="Experience" value={experienceLabel(profile?.experienceLevel)} />
                </dl>
              )}
            </Card>

            {/* Learning intent */}
            <Card title="What you want to learn">
              {interests.length === 0 && !profile?.goals && !profile?.weeklyHours ? (
                <Blank>Tell us and the owl will aim better.</Blank>
              ) : (
                <>
                  {interests.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
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
                  )}
                  {profile?.goals && (
                    <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                      {profile.goals}
                    </p>
                  )}
                  {profile?.weeklyHours ? (
                    <p className="mt-3 text-sm text-[var(--text-muted)]">
                      Aiming for{" "}
                      <span className="font-semibold text-[var(--text)]">
                        {profile.weeklyHours} hours
                      </span>{" "}
                      a week.
                    </p>
                  ) : null}
                </>
              )}
            </Card>

            {/* About */}
            {profile?.bio && (
              <Card title="About">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-muted)]">
                  {profile.bio}
                </p>
              </Card>
            )}

            {/* Accolades */}
            <Card title="Competitions & certifications">
              {!profile?.accolades?.length ? (
                <Blank>
                  Anything you have won or earned elsewhere can go here.
                </Blank>
              ) : (
                <ul className="space-y-3">
                  {profile.accolades.map((a) => (
                    <li
                      key={a.id}
                      className="border-l-2 border-[var(--gold)] pl-3"
                    >
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-semibold text-[var(--text)]">
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
                        </span>
                        <span className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                          {accoladeLabel(a.kind)}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-faint)]">
                        {[a.issuer, a.year].filter(Boolean).join(" · ")}
                      </p>
                      {a.description && (
                        <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                          {a.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {/* What this is used for — stated plainly */}
          <div className="mt-8 rounded-sm border border-[var(--border)] bg-[var(--surface-2)] p-5">
            <h3 className="flex items-center gap-2 font-serif text-base font-bold text-[var(--text)]">
              <Icon name="shield" className="h-4 w-4 text-[var(--gold)]" />
              How your record is used
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              What you record here shapes the courses the owl suggests and helps the academy
              decide what to teach next. Every field is optional. Offers by email are sent
              only if you have turned them on — currently{" "}
              <span className="font-semibold text-[var(--text)]">
                {profile?.marketingOptIn ? "on" : "off"}
              </span>
              . You can change or clear any of it at any time.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <h3 className="mb-4 font-serif text-lg font-bold text-[var(--brand)]">{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-wrap items-baseline gap-x-3">
      <dt className="w-32 shrink-0 text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
        {label}
      </dt>
      <dd className="text-sm text-[var(--text)]">{value}</dd>
    </div>
  );
}

function Blank({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-[var(--text-muted)]">{children}</p>;
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
      <p className="font-serif text-3xl font-bold text-[var(--text)]">{value}</p>
      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
        {label}
      </p>
    </div>
  );
}

function LinkChip({ href, label, icon }: { href: string; label: string; icon: string }) {
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
