"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

/** How often to report presence. Must stay well under PRESENCE_WINDOW_MS. */
const PING_MS = 60_000;

/**
 * Reports that this user is present, so the admin dashboard's "online now"
 * figure is real.
 *
 * Only pings while the tab is visible — a backgrounded tab is not someone
 * using the site, and counting it would inflate the number.
 */
export default function Heartbeat() {
  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;

    let timer: number;

    const ping = () => {
      if (document.hidden) return;
      // Fire and forget: a missed beat just means a slightly stale figure.
      fetch("/api/heartbeat", { method: "POST", keepalive: true }).catch(() => {});
    };

    ping();
    timer = window.setInterval(ping, PING_MS);

    // Report immediately on return, rather than waiting out the interval.
    document.addEventListener("visibilitychange", ping);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", ping);
    };
  }, [status]);

  return null;
}
