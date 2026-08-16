import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { formatPrice } from "@/lib/format";
import { categoryTheme } from "@/lib/categories";
import {
  getRevenue,
  getLiveUsers,
  getPlatformStats,
  getTopCourses,
} from "@/lib/analytics";
import Icon from "@/components/Icon";
import DeleteCourseButton from "@/components/DeleteCourseButton";
import LiveUsers from "@/components/admin/LiveUsers";
import RevenueChart from "@/components/admin/RevenueChart";

export const metadata = { title: "Admin · EduPlatform" };

// Presence and revenue must be read fresh on every visit.
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const [revenue, live, stats, top] = await Promise.all([
    getRevenue(),
    getLiveUsers(),
    getPlatformStats(),
    getTopCourses(6),
  ]);

  return (
    <div className="paper min-h-screen px-6 py-10 xl:px-10">
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--text-faint)]">
              Academy Administration
            </p>
            <h1 className="mt-1 font-serif text-4xl font-bold text-[var(--brand)]">
              Dashboard
            </h1>
            <p className="mt-1.5 text-sm text-[var(--text-muted)]">
              Signed in as {admin.name}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <AdminLink href="/admin/users" icon="user" label="Users" />
            <AdminLink href="/courses" icon="book" label="View site" />
            <Link
              href="/admin/courses/new"
              className="rune-edge inline-flex items-center gap-2 rounded-md border border-[var(--gold-bright)] bg-gradient-to-b from-[var(--gold)] to-[var(--gold-dim)] px-4 py-2.5 text-sm font-semibold text-[#241026] shadow-[0_0_16px_var(--academy-glow)] transition hover:brightness-110"
            >
              <Icon name="plus" className="h-4 w-4" />
              New course
            </Link>
          </div>
        </div>

        {/* Money */}
        <div className="stagger mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Money
            label="Captured revenue"
            value={formatPrice(revenue.captured)}
            sub={`${revenue.capturedCount} paid`}
            trend={revenue.trendPct}
            highlight
          />
          <Money
            label="Pending"
            value={formatPrice(revenue.pending)}
            sub={`${revenue.pendingCount} awaiting confirmation`}
          />
          <Money
            label="Failed"
            value={formatPrice(revenue.failed)}
            sub={`${revenue.failedCount} not charged`}
            negative
          />
          <Money
            label="Avg. per enrollment"
            value={formatPrice(
              stats.enrollments > 0 ? Math.round(revenue.captured / stats.enrollments) : 0,
            )}
            sub={`across ${stats.enrollments} enrollments`}
          />
        </div>

        <div className="mb-6 grid gap-5 lg:grid-cols-[1fr_20rem] lg:items-start">
          <RevenueChart series={revenue.series} />
          <LiveUsers
            initialCount={live.length}
            initialUsers={live.map((u) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role,
              lastSeenAt: u.lastSeenAt ? u.lastSeenAt.toISOString() : null,
            }))}
          />
        </div>

        {/* Platform counts */}
        <div className="stagger mb-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Tile icon="book" label="Courses" value={stats.courses} note={`${stats.drafts} draft`} />
          <Tile icon="check" label="Published" value={stats.published} />
          <Tile icon="user" label="Students" value={stats.students} note={`+${stats.signups7} this week`} />
          <Tile icon="learners" label="Enrollments" value={stats.enrollments} note={`+${stats.enrollments7} this week`} />
          <Tile icon="award" label="Credentials" value={stats.certificates} />
          <Tile icon="chart" label="Lessons done" value={stats.lessonsCompleted} />
        </div>

        {/* Course performance */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[var(--brand)]">
            Course performance
          </h2>
          <span className="text-sm text-[var(--text-muted)]">By revenue</span>
        </div>

        {top.length === 0 ? (
          <div className="rounded-sm border border-dashed border-[var(--border-strong)] px-6 py-16 text-center">
            <p className="font-serif text-xl font-bold text-[var(--brand)]">No courses yet</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Create the first course to begin.
            </p>
            <Link
              href="/admin/courses/new"
              className="mt-6 inline-flex items-center gap-2 rounded-md border border-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-[var(--brand)] transition hover:bg-[var(--gold-soft)]"
            >
              <Icon name="plus" className="h-4 w-4" />
              New course
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                  <tr className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-faint)]">
                    <th className="px-5 py-3.5">Course</th>
                    <th className="px-5 py-3.5">Price</th>
                    <th className="px-5 py-3.5">Lessons</th>
                    <th className="px-5 py-3.5">Students</th>
                    <th className="px-5 py-3.5">Revenue</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {top.map((c) => {
                    const theme = categoryTheme(c.category);
                    return (
                      <tr key={c.id} className="transition hover:bg-[var(--surface-2)]">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span
                              className="h-9 w-9 shrink-0 rounded-sm"
                              style={{
                                backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
                              }}
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-[var(--text)]">{c.title}</p>
                              <p className="text-xs text-[var(--text-faint)]">{c.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-medium">{formatPrice(c.price)}</td>
                        <td className="px-5 py-4 text-[var(--text-muted)]">{c.lessons}</td>
                        <td className="px-5 py-4 text-[var(--text-muted)]">{c.enrollments}</td>
                        <td className="px-5 py-4 font-serif font-bold text-[var(--gold-dim)]">
                          {formatPrice(c.revenue)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              c.published
                                ? "bg-[var(--academy-emerald)]/15 text-[var(--academy-emerald)]"
                                : "bg-[var(--surface-2)] text-[var(--text-muted)]"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                c.published
                                  ? "bg-[var(--academy-emerald)]"
                                  : "bg-[var(--text-faint)]"
                              }`}
                            />
                            {c.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`/admin/courses/${c.id}/edit`}
                              className="rounded-full px-3 py-1.5 font-semibold text-[var(--brand)] transition hover:bg-[var(--gold-soft)]"
                            >
                              Edit
                            </Link>
                            <DeleteCourseButton courseId={c.id} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--gold)] hover:bg-[var(--gold-soft)]"
    >
      <Icon name={icon} className="h-4 w-4" />
      {label}
    </Link>
  );
}

function Money({
  label,
  value,
  sub,
  trend,
  highlight,
  negative,
}: {
  label: string;
  value: string;
  sub: string;
  trend?: number;
  highlight?: boolean;
  negative?: boolean;
}) {
  return (
    <div
      className={`rounded-sm border p-5 shadow-[var(--shadow-card)] ${
        highlight
          ? "border-[var(--gold)] bg-[var(--gold-soft)]"
          : "border-[var(--border)] bg-[var(--surface)]"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
        {label}
      </p>
      <p
        className={`mt-2 font-serif text-3xl font-bold ${
          negative ? "text-[var(--text-muted)]" : "text-[var(--text)]"
        }`}
      >
        {value}
      </p>
      <div className="mt-1 flex items-center gap-2">
        <p className="text-xs text-[var(--text-faint)]">{sub}</p>
        {trend !== undefined && (
          <span
            className={`text-xs font-semibold ${
              trend >= 0 ? "text-[var(--academy-emerald)]" : "text-red-500"
            }`}
          >
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}

function Tile({
  icon,
  label,
  value,
  note,
}: {
  icon: string;
  label: string;
  value: number;
  note?: string;
}) {
  return (
    <div className="rounded-sm border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]">
      <span className="mb-2.5 inline-grid h-9 w-9 place-items-center rounded-sm border border-[var(--border)] text-[var(--text-muted)]">
        <Icon name={icon} className="h-4 w-4" />
      </span>
      <p className="font-serif text-2xl font-bold text-[var(--text)]">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">
        {label}
      </p>
      {note && <p className="mt-1 text-[11px] text-[var(--academy-emerald)]">{note}</p>}
    </div>
  );
}
