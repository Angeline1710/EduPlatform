"use client";

import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";

/** Total length of the hour-change sequence. */
const SWEEP_MS = 760;

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [sweep, setSweep] = useState<Theme | null>(null);
  const timers = useRef<number[]>([]);

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

    return () => timers.current.forEach(window.clearTimeout);
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(next);
      return;
    }

    // Run the sweep, and flip the palette at its midpoint so the change
    // happens behind the brightest part of the wash rather than in plain view.
    setSweep(next);
    timers.current.push(window.setTimeout(() => apply(next), SWEEP_MS * 0.42));
    timers.current.push(window.setTimeout(() => setSweep(null), SWEEP_MS));
  }

  return (
    <>
      <button
        onClick={toggle}
        aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        className="grid h-9 w-9 place-items-center rounded-full border border-[var(--shell-line)] text-[var(--gold)] transition hover:border-[var(--gold)] hover:bg-[var(--gold-soft)]"
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
          {theme === "dark" ? (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </>
          ) : (
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          )}
        </svg>
      </button>

      {sweep && <HourChange to={sweep} />}
    </>
  );
}

/**
 * The "academy hour" overlay.
 *
 * Going dark, the sun departs across the sky and stars bloom behind it.
 * Going light, the moon withdraws and warm light spreads. Purely visual and
 * click-through, so it never blocks the interface mid-sweep.
 */
function HourChange({ to }: { to: Theme }) {
  const goingDark = to === "dark";

  // Fixed positions so the bloom is identical every time rather than jittering.
  const stars = [
    { x: 14, y: 22, s: 3, d: 0.1 },
    { x: 28, y: 12, s: 2, d: 0.18 },
    { x: 41, y: 30, s: 4, d: 0.06 },
    { x: 56, y: 16, s: 2, d: 0.24 },
    { x: 68, y: 34, s: 3, d: 0.14 },
    { x: 79, y: 20, s: 2, d: 0.3 },
    { x: 88, y: 40, s: 3, d: 0.2 },
    { x: 22, y: 48, s: 2, d: 0.26 },
    { x: 47, y: 58, s: 3, d: 0.12 },
    { x: 72, y: 62, s: 2, d: 0.28 },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
      style={{ animation: `hour-sweep ${SWEEP_MS}ms ease-in-out both` }}
    >
      {/* Warm or cool wash across the whole viewport */}
      <div
        className="absolute inset-0"
        style={{
          background: goingDark
            ? "radial-gradient(circle at 70% 20%, rgb(84 38 56 / 0.55), rgb(27 16 25 / 0.85))"
            : "radial-gradient(circle at 20% 70%, rgb(228 189 104 / 0.5), rgb(247 241 229 / 0.8))",
        }}
      />

      {/* The travelling orb: sun leaving, or moon withdrawing */}
      <div
        className="absolute left-0 top-1/2 h-24 w-24 rounded-full"
        style={{
          background: goingDark
            ? "radial-gradient(circle, #F0D089, #C99632 55%, transparent 72%)"
            : "radial-gradient(circle, #FFFDF7, #AAA5A7 55%, transparent 72%)",
          filter: "blur(2px)",
          animation: `orb-travel ${SWEEP_MS}ms var(--ease-academy) both`,
        }}
      />

      {/* Stars bloom on the way into night only */}
      {goingDark &&
        stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#F4EFE7]"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.s,
              height: s.s,
              boxShadow: "0 0 8px rgb(244 239 231 / 0.9)",
              animation: `star-bloom ${SWEEP_MS}ms ease-out ${s.d}s both`,
            }}
          />
        ))}
    </div>
  );
}
