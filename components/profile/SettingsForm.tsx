"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/Icon";

/**
 * Account settings: the things that are about the account rather than the
 * scholar — visibility, contact preference, and the password.
 */
export default function SettingsForm({
  email,
  isPublic,
  marketingOptIn,
}: {
  email: string;
  isPublic: boolean;
  marketingOptIn: boolean;
}) {
  const router = useRouter();

  const [visibility, setVisibility] = useState(isPublic);
  const [offers, setOffers] = useState(marketingOptIn);
  const [prefState, setPrefState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [prefError, setPrefError] = useState("");

  async function savePrefs(next: {
    isPublic?: boolean;
    marketingOptIn?: boolean;
  }) {
    setPrefState("saving");
    setPrefError("");

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setPrefError(data.error ?? "Could not save that.");
      setPrefState("error");
      // Put the switch back where it was, rather than showing a state the
      // server did not accept.
      if (next.isPublic !== undefined) setVisibility(!next.isPublic);
      if (next.marketingOptIn !== undefined) setOffers(!next.marketingOptIn);
      return;
    }

    setPrefState("saved");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Visibility */}
      <Panel
        title="Who can see your record"
        note="Your credentials stay verifiable either way"
      >
        <Toggle
          checked={visibility}
          onChange={(v) => {
            setVisibility(v);
            savePrefs({ isPublic: v });
          }}
          label="Make my record public"
          hint={
            visibility
              ? "Anyone with the link can see your headline, education, interests and accolades. Your email, phone and date of birth are never shown."
              : "Only you and the academy's administrators can see your record."
          }
        />
      </Panel>

      {/* Contact */}
      <Panel title="Offers and suggestions">
        <Toggle
          checked={offers}
          onChange={(v) => {
            setOffers(v);
            savePrefs({ marketingOptIn: v });
          }}
          label="Email me course suggestions and offers"
          hint="Off by default. The owl will still guide you on the site either way."
        />
      </Panel>

      {prefError && (
        <p className="rounded-sm border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500">
          {prefError}
        </p>
      )}
      {prefState === "saved" && !prefError && (
        <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--academy-emerald)]">
          <Icon name="check" className="h-4 w-4" />
          Preferences saved
        </p>
      )}

      {/* Sign-in */}
      <Panel title="Sign-in" note="How you get into your account">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
            Email
          </p>
          <p className="mt-1 text-[var(--text)]">{email}</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Contact the academy if you need this changed — it is the address
            your credentials are tied to.
          </p>
        </div>

        <PasswordChange />
      </Panel>
    </div>
  );
}

function PasswordChange() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Caught here rather than at the server, so the mismatch is reported
    // before the current password is sent anywhere.
    if (next !== confirm) {
      setError("The new passwords do not match.");
      return;
    }
    if (next.length < 8) {
      setError("Your new password must be at least 8 characters.");
      return;
    }

    setBusy(true);
    const res = await fetch("/api/profile/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);

    if (!res.ok) {
      setError(data.error ?? "Could not change your password.");
      return;
    }

    setCurrent("");
    setNext("");
    setConfirm("");
    setDone(true);
    setOpen(false);
  }

  if (!open) {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setDone(false);
          }}
          className="inline-flex items-center gap-2 rounded-md border border-[var(--gold)] px-4 py-2.5 text-sm font-semibold text-[var(--brand)] transition hover:bg-[var(--gold-soft)]"
        >
          <Icon name="lock" className="h-4 w-4" />
          Change password
        </button>
        {done && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--academy-emerald)]">
            <Icon name="check" className="h-4 w-4" />
            Password changed
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-sm border border-[var(--border)] bg-[var(--surface-2)] p-4"
    >
      <Field label="Current password">
        <input
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
          autoComplete="current-password"
          className="input"
        />
      </Field>
      <Field label="New password" hint="At least 8 characters">
        <input
          type="password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          className="input"
        />
      </Field>
      <Field label="Confirm new password">
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
          className="input"
        />
      </Field>

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-md border border-[var(--gold-bright)] bg-gradient-to-b from-[var(--gold)] to-[var(--gold-dim)] px-5 py-2.5 text-sm font-semibold text-[var(--on-gold)] transition hover:brightness-110 disabled:opacity-60"
        >
          {busy ? "Changing…" : "Change password"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError("");
          }}
          className="rounded-md px-4 py-2.5 text-sm text-[var(--text-muted)] transition hover:text-[var(--text)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Panel({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-sm border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <div className="mb-4">
        <h2 className="font-serif text-xl font-bold text-[var(--brand)]">
          {title}
        </h2>
        {note && <p className="text-xs text-[var(--text-faint)]">{note}</p>}
      </div>
      {children}
    </section>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors ${
          checked
            ? "border-[var(--gold)] bg-[var(--gold)]"
            : "border-[var(--border-strong)] bg-[var(--surface-2)]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-[var(--surface)] shadow transition-transform duration-300 ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
          style={{ height: 18, width: 18 }}
        />
      </button>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[var(--text)]">
          {label}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-[var(--text-muted)]">
          {hint}
        </span>
      </span>
    </label>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-[var(--text)]">
        {label}
        {hint && (
          <span className="ml-2 text-xs font-normal text-[var(--text-faint)]">
            {hint}
          </span>
        )}
      </span>
      {children}
    </label>
  );
}
