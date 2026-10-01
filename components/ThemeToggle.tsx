"use client";

import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";

/** Must match --t-sweep in globals.css. */
const SWEEP_MS = 1150;

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // The inline script in <head> has already resolved and applied the theme.
    // Read that back rather than re-deriving it, so the button label can never
    // disagree with what is actually on screen.
    const applied = document.documentElement.getAttribute(
      "data-theme",
    ) as Theme | null;
    const stored = localStorage.getItem("theme") as Theme | null;
    const initial =
      applied ??
      stored ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(initial);
    document.documentElement.classList.add("theme-ready");
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  /**
   * A wave of light crossing the page, with motes riding its curve.
   *
   * Nothing opaque is drawn. An earlier version expanded a solid disc of the
   * incoming ground colour and swapped the palette beneath it — which is
   * exactly what made it read as a flash, since the page was simply covered
   * for half a second. Here the palette is applied as the wave *starts* and
   * eases over on a long colour transition, so every surface is visibly
   * turning while the wave travels.
   */
  function sweep(x: number, y: number, to: Theme) {
    const spawned: HTMLElement[] = [];

    const ring = (lead: boolean) => {
      const el = document.createElement("span");
      el.className = lead ? "sweep-wave sweep-wave--lead" : "sweep-wave";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      document.body.appendChild(el);
      spawned.push(el);
    };

    ring(false);
    ring(true);

    // Motes spread around the circle, each pinned to the origin on its own
    // rotated arm so it stays on the wavefront rather than drifting off it.
    const COUNT = 22;
    for (let i = 0; i < COUNT; i++) {
      // Jitter the angle so the ring of sparks never looks like a clock face.
      const angle = (360 / COUNT) * i + (Math.random() * 10 - 5);
      const arm = document.createElement("span");
      arm.className = "sweep-spark";
      arm.style.left = `${x}px`;
      arm.style.top = `${y}px`;
      arm.style.transform = `rotate(${angle}deg)`;

      const spark = document.createElement("i");
      const size = 2 + Math.random() * 3;
      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.boxShadow = `0 0 ${6 + size * 2}px ${size / 2}px var(--academy-glow)`;
      // Spread the departures slightly so they twinkle rather than march.
      spark.style.animationDelay = `${Math.random() * 90}ms`;
      arm.appendChild(spark);

      document.body.appendChild(arm);
      spawned.push(arm);
    }

    // The palette changes with the wave, not behind it.
    apply(to);

    window.setTimeout(
      () => spawned.forEach((el) => el.remove()),
      SWEEP_MS + 400,
    );
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

    sweep(x, y, next);
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
