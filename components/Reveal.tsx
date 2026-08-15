"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Seconds of delay before the element animates in. */
  delay?: number;
  className?: string;
};

/**
 * Fades content up as it scrolls into view.
 *
 * Starts in the revealed state and only hides itself once the observer is
 * confirmed available, so content is never left invisible if JS fails to run
 * or IntersectionObserver is missing.
 */
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [revealed, setRevealed] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    // Only now is it safe to hide: we can guarantee we can show it again.
    setArmed(true);
    setRevealed(false);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${armed ? "reveal" : ""} ${className}`}
      data-revealed={revealed ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
