"use client";

import { useEffect, useState } from "react";

/**
 * The site's living backdrop.
 *
 * Sits fixed behind every page so the artwork continues past the hero
 * instead of stopping at it. Everything is low-contrast and slow — this is
 * meant to be felt rather than watched.
 *
 * Rendered only after mount: the figures are randomised per visit, and
 * generating them during SSR would produce a hydration mismatch.
 */
export default function AmbientCanvas() {
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setReady(true);
  }, []);

  if (!ready) return null;

  // Fixed layout, varied by hand so nothing sits on a grid.
  const constellations = [
    { d: "M60 120L140 90L210 140L280 100", top: "8%", left: "4%" },
    { d: "M40 60L120 30L180 80L250 40L300 90", top: "44%", left: "62%" },
    { d: "M20 80L90 40L160 70", top: "74%", left: "12%" },
  ];

  const blooms = [
    { top: "18%", left: "78%", size: 220, delay: 0 },
    { top: "62%", left: "8%", size: 300, delay: 6 },
    { top: "86%", left: "58%", size: 180, delay: 11 },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Ink blooming through the paper */}
      {!reduced &&
        blooms.map((b, i) => (
          <span
            key={i}
            className="ambient-bloom absolute rounded-full"
            style={{
              top: b.top,
              left: b.left,
              width: b.size,
              height: b.size,
              background:
                "radial-gradient(circle, var(--academy-glow), transparent 70%)",
              animationDelay: `${b.delay}s`,
            }}
          />
        ))}

      {/* Faint constellations drawing themselves across the page */}
      {constellations.map((c, i) => (
        <svg
          key={i}
          className="absolute"
          width="320"
          height="170"
          style={{ top: c.top, left: c.left, opacity: 0.5 }}
          fill="none"
        >
          <path
            d={c.d}
            stroke="var(--gold)"
            strokeWidth="0.7"
            className="ambient-line"
            style={{ animationDelay: `${i * 7}s` }}
          />
          {c.d
            .split("L")
            .map((seg) => seg.replace("M", "").trim().split(" ").map(Number))
            .map(([x, y], j) => (
              <circle
                key={j}
                cx={x}
                cy={y}
                r="1.4"
                fill="var(--gold)"
                opacity="0.55"
              />
            ))}
        </svg>
      ))}
    </div>
  );
}
