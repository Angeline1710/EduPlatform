"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero's background film.
 *
 * Two things are worth knowing about how it is framed:
 *
 * 1. The source carries a generator watermark in a bottom corner. It is
 *    scaled slightly past the frame and nudged up so that corner falls
 *    outside the visible box — cropping in CSS rather than re-encoding.
 * 2. Autoplay only works muted and inline; both are set. If the browser
 *    still refuses, or the visitor prefers reduced motion, the poster frame
 *    remains and nothing breaks.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    const v = ref.current;
    if (!v) return;

    if (mq.matches) {
      v.pause();
      return;
    }

    // Some browsers reject the autoplay promise; a paused first frame is a
    // perfectly good backdrop, so the rejection is swallowed deliberately.
    v.play().catch(() => {});

    // Don't burn decode cycles on a tab nobody is looking at.
    const onVisibility = () => {
      if (document.hidden) v.pause();
      else v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <video
        ref={ref}
        className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
        // Overscan hides the generator watermark in the lower corner.
        style={{ minWidth: "112%", minHeight: "112%", transform: "translate(-50%, -54%)" }}
        src="/hero-owl.mp4"
        muted
        loop
        playsInline
        autoPlay={!reduced}
        preload="metadata"
      />

      {/* Scrims: darken the film enough for the headline and the stats panel
          to sit on top of it legibly, without flattening the picture. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, var(--hero-scrim-strong) 0%, var(--hero-scrim-strong) 34%, var(--hero-scrim-soft) 62%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{ background: "linear-gradient(180deg, transparent, var(--hero-scrim-strong))" }}
      />
      <div
        className="absolute inset-x-0 top-0 h-24"
        style={{ background: "linear-gradient(180deg, var(--hero-scrim-soft), transparent)" }}
      />
    </div>
  );
}
