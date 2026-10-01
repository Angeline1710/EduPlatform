"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Icon from "../Icon";

export default function MagicalSearch({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [status, setStatus] = useState<"idle" | "searching">("idle");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setStatus("searching");

    // Simulate magical quill writing/ink traveling before redirecting
    setTimeout(() => {
      setStatus("idle");
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
    }, 600);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`
        relative flex max-w-sm flex-1 items-center gap-2 rounded-full border bg-[var(--surface-2)] px-4 py-2 transition-all duration-300
        ${isFocused ? "border-[var(--glow)] shadow-[0_0_12px_var(--academy-glow)]" : "border-[var(--shell-line)]"}
      `}
    >
      <Icon
        name="search"
        className={`h-4 w-4 shrink-0 transition-colors ${
          isFocused
            ? "text-[var(--gold-bright)]"
            : "text-[var(--shell-text-muted)]"
        }`}
      />

      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search the archives..."
        aria-label="Search the archives"
        className="w-full min-w-0 bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none"
      />

      {status === "searching" && (
        <span
          aria-hidden="true"
          className="absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-[var(--gold)]"
          style={{ animation: "rune-trace 0.6s ease-out forwards" }}
        />
      )}

      {/* Tiny quill icon that appears on focus */}
      {isFocused && status !== "searching" && (
        <span className="pointer-events-none absolute right-4 animate-fade-in text-[var(--gold)]">
          {/* We'll use a small marker or existing icon for the quill effect */}
          <Icon name="code" className="h-4 w-4 rotate-45 opacity-50" />
        </span>
      )}
    </form>
  );
}
