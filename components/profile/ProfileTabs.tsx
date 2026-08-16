"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/profile", label: "Overview" },
  { href: "/profile/activity", label: "Activity" },
  { href: "/profile/edit", label: "Edit record" },
  { href: "/profile/settings", label: "Settings" },
];

/**
 * The record's sections.
 *
 * Real routes rather than client-side panels, so each is server-rendered,
 * linkable, and survives a refresh — which is what people expect of a
 * profile once they have deep-linked to one of its tabs.
 */
export default function ProfileTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Profile sections"
      className="mb-8 flex flex-wrap gap-1 border-b border-[var(--border)]"
    >
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`relative px-4 py-3 text-sm font-semibold transition-colors ${
              active
                ? "text-[var(--brand)]"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            {tab.label}
            <span
              aria-hidden="true"
              className={`absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-[var(--gold)] transition-all duration-300 ${
                active ? "opacity-100" : "scale-x-0 opacity-0"
              }`}
              style={{ boxShadow: active ? "0 0 8px var(--gold)" : undefined }}
            />
          </Link>
        );
      })}
    </nav>
  );
}
