"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  value: number;
  durationMs?: number;
  /** Rendered before/after the number, e.g. "$" or "%". */
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

/** Animates from 0 up to `value` once, on mount. */
export default function CountUp({
  value,
  durationMs = 900,
  prefix = "",
  suffix = "",
  decimals = 0,
}: CountUpProps) {
  const [display, setDisplay] = useState(value);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || value === 0) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    setDisplay(0);

    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [value, durationMs]);

  return (
    <span>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
