"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Icon from "@/components/Icon";

type Item = { href: string; label: string; icon: string };

const ITEMS: Item[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/#courses", label: "Courses", icon: "book" },
  { href: "/#categories", label: "Categories", icon: "grid" },
  { href: "/#why", label: "Why Us", icon: "shield" },
  { href: "/verify", label: "Verify", icon: "award" },
];

/**
 * The persistent left rail from the reference design. Hidden below lg,
 * where the top bar carries navigation instead.
 */
export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const items: Item[] = [
    ...ITEMS,
    user?.role === "ADMIN"
      ? { href: "/admin", label: "Admin", icon: "lock" }
      : { href: "/dashboard", label: "My Learning", icon: "user" },
  ];

  return (
    <aside className="shell-panel sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-[var(--shell-line-soft)] lg:flex">
      <nav className="flex flex-col gap-1 px-3 pt-6">
        {items.map((item, i) => {
          // Hash links all live on "/", so compare only the path portion.
          const base = item.href.split("#")[0] || "/";
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === base || pathname.startsWith(`${base}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-300 ${
                active
                  ? "bg-gradient-to-r from-[rgb(212_162_76/0.18)] to-transparent font-semibold text-[var(--gold-bright)]"
                  : "text-[var(--shell-text-muted)] hover:bg-white/5 hover:text-[var(--shell-text)]"
              }`}
              style={{ animation: `fade-up 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.05}s both` }}
            >
              {/* Gold marker that slides in on the active row */}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r bg-[var(--gold)] transition-all duration-300 ${
                  active ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                }`}
                style={{ boxShadow: active ? "0 0 10px var(--gold)" : undefined }}
              />
              <Icon
                name={item.icon}
                className={`h-[18px] w-[18px] transition-transform duration-300 ${
                  active ? "scale-110" : "group-hover:scale-110"
                }`}
              />
              {item.label}

              {/* Chevron on the active row, as in the mockup */}
              {active && (
                <span className="ml-auto text-[var(--gold)]">
                  <Icon name="arrowRight" className="h-3.5 w-3.5" />
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Decorative astrolabe, slowly turning */}
      <div className="pointer-events-none relative mt-auto h-56 overflow-hidden" aria-hidden="true">
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
