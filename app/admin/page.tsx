import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { formatPrice } from "@/lib/format";
import { categoryTheme } from "@/lib/categories";
import DeleteCourseButton from "@/components/DeleteCourseButton";
import Icon from "@/components/Icon";

export default async function AdminDashboard() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const [courses, enrollmentCount, revenue] = await Promise.all([
    prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { lessons: true, enrollments: true } } },
    }),
    prisma.enrollment.count(),
    prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
  ]);

  const publishedCount = courses.filter((c) => c.published).length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-faint)]">
            Admin
          </p>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-[var(--text-muted)]">
            Manage courses, lessons, and pricing.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/users" className="btn btn-secondary press">
            <Icon name="user" className="h-4 w-4" />
            Manage users
          </Link>
          <Link href="/admin/courses/new" className="btn btn-primary press">
            <Icon name="plus" className="h-4 w-4" />
            New course
          </Link>
        </div>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="book" label="Courses" value={String(courses.length)} />
        <StatCard icon="check" label="Published" value={String(publishedCount)} />
        <StatCard icon="user" label="Enrollments" value={String(enrollmentCount)} />
        <StatCard
          icon="chart"
          label="Revenue"
          value={formatPrice(revenue._sum.amount ?? 0)}
          highlight
        />
      </div>

      {courses.length === 0 ? (
        <div className="card px-6 py-16 text-center">
          <p className="text-lg font-semibold">No courses yet</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Create your first course to get started.
          </p>
          <Link href="/admin/courses/new" className="btn btn-primary mt-6">
            <Icon name="plus" className="h-4 w-4" />
            New course
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                <tr className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Lessons</th>
                  <th className="px-5 py-4">Students</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {courses.map((course) => {
                  const theme = categoryTheme(course.category);
                  return (
                    <tr key={course.id} className="transition hover:bg-[var(--surface-2)]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white shadow-sm"
                            style={{
                              backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
                            }}
                          >
                            <Icon name={theme.icon} className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold">{course.title}</p>
                            <p className="text-xs text-[var(--text-faint)]">{course.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium">{formatPrice(course.price)}</td>
                      <td className="px-5 py-4 text-[var(--text-muted)]">
                        {course._count.lessons}
                      </td>
                      <td className="px-5 py-4 text-[var(--text-muted)]">
                        {course._count.enrollments}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            course.published
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : "bg-[var(--surface-2)] text-[var(--text-muted)]"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              course.published ? "bg-emerald-500" : "bg-[var(--text-faint)]"
                            }`}
                          />
                          {course.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/courses/${course.id}/edit`}
                            className="focus-ring rounded-full px-3 py-1.5 font-semibold text-[var(--brand)] transition hover:bg-[var(--brand-soft)]"
                          >
                            Edit
                          </Link>
                          <DeleteCourseButton courseId={course.id} />
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
  );
}

function StatCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: string;
  label: string;
  value: string;
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
