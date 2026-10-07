"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";

type Lesson = { id: string; title: string; content: string; order: number };

type LessonViewerProps = {
  courseId: string;
  lessons: Lesson[];
  /** Lesson ids the student has already completed. */
  completedIds: string[];
  /** Admins previewing a course they don't own cannot record progress. */
  canTrackProgress: boolean;
  existingCertificateCode?: string | null;
};

export default function LessonViewer({
  courseId,
  lessons,
  completedIds,
  canTrackProgress,
  existingCertificateCode = null,
}: LessonViewerProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(
    new Set(completedIds),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [certCode, setCertCode] = useState<string | null>(
    existingCertificateCode,
  );
  const [justEarned, setJustEarned] = useState(false);

  const active = lessons[activeIndex];

  if (lessons.length === 0) {
    return (
      <div className="card px-6 py-16 text-center">
        <p className="font-semibold">This course has no lessons yet.</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Check back soon.
        </p>
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
      setTimeout(
        () => setActiveIndex((i) => Math.min(lessons.length - 1, i + 1)),
        350,
      );
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr_300px] lg:items-start">
      <aside className="card animate-fade-up sticky top-24 overflow-hidden p-0 border border-[var(--border)] shadow-[var(--shadow-panel)]">
        <div className="bg-[var(--surface-2)] border-b border-[var(--border)] px-4 pb-4 pt-4">
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-faint)]">
              Curriculum
            </p>
            <p className="text-sm font-bold text-[var(--gold)]">{percent}%</p>
          </div>
          <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface)]">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[var(--gold)] shadow-[0_0_8px_var(--gold)]"
              style={{
                width: `${percent}%`,
                transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>
          <p className="mt-2 text-[11px] font-medium tracking-wide text-[var(--text-muted)] text-right">
            {doneCount} of {lessons.length} Mastered
          </p>
        </div>

        <ol className="divide-y divide-[var(--border)] max-h-[calc(100vh-16rem)] overflow-y-auto">
          {lessons.map((lesson, i) => {
            const isActive = i === activeIndex;
            const isComplete = completed.has(lesson.id);
            return (
              <li key={lesson.id} className="relative group">
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--gold)] shadow-[0_0_8px_var(--gold)] z-10"
                  />
                )}
                <button
                  onClick={() => setActiveIndex(i)}
                  aria-current={isActive ? "true" : undefined}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-[var(--surface-2)] font-semibold text-[var(--brand)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                  }`}
                >
                  <span
                    className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-sm border text-[11px] font-bold transition-all ${
                      isComplete
                        ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--on-gold)]"
                        : isActive
                          ? "border-[var(--gold)] bg-transparent text-[var(--gold)]"
                          : "border-[var(--border)] bg-transparent text-[var(--text-faint)] group-hover:border-[var(--text-muted)] group-hover:text-[var(--text)]"
                    }`}
                  >
                    {isComplete ? (
                      <Icon name="check" className="h-3 w-3" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className="flex-1 line-clamp-2 leading-tight">
                    {lesson.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>

      <section
        className="card animate-fade-up p-8 relative min-h-[600px] border border-[var(--border)] shadow-[var(--shadow-card)]"
        style={{ animationDelay: "0.08s" }}
      >
        {/* Parchment background for content */}
        <div className="absolute inset-0 bg-[var(--surface)] opacity-90 rounded-2xl pointer-events-none" />

        <div className="relative z-10">
          {percent >= 85 && (
            <div className="mb-8 pt-4 pb-6 border-b border-[var(--border)]">
              <h3 className="text-xl font-bold mb-4 text-[var(--gold)] flex items-center gap-2">
                <Icon name="award" className="h-5 w-5" />
                Mastery Achieved! Claim Your Certificates
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <a
                  href={`/api/certificates/generate?courseId=${courseId}&type=COURSE`}
                  className="flex items-center gap-2 bg-[var(--gold)] hover:bg-[var(--gold-bright)] text-black font-semibold py-2 px-5 rounded-md transition-colors"
                >
                  <Icon name="medal" className="h-4 w-4" />
                  Claim Course Certificate
                </a>
                <a
                  href={`/api/certificates/generate?courseId=${courseId}&type=INTERNSHIP`}
                  className="flex items-center gap-2 border border-[var(--gold)] hover:bg-[var(--gold)] hover:text-black text-[var(--gold)] font-semibold py-2 px-5 rounded-md transition-colors"
                >
                  <Icon name="briefcase" className="h-4 w-4" />
                  Claim Internship Certificate
                </a>
              </div>
            </div>
          )}

          {certCode && (
            <div
              className={`mb-8 flex flex-wrap items-center gap-4 rounded-xl border border-[var(--gold)] bg-[var(--surface-2)] px-6 py-5 shadow-[0_0_12px_var(--academy-glow)] ${
                justEarned ? "animate-pop-in" : ""
              }`}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dim)] text-[var(--on-gold)] shadow-lg">
                <Icon name="award" className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-lg font-bold text-[var(--gold)]">
                  {justEarned
                    ? "Mastery Achieved — Credential Issued!"
                    : "Credential Earned"}
                </p>
                <p className="font-mono text-sm text-[var(--text-muted)] tracking-widest">
                  {certCode}
                </p>
              </div>
              <Link
                href={`/certificates/${certCode}`}
                className="rune-edge press inline-flex items-center gap-2 rounded-md border border-[var(--gold-bright)] bg-[var(--surface-2)] px-5 py-2.5 font-semibold text-[var(--gold)] transition hover:brightness-110"
              >
                View Credential
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </div>
          )}

          <header className="mb-8 border-b border-[var(--border)] pb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--gold)]">
              Manuscript {activeIndex + 1} of {lessons.length}
            </p>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-[var(--brand)]">
              {active.title}
            </h2>
          </header>

          <div
            key={active.id}
            className="animate-fade-in whitespace-pre-wrap leading-relaxed text-[17px] text-[var(--text-muted)]"
          >
            {active.content}
          </div>

          {error && (
            <p className="mt-6 rounded-md bg-red-900/20 px-4 py-3 text-sm font-medium text-red-400 border border-red-800">
              {error}
            </p>
          )}

          {canTrackProgress && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={toggleComplete}
                disabled={saving}
                className={`rune-edge group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-md border px-8 py-3 text-[16px] font-semibold transition-all duration-300 w-full sm:w-auto ${
                  isDone
                    ? "border-[var(--gold)] bg-[var(--surface-2)] text-[var(--gold)] shadow-[0_0_12px_var(--academy-glow)]"
                    : "border-[var(--gold-bright)] bg-gradient-to-b from-[var(--gold)] to-[var(--gold-dim)] text-[var(--on-gold)] hover:brightness-110 shadow-[0_0_18px_rgb(212_162_76/0.35)]"
                }`}
              >
                <span
                  className={`grid h-5 w-5 place-items-center rounded-full transition-colors ${isDone ? "bg-[var(--gold)] text-[var(--on-gold)]" : "bg-black/20 text-[var(--on-gold)]"}`}
                >
                  <Icon name="check" className="h-3 w-3" />
                </span>
                {saving
                  ? "Inscribing..."
                  : isDone
                    ? "Mastery Recorded"
                    : "Mark as Mastered"}
              </button>
            </div>
          )}

          <div className="mt-12 flex items-center justify-between border-t border-[var(--border)] pt-8">
            <button
              onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
              disabled={activeIndex === 0}
              className="rune-edge inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 font-medium text-[var(--text)] transition hover:text-[var(--gold)] hover:border-[var(--gold)] disabled:opacity-40 disabled:pointer-events-none"
            >
              <span className="rotate-180">
                <Icon name="arrowRight" className="h-4 w-4" />
              </span>
              Previous
            </button>
            <button
              onClick={() =>
                setActiveIndex((i) => Math.min(lessons.length - 1, i + 1))
              }
              disabled={activeIndex === lessons.length - 1}
              className="rune-edge inline-flex items-center gap-2 rounded-md border border-[var(--gold)] bg-[var(--surface-2)] px-5 py-2.5 font-semibold text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-[var(--on-gold)] disabled:opacity-40 disabled:pointer-events-none"
            >
              Next
              <Icon name="arrowRight" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Study Notes Sidebar */}
      <aside
        className="card animate-fade-up sticky top-24 h-[calc(100vh-8rem)] flex flex-col overflow-hidden border border-[var(--border)] bg-[var(--surface-2)] shadow-[var(--shadow-panel)]"
        style={{ animationDelay: "0.15s" }}
      >
        <div className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3 flex items-center gap-2">
          <Icon name="code" className="h-4 w-4 text-[var(--gold)]" />
          <h3 className="font-serif font-bold text-[var(--brand)]">
            Study Notes
          </h3>
        </div>
        <textarea
          className="flex-1 w-full resize-none bg-transparent p-4 text-[15px] text-[var(--text-muted)] placeholder:text-[var(--text-faint)] focus:outline-none"
          placeholder="Jot down your insights here... (Autosaved locally)"
          defaultValue=""
          onChange={() => {
            clearTimeout((window as any)._notesTimer);
            (window as any)._notesTimer = setTimeout(() => {
              // Autosave is handled locally; no noisy console output.
            }, 1000);
          }}
        />
      </aside>
    </div>
  );
}
