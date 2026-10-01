import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { formatPrice } from "@/lib/format";
import { formatIssueDate } from "@/lib/certificates";
import { categoryTheme } from "@/lib/categories";
import UserControls from "@/components/UserControls";
import ScholarRecord from "@/components/admin/ScholarRecord";
import Icon from "@/components/Icon";

export default async function AdminUserDetailPage({
  params,
}: PageProps<"/admin/users/[id]">) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { id } = await params;

  const [user, allCourses] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: {
        enrollments: {
          orderBy: { purchasedAt: "desc" },
          include: {
            course: {
              select: {
                id: true,
                title: true,
                category: true,
                _count: { select: { lessons: true } },
              },
            },
          },
        },
        certificates: {
          orderBy: { issuedAt: "desc" },
          include: { course: { select: { title: true } } },
        },
        payments: {
          orderBy: { createdAt: "desc" },
          include: { course: { select: { title: true } } },
        },
      },
    }),
    prisma.course.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  if (!user) notFound();

  // Completed-lesson counts per enrolled course, for the progress column.
  const progress = await prisma.lessonProgress.findMany({
    where: { userId: id },
    select: { lesson: { select: { courseId: true } } },
  });
  const doneByCourse = new Map<string, number>();
  for (const p of progress) {
    doneByCourse.set(
      p.lesson.courseId,
      (doneByCourse.get(p.lesson.courseId) ?? 0) + 1,
    );
  }

  const paidTotal = user.payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const enrolledIds = new Set(user.enrollments.map((e) => e.courseId));
  const grantable = allCourses.filter((c) => !enrolledIds.has(c.id));

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/admin/users"
        className="focus-ring mb-6 inline-flex items-center gap-2 rounded-full text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
      >
        <span className="rotate-180">
          <Icon name="arrowRight" className="h-4 w-4" />
        </span>
        All users
      </Link>

      {/* Identity header */}
      <div className="card animate-fade-up mb-6 flex flex-wrap items-center gap-5 p-6">
        <span
          className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-2xl font-bold text-white shadow-md ${
            user.role === "ADMIN" ? "bg-slate-700" : "brand-gradient"
          }`}
        >
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {user.name}
          </h1>
          <p className="text-[var(--text-muted)]">{user.email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                user.role === "ADMIN"
                  ? "bg-slate-500/15 text-slate-600 dark:text-slate-300"
                  : "bg-[var(--brand-soft)] text-[var(--brand)]"
              }`}
            >
              {user.role}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                user.status === "ACTIVE"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/15 text-red-500"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  user.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              {user.status}
            </span>
            <span className="text-xs text-[var(--text-faint)]">
              Joined {formatIssueDate(user.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stagger mb-6 grid gap-4 sm:grid-cols-3">
        <Stat
          label="Courses"
          value={String(user.enrollments.length)}
          icon="book"
        />
        <Stat
          label="Certificates"
          value={String(user.certificates.length)}
          icon="award"
        />
        <Stat
          label="Lifetime spend"
          value={formatPrice(paidTotal)}
          icon="chart"
          highlight
        />
      </div>

      {/* Controls */}
      {/* The scholar's own record, as they filled it in */}
      <ScholarRecord userId={user.id} />

      <UserControls
        userId={user.id}
        isSelf={user.id === admin.id}
        status={user.status}
        role={user.role}
        grantableCourses={grantable}
        enrollments={user.enrollments.map((e) => ({
          courseId: e.courseId,
          title: e.course.title,
        }))}
        certificates={user.certificates.map((c) => ({
          id: c.id,
          code: c.code,
          courseTitle: c.course.title,
          revoked: Boolean(c.revokedAt),
        }))}
      />

      {/* Enrolled courses with progress */}
      <h2 className="mb-4 mt-10 text-2xl font-bold tracking-tight">
        Enrolled courses
      </h2>
      {user.enrollments.length === 0 ? (
        <div className="card px-6 py-10 text-center text-[var(--text-muted)]">
          No enrollments yet.
        </div>
      ) : (
        <div className="stagger grid gap-4 sm:grid-cols-2">
          {user.enrollments.map(({ courseId, course }) => {
            const total = course._count.lessons;
            const done = doneByCourse.get(courseId) ?? 0;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const theme = categoryTheme(course.category);
            return (
              <div key={courseId} className="card p-5">
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white shadow-sm"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
                    }}
                  >
                    <Icon name={theme.icon} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{course.title}</p>
                    <p className="text-xs text-[var(--text-faint)]">
                      {done} / {total} lessons
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[var(--brand)]">
                    {pct}%
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
                  <div
                    className="brand-gradient h-full rounded-full"
                    style={{ width: `${pct}%`, transition: "width 0.8s ease" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Payments */}
      <h2 className="mb-4 mt-10 text-2xl font-bold tracking-tight">Payments</h2>
      {user.payments.length === 0 ? (
        <div className="card px-6 py-10 text-center text-[var(--text-muted)]">
          No payments recorded.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                <tr className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {user.payments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3 font-medium">{p.course.title}</td>
                    <td className="px-5 py-3">{formatPrice(p.amount)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          p.status === "PAID"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : "bg-[var(--surface-2)] text-[var(--text-muted)]"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[var(--text-muted)]">
                      {formatIssueDate(p.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
  value: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div className="card p-5">
      <span
        className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${
          highlight
            ? "brand-gradient text-white shadow-md"
            : "bg-[var(--brand-soft)] text-[var(--brand)]"
        }`}
      >
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
        {label}
      </p>
    </div>
  );
}
