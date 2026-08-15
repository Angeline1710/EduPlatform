"use client";

import { useEffect, useState } from "react";

type ProgressRingProps = {
  percent: number;
  size?: number;
  stroke?: number;
  from?: string;
  to?: string;
  /** Unique per instance — SVG gradient ids must not collide on a page. */
  gradientId: string;
  label?: string;
};

export default function ProgressRing({
  percent,
  size = 68,
  stroke = 6,
  from = "#8b5cf6",
  to = "#6366f1",
  gradientId,
  label,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));

  // Animate from empty to the real value after mount.
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(clamped);
      return;
    }
    const id = requestAnimationFrame(() => setShown(clamped));
    return () => cancelAnimationFrame(id);
  }, [clamped]);

  const offset = circumference - (shown / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-bold">
        {label ?? `${Math.round(clamped)}%`}
      </span>
    </div>
  );
}
