"use client";

const ANON_KEY = "academy.anon";

/**
 * A stable id for this browser, so a visitor's interests still form a
 * profile before they sign in. It is a random local value — no fingerprinting
 * and nothing personal — and it stops being used the moment a real session
 * exists, since the server attributes signals to the account instead.
 */
export function anonId() {
  if (typeof window === "undefined") return null;
  try {
    let id = localStorage.getItem(ANON_KEY);
    if (!id) {
      id = `a_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      localStorage.setItem(ANON_KEY, id);
    }
    return id;
  } catch {
    // Private mode with storage disabled: browsing still works, the visitor
    // simply gets generic advice.
    return null;
  }
}

export type SignalKind =
  | "search"
  | "course_view"
  | "category_view"
  | "enroll_intent"
  | "enrolled";

/**
 * Records an act of interest. Fire and forget — a dropped signal costs
 * nothing but slightly staler advice, and must never block navigation.
 */
export function recordSignal(
  kind: SignalKind,
  value: string,
  extra?: { courseId?: string; category?: string },
) {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({
    kind,
    value,
    courseId: extra?.courseId,
    category: extra?.category,
    anonId: anonId(),
  });

  // keepalive so a signal fired during navigation still lands.
  fetch("/api/signals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
