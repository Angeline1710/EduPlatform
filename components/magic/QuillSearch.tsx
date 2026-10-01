"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";

type Suggestion = { label: string; kind: "course" | "department" };

/**
 * The archive search.
 *
 * A quill nib rides the caret as the user types and leaves a drying ink
 * trail behind it. The nib's position is measured from a mirror span that
 * carries the input's exact font metrics, so it tracks real glyph widths
 * rather than an assumed character width.
 *
 * The animation is decoration only — submitting navigates to the same
 * `?q=` URL the server already filters on, so results are never implied by
 * the animation alone.
 */
export default function QuillSearch({
  initialQuery = "",
  suggestions = [],
  autoFocus = false,
  placeholder = "Search the archives...",
}: {
  initialQuery?: string;
  suggestions?: Suggestion[];
  autoFocus?: boolean;
  placeholder?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nibX, setNibX] = useState(0);
  const [reduced, setReduced] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const mirrorRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Measure the rendered text so the nib sits exactly at the caret.
  useEffect(() => {
    const mirror = mirrorRef.current;
    const input = inputRef.current;
    if (!mirror || !input) return;

    const width = mirror.offsetWidth;
    const max = input.clientWidth - 8;
    setNibX(Math.min(width, Math.max(0, max)));
  }, [query]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return suggestions
      .filter((s) => s.label.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, suggestions]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = query.trim();
    setSubmitting(true);
    // Real navigation — the server does the filtering, as it always has.
    router.push(term ? `/courses?q=${encodeURIComponent(term)}` : "/courses");
  }

  // Clear the submitting flag once the new query has landed.
  useEffect(() => {
    setSubmitting(false);
  }, [initialQuery]);

  const showNib = focused && query.length > 0 && !reduced;

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <form onSubmit={submit}>
        <div
          className={`relative flex items-center gap-3 rounded-full border bg-black/25 py-2.5 pl-5 pr-2.5 transition-all duration-300 ${
            focused
              ? "border-[var(--gold)] shadow-[0_0_22px_var(--academy-glow)]"
              : "border-[var(--shell-line)]"
          }`}
        >
          <Icon name="search" className="h-4 w-4 shrink-0 text-[var(--gold)]" />

          <div className="relative min-w-0 flex-1">
            <input
              ref={inputRef}
              value={query}
              autoFocus={autoFocus}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => window.setTimeout(() => setFocused(false), 150)}
              placeholder={placeholder}
              aria-label="Search the archives"
              className="w-full bg-transparent text-[15px] text-[var(--shell-text)] placeholder:text-[var(--shell-text-muted)] focus:outline-none"
            />

            {/* Hidden mirror: same font metrics as the input, so its width
                is the exact pixel offset of the caret. */}
            <span
              ref={mirrorRef}
              aria-hidden="true"
              className="pointer-events-none invisible absolute left-0 top-0 whitespace-pre text-[15px]"
            >
              {query}
            </span>

            {/* Drying ink trail under what has been written */}
            {showNib && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-[-3px] left-0 h-[2px] rounded-full"
                style={{
                  width: nibX,
                  background:
                    "linear-gradient(90deg, transparent, var(--gold-dim) 15%, var(--gold) 90%)",
                  opacity: 0.75,
                  transition: "width 90ms linear",
                }}
              />
            )}

            {/* The nib itself, riding the caret */}
            {showNib && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-3.5 text-[var(--gold-bright)]"
                style={{
                  left: nibX - 3,
                  transition: "left 90ms linear",
                  filter: "drop-shadow(0 0 5px var(--academy-glow))",
                }}
              >
                <QuillNib />
              </span>
            )}
          </div>

          <button
            type="submit"
            aria-label="Search"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[var(--gold)] transition hover:bg-[var(--gold-soft)]"
          >
            {submitting ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--gold)] border-t-transparent" />
            ) : (
              <Icon name="arrowRight" className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>

      {/* Live suggestions, drawn from the real catalogue */}
      {focused && matches.length > 0 && (
        <ul className="animate-fade-up absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-lg border border-[var(--shell-line)] bg-[var(--shell)] py-1.5 shadow-[var(--shadow-panel)]">
          {matches.map((m) => (
            <li key={`${m.kind}-${m.label}`}>
              <button
                type="button"
                onMouseDown={(e) => {
                  // mousedown, not click: blur would close the list first.
                  e.preventDefault();
                  setQuery(m.label);
                  router.push(
                    m.kind === "department"
                      ? `/courses?category=${encodeURIComponent(m.label)}`
                      : `/courses?q=${encodeURIComponent(m.label)}`,
                  );
                }}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-[var(--shell-text)] transition hover:bg-white/5"
              >
                <Icon
                  name={m.kind === "department" ? "grid" : "book"}
                  className="h-3.5 w-3.5 shrink-0 text-[var(--gold)]"
                />
                <span className="truncate">{m.label}</span>
                <span className="ml-auto shrink-0 text-[10px] uppercase tracking-widest text-[var(--shell-text-muted)]">
                  {m.kind}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Small feathered quill, nib pointing down-left at the caret. */
function QuillNib() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M17 1c-4 1.4-8.2 4.6-10.4 8.2L4.8 12l2.6-1c3.6-1.4 7.2-4.6 8.4-8L17 1z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M5 11.6L1.6 16.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M13.6 3.6c-2.4 1.6-4.6 3.8-6 6"
        stroke="var(--gold-dim)"
        strokeWidth="0.7"
      />
    </svg>
  );
}
