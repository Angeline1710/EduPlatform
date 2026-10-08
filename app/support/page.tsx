import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

export const metadata = {
  title: "Support · EduPlatform",
  description: "Answers to common questions, and how to reach the academy.",
};

const FAQS = [
  {
    q: "How long do I keep a course?",
    a: "Permanently. Courses are bought once, not rented — your access and your progress stay with your account for good.",
  },
  {
    q: "How do I earn a credential?",
    a: "Complete at least 85% of a course's lessons, then claim your credential from the course or dashboard. You'll choose the one-month completion period before it is issued.",
  },
  {
    q: "Can someone verify my credential?",
    a: "Yes. Enter the credential ID printed on the certificate on the public verification page. No account is required.",
  },
  {
    q: "What happens if my payment fails?",
    a: "No course access is granted and nothing is charged. Enrollment is only recorded once the payment provider confirms the charge succeeded.",
  },
  {
    q: "Can I get a refund?",
    a: "Contact support with your credential or payment reference and we will review it with you directly.",
  },
  {
    q: "My progress did not save.",
    a: "Progress saves per lesson as you mark it complete. If a lesson looks unfinished, reopen it and mark it again — if it still will not stick, send us the course name.",
  },
];

const CHANNELS = [
  {
    icon: "chat",
    title: "Email the academy",
    body: "Questions about courses, payments, or your record.",
    action: "advinnetworks@gmail.com",
    href: "mailto:advinnetworks@gmail.com",
  },
  {
    icon: "award",
    title: "Verify a credential",
    body: "Check any credential's authenticity using the ID printed on it.",
    action: "Open verification",
    href: "/verify",
  },
  {
    icon: "linkedin",
    title: "Follow along",
    body: "News and announcements from the team behind the academy.",
    action: "LinkedIn",
    href: "https://www.linkedin.com/company/zerobugsolutions/",
    external: true,
  },
];

export default function SupportPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Academy"
        title="Support"
        lead="Most answers are below. If yours is not, write to us and a person will reply."
      />

      {/* Channels */}
      <section className="paper border-b border-[var(--border)] px-6 py-14 xl:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-5 md:grid-cols-3">
          {CHANNELS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <a
                href={c.href}
                {...(c.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex h-full flex-col rounded-sm border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)]"
              >
                <span className="mb-4 inline-grid h-12 w-12 place-items-center rounded-sm border border-[var(--gold)] text-[var(--gold)] transition-all duration-300 group-hover:bg-[var(--gold-soft)]">
                  <Icon name={c.icon} className="h-6 w-6" />
                </span>
                <h2 className="font-serif text-xl font-bold text-[var(--text)]">
                  {c.title}
                </h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
                  {c.body}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 break-all text-sm font-semibold text-[var(--brand)]">
                  {c.action}
                  <Icon
                    name="arrowRight"
                    className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ — details/summary so it works without JavaScript */}
      <section className="shell-panel px-6 py-14 xl:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-serif text-3xl font-bold text-[var(--shell-text)]">
            Common questions
          </h2>

          <div className="mt-10 divide-y divide-[var(--shell-line-soft)] border-y border-[var(--shell-line-soft)]">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center gap-4 font-serif text-lg font-bold text-[var(--shell-text)] transition hover:text-[var(--gold-bright)]">
                  <span className="flex-1">{f.q}</span>
                  <span className="shrink-0 text-[var(--gold)] transition-transform duration-300 group-open:rotate-90">
                    <Icon name="arrowRight" className="h-4 w-4" />
                  </span>
                </summary>
                <p className="mt-3 pr-10 text-sm leading-relaxed text-[var(--shell-text-muted)]">
                  {f.a}
                </p>
              </details>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-[var(--shell-text-muted)]">
            Still stuck?{" "}
            <a
              href="mailto:advinnetworks@gmail.com"
              className="font-semibold text-[var(--gold-bright)] hover:underline"
            >
              Write to the academy
            </a>{" "}
            and include your course name.
          </p>
        </div>
      </section>
    </>
  );
}
