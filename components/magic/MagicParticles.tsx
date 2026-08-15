"use client";

import { useEffect, useRef } from "react";

type Kind = "gold" | "silver" | "ember" | "firefly";

const PALETTE: Record<Kind, string> = {
  gold: "201, 150, 50",
  silver: "170, 165, 167",
  ember: "228, 189, 104",
  firefly: "240, 216, 150",
};

/**
 * Shared particle field, drawn to one canvas.
 *
 * Budget is deliberately small (§49): the count scales down with viewport and
 * the loop stops outright when the field scrolls off screen or the tab is
 * hidden, so an idle page costs nothing. Everything is plain 2D canvas —
 * cheaper here than hundreds of animated DOM nodes.
 */
export default function MagicParticles({
  count = 40,
  kind = "gold",
  className = "",
}: {
  count?: number;
  kind?: Kind;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rgb = PALETTE[kind];
    // Phones get a third of the budget; they gain least and pay most.
    const budget = window.innerWidth < 768 ? Math.round(count / 3) : count;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; tw: number };
    let parts: P[] = [];

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      parts = Array.from({ length: budget }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.14,
        vy: -0.05 - Math.random() * 0.16,
        r: 0.7 + Math.random() * 1.5,
        a: 0.2 + Math.random() * 0.5,
        tw: Math.random() * Math.PI * 2,
      }));
    }

    function frame() {
      ctx!.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.02;

        // Wrap rather than respawn, so density stays constant.
        if (p.y < -4) p.y = h + 4;
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;

        const alpha = p.a * (0.55 + 0.45 * Math.sin(p.tw));
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${rgb}, ${alpha})`;
        ctx!.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    resize();
    seed();

    // Only run while visible on screen.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      resize();
      seed();
    });
    ro.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count, kind]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
