"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Icon from "@/components/Icon";
import Owl from "@/components/magic/Owl";

type Item = { href: string; label: string; icon: string };

/** Every entry is a real route — none of these scroll the current page. */
const ITEMS: Item[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/courses", label: "Courses", icon: "book" },
  { href: "/categories", label: "Departments", icon: "grid" },
  { href: "/why-us", label: "Why Us", icon: "shield" },
  { href: "/verify", label: "Verify", icon: "award" },
  { href: "/support", label: "Support", icon: "headset" },
];

/** How long the owl is given to alight before the route changes. */
const PERCH_MS = 420;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  // Which row the owl is currently landing on, if any.
  const [perched, setPerched] = useState<string | null>(null);

  const items: Item[] = [
    ...ITEMS,
    ...(user?.role === "ADMIN"
      ? [{ href: "/admin", label: "Admin", icon: "lock" }]
      : user
        ? [
            { href: "/dashboard", label: "My Learning", icon: "book" },
            { href: "/profile", label: "My Record", icon: "user" },
          ]
        : []),
  ];

  function isActive(href: string) {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  function onSelect(e: React.MouseEvent, href: string) {
    // Let modified clicks (new tab, etc.) behave normally.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || isActive(href))
      return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return; // navigate immediately, no perch

    e.preventDefault();
    setPerched(href);
    // Navigation is only delayed by the perch, never replaced by it.
    window.setTimeout(() => {
      router.push(href);
      setPerched(null);
    }, PERCH_MS);
  }

  return (
    <aside className="shell-panel sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-[var(--shell-line-soft)] lg:flex">
      <nav className="flex flex-col gap-1 px-3 pt-6">
        {items.map((item, i) => {
          const active = isActive(item.href);
          const landing = perched === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => onSelect(e, item.href)}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-300 ${
                active
                  ? "bg-gradient-to-r from-[rgb(201_150_50/0.18)] to-transparent font-semibold text-[var(--gold-bright)]"
                  : "text-[var(--shell-text-muted)] hover:bg-white/5 hover:text-[var(--shell-text)]"
              }`}
              style={{
                animation: `fade-up 0.5s var(--ease-academy) ${i * 0.05}s both`,
              }}
            >
              {/* Gold marker on the active row */}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r bg-[var(--gold)] transition-all duration-300 ${
                  active ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                }`}
                style={{
                  boxShadow: active ? "0 0 10px var(--gold)" : undefined,
                }}
              />

              <Icon
                name={item.icon}
                className={`h-[18px] w-[18px] transition-transform duration-300 ${
                  active ? "scale-110" : "group-hover:scale-110"
                }`}
              />
              {item.label}

              {active && !landing && (
                <span className="ml-auto text-[var(--gold)]">
                  <Icon name="arrowRight" className="h-3.5 w-3.5" />
                </span>
              )}

              {/* The owl swoops in, grips the row, and a little magic scatters */}
              {landing && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <span className="owl-arrive block">
                    <Owl size={26} />
                  </span>
                  <span className="owl-dust" />
                  <span
                    className="owl-dust"
                    style={{ animationDelay: "0.08s" }}
                  />
                  <span
                    className="owl-dust"
                    style={{ animationDelay: "0.16s" }}
                  />
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Decorative astrolabe, slowly turning */}
      <div
        className="pointer-events-none relative mt-auto h-56 overflow-hidden"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 200 200"
          className="animate-slow-spin absolute -bottom-16 -left-10 h-64 w-64"
          style={{ color: "var(--gold)", opacity: 0.16 }}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        >
          <circle cx="100" cy="100" r="78" />
          <circle cx="100" cy="100" r="58" />
          <circle cx="100" cy="100" r="34" strokeDasharray="3 5" />
          <path d="M100 8v184M8 100h184" />
          <path d="M35 35l130 130M165 35L35 165" strokeDasharray="2 6" />
          <path d="M100 44l7 49 49 7-49 7-7 49-7-49-49-7 49-7 7-49z" />
        </svg>
      </div>
    </aside>
  );
}
