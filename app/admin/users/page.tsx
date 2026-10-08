import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Users · Admin · EduPlatform" };

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/admin/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      courseEnrollments: true,
      certificates: true,
    },
  });

  const studentCount = users.filter((u) => u.role !== "ADMIN").length;

  return (
    <div className="min-h-screen text-white" style={{ background: "var(--shell, #120d1e)" }}>
      <main className="px-8 py-10 max-w-4xl mx-auto">
        {/* Back */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-400 transition mb-8"
        >
          ← Back to dashboard
        </Link>

        <p className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold mb-1">Admin</p>
        <h1 className="text-4xl font-bold mb-1">Users</h1>
        <p className="text-sm text-gray-400 mb-8">
          {users.length} accounts · {studentCount} student{studentCount !== 1 ? "s" : ""} · 0 suspended
        </p>

        {/* Search placeholder */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search name or email..."
            className="w-full max-w-sm px-4 py-2.5 rounded-lg text-sm bg-white/5 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/60"
          />
        </div>

        {/* Users table */}
        <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-widest">
                <th className="px-5 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Courses</th>
                <th className="px-4 py-3">Certificates</th>
                <th className="px-4 py-3">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-black shrink-0"
                        style={{
                          background:
                            u.role === "ADMIN" ? "#d4a22c" : "#6366f1",
                        }}
                      >
                        {u.name[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white">{u.name}</p>
                        <p className="text-xs text-gray-400 truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded font-semibold ${
                        u.role === "ADMIN"
                          ? "bg-yellow-400/10 text-yellow-400"
                          : "bg-indigo-500/10 text-indigo-300"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      ACTIVE
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{u.courseEnrollments.length}</td>
                  <td className="px-4 py-3 text-gray-300">{u.certificates.length}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="text-yellow-400 hover:text-yellow-300 font-semibold text-xs"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
