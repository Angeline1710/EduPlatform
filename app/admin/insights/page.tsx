import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { getAdminBrief, getUserInterestSummaries } from "@/lib/interest";
import { categoryTheme } from "@/lib/categories";
import { DepartmentCrest } from "@/components/Crests";
import Icon from "@/components/Icon";

export const metadata = { title: "Interest · Admin · EduPlatform" };

// Every figure here is read fresh; stale demand data is worse than none.
export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const [brief, people] = await Promise.all([
    getAdminBrief(30),
    getUserInterestSummaries(40),
  ]);

  return (
    <div className="paper min-h-screen px-6 py-10 xl:px-10">
      <div className="mx-auto max-w-[1500px]">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
        >
          <span className="rotate-180">
            <Icon name="arrowRight" className="h-4 w-4" />
          </span>
          Back to dashboard
        </Link>

        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--text-faint)]">
            Academy Administration
          </p>
          <h1 className="mt-1 font-serif text-4xl font-bold text-[var(--brand)]">
            What people want
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">
            Drawn from {brief.totalSignals.toLocaleString()} recorded actions
            across {brief.activeProfiles} visitors in the last{" "}
            {brief.windowDays} days — searches, courses opened, and departments
            browsed. Nothing here is estimated.
          </p>
        </div>

        {brief.totalSignals === 0 ? (
          <div className="rounded-sm border border-dashed border-[var(--border-strong)] px-6 py-16 text-center">
            <p className="font-serif text-xl font-bold text-[var(--brand)]">
              No interest recorded yet
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-muted)]">
              Once visitors search and open courses, their intent appears here —
              by person and in aggregate.
            </p>
          </div>
        ) : (
          <>
            {/* ---- Collective brief ---- */}
            <h2 className="mb-4 font-serif text-2xl font-bold text-[var(--brand)]">
              The collective brief
            </h2>

            <div className="mb-8 grid gap-5 lg:grid-cols-3">
              {/* Demand by department */}
              <Panel
                title="Demand by department"
                note="Where attention is going"
              >
                {brief.demand.length === 0 ? (
                  <Empty>No department signals yet.</Empty>
                ) : (
                  <ul className="space-y-3">
                    {brief.demand.map((d) => {
                      const theme = categoryTheme(d.category);
                      return (
                        <li
                          key={d.category}
                          className="flex items-center gap-3"
                        >
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
                              name={d.category}
                              className="h-7 w-7"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-baseline justify-between gap-2">
                              <span className="truncate text-sm font-semibold text-[var(--text)]">
                                {d.category}
                              </span>
                              <span className="shrink-0 text-xs tabular-nums text-[var(--text-faint)]">
                                {d.share}% · {d.courses}{" "}
                                {d.courses === 1 ? "course" : "courses"}
                              </span>
                            </span>
                            <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
                              <span
                                className="block h-full rounded-full bg-[var(--gold)]"
                                style={{ width: `${Math.max(d.share, 2)}%` }}
                              />
                            </span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Panel>

              {/* Searches */}
              <Panel title="What people typed" note="Most frequent first">
                {brief.topSearches.length === 0 ? (
                  <Empty>Nobody has searched yet.</Empty>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {brief.topSearches.map((s) => (
                      <li key={s.term}>
                        <Link
                          href={`/courses?q=${encodeURIComponent(s.term)}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs transition hover:border-[var(--gold)]"
                        >
                          <span className="text-[var(--text)]">{s.term}</span>
                          <span className="tabular-nums text-[var(--text-faint)]">
                            {s.count}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {brief.unmetSearches.length > 0 && (
                  <div className="mt-5 rounded-sm border-l-2 border-[var(--gold)] bg-[var(--gold-soft)] px-3 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">
                      Searched, but nothing to sell them
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--text)]">
                      {brief.unmetSearches.map((s) => s.term).join(", ")}
                    </p>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--text-muted)]">
                      These matched no published course. Each is a course worth
                      commissioning, or a title worth rewording.
                    </p>
                  </div>
                )}
              </Panel>

              {/* Conversion gaps */}
              <Panel
                title="Looked at, not bought"
                note="Lowest conversion first"
              >
                {brief.conversionGaps.length === 0 ? (
                  <Empty>Not enough views yet to judge conversion.</Empty>
                ) : (
                  <ul className="space-y-2.5">
                    {brief.conversionGaps.map((c) => (
                      <li key={c.courseId} className="flex items-center gap-3">
                        <span className="min-w-0 flex-1">
                          <Link
                            href={`/admin/courses/${c.courseId}/edit`}
                            className="block truncate text-sm font-medium text-[var(--text)] hover:text-[var(--brand)]"
                          >
                            {c.title}
                          </Link>
                          <span className="text-[11px] text-[var(--text-faint)]">
                            {c.views} views · {c.enrollments} enrolled
                          </span>
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${
                            c.rate === 0
                              ? "bg-red-500/15 text-red-500"
                              : c.rate < 20
                                ? "bg-[var(--gold-soft)] text-[var(--brand)]"
                                : "bg-[var(--academy-emerald)]/15 text-[var(--academy-emerald)]"
                          }`}
                        >
                          {c.rate}%
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-4 text-[11px] leading-relaxed text-[var(--text-faint)]">
                  A course seen often and bought rarely is usually a price, a
                  title, or a description problem — not a demand problem.
                </p>
              </Panel>
            </div>

            {/* ---- Per person ---- */}
            <h2 className="mb-4 font-serif text-2xl font-bold text-[var(--brand)]">
              Person by person
            </h2>

            {people.filter((p) => p.signalCount > 0).length === 0 ? (
              <div className="rounded-sm border border-dashed border-[var(--border-strong)] px-6 py-12 text-center text-sm text-[var(--text-muted)]">
                No individual profiles have formed yet.
              </div>
            ) : (
              <div className="overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                      <tr className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-faint)]">
                        <th className="px-5 py-3.5">Scholar</th>
                        <th className="px-5 py-3.5">Leans toward</th>
                        <th className="px-5 py-3.5">Searched for</th>
                        <th className="px-5 py-3.5">Would likely buy</th>
                        <th className="px-5 py-3.5 text-right">Signals</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {people
                        .filter((p) => p.signalCount > 0)
                        .map((p) => (
                          <tr
                            key={p.id}
                            className="transition hover:bg-[var(--surface-2)]"
                          >
                            <td className="px-5 py-4">
                              <Link
                                href={`/admin/users/${p.id}`}
                                className="group block"
                              >
                                <span className="block font-semibold text-[var(--text)] group-hover:text-[var(--brand)]">
                                  {p.name}
                                </span>
                                <span className="block text-xs text-[var(--text-faint)]">
                                  {p.email}
                                </span>
                              </Link>
                            </td>
                            <td className="px-5 py-4">
                              {p.affinities.length === 0 ? (
                                <span className="text-[var(--text-faint)]">
                                  —
                                </span>
                              ) : (
                                <span className="flex flex-wrap gap-1.5">
                                  {p.affinities.map((a) => (
                                    <span
                                      key={a.category}
                                      className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-xs"
                                    >
                                      {a.category}{" "}
                                      <span className="tabular-nums text-[var(--text-faint)]">
                                        {a.share}%
                                      </span>
                                    </span>
                                  ))}
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-[var(--text-muted)]">
                              {p.recentSearches.length === 0 ? (
                                <span className="text-[var(--text-faint)]">
                                  —
                                </span>
                              ) : (
                                p.recentSearches.map((s) => `“${s}”`).join(", ")
                              )}
                            </td>
                            <td className="px-5 py-4 text-[var(--text-muted)]">
                              {p.wants.length === 0 ? (
                                <span className="text-[var(--text-faint)]">
                                  —
                                </span>
                              ) : (
                                p.wants.join(", ")
                              )}
                            </td>
                            <td className="px-5 py-4 text-right tabular-nums text-[var(--text-faint)]">
                              {p.signalCount}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Panel({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-sm border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4">
        <h3 className="font-serif text-lg font-bold text-[var(--text)]">
          {title}
        </h3>
        {note && <p className="text-[11px] text-[var(--text-faint)]">{note}</p>}
      </div>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-[var(--text-muted)]">{children}</p>;
}
