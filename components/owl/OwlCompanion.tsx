"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { formatPrice } from "@/lib/format";
import { anonId } from "@/lib/signals";

type Recommendation = {
  courseId: string;
  title: string;
  category: string;
  price: number;
  lessons: number;
  reason: string;
};

type Profile = {
  name: string | null;
  hasHistory: boolean;
  signalCount: number;
  affinities: { category: string; score: number; share: number }[];
  topCategory: string | null;
  recentSearches: string[];
  viewedCourses: { id: string; title: string; category: string; views: number }[];
  recommendations: Recommendation[];
  nudge: string;
};

/** How long after arriving the owl offers an unprompted word. */
const NUDGE_DELAY_MS = 9000;
/** Once dismissed, stay quiet for this long. */
const QUIET_MS = 1000 * 60 * 20;
const QUIET_KEY = "academy.owl.quiet";

/**
 * The academy's messenger owl.
 *
 * Perches bottom-left on every page. It reads the visitor's own recorded
 * signals — searches, courses opened, departments browsed — and offers a
 * direction. Two behaviours: an occasional unprompted nudge, and a full
 * reading when clicked.
 *
 * It never invents interest. With no history it says so plainly and offers a
 * place to start rather than pretending to know something.
 */
export default function OwlCompanion() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [open, setOpen] = useState(false);
  const [nudging, setNudging] = useState(false);
  const [loading, setLoading] = useState(false);
  const nudgeTimer = useRef<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const id = anonId();
      const res = await fetch(`/api/owl${id ? `?anonId=${encodeURIComponent(id)}` : ""}`, {
        cache: "no-store",
      });
      if (res.ok) setProfile(await res.json());
    } catch {
      // Advice is a nicety; failing to fetch it must not disturb the page.
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-read on every route change: the visitor has just told us something.
  useEffect(() => {
    load();
  }, [pathname, load]);

  // The unprompted nudge, held back if recently dismissed.
  useEffect(() => {
    if (open) return;

    let quietUntil = 0;
    try {
      quietUntil = Number(localStorage.getItem(QUIET_KEY) ?? 0);
    } catch {
      /* storage unavailable — just proceed */
    }
    if (Date.now() < quietUntil) return;

    nudgeTimer.current = window.setTimeout(() => setNudging(true), NUDGE_DELAY_MS);
    return () => {
      if (nudgeTimer.current) window.clearTimeout(nudgeTimer.current);
    };
  }, [pathname, open]);

  function hush() {
    setNudging(false);
    try {
      localStorage.setItem(QUIET_KEY, String(Date.now() + QUIET_MS));
    } catch {
      /* ignore */
    }
  }

  function toggle() {
    setNudging(false);
    setOpen((o) => {
      if (!o) load();
      return !o;
    });
  }

  // The owl has no place on the credential pages a stranger might be sent to.
  if (pathname.startsWith("/verify/") || pathname.startsWith("/certificates/")) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 left-5 z-[80] flex items-end gap-3 lg:bottom-6 lg:left-6">
      {/* The bird */}
      <button
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? "Close the owl's guidance" : "Ask the owl for guidance"}
        className="owl-roost pointer-events-auto relative grid h-16 w-16 shrink-0 place-items-center rounded-full border border-[var(--gold)]/50 bg-[var(--surface)]/85 shadow-[0_6px_28px_var(--academy-shadow)] backdrop-blur-md transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        <OwlArt />
        {/* A quiet mark when the owl has something to say */}
        {(nudging || (!open && profile?.hasHistory)) && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-[var(--gold)] text-[9px] font-bold text-[var(--on-gold)]">
            <span className="owl-pip block h-1.5 w-1.5 rounded-full bg-[var(--on-gold)]" />
          </span>
        )}
      </button>

      {/* The unprompted word */}
      {nudging && !open && profile && (
        <div className="owl-speak pointer-events-auto relative mb-2 max-w-[16rem] rounded-lg rounded-bl-none border border-[var(--gold)]/40 bg-[var(--surface)] p-3.5 shadow-[var(--shadow-lift)] sm:max-w-xs">
          <p className="text-[13px] leading-relaxed text-[var(--text)]">{profile.nudge}</p>
          <div className="mt-2.5 flex items-center gap-3">
            <button
              onClick={toggle}
              className="text-xs font-semibold text-[var(--brand)] hover:underline"
            >
              Show me
            </button>
            <button
              onClick={hush}
              className="text-xs text-[var(--text-faint)] hover:text-[var(--text-muted)]"
            >
              Not now
            </button>
          </div>
        </div>
      )}

      {/* The full reading */}
      {open && (
        <div className="owl-speak pointer-events-auto mb-2 w-[min(22rem,calc(100vw-6rem))] overflow-hidden rounded-lg rounded-bl-none border border-[var(--gold)]/40 bg-[var(--surface)] shadow-[var(--shadow-panel)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5">
            <p className="font-serif text-sm font-bold text-[var(--brand)]">
              {profile?.name ? `A word for ${profile.name}` : "A word from the owl"}
            </p>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-[var(--text-faint)] transition hover:text-[var(--text)]"
            >
              <Icon name="plus" className="h-4 w-4 rotate-45" />
            </button>
          </div>

          <div className="max-h-[min(26rem,60vh)] overflow-y-auto p-4">
            {loading && !profile ? (
              <p className="text-sm text-[var(--text-muted)]">Consulting the archives…</p>
            ) : !profile?.hasHistory ? (
              <>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  I have not seen enough of your reading to advise you yet. Search for a
                  subject, or open a course, and I will learn what suits you.
                </p>
                <Link
                  href="/courses"
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:underline"
                >
                  Browse the archives
                  <Icon name="arrowRight" className="h-3.5 w-3.5" />
                </Link>
              </>
            ) : (
              <>
                {/* What the owl noticed — stated, not implied */}
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">
                  What I have noticed
                </p>
                <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-[var(--text-muted)]">
                  {profile.topCategory && (
                    <li>
                      Your reading leans toward{" "}
                      <span className="font-semibold text-[var(--text)]">
                        {profile.topCategory}
                      </span>
                      {profile.affinities[0] && ` (${profile.affinities[0].share}% of it)`}.
                    </li>
                  )}
                  {profile.recentSearches.length > 0 && (
                    <li>
                      You searched for{" "}
                      {profile.recentSearches.slice(0, 3).map((t, i, a) => (
                        <span key={t}>
                          <span className="font-semibold text-[var(--text)]">“{t}”</span>
                          {i < a.length - 1 ? ", " : ""}
                        </span>
                      ))}
                      .
                    </li>
                  )}
                  {profile.viewedCourses.length > 0 && (
                    <li>
                      You returned to{" "}
                      <span className="font-semibold text-[var(--text)]">
                        {profile.viewedCourses[0].title}
                      </span>
                      .
                    </li>
                  )}
                </ul>

                {/* Department shares */}
                {profile.affinities.length > 1 && (
                  <div className="mt-4 space-y-1.5">
                    {profile.affinities.slice(0, 4).map((a) => (
                      <div key={a.category} className="flex items-center gap-2">
                        <span className="w-24 shrink-0 truncate text-[11px] text-[var(--text-muted)]">
                          {a.category}
                        </span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
                          <span
                            className="block h-full rounded-full bg-[var(--gold)]"
                            style={{ width: `${Math.max(a.share, 3)}%` }}
                          />
                        </span>
                        <span className="w-8 shrink-0 text-right text-[11px] tabular-nums text-[var(--text-faint)]">
                          {a.share}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* The advice */}
                {profile.recommendations.length > 0 && (
                  <>
                    <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">
                      I would suggest
                    </p>
                    <ul className="mt-2 space-y-2">
                      {profile.recommendations.map((r) => (
                        <li key={r.courseId}>
                          <Link
                            href={`/courses/${r.courseId}`}
                            onClick={() => setOpen(false)}
                            className="group block rounded-sm border border-[var(--border)] p-3 transition hover:border-[var(--gold)] hover:bg-[var(--surface-2)]"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-serif text-sm font-bold leading-snug text-[var(--text)]">
                                {r.title}
                              </p>
                              <span className="shrink-0 font-serif text-sm font-bold text-[var(--brand)]">
                                {formatPrice(r.price)}
                              </span>
                            </div>
                            <p className="mt-1 text-[11px] italic text-[var(--text-muted)]">
                              {r.reason}
                            </p>
                            <p className="mt-1 text-[11px] text-[var(--text-faint)]">
                              {r.category} · {r.lessons} lessons
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <p className="mt-4 text-[10px] text-[var(--text-faint)]">
                  Drawn from {profile.signalCount} of your own actions on this site.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** The bird itself — blinking, with a slow breath. */
function OwlArt() {
  return (
    <svg width="42" height="42" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M8 15c-1.6 2.4-2 5.4-1 8.2 1.4-.6 2.6-1.8 3.4-3.4M24 15c1.6 2.4 2 5.4 1 8.2-1.4-.6-2.6-1.8-3.4-3.4"
        fill="#EDE7E0"
        stroke="#CFC6BD"
        strokeWidth="0.7"
      />
      <path
        d="M16 6c-5 0-8.4 4.2-8.4 9.6 0 4.6 3.6 8.4 8.4 8.4s8.4-3.8 8.4-8.4C24.4 10.2 21 6 16 6z"
        fill="#F9F6F2"
        stroke="#D8D0C8"
        strokeWidth="0.8"
      />
      <path
        d="M9.6 9.4L7.4 5.6l4 1.6zM22.4 9.4l2.2-3.8-4 1.6z"
        fill="#F9F6F2"
        stroke="#D8D0C8"
        strokeWidth="0.7"
      />
      <circle cx="12.4" cy="13.4" r="3.5" fill="#FFFFFF" stroke="#D8D0C8" strokeWidth="0.6" />
      <circle cx="19.6" cy="13.4" r="3.5" fill="#FFFFFF" stroke="#D8D0C8" strokeWidth="0.6" />
      <g className="owl-eyes">
        <circle cx="12.4" cy="13.4" r="1.8" fill="#2A1428" />
        <circle cx="19.6" cy="13.4" r="1.8" fill="#2A1428" />
      </g>
      <path d="M16 15.4l-1.5 2.6h3z" fill="var(--gold)" />
      <path
        d="M13 19.5c1 .7 2 1 3 1s2-.3 3-1"
        stroke="#DCD4CC"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      <path
        d="M13.6 24v2M16 24.2v2.2M18.4 24v2"
        stroke="var(--gold-dim)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
