"use client";

import { useState } from "react";
import { grantCourseAccess, deleteUser, promoteToAdmin } from "../../actions";
import { useRouter } from "next/navigation";

export default function UserActionPanel({
  user,
  courses,
}: {
  user: any;
  courses: any[];
}) {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState(
    courses[0]?.id ?? ""
  );
  const [loading, setLoading] = useState<string | null>(null);

  const unenrolledCourses = courses.filter(
    (c) => !user.courseEnrollments.some((e: any) => e.courseId === c.id)
  );

  async function handle(action: () => Promise<void>, key: string) {
    setLoading(key);
    try {
      await action();
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Account controls */}
      <div className="rounded-xl border border-white/10 p-5" style={{ background: "rgba(255,255,255,0.04)" }}>
        <h3 className="font-bold text-base mb-1">Account controls</h3>
        <p className="text-xs text-gray-400 mb-4">Changes take effect immediately.</p>
        <div className="flex flex-wrap gap-3">
          {user.role !== "ADMIN" && (
            <button
              onClick={() =>
                handle(() => promoteToAdmin(user.id), "promote")
              }
              disabled={loading === "promote"}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-sm hover:border-yellow-400 transition disabled:opacity-50"
            >
              👤 {loading === "promote" ? "Promoting..." : "Promote to admin"}
            </button>
          )}
          <button
            onClick={() => {
              if (confirm("Permanently delete this user?"))
                handle(() => deleteUser(user.id), "delete");
            }}
            disabled={loading === "delete"}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/40 text-red-400 text-sm hover:bg-red-500/10 transition disabled:opacity-50"
          >
            🗑 {loading === "delete" ? "Deleting..." : "Delete user"}
          </button>
        </div>
      </div>

      {/* Course access */}
      <div className="rounded-xl border border-white/10 p-5" style={{ background: "rgba(255,255,255,0.04)" }}>
        <h3 className="font-bold text-base mb-4">Course access</h3>
        {unenrolledCourses.length > 0 ? (
          <div className="flex gap-3 flex-wrap">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-yellow-400/60"
            >
              {unenrolledCourses.map((c: any) => (
                <option key={c.id} value={c.id} className="bg-gray-900">
                  {c.title}
                </option>
              ))}
            </select>
            <button
              onClick={() =>
                handle(
                  () => grantCourseAccess(user.id, selectedCourse),
                  "grant"
                )
              }
              disabled={loading === "grant" || !selectedCourse}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition disabled:opacity-50"
            >
              + {loading === "grant" ? "Granting..." : "Grant access"}
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-400">User is enrolled in all courses.</p>
        )}

        {user.courseEnrollments.length === 0 ? (
          <p className="text-sm text-gray-500 mt-3">No courses granted.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {user.courseEnrollments.map((e: any) => (
              <div
                key={e.id}
                className="flex items-center justify-between text-sm bg-white/5 px-3 py-2 rounded-lg"
              >
                <span className="text-gray-300">{e.course.title}</span>
                <span className="text-xs text-gray-500">
                  {new Date(e.enrolledAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificates */}
      <div className="rounded-xl border border-white/10 p-5" style={{ background: "rgba(255,255,255,0.04)" }}>
        <h3 className="font-bold text-base mb-4">Certificates</h3>
        {user.certificates.length === 0 ? (
          <p className="text-sm text-gray-500">None issued yet.</p>
        ) : (
          <div className="space-y-2">
            {user.certificates.map((c: any) => (
              <div
                key={c.id}
                className="flex items-center justify-between text-sm bg-white/5 px-3 py-2 rounded-lg"
              >
                <span className="text-gray-300">
                  {c.course?.title ?? c.internship?.title}
                </span>
                <span className="text-xs font-mono text-indigo-400">
                  {c.credentialId}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
