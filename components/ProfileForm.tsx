"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/Icon";
import { DepartmentCrest } from "@/components/Crests";
import Avatar from "@/components/profile/Avatar";
import { CATEGORY_NAMES, categoryTheme } from "@/lib/categories";
import { EDUCATION_LEVELS, EXPERIENCE_LEVELS, ACCOLADE_KINDS } from "@/lib/profile-fields";

type Accolade = {
  id: string;
  kind: string;
  title: string;
  issuer: string | null;
  year: number | null;
  url: string | null;
  description: string | null;
};

export type ProfileFormValues = {
  name: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  pronouns: string;
  languages: string;
  timezone: string;
  dateOfBirth: string;
  phone: string;
  country: string;
  city: string;
  educationLevel: string;
  fieldOfStudy: string;
  institution: string;
  graduationYear: string;
  occupation: string;
  experienceLevel: string;
  interests: string[];
  goals: string;
  weeklyHours: string;
  linkedinUrl: string;
  githubUrl: string;
  websiteUrl: string;
  marketingOptIn: boolean;
};

export default function ProfileForm({
  initial,
  accolades: initialAccolades,
}: {
  initial: ProfileFormValues;
  accolades: Accolade[];
}) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [accolades, setAccolades] = useState(initialAccolades);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function set<K extends keyof ProfileFormValues>(key: K, value: ProfileFormValues[K]) {
    setV((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function toggleInterest(name: string) {
    setV((prev) => ({
      ...prev,
      interests: prev.interests.includes(name)
        ? prev.interests.filter((i) => i !== name)
        : [...prev.interests, name],
    }));
    setSaved(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...v,
        graduationYear: v.graduationYear || null,
        weeklyHours: v.weeklyHours || null,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save your record.");
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-6">
      {/* Identity */}
      <Section title="Who you are" note="Shown on your record">
        {/* Picture, with a live preview so a broken link is obvious here
            rather than after saving. */}
        <div className="flex flex-wrap items-center gap-5">
          <Avatar name={v.name || "?"} src={v.avatarUrl || null} size={80} />
          <div className="min-w-0 flex-1">
            <Field label="Picture" hint="A link to an image. Square looks best.">
              <input
                type="url"
                value={v.avatarUrl}
                onChange={(e) => set("avatarUrl", e.target.value)}
                placeholder="https://..."
                className="input"
              />
            </Field>
          </div>
        </div>

        <Grid>
          <Field label="Name" required>
            <input
              value={v.name}
              onChange={(e) => set("name", e.target.value)}
              required
              maxLength={80}
              className="input"
            />
          </Field>
          <Field label="Headline" hint="e.g. Aspiring data analyst">
            <input
              value={v.headline}
              onChange={(e) => set("headline", e.target.value)}
              maxLength={120}
              className="input"
            />
          </Field>
          <Field label="Date of birth" hint="Used to pitch courses at the right level">
            <input
              type="date"
              value={v.dateOfBirth}
              onChange={(e) => set("dateOfBirth", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Phone" hint="Optional">
            <input
              type="tel"
              value={v.phone}
              onChange={(e) => set("phone", e.target.value)}
              maxLength={40}
              className="input"
            />
          </Field>
          <Field label="City">
            <input
              value={v.city}
              onChange={(e) => set("city", e.target.value)}
              maxLength={80}
              className="input"
            />
          </Field>
          <Field label="Country">
            <input
              value={v.country}
              onChange={(e) => set("country", e.target.value)}
              maxLength={80}
              className="input"
            />
          </Field>
          <Field label="Pronouns" hint="e.g. she/her">
            <input
              value={v.pronouns}
              onChange={(e) => set("pronouns", e.target.value)}
              maxLength={40}
              className="input"
            />
          </Field>
          <Field label="Languages" hint="Comma separated">
            <input
              value={v.languages}
              onChange={(e) => set("languages", e.target.value)}
              maxLength={160}
              placeholder="English, Tamil"
              className="input"
            />
          </Field>
          <Field label="Time zone" hint="Helps us time reminders">
            <input
              value={v.timezone}
              onChange={(e) => set("timezone", e.target.value)}
              maxLength={60}
              placeholder="Asia/Kolkata"
              className="input"
            />
          </Field>
        </Grid>

        <Field label="About you" hint="A few lines, if you like">
          <textarea
            value={v.bio}
            onChange={(e) => set("bio", e.target.value)}
            rows={4}
            maxLength={1000}
            className="input resize-y"
          />
        </Field>
      </Section>

      {/* Education */}
      <Section title="Education & work" note="Sets the depth the owl suggests">
        <Grid>
          <Field label="Highest level">
            <select
              value={v.educationLevel}
              onChange={(e) => set("educationLevel", e.target.value)}
              className="input"
            >
              <option value="">Prefer not to say</option>
              {EDUCATION_LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Field of study">
            <input
              value={v.fieldOfStudy}
              onChange={(e) => set("fieldOfStudy", e.target.value)}
              maxLength={120}
              className="input"
            />
          </Field>
          <Field label="Institution">
            <input
              value={v.institution}
              onChange={(e) => set("institution", e.target.value)}
              maxLength={160}
              className="input"
            />
          </Field>
          <Field label="Graduation year">
            <input
              type="number"
              min={1950}
              max={2100}
              value={v.graduationYear}
              onChange={(e) => set("graduationYear", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Occupation">
            <input
              value={v.occupation}
              onChange={(e) => set("occupation", e.target.value)}
              maxLength={120}
              className="input"
            />
          </Field>
        </Grid>

        <Field label="Experience level" hint="Stops beginners being sent advanced material">
          <div className="flex flex-wrap gap-2">
            {EXPERIENCE_LEVELS.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() =>
                  set("experienceLevel", v.experienceLevel === l.value ? "" : l.value)
                }
                aria-pressed={v.experienceLevel === l.value}
                className={`rounded-sm border px-4 py-2.5 text-left text-sm transition ${
                  v.experienceLevel === l.value
                    ? "border-[var(--gold)] bg-[var(--gold-soft)]"
                    : "border-[var(--border)] hover:border-[var(--gold)]"
                }`}
              >
                <span className="block font-semibold text-[var(--text)]">{l.label}</span>
                <span className="block text-xs text-[var(--text-muted)]">{l.hint}</span>
              </button>
            ))}
          </div>
        </Field>
      </Section>

      {/* Learning intent */}
      <Section title="What you want to learn" note="The strongest signal the owl has">
        <Field label="Subjects you care about" hint="Pick any that apply">
          <div className="flex flex-wrap gap-2">
            {CATEGORY_NAMES.filter((n) => n !== "General").map((name) => {
              const on = v.interests.includes(name);
              const theme = categoryTheme(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleInterest(name)}
                  aria-pressed={on}
                  className={`accent inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition ${
                    on
                      ? "border-[var(--gold)] bg-[var(--gold-soft)] font-semibold"
                      : "border-[var(--border)] hover:border-[var(--gold)]"
                  }`}
                  style={
                    {
                      "--accent-light": theme.ink,
                      "--accent-dark": theme.inkDark,
                    } as React.CSSProperties
                  }
                >
                  <DepartmentCrest name={name} className="h-4 w-4" />
                  {name}
                  {on && <Icon name="check" className="h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>
        </Field>

        <Grid>
          <Field label="Hours a week" hint="Roughly">
            <input
              type="number"
              min={0}
              max={80}
              value={v.weeklyHours}
              onChange={(e) => set("weeklyHours", e.target.value)}
              className="input"
            />
          </Field>
        </Grid>

        <Field label="What you want to achieve" hint="Shapes the order courses are suggested in">
          <textarea
            value={v.goals}
            onChange={(e) => set("goals", e.target.value)}
            rows={3}
            maxLength={600}
            className="input resize-y"
            placeholder="e.g. Move into data analysis within a year"
          />
        </Field>
      </Section>

      {/* Links */}
      <Section title="Elsewhere">
        <Grid>
          <Field label="LinkedIn">
            <input
              type="url"
              value={v.linkedinUrl}
              onChange={(e) => set("linkedinUrl", e.target.value)}
              placeholder="https://..."
              className="input"
            />
          </Field>
          <Field label="GitHub">
            <input
              type="url"
              value={v.githubUrl}
              onChange={(e) => set("githubUrl", e.target.value)}
              placeholder="https://..."
              className="input"
            />
          </Field>
          <Field label="Website">
            <input
              type="url"
              value={v.websiteUrl}
              onChange={(e) => set("websiteUrl", e.target.value)}
              placeholder="https://..."
              className="input"
            />
          </Field>
        </Grid>
      </Section>

      {/* Consent */}
      <Section title="Offers">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={v.marketingOptIn}
            onChange={(e) => set("marketingOptIn", e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--gold)]"
          />
          <span className="text-sm leading-relaxed text-[var(--text-muted)]">
            Send me course suggestions and offers by email. Off by default — the owl will
            still guide you on the site either way.
          </span>
        </label>
      </Section>

      {error && (
        <p className="rounded-sm border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rune-edge inline-flex items-center gap-2 rounded-md border border-[var(--gold-bright)] bg-gradient-to-b from-[var(--gold)] to-[var(--gold-dim)] px-6 py-3 font-semibold text-[var(--on-gold)] transition hover:brightness-110 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save record"}
          <Icon name="check" className="h-4 w-4" />
        </button>
        {saved && (
          <span className="animate-fade-up inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--academy-emerald)]">
            <Icon name="check" className="h-4 w-4" />
            Saved
          </span>
        )}
      </div>

      {/* Accolades are saved individually, so they sit outside the main form
          submit rather than being lost if the page is left mid-edit. */}
      <AccoladeEditor accolades={accolades} onChange={setAccolades} />
    </form>
  );
}

function AccoladeEditor({
  accolades,
  onChange,
}: {
  accolades: Accolade[];
  onChange: (next: Accolade[]) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [draft, setDraft] = useState({
    kind: "COMPETITION",
    title: "",
    issuer: "",
    year: "",
    url: "",
    description: "",
  });

  async function add() {
    if (!draft.title.trim()) {
      setErr("Give it a title.");
      return;
    }
    setBusy(true);
    setErr("");

    const res = await fetch("/api/profile/accolades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);

    if (!res.ok) {
      setErr(data.error ?? "Could not add that.");
      return;
    }

    onChange([
      {
        id: data.id,
        kind: draft.kind,
        title: draft.title,
        issuer: draft.issuer || null,
        year: draft.year ? Number(draft.year) : null,
        url: draft.url || null,
        description: draft.description || null,
      },
      ...accolades,
    ]);
    setDraft({ kind: "COMPETITION", title: "", issuer: "", year: "", url: "", description: "" });
    setOpen(false);
    router.refresh();
  }

  async function remove(id: string) {
    setBusy(true);
    const res = await fetch(`/api/profile/accolades?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (res.ok) {
      onChange(accolades.filter((a) => a.id !== id));
      router.refresh();
    }
  }

  return (
    <Section
      title="Competitions & certifications"
      note="Anything you earned outside this academy"
    >
      {accolades.length > 0 && (
        <ul className="mb-4 space-y-2">
          {accolades.map((a) => (
            <li
              key={a.id}
              className="flex items-start gap-3 rounded-sm border border-[var(--border)] px-4 py-3"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-[var(--text)]">{a.title}</span>
                <span className="block text-xs text-[var(--text-faint)]">
                  {[
                    ACCOLADE_KINDS.find((k) => k.value === a.kind)?.label,
                    a.issuer,
                    a.year,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </span>
              <button
                type="button"
                onClick={() => remove(a.id)}
                disabled={busy}
                className="shrink-0 rounded-full px-3 py-1 text-sm font-semibold text-red-500 transition hover:bg-red-500/10 disabled:opacity-40"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md border border-[var(--gold)] px-4 py-2.5 text-sm font-semibold text-[var(--brand)] transition hover:bg-[var(--gold-soft)]"
        >
          <Icon name="plus" className="h-4 w-4" />
          Add one
        </button>
      ) : (
        <div className="rounded-sm border border-[var(--border)] bg-[var(--surface-2)] p-4">
          <Grid>
            <Field label="Kind">
              <select
                value={draft.kind}
                onChange={(e) => setDraft({ ...draft, kind: e.target.value })}
                className="input"
              >
                {ACCOLADE_KINDS.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Title" required>
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                maxLength={160}
                className="input"
                placeholder="e.g. National Olympiad, 2nd place"
              />
            </Field>
            <Field label="Issued by">
              <input
                value={draft.issuer}
                onChange={(e) => setDraft({ ...draft, issuer: e.target.value })}
                maxLength={160}
                className="input"
              />
            </Field>
            <Field label="Year">
              <input
                type="number"
                min={1950}
                max={2100}
                value={draft.year}
                onChange={(e) => setDraft({ ...draft, year: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Link">
              <input
                type="url"
                value={draft.url}
                onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                placeholder="https://..."
                className="input"
              />
            </Field>
          </Grid>

          <Field label="Description">
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              rows={2}
              maxLength={500}
              className="input resize-y"
            />
          </Field>

          {err && <p className="mb-3 text-sm font-medium text-red-500">{err}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={add}
              disabled={busy}
              className="rounded-md border border-[var(--gold-bright)] bg-gradient-to-b from-[var(--gold)] to-[var(--gold-dim)] px-5 py-2.5 text-sm font-semibold text-[var(--on-gold)] transition hover:brightness-110 disabled:opacity-60"
            >
              {busy ? "Adding…" : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setErr("");
              }}
              className="rounded-md px-4 py-2.5 text-sm text-[var(--text-muted)] transition hover:text-[var(--text)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}

function Section({
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
      <div className="mb-5">
        <h2 className="font-serif text-xl font-bold text-[var(--brand)]">{title}</h2>
        {note && <p className="text-xs text-[var(--text-faint)]">{note}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-[var(--text)]">
        {label}
        {required && <span className="ml-1 text-[var(--gold)]">*</span>}
        {hint && (
          <span className="ml-2 font-normal text-xs text-[var(--text-faint)]">{hint}</span>
        )}
      </span>
      {children}
    </label>
  );
}
