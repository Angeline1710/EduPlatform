"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";

type Lesson = { id: string; title: string; content: string; order: number };

type LessonViewerProps = {
  lessons: Lesson[];
  /** Lesson ids the student has already completed. */
  completedIds: string[];
  /** Admins previewing a course they don't own cannot record progress. */
  canTrackProgress: boolean;
  existingCertificateCode?: string | null;
};

export default function LessonViewer({
  lessons,
  completedIds,
  canTrackProgress,
  existingCertificateCode = null,
}: LessonViewerProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set(completedIds));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [certCode, setCertCode] = useState<string | null>(existingCertificateCode);
  const [justEarned, setJustEarned] = useState(false);

  const active = lessons[activeIndex];

  if (lessons.length === 0) {
    return (
      <div className="card px-6 py-16 text-center">
        <p className="font-semibold">This course has no lessons yet.</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Check back soon.</p>
      </div>
    );
  }

  const doneCount = completed.size;
  const percent = Math.round((doneCount / lessons.length) * 100);
  const isDone = completed.has(active.id);

  async function toggleComplete() {
    if (!canTrackProgress || saving) return;
    setSaving(true);
    setError("");

    const next = !isDone;
    // Optimistic: reflect the click immediately, roll back if the save fails.
    const optimistic = new Set(completed);
    if (next) optimistic.add(active.id);
    else optimistic.delete(active.id);
    setCompleted(optimistic);

    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: active.id, completed: next }),
    });

    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setCompleted(completed);
      setError(data.error ?? "Could not save progress.");
      return;
    }

    if (data.certificateCode && !certCode) {
      setCertCode(data.certificateCode);
      setJustEarned(true);
    }

    // Refresh so the dashboard and course pages pick the change up.
    router.refresh();

    // Advance to the next unfinished lesson for a smoother run-through.
    if (next && activeIndex < lessons.length - 1) {
      setTimeout(() => setActiveIndex((i) => Math.min(lessons.length - 1, i + 1)), 350);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
      <aside className="card animate-fade-up sticky top-24 overflow-hidden p-2">
        <div className="px-3 pb-3 pt-2">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
              Progress
            </p>
            <p className="text-sm font-bold text-[var(--brand)]">{percent}%</p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
            <div
              className="brand-gradient h-full rounded-full"
              style={{
                width: `${percent}%`,
                transition: "width 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>
          <p className="mt-1.5 text-xs text-[var(--text-faint)]">
            {doneCount} of {lessons.length} lessons
          </p>
        </div>

        <ol className="space-y-0.5">
          {lessons.map((lesson, i) => {
            const isActive = i === activeIndex;
            const isComplete = completed.has(lesson.id);
            return (
              <li key={lesson.id}>
                <button
                  onClick={() => setActiveIndex(i)}
                  aria-current={isActive ? "true" : undefined}
                  className={`focus-ring press flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    isActive
                      ? "brand-gradient font-semibold text-white shadow-sm"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                  }`}
                >
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold transition ${
                      isComplete
                        ? "bg-emerald-500 text-white"
                        : isActive
                          ? "bg-white/25"
                          : "bg-[var(--surface-2)]"
                    }`}
                  >
                    {isComplete ? <Icon name="check" className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className="flex-1">{lesson.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>

      <section className="card animate-fade-up p-8" style={{ animationDelay: "0.08s" }}>
        {certCode && (
          <div
            className={`mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 ${
              justEarned ? "animate-pop-in" : ""
            }`}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
              <Icon name="award" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-emerald-600 dark:text-emerald-400">
                {justEarned ? "Course complete — certificate issued!" : "Certificate earned"}
              </p>
              <p className="font-mono text-xs text-[var(--text-muted)]">{certCode}</p>
            </div>
            <Link href={`/certificates/${certCode}`} className="btn btn-primary press">
              View certificate
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        )}

        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
          Lesson {activeIndex + 1} of {lessons.length}
        </p>
        <h2 className="text-2xl font-bold tracking-tight">{active.title}</h2>

        <div
          key={active.id}
          className="animate-fade-in mt-6 whitespace-pre-wrap leading-relaxed text-[var(--text-muted)]"
        >
          {active.content}
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500">
            {error}
          </p>
        )}

        {canTrackProgress && (
          <button
            onClick={toggleComplete}
            disabled={saving}
            className={`press mt-8 inline-flex w-full items-center justify-center gap-2.5 rounded-full px-5 py-3 font-semibold transition sm:w-auto ${
              isDone
                ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "btn-primary text-white"
            }`}
          >
            <span
              className={`grid h-5 w-5 place-items-center rounded-full ${
                isDone ? "bg-emerald-500 text-white" : "bg-white/25"
              }`}
            >
              <Icon name="check" className="h-3 w-3" />
            </span>
            {saving ? "Saving..." : isDone ? "Completed" : "Mark as complete"}
          </button>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-6">
          <button
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            disabled={activeIndex === 0}
            className="btn btn-secondary press disabled:opacity-40"
          >
            <span className="rotate-180">
              <Icon name="arrowRight" className="h-4 w-4" />
            </span>
            Previous
          </button>
          <button
            onClick={() => setActiveIndex((i) => Math.min(lessons.length - 1, i + 1))}
            disabled={activeIndex === lessons.length - 1}
            className="btn btn-primary press disabled:opacity-40"
          >
            Next
            <Icon name="arrowRight" className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
