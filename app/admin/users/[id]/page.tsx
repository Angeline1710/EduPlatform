import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UserActionPanel from "./UserActionPanel";

export const metadata = { title: "User Detail · Admin · EduPlatform" };

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect("/admin/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const [user, allCourses] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: {
        courseEnrollments: { include: { course: true } },
        internshipEnrollments: { include: { internship: true } },
        certificates: { include: { course: true, internship: true } },
        lessonProgress: true,
        loginLogs: { orderBy: { loginAt: "desc" }, take: 20 },
      },
    }),
    prisma.course.findMany({ orderBy: { title: "asc" } }),
  ]);

  if (!user) notFound();

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen text-white" style={{ background: "var(--shell, #120d1e)" }}>
      <main className="px-8 py-10 max-w-3xl mx-auto">
        {/* Back */}
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-400 transition mb-8"
        >
          ← All users
        </Link>

        {/* Profile card */}
        <div
          className="rounded-xl border border-yellow-400/30 p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <div
            className="h-20 w-20 rounded-xl flex items-center justify-center text-2xl font-bold text-black shrink-0"
            style={{ background: "#d4a22c" }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span
                className={`text-xs px-2.5 py-1 rounded font-semibold ${
                  user.role === "ADMIN"
                    ? "bg-yellow-400/10 text-yellow-400"
                    : "bg-indigo-500/10 text-indigo-300"
                }`}
              >
                {user.role}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                ACTIVE
              </span>
              <span className="text-xs text-gray-500">
                Joined {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: "📋", value: user.courseEnrollments.length, label: "Courses" },
            { icon: "🎓", value: user.certificates.length, label: "Certificates" },
            { icon: "📈", value: user.lessonProgress.length, label: "Lessons done" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/10 p-4 text-center"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <p className="text-xl mb-1">{s.icon}</p>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Action panel (client) */}
        <UserActionPanel user={user} courses={allCourses} />

        {/* Login history */}
        <div className="mt-6 rounded-xl border border-white/10 p-5" style={{ background: "rgba(255,255,255,0.04)" }}>
          <h3 className="font-bold text-base mb-4">Recent login history</h3>
          {user.loginLogs.length === 0 ? (
            <p className="text-sm text-gray-500">No login history.</p>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-1">
              {user.loginLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex justify-between text-xs text-gray-400 border-b border-white/5 py-1.5"
                >
                  <span>{new Date(log.loginAt).toLocaleString()}</span>
                  <span className="text-gray-500">{log.ipAddress ?? "Unknown IP"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
