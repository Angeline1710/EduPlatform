import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getLearningState } from "@/lib/learning";
import { categoryTheme } from "@/lib/categories";
import { formatIssueDate } from "@/lib/certificates";
import Icon from "@/components/Icon";
import CountUp from "@/components/CountUp";
import ProgressRing from "@/components/ProgressRing";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import { DepartmentCrest } from "@/components/Crests";

export const metadata = { title: "My Learning · EduPlatform" };

function greeting(d: Date) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage({
  searchParams,
}: PageProps<"/dashboard">) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { purchase } = await searchParams;
  const s = await getLearningState(session.user.id);
  const firstName = session.user.name?.split(" ")[0] ?? "Scholar";

  return (
    <>
      <PageHeader
        eyebrow={greeting(new Date())}
        title={firstName}
        lead={
          s.totals.courses === 0
            ? "Your record is open and waiting for its first entry."
            : `${s.totals.lessonsDone} of ${s.totals.totalLessons} lessons mastered · ${s.totals.lessonsLeft} remaining`
        }
      />

      <section className="paper min-h-[60vh] px-6 py-12 xl:px-10">
        <div className="mx-auto max-w-[1400px]">
          {purchase === "success" && (
            <div className="animate-pop-in mb-8 flex items-center gap-3 rounded-sm border border-[var(--gold)] bg-[var(--gold-soft)] px-5 py-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--gold)] text-[var(--on-gold)]">
                <Icon name="check" className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold text-[var(--text)]">
                Payment confirmed. Your enrollment has been recorded below.
              </p>
            </div>
          )}

          {/* Standing */}
          <div className="stagger mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon="book" label="Courses" value={s.totals.courses} />
            <Stat
              icon="check"
              label="Lessons done"
              value={s.totals.lessonsDone}
            />
            <Stat
              icon="clock"
              label="Lessons left"
              value={s.totals.lessonsLeft}
            />
            <Stat
              icon="award"
              label="Credentials"
              value={s.certificates.length}
              highlight
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
            <div className="min-w-0">
              {/* What to do next */}
              {s.upNext && (
                <Reveal className="mb-10">
                  <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--brand)]">
                    Do this next
                  </h2>
                  <Link
                    href={`/learn/${s.upNext.id}`}
                    className="group relative flex flex-wrap items-center gap-6 overflow-hidden rounded-sm border border-[var(--gold)] bg-[var(--surface)] p-6 shadow-[var(--shadow-lift)] transition hover:-translate-y-1 sm:p-8"
                  >
                    <ProgressRing
                      percent={s.upNext.percent}
                      size={88}
                      stroke={8}
                      gradientId="next-ring"
                      from={categoryTheme(s.upNext.category).from}
                      to={categoryTheme(s.upNext.category).to}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-faint)]">
                        {s.upNext.done === 0 ? "Begin" : "Resume"} ·{" "}
                        {s.upNext.category}
                      </p>
                      <p className="mt-1 truncate font-serif text-2xl font-bold text-[var(--text)]">
                        {s.upNext.title}
                      </p>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">
                        {s.upNext.nextLesson
                          ? `Next lesson — ${s.upNext.nextLesson.title}`
                          : "All lessons complete"}
                        {" · "}
                        {s.upNext.remaining} of {s.upNext.total} remaining
                      </p>
                    </div>
                    <span className="grid h-13 w-13 shrink-0 place-items-center rounded-full bg-gradient-to-b from-[var(--gold)] to-[var(--gold-dim)] p-4 text-[var(--on-gold)] shadow-[0_0_18px_var(--academy-glow)] transition group-hover:scale-105">
                      <Icon name="arrowRight" className="h-5 w-5" />
                    </span>
                  </Link>
                </Reveal>
              )}

              {/* Courses */}
              <h2 className="mb-4 font-serif text-2xl font-bold text-[var(--brand)]">
                My courses
              </h2>

              {s.courses.length === 0 ? (
                <EmptyRecord />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {s.courses.map((c, i) => {
                    const theme = categoryTheme(c.category);
                    return (
                      <Reveal key={c.id} delay={(i % 2) * 0.06}>
                        <Link
                          href={`/learn/${c.id}`}
                          className="group flex h-full flex-col rounded-sm border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:border-[var(--gold)]"
                        >
                          <div className="flex items-start gap-3">
                            {c.gifUrl ? (
                              <span className="h-11 w-11 shrink-0 overflow-hidden rounded-md border border-[var(--gold)]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={c.gifUrl}
                                  alt=""
                                  loading="lazy"
                                  className="h-full w-full object-cover"
                                />
                              </span>
                            ) : (
                              <span
                                className="accent shrink-0"
                                style={
                                  {
                                    "--accent-light": theme.ink,
                                    "--accent-dark": theme.inkDark,
                                  } as React.CSSProperties
                                }
                              >
                                <DepartmentCrest
                                  name={c.category}
                                  className="h-11 w-11"
                                />
                              </span>
                            )}

                            <div className="min-w-0 flex-1">
                              <p className="truncate font-serif text-lg font-bold text-[var(--text)]">
                                {c.title}
                              </p>
                              <p className="text-xs text-[var(--text-faint)]">
                                {c.done} of {c.total} lessons
                                {c.complete
                                  ? " · complete"
                                  : ` · ${c.remaining} left`}
                              </p>
                            </div>

                            <span className="shrink-0 font-serif text-lg font-bold text-[var(--brand)]">
                              {c.percent}%
                            </span>
                          </div>

                          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
                            <div
                              className="h-full rounded-full bg-[var(--gold)] shadow-[0_0_8px_var(--academy-glow)]"
                              style={{
                                width: `${c.percent}%`,
                                transition: "width 0.8s var(--ease-academy)",
                              }}
                            />
                          </div>

                          <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-[var(--brand)]">
                            {c.complete ? (
                              <>
                                <Icon name="check" className="h-4 w-4" />{" "}
                                Completed
                              </>
                            ) : (
                              <>
                                {c.nextLesson ? c.nextLesson.title : "Continue"}
                                <Icon
                                  name="arrowRight"
                                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                />
                              </>
                            )}
                          </p>
                        </Link>
                      </Reveal>
                    );
                  })}
                </div>
              )}

              {/* Credentials */}
              {s.certificates.length > 0 && (
                <>
                  <h2
                    id="credentials"
                    className="mb-4 mt-12 font-serif text-2xl font-bold text-[var(--brand)]"
                  >
                    My credentials
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {s.certificates.map((cert, i) => (
                      <Reveal key={cert.id} delay={(i % 3) * 0.05}>
                        <Link
                          href={`/certificates/${cert.code}`}
                          className="group flex h-full flex-col rounded-sm border border-[var(--border)] bg-[var(--surface)] p-5 transition-all hover:-translate-y-1 hover:border-[var(--gold)]"
                        >
                          <span className="mb-3 inline-grid h-11 w-11 place-items-center rounded-sm border border-[var(--gold)] text-[var(--gold)] transition group-hover:bg-[var(--gold-soft)]">
                            <Icon name="award" className="h-5 w-5" />
                          </span>
                          <p className="font-serif font-bold text-[var(--text)]">
                            {cert.course.title}
                          </p>
                          <p className="mt-1 font-mono text-xs text-[var(--brand)]">
                            {cert.code}
                          </p>
                          <p className="mt-auto pt-3 text-xs text-[var(--text-faint)]">
                            Issued {formatIssueDate(cert.issuedAt)}
                          </p>
                        </Link>
                      </Reveal>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Study aide */}
            <aside className="space-y-5 lg:sticky lg:top-24">
              <StreakCard streak={s.streak} studiedToday={s.studiedToday} />

              <div className="rounded-sm border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
                <h3 className="mb-3 flex items-center gap-2 font-serif text-lg font-bold text-[var(--text)]">
                  <Icon name="sparkle" className="h-4 w-4 text-[var(--gold)]" />
                  Your study aide
                </h3>

                {s.reminders.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)]">
                    Nothing needs your attention.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {s.reminders.map((r) => (
                      <li
                        key={r.id}
                        className="rounded-sm border-l-2 bg-[var(--surface-2)] px-3 py-2.5"
                        style={{
                          borderLeftColor:
                            r.tone === "urgent"
                              ? "var(--gold)"
                              : r.tone === "praise"
                                ? "var(--academy-emerald)"
                                : "var(--border-strong)",
                        }}
                      >
                        <p className="text-sm font-semibold text-[var(--text)]">
                          {r.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-muted)]">
                          {r.body}
                        </p>
                        {r.href && (
                          <Link
                            href={r.href}
                            className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand)] hover:underline"
                          >
                            {r.cta}
                            <Icon name="arrowRight" className="h-3 w-3" />
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Overall standing */}
              <div className="rounded-sm border border-[var(--border)] bg-[var(--surface)] p-5 text-center shadow-[var(--shadow-card)]">
                <h3 className="mb-4 font-serif text-lg font-bold text-[var(--text)]">
                  Overall progress
                </h3>
                <div className="flex justify-center">
                  <ProgressRing
                    percent={s.totals.percent}
                    size={116}
                    stroke={9}
                    gradientId="overall-ring"
                    from="var(--gold)"
                    to="var(--gold-dim)"
                  />
                </div>
                <p className="mt-4 text-sm text-[var(--text-muted)]">
                  {s.totals.completedCourses} of {s.totals.courses} courses
                  complete
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({
  icon,
  label,
  value,
  highlight,
}: {
  icon: string;
  label: string;
  value: number;
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
        <CountUp value={value} />
      </p>
      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
        {label}
      </p>
    </div>
  );
}

function StreakCard({
  streak,
  studiedToday,
}: {
  streak: number;
  studiedToday: boolean;
}) {
  // Seven candles; the lit ones show this week's consecutive days.
  const lit = Math.min(streak, 7);

  return (
    <div className="rounded-sm border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-baseline justify-between">
        <h3 className="font-serif text-lg font-bold text-[var(--text)]">
          Study streak
        </h3>
        <span className="font-serif text-2xl font-bold text-[var(--gold)]">
          {streak}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-1.5">
        {Array.from({ length: 7 }, (_, i) => {
          const isLit = i < lit;
          return (
            <span key={i} className="flex flex-1 flex-col items-center gap-1">
              {/* Flame */}
              <span
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  isLit
                    ? "animate-flicker bg-[var(--gold-bright)]"
                    : "bg-[var(--surface-2)]"
                }`}
                style={
                  isLit
                    ? { boxShadow: "0 0 8px var(--academy-glow)" }
                    : undefined
                }
              />
              {/* Candle */}
              <span
                className={`h-7 w-2 rounded-sm ${
                  isLit ? "bg-[var(--gold-dim)]" : "bg-[var(--surface-2)]"
                }`}
              />
            </span>
          );
        })}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]">
        {streak === 0
          ? "Complete a lesson today to light the first candle."
          : studiedToday
            ? "Today is done. The streak holds."
            : "Study today to keep the streak alive."}
      </p>
    </div>
  );
}

function EmptyRecord() {
  return (
    <div className="rounded-sm border border-dashed border-[var(--border-strong)] px-6 py-14 text-center">
      <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full border border-[var(--gold)] text-[var(--gold)]">
        <Icon name="book" className="h-6 w-6" />
      </span>
      <p className="font-serif text-2xl font-bold text-[var(--brand)]">
        Your academy journey begins here.
      </p>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Choose your first course.
      </p>
      <Link
        href="/courses"
        className="rune-edge mt-6 inline-flex items-center gap-2 rounded-md border border-[var(--gold-bright)] bg-gradient-to-b from-[var(--gold)] to-[var(--gold-dim)] px-6 py-3 font-semibold text-[var(--on-gold)] transition hover:brightness-110"
      >
        Explore the archives
        <Icon name="arrowRight" className="h-4 w-4" />
      </Link>
    </div>
  );
}
