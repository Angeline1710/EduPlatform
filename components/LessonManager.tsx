"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Lesson = { id: string; title: string; content: string; order: number };

export default function LessonManager({
  courseId,
  lessons,
}: {
  courseId: string;
  lessons: Lesson[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function startAdd() {
    setEditingId("new");
    setTitle("");
    setContent("");
    setError("");
  }

  function startEdit(lesson: Lesson) {
    setEditingId(lesson.id);
    setTitle(lesson.title);
    setContent(lesson.content);
    setError("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const isNew = editingId === "new";
    const res = await fetch(
      isNew ? `/api/admin/courses/${courseId}/lessons` : `/api/admin/lessons/${editingId}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      }
    );

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save lesson.");
      return;
    }

    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(lessonId: string) {
    if (!confirm("Delete this lesson?")) return;

    const res = await fetch(`/api/admin/lessons/${lessonId}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Could not delete lesson.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <ol className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
        {lessons.length === 0 && (
          <li className="px-4 py-4 text-sm text-gray-500">No lessons yet.</li>
        )}
        {lessons.map((lesson, i) => (
          <li key={lesson.id} className="flex items-center gap-3 px-4 py-3 text-sm">
            <span className="w-6 text-gray-400">{i + 1}</span>
            <span className="flex-1">{lesson.title}</span>
            <button onClick={() => startEdit(lesson)} className="text-blue-600 hover:underline">
              Edit
            </button>
            <button
              onClick={() => handleDelete(lesson.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ol>

      {editingId ? (
        <form onSubmit={handleSave} className="space-y-3 rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="font-semibold">{editingId === "new" ? "Add lesson" : "Edit lesson"}</h3>
          <div>
            <label className="mb-1 block text-sm font-medium">Lesson title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Content (text or video URL)</label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save lesson"}
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={startAdd}
          className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
        >
          + Add lesson
        </button>
      )}
    </div>
  );
}
