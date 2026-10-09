"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Icon from "@/components/Icon";
import ThemeToggle from "@/components/ThemeToggle";
import { AcademyCrest } from "@/components/Crests";
import MagicalSearch from "@/components/magic/MagicalSearch";

const LINKS = [
  { href: "/courses", label: "Courses" },
  { href: "/departments", label: "Departments" },
  { href: "/#why", label: "Why Us" },
  { href: "/verify", label: "Verify" },
];

export default function Nav() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Seed the field from the URL so a shared /?q=… link shows its term. Read
  // from location rather than useSearchParams: that hook forces the whole nav
  // into a Suspense boundary, which leaves it unhydrated and inert.
  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get("q") ?? "");
  }, []);

  useEffect(() => {
    const syncSidebarState = (event: Event) => {
      const detail = (event as CustomEvent<{ open: boolean }>).detail;
      if (detail && typeof detail.open === "boolean") {
        setSidebarOpen(detail.open);
      }
    };

    window.addEventListener("sidebar-state", syncSidebarState);

    return () => {
      window.removeEventListener("sidebar-state", syncSidebarState);
    };
  }, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/?q=${encodeURIComponent(query.trim())}` : "/");
  }

  async function onSignOut() {
    setIsSigningOut(true);
    try {
      await signOut({ redirect: false, callbackUrl: "/" });
      router.replace("/");
    } catch (error) {
      setIsSigningOut(false);
      console.error("Unable to sign out.", error);
    }
  }

  return (
    <header className="shell-panel sticky top-0 z-50 border-b border-[var(--shell-line)]">
      <nav className="flex items-center gap-5 px-5 py-3 xl:px-8">
        <button
          type="button"
          aria-label={sidebarOpen ? "Hide navigation" : "Open navigation"}
          onClick={() => {
            window.dispatchEvent(new Event("toggle-sidebar"));
          }}
          className="z-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--gold)]/50 bg-[rgba(17,17,17,0.72)] text-[var(--gold-bright)] shadow-[0_10px_35px_rgba(0,0,0,0.45)] backdrop-blur-xl transition hover:scale-105 hover:border-[var(--gold-bright)]"
        >
          <Icon
            name={sidebarOpen ? "arrowLeft" : "arrowRight"}
            className="h-4 w-4"
          />
        </button>

        {/* Crest + wordmark */}
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="transition-transform duration-500 group-hover:scale-105">
            <AcademyCrest size={38} />
          </span>
          <span className="hidden sm:block">
            <span className="gold-leaf block font-serif text-[22px] font-bold leading-none tracking-wide">
              EduPlatform
            </span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-[var(--shell-text-muted)]">
              Learn. Grow. Succeed.
            </span>
          </span>
        </Link>

        {/* Centre links with the gold underline. Below 2xl the sidebar rail
            carries navigation, so these are dropped rather than squeezed. */}
        <div className="ml-4 hidden min-w-0 flex-1 items-center gap-1 2xl:flex">
          {LINKS.map((link) => {
            const base = link.href.split("#")[0] || "/";
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(base);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rune-edge group relative rounded-md px-4 py-2 text-[15px] transition-all duration-300 ${
                  active
                    ? "font-semibold text-[var(--gold-bright)]"
                    : "text-[var(--shell-text)] hover:text-[var(--gold-bright)] hover:bg-[var(--shell-line-soft)]"
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-[var(--gold)] transition-all duration-300 ${
                    active
                      ? "opacity-100"
                      : "opacity-0 scale-x-0 group-hover:scale-x-100 group-hover:opacity-60"
                  }`}
                  style={{
                    boxShadow: active ? "0 0 8px var(--gold)" : undefined,
                  }}
                />
              </Link>
            );
          })}
        </div>

        {/* Pill search with gold trim */}
        <div className="ml-auto hidden min-w-0 max-w-[280px] shrink md:block 2xl:ml-0">
          <MagicalSearch initialQuery={query} />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3 md:ml-0">
          <ThemeToggle />

          {user ? (
            <>
              <Link
                href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                className="hidden text-sm text-[var(--shell-text-muted)] transition hover:text-[var(--gold-bright)] lg:inline"
              >
                {user.name}
              </Link>
              <button
                type="button"
                onClick={onSignOut}
                disabled={isSigningOut}
                className="rounded-full px-3 py-2 text-sm text-[var(--shell-text)] transition hover:text-[var(--gold-bright)]"
              >
                {isSigningOut ? "Signing out…" : "Sign out"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden px-2 text-sm text-[var(--shell-text)] transition hover:text-[var(--gold-bright)] sm:block"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rune-edge inline-flex items-center gap-2 rounded-md border border-[var(--gold-bright)] bg-gradient-to-b from-[var(--gold)] to-[var(--gold-dim)] px-4 py-2 text-sm font-semibold text-[var(--on-gold)] shadow-[0_0_18px_rgb(212_162_76/0.35)] transition hover:brightness-110"
              >
                Get Started
                <Icon name="sparkle" className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
