"use client";

import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";

/** Must match --t-major in globals.css. */
const SWEEP_MS = 900;

/** View Transitions is not in the DOM lib yet. */
type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // The inline script in <head> has already resolved and applied the theme.
    // Read that back rather than re-deriving it, so the button label can never
    // disagree with what is actually on screen.
    const applied = document.documentElement.getAttribute("data-theme") as Theme | null;
    const stored = localStorage.getItem("theme") as Theme | null;
    const initial =
      applied ??
      stored ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.add("theme-ready");
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  /** Expanding gold rim that rides the leading edge of the wipe. */
  function spawnRim(x: number, y: number) {
    const rim = document.createElement("span");
    rim.className = "sweep-rim";
    rim.style.left = `${x}px`;
    rim.style.top = `${y}px`;
    rim.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(rim);
    window.setTimeout(() => rim.remove(), SWEEP_MS + 100);
  }

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(next);
      return;
    }

    // Sweep outward from the button the user actually pressed, so the change
    // has a direction and an origin rather than appearing everywhere at once.
    const rect = btnRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    const root = document.documentElement;
    root.style.setProperty("--sweep-x", `${(x / window.innerWidth) * 100}%`);
    root.style.setProperty("--sweep-y", `${(y / window.innerHeight) * 100}%`);

    const doc = document as DocWithVT;

    // Without View Transitions the snapshot wipe is impossible; swap plainly
    // rather than faking it with an overlay that only tints part of the page.
    if (!doc.startViewTransition) {
      spawnRim(x, y);
      apply(next);
      return;
    }

    root.classList.add("theme-sweeping");
    spawnRim(x, y);

    const transition = doc.startViewTransition(() => {
      apply(next);
    });

    transition.finished.finally(() => root.classList.remove("theme-sweeping"));
  }

  const isDark = theme === "dark";

  return (
    <button
      ref={btnRef}
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="group relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-[var(--shell-line)] text-[var(--gold)] transition hover:border-[var(--gold)] hover:bg-[var(--gold-soft)]"
    >
      {/* Sun and moon are both mounted and cross-fade, so the control itself
          animates rather than swapping glyphs abruptly. */}
      <span
        className="absolute transition-all duration-500"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark ? "translateY(14px) rotate(-90deg)" : "none",
        }}
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      </span>

      <span
        className="absolute transition-all duration-500"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark ? "none" : "translateY(-14px) rotate(90deg)",
        }}
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      </span>
    </button>
  );
}
