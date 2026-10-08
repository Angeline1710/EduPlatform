import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CourseManager from "./CourseManager";

export const metadata = { title: "Admin Dashboard · EduPlatform" };

// ─── Category mapping ──────────────────────────────────────────────────────
const CATEGORY_MAP: Record<string, string> = {
  "Web Development Fundamentals": "Development",
  "React from Zero to Hero": "Development",
  "Mobile App Development with React Native": "Development",
  "DSA for Beginners": "Development",
  "DSA for beginners": "Development",
  "Python for Data Analysis": "Data",
  "SQL and Database Design": "Data",
  "Machine Learning Basics": "Data",
  "UI/UX Design Principles": "Design",
  "Graphic Design with Figma": "Design",
  "Digital Marketing Essentials": "Business",
  "Cybersecurity Awareness": "Security",
  "Business English Communication": "Communication",
  "Public Speaking Masterclass": "Communication",
};

const CATEGORY_COLORS: Record<string, string> = {
  Development: "#7c3aed",
  Data:        "#0e9f6e",
  Design:      "#e02424",
  Business:    "#f59e0b",
  Security:    "#3b82f6",
  Communication:"#ec4899",
};

function getCategoryColor(title: string) {
  const cat = CATEGORY_MAP[title] ?? "Development";
  return CATEGORY_COLORS[cat] ?? "#7c3aed";
}

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/admin/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  // ── Data ──────────────────────────────────────────────────────────────────
  const [users, courses, certCount, progressCount] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        courseEnrollments: true,
        certificates: true,
        loginLogs: { orderBy: { loginAt: "desc" }, take: 1 },
      },
    }),
    prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: { enrollments: { include: { user: true } }, lessons: true },
    }),
    prisma.certificate.count(),
    prisma.lessonProgress.count(),
  ]);

  const studentCount = users.filter((u) => u.role !== "ADMIN").length;
  const enrollmentCount = courses.reduce((a, c) => a + c.enrollments.length, 0);
  const publishedCount = courses.length; // all seeded courses are "published"

  const adminUser = users.find((u) => u.email === session.user.email);
  const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
  const onlineUsers = users.filter(
    (u) => u.loginLogs[0] && new Date(u.loginLogs[0].loginAt) > fiveMinsAgo
  );

  return (
    <div className="min-h-screen text-white" style={{ background: "var(--shell, #120d1e)" }}>
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold mb-0.5">
            Academy Administration
          </p>
          <h1 className="text-3xl font-bold text-yellow-400">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Signed in as {adminUser?.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-sm hover:border-yellow-400/50 transition"
          >
            👤 Users
          </Link>
          <Link
            href="/courses"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-sm hover:border-yellow-400/50 transition"
          >
            🌐 View site
          </Link>
          <Link
            href="/admin/courses/new"
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition"
          >
            + New course
          </Link>
        </div>
      </header>

      <main className="px-8 py-8 max-w-[1600px] mx-auto space-y-8">
        {/* ── KPI cards ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Courses", value: courses.length, sub: `${publishedCount} published`, icon: "📋" },
            { label: "Students", value: studentCount, sub: "+3 this week", icon: "👥" },
            { label: "Enrollments", value: enrollmentCount, sub: "+0 this week", icon: "📝" },
            { label: "Credentials", value: certCount, sub: "", icon: "🎓" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border border-white/10 p-5"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <p className="text-2xl mb-1">{kpi.icon}</p>
              <p className="text-3xl font-bold">{kpi.value}</p>
              <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">{kpi.label}</p>
              {kpi.sub && <p className="text-xs text-yellow-400/70 mt-1">{kpi.sub}</p>}
            </div>
          ))}
        </div>

        {/* ── Online now ──────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-white/10 p-5" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <h2 className="font-semibold text-sm">Online now</h2>
          </div>
          {onlineUsers.length === 0 ? (
            <p className="text-sm text-gray-500">No users active in the last 5 minutes.</p>
          ) : (
            <div className="space-y-2">
              {onlineUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold text-black"
                    style={{ background: "#d4a22c" }}
                  >
                    {u.name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{u.name}</p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  </div>
                  <span
                    className={`ml-auto text-xs px-2 py-0.5 rounded font-semibold ${u.role === "ADMIN" ? "text-red-400 bg-red-400/10" : "text-gray-400 bg-white/5"}`}
                  >
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Course Performance Table ──────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-yellow-400">Course performance</h2>
            <span className="text-xs text-gray-400">By students</span>
          </div>
          <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-widest">
                  <th className="px-5 py-3">Course</th>
                  <th className="px-4 py-3">Lessons</th>
                  <th className="px-4 py-3">Students</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {courses.map((course) => {
                  const cat = CATEGORY_MAP[course.title] ?? "Development";
                  const color = getCategoryColor(course.title);
                  return (
                    <tr key={course.id} className="hover:bg-white/5 transition group">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-8 w-8 rounded-md shrink-0"
                            style={{ background: color + "33", border: `1.5px solid ${color}` }}
                          />
                          <div>
                            <p className="font-semibold text-white">{course.title}</p>
                            <p className="text-xs text-gray-500">{cat}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{course.lessons.length}</td>
                      <td className="px-4 py-3 text-gray-300">{course.enrollments.length}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                          Published
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <CourseRowActions courseId={course.id} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Course Manager (card grid + full edit panel) ─────────────── */}
        <section>
          <h2 className="text-lg font-bold text-yellow-400 mb-4">Manage Courses</h2>
          <CourseManager courses={courses} />
        </section>
      </main>
    </div>
  );
}

function CourseRowActions({ courseId }: { courseId: string }) {
  return (
    <div className="flex gap-3 opacity-70 group-hover:opacity-100 transition">
      <Link
        href={`/admin/courses/${courseId}/edit`}
        className="text-yellow-400 hover:text-yellow-300 font-semibold text-xs"
      >
        Edit
      </Link>
    </div>
  );
}
