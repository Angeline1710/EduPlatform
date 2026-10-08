import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import CourseManager from "./CourseManager";

export const metadata = { title: "Admin Dashboard · EduPlatform" };

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/admin/login");

  // Check if user is an ADMIN
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      courseEnrollments: { include: { course: true } },
      loginLogs: { orderBy: { loginAt: "desc" }, take: 5 },
    },
  });

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      enrollments: { include: { user: true } },
      lessons: true
    }
  });

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Admin Dashboard"
        lead="Manage users, view enrollments, and check login activity."
      />

      <section className="min-h-[60vh] px-6 py-12 xl:px-10 text-white">
        <div className="mx-auto max-w-[1400px]">
          
          <CourseManager courses={courses} />

          <h2 className="mb-6 mt-16 text-2xl font-bold border-b border-gray-700 pb-2">Registered Users</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-3 text-sm font-semibold tracking-wide text-gray-300">Name</th>
                  <th className="p-3 text-sm font-semibold tracking-wide text-gray-300">Email</th>
                  <th className="p-3 text-sm font-semibold tracking-wide text-gray-300">Role</th>
                  <th className="p-3 text-sm font-semibold tracking-wide text-gray-300">Enrolled Courses</th>
                  <th className="p-3 text-sm font-semibold tracking-wide text-gray-300">Recent Logins</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-800/50 transition">
                    <td className="p-3">{u.title} {u.name}</td>
                    <td className="p-3 text-gray-400">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded ${u.role === "ADMIN" ? "bg-red-900/50 text-red-300" : "bg-indigo-900/50 text-indigo-300"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      {u.courseEnrollments.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-400">
                          {u.courseEnrollments.map((ce) => (
                            <li key={ce.id}>{ce.course.title}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500 text-sm">None</span>
                      )}
                    </td>
                    <td className="p-3">
                      {u.loginLogs.length > 0 ? (
                        <ul className="text-xs text-gray-400">
                          {u.loginLogs.map((log) => (
                            <li key={log.id}>{new Date(log.loginAt).toLocaleString()}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500 text-sm">No logins yet</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
