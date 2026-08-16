import {
  getProfile,
  educationLabel,
  experienceLabel,
  accoladeLabel,
} from "@/lib/profile";
import { getInterestProfile } from "@/lib/interest";
import Icon from "@/components/Icon";

/**
 * A scholar's own record, as seen by an admin.
 *
 * Presented as what the person chose to share, alongside what their behaviour
 * says — the two together are what makes an offer relevant rather than a
 * guess. The marketing consent state is shown prominently, because whether a
 * scholar may be contacted is a fact about them, not a footnote.
 */
export default async function ScholarRecord({ userId }: { userId: string }) {
  const [record, interest] = await Promise.all([
    getProfile(userId),
    getInterestProfile({ userId }),
  ]);

  if (!record) return null;
  const { profile, age, interests, completeness } = record;

  const hasAnything =
    profile &&
    (profile.headline ||
      profile.bio ||
      profile.dateOfBirth ||
      profile.educationLevel ||
      profile.occupation ||
      interests.length > 0 ||
      profile.accolades.length > 0);

  return (
    <div className="mb-6 rounded-sm border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-bold text-[var(--brand)]">
            Scholar record
          </h2>
          <p className="text-xs text-[var(--text-faint)]">
            {completeness.percent}% complete · what they chose to share
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
            profile?.marketingOptIn
              ? "bg-[var(--academy-emerald)]/15 text-[var(--academy-emerald)]"
              : "bg-[var(--surface-2)] text-[var(--text-muted)]"
          }`}
        >
          <Icon name={profile?.marketingOptIn ? "check" : "lock"} className="h-3.5 w-3.5" />
          {profile?.marketingOptIn ? "Consented to offers" : "No marketing consent"}
        </span>
      </div>

      {!hasAnything ? (
        <p className="text-sm text-[var(--text-muted)]">
          This scholar has not filled in their record yet.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Declared */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
              Told us
            </p>
            <dl className="space-y-2 text-sm">
              <Row label="Headline" value={profile?.headline} />
              <Row label="Age" value={age !== null ? `${age}` : null} />
              <Row
                label="Location"
                value={[profile?.city, profile?.country].filter(Boolean).join(", ") || null}
              />
              <Row label="Phone" value={profile?.phone} />
              <Row label="Education" value={educationLabel(profile?.educationLevel)} />
              <Row label="Field" value={profile?.fieldOfStudy} />
              <Row label="Institution" value={profile?.institution} />
              <Row label="Occupation" value={profile?.occupation} />
              <Row label="Experience" value={experienceLabel(profile?.experienceLevel)} />
              <Row
                label="Hours/week"
                value={profile?.weeklyHours ? String(profile.weeklyHours) : null}
              />
            </dl>

            {interests.length > 0 && (
              <div className="mt-3">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  Wants to learn
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {interests.map((i) => (
                    <span
                      key={i}
                      className="rounded-full bg-[var(--gold-soft)] px-2.5 py-1 text-xs text-[var(--brand)]"
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile?.goals && (
              <div className="mt-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  Their goal
                </p>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  {profile.goals}
                </p>
              </div>
            )}
          </div>

          {/* Observed + accolades */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
              What their behaviour says
            </p>
            {!interest.hasHistory ? (
              <p className="text-sm text-[var(--text-muted)]">
                No browsing recorded yet.
              </p>
            ) : (
              <>
                <div className="space-y-1.5">
                  {interest.affinities.slice(0, 4).map((a) => (
                    <div key={a.category} className="flex items-center gap-2">
                      <span className="w-24 shrink-0 truncate text-xs text-[var(--text-muted)]">
                        {a.category}
                      </span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
                        <span
                          className="block h-full rounded-full bg-[var(--gold)]"
                          style={{ width: `${Math.max(a.share, 3)}%` }}
                        />
                      </span>
                      <span className="w-8 shrink-0 text-right text-xs tabular-nums text-[var(--text-faint)]">
                        {a.share}%
                      </span>
                    </div>
                  ))}
                </div>

                {interest.recentSearches.length > 0 && (
                  <p className="mt-3 text-sm text-[var(--text-muted)]">
                    <span className="text-[var(--text-faint)]">Searched:</span>{" "}
                    {interest.recentSearches.map((s) => `“${s}”`).join(", ")}
                  </p>
                )}

                {interest.recommendations.length > 0 && (
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    <span className="text-[var(--text-faint)]">Would likely buy:</span>{" "}
                    {interest.recommendations.slice(0, 2).map((r) => r.title).join(", ")}
                  </p>
                )}
              </>
            )}

            {profile?.accolades && profile.accolades.length > 0 && (
              <div className="mt-4">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  Earned elsewhere
                </p>
                <ul className="space-y-1.5">
                  {profile.accolades.map((a) => (
                    <li key={a.id} className="text-sm">
                      <span className="font-medium text-[var(--text)]">{a.title}</span>
                      <span className="text-xs text-[var(--text-faint)]">
                        {" "}
                        · {accoladeLabel(a.kind)}
                        {a.year ? ` · ${a.year}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-3">
      <dt className="w-24 shrink-0 text-xs text-[var(--text-faint)]">{label}</dt>
      <dd className="text-[var(--text)]">{value}</dd>
    </div>
  );
}
