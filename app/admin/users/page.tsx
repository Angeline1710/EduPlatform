import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import Icon from "@/components/Icon";

export default async function AdminUsersPage({
  searchParams,
}: PageProps<"/admin/users">) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const params = await searchParams;
  const raw = params.q;
  const query = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { enrollments: true, certificates: true } },
    },
  });

  // SQLite lacks case-insensitive contains in Prisma, so filter in memory.
  const needle = query.toLowerCase();
  const filtered = needle
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(needle) ||
          u.email.toLowerCase().includes(needle),
      )
    : users;

  const students = users.filter((u) => u.role !== "ADMIN").length;
  const suspended = users.filter((u) => u.status === "SUSPENDED").length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/admin"
        className="focus-ring mb-6 inline-flex items-center gap-2 rounded-full text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
      >
        <span className="rotate-180">
          <Icon name="arrowRight" className="h-4 w-4" />
        </span>
        Back to dashboard
      </Link>

      <div className="mb-8 animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-faint)]">
          Admin
        </p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight">Users</h1>
        <p className="mt-2 text-[var(--text-muted)]">
          {users.length} accounts · {students} students · {suspended} suspended
        </p>
      </div>

      <form
        className="mb-6 animate-fade-up"
        style={{ animationDelay: "0.06s" }}
      >
        <label className="relative block max-w-sm">
          <span className="sr-only">Search users</span>
          <Icon
            name="search"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-faint)]"
          />
          <input
            name="q"
            defaultValue={query}
            placeholder="Search name or email..."
            className="input pl-11"
          />
        </label>
      </form>

      <div
        className="card animate-fade-up overflow-hidden"
        style={{ animationDelay: "0.12s" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--surface-2)]">
              <tr className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Courses</th>
                <th className="px-5 py-4">Certificates</th>
                <th className="px-5 py-4 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-[var(--text-muted)]"
                  >
                    No users match “{query}”.
                  </td>
                </tr>
              )}

              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="transition hover:bg-[var(--surface-2)]"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="flex items-center gap-3"
                    >
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white shadow-sm ${
                          user.role === "ADMIN"
                            ? "bg-slate-700"
                            : "brand-gradient"
                        }`}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold">{user.name}</span>
                        <span className="block text-xs text-[var(--text-faint)]">
                          {user.email}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.role === "ADMIN"
                          ? "bg-slate-500/15 text-slate-600 dark:text-slate-300"
                          : "bg-[var(--brand-soft)] text-[var(--brand)]"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.status === "ACTIVE"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-500/15 text-red-500"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          user.status === "ACTIVE"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[var(--text-muted)]">
                    {user._count.enrollments}
                  </td>
                  <td className="px-5 py-4 text-[var(--text-muted)]">
                    {user._count.certificates}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="focus-ring rounded-full px-3 py-1.5 font-semibold text-[var(--brand)] transition hover:bg-[var(--brand-soft)]"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
