"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

type Lesson = { id: string; title: string; content: string; order: number };

export default function LessonViewer({ lessons }: { lessons: Lesson[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = lessons[activeIndex];

  if (lessons.length === 0) {
    return (
      <div className="card px-6 py-16 text-center">
        <p className="font-semibold">This course has no lessons yet.</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Check back soon.</p>
      </div>
    );
  }

  const progress = ((activeIndex + 1) / lessons.length) * 100;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
      <aside className="card sticky top-24 overflow-hidden p-2">
        <div className="px-3 pb-3 pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
            {lessons.length} lessons
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
            <div
              className="brand-gradient h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <ol className="space-y-0.5">
          {lessons.map((lesson, i) => {
            const isActive = i === activeIndex;
            return (
              <li key={lesson.id}>
                <button
                  onClick={() => setActiveIndex(i)}
                  aria-current={isActive ? "true" : undefined}
                  className={`focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    isActive
                      ? "brand-gradient font-semibold text-white shadow-sm"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                  }`}
                >
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                      isActive ? "bg-white/25" : "bg-[var(--surface-2)]"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1">{lesson.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>

      <section className="card p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
          Lesson {activeIndex + 1} of {lessons.length}
        </p>
        <h2 className="text-2xl font-bold tracking-tight">{active.title}</h2>

        <div className="mt-6 whitespace-pre-wrap leading-relaxed text-[var(--text-muted)]">
          {active.content}
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-[var(--border)] pt-6">
          <button
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            disabled={activeIndex === 0}
            className="btn btn-secondary disabled:opacity-40"
          >
            <span className="rotate-180">
              <Icon name="arrowRight" className="h-4 w-4" />
            </span>
            Previous
          </button>
          <button
            onClick={() => setActiveIndex((i) => Math.min(lessons.length - 1, i + 1))}
            disabled={activeIndex === lessons.length - 1}
            className="btn btn-primary disabled:opacity-40"
          >
            Next
            <Icon name="arrowRight" className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
