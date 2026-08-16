import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getActivity, groupByDay, type ActivityEvent } from "@/lib/activity";
import { formatIssueDate } from "@/lib/certificates";
import PageHeader from "@/components/PageHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Activity · EduPlatform" };

const MARKS: Record<ActivityEvent["kind"], { icon: string; label: string }> = {
  joined: { icon: "sparkle", label: "Joined" },
  enrolled: { icon: "book", label: "Enrolled" },
  lesson: { icon: "check", label: "Lesson" },
  certificate: { icon: "award", label: "Credential" },
  accolade: { icon: "crown", label: "Accolade" },
};

export default async function ActivityPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const events = await getActivity(session.user.id, 60);
  const days = groupByDay(events);

  return (
    <>
      <PageHeader
        eyebrow="The Academy"
        title="Activity"
        lead="Everything you have done here, newest first."
      />

      <section className="paper min-h-[60vh] px-6 py-12 xl:px-10">
        <div className="mx-auto max-w-[900px]">
          <ProfileTabs />

          {events.length === 0 ? (
            <div className="rounded-sm border border-dashed border-[var(--border-strong)] px-6 py-16 text-center">
              <p className="font-serif text-xl font-bold text-[var(--brand)]">
                Nothing recorded yet
              </p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Your first lesson will appear here.
              </p>
              <Link
                href="/courses"
                className="mt-6 inline-flex items-center gap-2 rounded-md border border-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-[var(--brand)] transition hover:bg-[var(--gold-soft)]"
              >
                Browse the archives
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {days.map((day, di) => (
                <Reveal key={day.date} delay={Math.min(di, 4) * 0.05}>
                  <div>
                    <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-faint)]">
                      {formatIssueDate(new Date(`${day.date}T00:00:00`))}
                    </h2>

                    {/* The rail runs behind the marks, so the day reads as one
                        thread rather than a stack of separate rows. */}
                    <ol className="relative space-y-3 border-l border-[var(--border)] pl-6">
                      {day.items.map((e) => {
                        const mark = MARKS[e.kind];
                        const body = (
                          <>
                            <span
                              aria-hidden="true"
                              className="absolute -left-[31px] grid h-[22px] w-[22px] place-items-center rounded-full border border-[var(--gold)] bg-[var(--surface)] text-[var(--gold)]"
                            >
                              <Icon name={mark.icon} className="h-3 w-3" />
                            </span>
                            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                              {mark.label}
                            </span>
                            <span className="block font-medium text-[var(--text)]">
                              {e.title}
                            </span>
                            {e.detail && (
                              <span className="block text-xs text-[var(--text-muted)]">
                                {e.detail}
                              </span>
                            )}
                          </>
                        );

                        return (
                          <li key={e.id} className="relative">
                            {e.href ? (
                              <Link
                                href={e.href}
                                className="block rounded-sm border border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition hover:border-[var(--gold)]"
                              >
                                {body}
                              </Link>
                            ) : (
                              <div className="rounded-sm border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                                {body}
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
