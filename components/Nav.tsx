"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Nav() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold">
          EduPlatform
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:underline">
            Courses
          </Link>

          {user?.role === "ADMIN" && (
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
          )}

          {user && user.role !== "ADMIN" && (
            <Link href="/dashboard" className="hover:underline">
              My courses
            </Link>
          )}

          {user ? (
            <>
              <span className="text-gray-500">{user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-50"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
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
