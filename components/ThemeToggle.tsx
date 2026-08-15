"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [transitioning, setTransitioning] = useState<Theme | null>(null);

  useEffect(() => {
    const applied = document.documentElement.getAttribute("data-theme") as Theme | null;
    const stored = localStorage.getItem("theme") as Theme | null;
    const initial =
      applied ??
      stored ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.add("theme-ready");
  }, []);

  function toggle() {
    if (transitioning) return;
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTransitioning(next);
    
    // Perform the Academy Hour transition (600-900ms)
    setTimeout(() => {
      setTheme(next);
      localStorage.setItem("theme", next);
      document.documentElement.setAttribute("data-theme", next);
      
      setTimeout(() => setTransitioning(null), 300); // fade out overlay
    }, 450);
  }

  return (
    <>
      {transitioning && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 pointer-events-none"
          style={{
            background: transitioning === "dark" ? "linear-gradient(to top, #1B1019, #29172F)" : "linear-gradient(to bottom, #FFFDF7, #F7F1E5)",
            opacity: 1,
            animation: "fade-in 0.4s ease-out forwards"
          }}
        >
          {/* Transition icon */}
          <div className="absolute text-[var(--gold)]" style={{ animation: "float-y 1s ease-in-out infinite" }}>
            {transitioning === "dark" ? (
               <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" /></svg>
            ) : (
               <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4.2" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" /></svg>
            )}
          </div>
        </div>
      )}
      
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
    </>
  );
}
