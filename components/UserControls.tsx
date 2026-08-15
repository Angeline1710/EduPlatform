"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";

type Action =
  | { action: "suspend" | "activate" | "promote" | "demote" }
  | { action: "grant" | "revokeAccess"; courseId: string }
  | { action: "revokeCertificate" | "restoreCertificate"; certificateId: string };

type UserControlsProps = {
  userId: string;
  isSelf: boolean;
  status: string;
  role: string;
  grantableCourses: { id: string; title: string }[];
  enrollments: { courseId: string; title: string }[];
  certificates: { id: string; code: string; courseTitle: string; revoked: boolean }[];
};

export default function UserControls({
  userId,
  isSelf,
  status,
  role,
  grantableCourses,
  enrollments,
  certificates,
}: UserControlsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [grantId, setGrantId] = useState(grantableCourses[0]?.id ?? "");

  async function run(body: Action) {
    setBusy(true);
    setError("");

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setBusy(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Action failed.");
      return;
    }
    router.refresh();
  }

  async function remove() {
    if (
      !confirm("Delete this user permanently? Their progress and certificates go too.")
    ) {
      return;
    }
    setBusy(true);
    setError("");

    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    setBusy(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not delete user.");
      return;
    }
    router.push("/admin/users");
    router.refresh();
  }

  const isActive = status === "ACTIVE";
  const isAdmin = role === "ADMIN";

  return (
    <div className="card animate-fade-up space-y-6 p-6">
      <div>
        <h2 className="font-bold">Account controls</h2>
        <p className="text-sm text-[var(--text-muted)]">
          Changes take effect immediately.
        </p>
      </div>

      {isSelf && (
        <p className="rounded-xl bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text-muted)]">
          This is your own account — suspend and demote are disabled to stop you
          locking yourself out.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => run({ action: isActive ? "suspend" : "activate" })}
          disabled={busy || (isSelf && isActive)}
          className={`btn press disabled:opacity-40 ${
            isActive
              ? "border border-red-500/40 text-red-500 hover:bg-red-500/10"
              : "border border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
          }`}
        >
          <Icon name={isActive ? "lock" : "check"} className="h-4 w-4" />
          {isActive ? "Suspend account" : "Reactivate account"}
        </button>

        <button
          onClick={() => run({ action: isAdmin ? "demote" : "promote" })}
          disabled={busy || (isSelf && isAdmin)}
          className="btn btn-secondary press disabled:opacity-40"
        >
          <Icon name="user" className="h-4 w-4" />
          {isAdmin ? "Demote to student" : "Promote to admin"}
        </button>

        <button
          onClick={remove}
          disabled={busy || isSelf}
          className="btn press border border-red-500/40 text-red-500 hover:bg-red-500/10 disabled:opacity-40"
        >
          Delete user
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500">
          {error}
        </p>
      )}

      {/* Course access */}
      <div className="border-t border-[var(--border)] pt-6">
        <h3 className="mb-3 font-bold">Course access</h3>

        {grantableCourses.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <select
              value={grantId}
              onChange={(e) => setGrantId(e.target.value)}
              className="input max-w-xs"
            >
              {grantableCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <button
              onClick={() => grantId && run({ action: "grant", courseId: grantId })}
              disabled={busy || !grantId}
              className="btn btn-primary press disabled:opacity-40"
            >
              <Icon name="plus" className="h-4 w-4" />
              Grant access
            </button>
          </div>
        )}

        {enrollments.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No courses granted.</p>
        ) : (
          <ul className="space-y-2">
            {enrollments.map((e) => (
              <li
                key={e.courseId}
                className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-2.5"
              >
                <span className="flex-1 text-sm font-medium">{e.title}</span>
                <button
                  onClick={() => run({ action: "revokeAccess", courseId: e.courseId })}
                  disabled={busy}
                  className="focus-ring rounded-full px-3 py-1.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/10 disabled:opacity-40"
                >
                  Revoke
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Certificates */}
      <div className="border-t border-[var(--border)] pt-6">
        <h3 className="mb-3 font-bold">Certificates</h3>
        {certificates.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">None issued yet.</p>
        ) : (
          <ul className="space-y-2">
            {certificates.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-2.5"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{c.courseTitle}</span>
                  <Link
                    href={`/verify/${c.code}`}
                    className="font-mono text-xs text-[var(--brand)] hover:underline"
                  >
                    {c.code}
                  </Link>
                </span>

                {c.revoked && (
                  <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-500">
                    Revoked
                  </span>
                )}

                <button
                  onClick={() =>
                    run({
                      action: c.revoked ? "restoreCertificate" : "revokeCertificate",
                      certificateId: c.id,
                    })
                  }
                  disabled={busy}
                  className={`focus-ring rounded-full px-3 py-1.5 text-sm font-semibold transition disabled:opacity-40 ${
                    c.revoked
                      ? "text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                      : "text-red-500 hover:bg-red-500/10"
                  }`}
                >
                  {c.revoked ? "Restore" : "Revoke"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
