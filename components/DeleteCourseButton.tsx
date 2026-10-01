"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteCourseButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (
      !confirm("Delete this course and all its lessons? This cannot be undone.")
    )
      return;

    setLoading(true);
    setError("");

    const res = await fetch(`/api/admin/courses/${courseId}`, {
      method: "DELETE",
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not delete course.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleDelete}
        disabled={loading}
        className="focus-ring rounded-full px-3 py-1.5 font-semibold text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
      >
        {loading ? "Deleting..." : "Delete"}
      </button>

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
    </div>
  );
}
