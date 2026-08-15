"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/Icon";

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
      <ol className="card divide-y divide-[var(--border)] overflow-hidden">
        {lessons.length === 0 && (
          <li className="px-5 py-6 text-center text-sm text-[var(--text-muted)]">
            No lessons yet.
          </li>
        )}
        {lessons.map((lesson, i) => (
          <li key={lesson.id} className="flex items-center gap-3 px-5 py-3.5 text-sm">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--surface-2)] text-xs font-semibold text-[var(--text-muted)]">
              {i + 1}
            </span>
            <span className="flex-1 font-medium">{lesson.title}</span>
            <button
              onClick={() => startEdit(lesson)}
              className="focus-ring rounded-full px-3 py-1.5 font-semibold text-[var(--brand)] transition hover:bg-[var(--brand-soft)]"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(lesson.id)}
              className="focus-ring rounded-full px-3 py-1.5 font-semibold text-red-500 transition hover:bg-red-500/10"
            >
              Delete
            </button>
          </li>
        ))}
      </ol>

      {editingId ? (
        <form onSubmit={handleSave} className="card space-y-4 p-5">
          <h3 className="font-bold">{editingId === "new" ? "Add lesson" : "Edit lesson"}</h3>
          <div>
            <label htmlFor="lesson-title" className="label">
              Lesson title
            </label>
            <input
              id="lesson-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="lesson-content" className="label">
              Content <span className="font-normal text-[var(--text-faint)]">(text or video URL)</span>
            </label>
            <textarea
              id="lesson-content"
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input resize-y"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? "Saving..." : "Save lesson"}
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button onClick={startAdd} className="btn btn-secondary">
          <Icon name="plus" className="h-4 w-4" />
          Add lesson
        </button>
      )}
    </div>
  );
}
