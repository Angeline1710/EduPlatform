"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORY_NAMES, categoryTheme } from "@/lib/categories";
import Icon from "@/components/Icon";

type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnailUrl: string | null;
  gifUrl: string | null;
  published: boolean;
};

export default function CourseForm({ course }: { course?: Course }) {
  const router = useRouter();
  const [title, setTitle] = useState(course?.title ?? "");
  const [description, setDescription] = useState(course?.description ?? "");
  const [price, setPrice] = useState(
    course ? (course.price / 100).toFixed(2) : "300.00",
  );
  const [category, setCategory] = useState(course?.category ?? "Development");
  const [thumbnailUrl, setThumbnailUrl] = useState(course?.thumbnailUrl ?? "");
  const [gifUrl, setGifUrl] = useState(course?.gifUrl ?? "");
  const [gifBroken, setGifBroken] = useState(false);
  const [published, setPublished] = useState(course?.published ?? false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      title,
      description,
      price: Math.round(parseFloat(price) * 100),
      category,
      thumbnailUrl,
      gifUrl,
      published,
    };

    const res = await fetch(
      course ? `/api/admin/courses/${course.id}` : "/api/admin/courses",
      {
        method: course ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not save course.");
      return;
    }

    router.push(course ? "/admin" : `/admin/courses/${data.id}/edit`);
    router.refresh();
  }

  const theme = categoryTheme(category);

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-6">
      <div>
        <label htmlFor="title" className="label">
          Title
        </label>
        <input
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
        />
      </div>

      <div>
        <label htmlFor="description" className="label">
          Description
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input resize-y"
        />
      </div>

      <div>
        <label className="label">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_NAMES.map((name) => {
            const t = categoryTheme(name);
            const active = category === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setCategory(name)}
                aria-pressed={active}
                className={`focus-ring inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                  active
                    ? "border-transparent text-white shadow-sm"
                    : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
                style={
                  active
                    ? {
                        backgroundImage: `linear-gradient(135deg, ${t.from}, ${t.to})`,
                      }
                    : undefined
                }
              >
                <Icon name={t.icon} className="h-4 w-4" />
                {name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="label">
            Price (INR)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label htmlFor="thumb" className="label">
            Thumbnail URL{" "}
            <span className="font-normal text-[var(--text-faint)]">
              (optional)
            </span>
          </label>
          <input
            id="thumb"
            type="url"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="input"
          />
        </div>
      </div>

      {/* Live preview of the card tile the student will see */}
      <div className="flex items-center gap-3 rounded-2xl border border-dashed border-[var(--border-strong)] p-4">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-md"
          style={{
            backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
          }}
        >
          <Icon name={theme.icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">
            {category}
          </p>
          <p className="truncate font-bold">{title || "Course title"}</p>
        </div>
      </div>

      {/* Course GIF */}
      <div>
        <label htmlFor="gifUrl" className="label">
          Course GIF
          <span className="ml-2 font-normal text-[var(--text-faint)]">
            optional — plays above the course title
          </span>
        </label>
        <input
          id="gifUrl"
          type="url"
          value={gifUrl}
          onChange={(e) => setGifUrl(e.target.value)}
          placeholder="https://example.com/spellbook.gif"
          className="input"
        />

        {gifUrl && (
          <div className="mt-3 flex items-center gap-3">
            <span className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-md border border-[var(--gold)] bg-[var(--surface-2)] shadow-[0_0_12px_var(--academy-glow)]">
              {/* Plain <img>: the source is an arbitrary admin-supplied URL,
                  so it cannot go through the optimiser's allowlist. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gifUrl}
                alt=""
                className="h-full w-full object-cover"
                onError={() => setGifBroken(true)}
                onLoad={() => setGifBroken(false)}
              />
            </span>
            <p className="text-xs text-[var(--text-muted)]">
              {gifBroken
                ? "That URL could not be loaded — check the link."
                : "Preview. Square, under ~1MB looks best."}
            </p>
          </div>
        )}
      </div>

      <label className="flex items-center gap-2.5 text-sm font-medium">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 accent-[var(--brand)]"
        />
        Published (visible to students)
      </label>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? "Saving..." : course ? "Save changes" : "Create course"}
      </button>
    </form>
  );
}
