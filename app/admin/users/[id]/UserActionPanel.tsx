"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
  grantCourseAccess,
  deleteUser,
  promoteToAdmin,
  updateProgramDates,
} from "../../actions";
import { useRouter } from "next/navigation";

type UserActionPanelUser = {
  id: string;
  role: string;
  courseEnrollments: Array<{
    id: string;
    courseId: string;
    enrolledAt: Date;
    completedAt: Date | null;
    course: { title: string };
  }>;
  internshipEnrollments: Array<{
    id: string;
    internshipId: string;
    enrolledAt: Date;
    completedAt: Date | null;
    internship: { title: string };
  }>;
  certificates: Array<{
    id: string;
    credentialId: string;
    type: string;
    courseId: string | null;
    internshipId: string | null;
    periodStartDate: Date | null;
    periodEndDate: Date | null;
    course: { title: string } | null;
    internship: { title: string } | null;
  }>;
};

function dateInputValue(value: Date | string | null) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

function ProgramDateEditor({
  userId,
  enrollmentId,
  type,
  title,
  startDate: initialStartDate,
  completionDate: initialCompletionDate,
}: {
  userId: string;
  enrollmentId: string;
  type: "COURSE" | "INTERNSHIP";
  title: string;
  startDate: Date | string;
  completionDate: Date | string | null;
}) {
  const router = useRouter();
  const [startDate, setStartDate] = useState(dateInputValue(initialStartDate));
  const [completionDate, setCompletionDate] = useState(dateInputValue(initialCompletionDate));
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [saving, setSaving] = useState(false);

  async function saveDates(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setHasError(false);
    try {
      await updateProgramDates({
        userId,
        enrollmentId,
        type,
        startDate,
        completionDate,
      });
      setMessage("Dates saved.");
      router.refresh();
    } catch (error) {
      setHasError(true);
      setMessage(error instanceof Error ? error.message : "Could not save program dates.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={saveDates}
      className="rounded-lg border border-white/10 bg-black/10 p-3"
    >
      <p className="mb-3 text-sm font-medium text-gray-200">{title}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-gray-400">
          Start date
          <input
            type="date"
            required
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="mt-1 block w-full rounded border border-white/15 bg-gray-900 px-2 py-1.5 text-sm text-white"
          />
        </label>
        <label className="text-xs text-gray-400">
          Completion date
          <input
            type="date"
            value={completionDate}
            min={startDate || undefined}
            onChange={(event) => setCompletionDate(event.target.value)}
            className="mt-1 block w-full rounded border border-white/15 bg-gray-900 px-2 py-1.5 text-sm text-white"
          />
        </label>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p
          role={hasError ? "alert" : "status"}
          className={`text-xs ${hasError ? "text-red-400" : "text-emerald-400"}`}
        >
          {message}
        </p>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-bold text-black transition hover:bg-yellow-300 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save dates"}
        </button>
      </div>
    </form>
  );
}

export default function UserActionPanel({
  user,
  courses,
}: {
  user: UserActionPanelUser;
  courses: Array<{ id: string; title: string }>;
}) {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState(
    courses[0]?.id ?? ""
  );
  const [loading, setLoading] = useState<string | null>(null);

  const unenrolledCourses = courses.filter(
    (course) => !user.courseEnrollments.some((enrollment) => enrollment.courseId === course.id)
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
              {unenrolledCourses.map((course) => (
                <option key={course.id} value={course.id} className="bg-gray-900">
                  {course.title}
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

        <div className="mt-5 space-y-3">
          <h4 className="text-sm font-semibold text-gray-300">
            Program start and completion dates
          </h4>
          <p className="text-xs text-gray-500">
            These saved dates are shown to the user and on any issued certificate.
          </p>
          {user.courseEnrollments.map((enrollment) => {
            const certificate = user.certificates.find(
              (item) =>
                item.courseId === enrollment.courseId &&
                item.type === "COURSE",
            );
            return (
              <ProgramDateEditor
                key={enrollment.id}
                userId={user.id}
                enrollmentId={enrollment.id}
                type="COURSE"
                title={`Course · ${enrollment.course.title}`}
                startDate={certificate?.periodStartDate ?? enrollment.enrolledAt}
                completionDate={certificate?.periodEndDate ?? enrollment.completedAt}
              />
            );
          })}
          {user.internshipEnrollments.map((enrollment) => {
            const certificate = user.certificates.find(
              (item) => item.internshipId === enrollment.internshipId,
            );
            return (
              <ProgramDateEditor
                key={enrollment.id}
                userId={user.id}
                enrollmentId={enrollment.id}
                type="INTERNSHIP"
                title={`Internship · ${enrollment.internship.title}`}
                startDate={certificate?.periodStartDate ?? enrollment.enrolledAt}
                completionDate={certificate?.periodEndDate ?? enrollment.completedAt}
              />
            );
          })}
          {user.courseEnrollments.length === 0 && user.internshipEnrollments.length === 0 && (
            <p className="text-sm text-gray-500">No program enrollments yet.</p>
          )}
        </div>
      </div>

      {/* Certificates */}
      <div className="rounded-xl border border-white/10 p-5" style={{ background: "rgba(255,255,255,0.04)" }}>
        <h3 className="font-bold text-base mb-4">Certificates</h3>
        {user.certificates.length === 0 ? (
          <p className="text-sm text-gray-500">None issued yet.</p>
        ) : (
          <div className="space-y-2">
            {user.certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="flex items-center justify-between text-sm bg-white/5 px-3 py-2 rounded-lg"
              >
                <span className="text-gray-300">
                  {certificate.course?.title ?? certificate.internship?.title}
                </span>
                <span className="text-xs font-mono text-indigo-400">
                  {certificate.credentialId}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
