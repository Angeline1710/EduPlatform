"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Icon from "@/components/Icon";
import ThemeToggle from "@/components/ThemeToggle";

export default function Nav() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [query, setQuery] = useState("");

  // Seed the field from the URL so a shared /?q=… link shows its term. Read
  // from location rather than useSearchParams: that hook forces the whole nav
  // into a Suspense boundary, which leaves it unhydrated and inert.
  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get("q") ?? "");
  }, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/?q=${encodeURIComponent(query.trim())}` : "/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="brand-gradient grid h-9 w-9 place-items-center rounded-xl text-white shadow-md">
            <Icon name="logo" className="h-[18px] w-[18px]" />
          </span>
          <span className="text-xl font-bold tracking-tight">EduPlatform</span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          <NavLink href="/">Courses</NavLink>
          <NavLink href="/#categories">Categories</NavLink>
          <NavLink href="/#why">Why us</NavLink>
          {user?.role === "ADMIN" && <NavLink href="/admin">Admin</NavLink>}
          {user && user.role !== "ADMIN" && (
            <NavLink href="/dashboard">My learning</NavLink>
          )}
        </div>

        <form onSubmit={onSearch} className="ml-auto hidden md:block lg:ml-0">
          <label className="relative block">
            <span className="sr-only">Search courses</span>
            <Icon
              name="search"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-faint)]"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses..."
              className="focus-ring w-48 rounded-full border border-[var(--border)] bg-[var(--surface-2)] py-2 pl-9 pr-3 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] transition focus:w-60"
            />
          </label>
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle />

          {user ? (
            <>
              <span className="hidden text-sm text-[var(--text-muted)] sm:inline">
                {user.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="focus-ring rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--surface-2)]"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="focus-ring hidden rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--surface-2)] sm:block"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="focus-ring brand-gradient rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="focus-ring rounded-full px-3 py-2 text-sm font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
    >
      {children}
    </Link>
  );
}
