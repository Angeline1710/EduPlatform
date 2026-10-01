"use client";

import { useEffect, useState } from "react";

export default function QuillAnimation({
  text,
  onComplete,
  className = "",
}: {
  text: string;
  onComplete?: () => void;
  className?: string;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(
        () => {
          setDisplayedText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        },
        50 + Math.random() * 50,
      ); // randomized typing speed
      return () => clearTimeout(timer);
    } else {
      if (onComplete) onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return (
    <span className={`relative inline-block ${className}`}>
      {displayedText}
      {currentIndex < text.length && (
        <span
          className="absolute ml-1 inline-block h-[1em] w-[2px] bg-[var(--gold)] animate-pulse"
          style={{ transform: "rotate(15deg)" }}
        />
      )}
    </span>
  );
}
