"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "Living ink": the letters stay perfectly still, and every so often a single
 * mote of light drifts across them.
 *
 * The restraint is the point (§7) — one mote at a time, on a randomised
 * interval, so the text reads as quietly alive rather than as a shimmering
 * banner. Motion is skipped entirely under prefers-reduced-motion.
 */
export default function LivingInk({
  children,
  className = "",
  /** Average seconds between motes. */
  interval = 6,
}: {
  children: React.ReactNode;
  className?: string;
  interval?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [mote, setMote] = useState<{ id: number; top: number } | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number;
    let id = 0;

    const schedule = () => {
      // Randomised gap so the rhythm never feels mechanical.
      const wait = (interval + Math.random() * interval) * 1000;
      timer = window.setTimeout(() => {
        // Only animate while actually on screen — no work for offscreen text.
        const el = ref.current;
        if (el) {
          const r = el.getBoundingClientRect();
          const visible = r.top < window.innerHeight && r.bottom > 0;
          if (visible) {
            id += 1;
            setMote({ id, top: 20 + Math.random() * 60 });
            window.setTimeout(() => setMote(null), 1800);
          }
        }
        schedule();
      }, wait);
    };

    schedule();
    return () => window.clearTimeout(timer);
  }, [interval]);

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {children}
      {mote && (
        <span
          key={mote.id}
          aria-hidden="true"
          className="pointer-events-none absolute h-[3px] w-[3px] rounded-full"
          style={{
            top: `${mote.top}%`,
            left: 0,
            background: "var(--gold-bright)",
            boxShadow: "0 0 8px 2px var(--academy-glow)",
            animation: "mote-drift 1.8s var(--ease-ink) forwards",
          }}
        />
      )}
    </span>
  );
}
