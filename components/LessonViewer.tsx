"use client";

import { useState } from "react";

type Lesson = { id: string; title: string; content: string; order: number };

export default function LessonViewer({ lessons }: { lessons: Lesson[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = lessons[activeIndex];

  if (lessons.length === 0) {
    return <p className="text-gray-600">This course has no lessons yet.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-[260px_1fr]">
      <aside className="rounded-lg border border-gray-200 bg-white p-2">
        <ol>
          {lessons.map((lesson, i) => (
            <li key={lesson.id}>
              <button
                onClick={() => setActiveIndex(i)}
                className={`w-full rounded px-3 py-2 text-left text-sm ${
                  i === activeIndex ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                }`}
              >
                <span className="mr-2 opacity-60">{i + 1}</span>
                {lesson.title}
              </button>
            </li>
          ))}
        </ol>
      </aside>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">{active.title}</h2>
        <p className="whitespace-pre-wrap text-gray-700">{active.content}</p>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            disabled={activeIndex === 0}
            className="rounded border border-gray-300 px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => setActiveIndex((i) => Math.min(lessons.length - 1, i + 1))}
            disabled={activeIndex === lessons.length - 1}
            className="rounded border border-gray-300 px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
