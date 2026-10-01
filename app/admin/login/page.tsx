"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    const session = await getSession();
    setLoading(false);

    if (session?.user?.role !== "ADMIN") {
      setError("This account does not have admin access.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <AuthShell
      variant="admin"
      title="Admin login"
      subtitle="Restricted area — staff accounts only."
      footer={
        <p>
          Student?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--brand)] hover:underline"
          >
            Go to student login
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn w-full bg-slate-800 text-white shadow-md hover:bg-slate-900 disabled:opacity-55 dark:bg-slate-700"
        >
          {loading ? "Signing in..." : "Sign in as admin"}
        </button>
      </form>
    </AuthShell>
  );
}
