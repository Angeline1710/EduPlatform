"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";

type LiveUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastSeenAt: string | null;
};

const POLL_MS = 15_000;

/**
 * Who is on the site right now.
 *
 * Polls rather than holding a socket open — at this cadence the traffic is
 * negligible and it survives redeploys and sleeping laptops without
 * reconnection logic. Seeded from a server render so the panel is populated
 * on first paint rather than flashing empty.
 */
export default function LiveUsers({
  initialUsers,
  initialCount,
}: {
  initialUsers: LiveUser[];
  initialCount: number;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [count, setCount] = useState(initialCount);
  const [stale, setStale] = useState(false);

  useEffect(() => {
    let timer: number;
    let cancelled = false;

    async function poll() {
      if (document.hidden) return;
      try {
        const res = await fetch("/api/admin/live", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        if (cancelled) return;
        setUsers(data.users);
        setCount(data.count);
        setStale(false);
      } catch {
        // Keep showing the last good figures, but say they may be stale
        // rather than silently presenting them as current.
        if (!cancelled) setStale(true);
      }
    }

    timer = window.setInterval(poll, POLL_MS);
    document.addEventListener("visibilitychange", poll);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", poll);
    };
  }, []);

  return (
    <div className="rounded-sm border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-[var(--text)]">
          <span className="relative flex h-2.5 w-2.5">
            {!stale && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--academy-emerald)] opacity-70" />
            )}
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                stale ? "bg-[var(--text-faint)]" : "bg-[var(--academy-emerald)]"
              }`}
            />
          </span>
          Online now
        </h3>
        <span className="font-serif text-2xl font-bold text-[var(--gold)]">
          {count}
        </span>
      </div>

      {stale && (
        <p className="mt-2 text-xs text-[var(--text-faint)]">
          Connection lost — showing last known figures.
        </p>
      )}

      {users.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--text-muted)]">
          Nobody is active in the last five minutes.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {users.map((u) => (
            <li key={u.id}>
              <Link
                href={`/admin/users/${u.id}`}
                className="flex items-center gap-3 rounded-sm px-2 py-1.5 transition hover:bg-[var(--surface-2)]"
              >
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${
                    u.role === "ADMIN"
                      ? "bg-[var(--academy-plum)]"
                      : "bg-[var(--academy-purple)]"
                  }`}
                >
                  {u.name.charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-[var(--text)]">
                    {u.name}
                  </span>
                  <span className="block truncate text-xs text-[var(--text-faint)]">
                    {u.email}
                  </span>
                </span>
                <span className="shrink-0 text-[10px] uppercase tracking-widest text-[var(--text-faint)]">
                  {u.role}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 flex items-center gap-1.5 text-[11px] text-[var(--text-faint)]">
        <Icon name="clock" className="h-3 w-3" />
        Refreshes every {POLL_MS / 1000}s · active within 5 min
      </p>
    </div>
  );
}
