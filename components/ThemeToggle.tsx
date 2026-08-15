"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

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
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      // Lives on the dark shell in both themes, so it is styled against the
      // shell tokens rather than the theme-flipping content tokens.
      className="grid h-9 w-9 place-items-center rounded-full border border-[var(--shell-line)] text-[var(--gold)] transition hover:border-[var(--gold)] hover:bg-[var(--gold-soft)]"
    >
      {/* Render both and swap with CSS so the button is stable before hydration */}
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
  );
}
