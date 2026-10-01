import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import { Diamond } from "@/components/Ornament";
import AcademyPlate from "@/components/art/AcademyPlate";

export const metadata = {
  title: "Why the Academy · EduPlatform",
  description: "How learning works here, and what you take away from it.",
};

const PILLARS = [
  {
    icon: "crown",
    title: "Lifetime Access",
    body: "Buy a course once and it stays yours. No subscription, no expiry, no losing your progress because a month lapsed.",
  },
  {
    icon: "learners",
    title: "Expert Instructors",
    body: "Every course is written by someone who does the work professionally, not someone reading from a manual.",
  },
  {
    icon: "book",
    title: "Practical Content",
    body: "Lessons build toward something you can actually show — projects and exercises, not trivia.",
  },
  {
    icon: "award",
    title: "Verified Credentials",
    body: "Finish a course and receive a credential anyone can check against our public archive, by code or by QR.",
  },
  {
    icon: "chart",
    title: "Progress You Can See",
    body: "Your record tracks every lesson, so you always know what is done, what is left, and what comes next.",
  },
  {
    icon: "headset",
    title: "Support That Answers",
    body: "Stuck on a lesson or a payment? Reach us and a person replies.",
  },
];

const STEPS = [
  {
    n: "I",
    title: "Discover",
    body: "Search the archives or browse a department until something catches you.",
  },
  {
    n: "II",
    title: "Learn",
    body: "Work through lessons at your own pace. Progress saves as you go.",
  },
  {
    n: "III",
    title: "Practise",
    body: "Apply each lesson to real exercises rather than only reading.",
  },
  {
    n: "IV",
    title: "Master",
    body: "Finish the course and your credential is sealed and issued.",
  },
];

export default async function WhyUsPage() {
  // Real figures, so the page never claims more than the platform holds.
  const [courses, lessons, students, certificates] = await Promise.all([
    prisma.course.count({ where: { published: true } }),
    prisma.lesson.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.certificate.count({ where: { revokedAt: null } }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="The Academy"
        title="Why Learn Here"
        lead="An academy is judged by what its scholars can do afterwards. Here is how this one is built."
      />

      {/* The academy itself, as an engraved plate. This is where the drawing
          belongs now that the hero carries the film. */}
      <section className="shell-panel relative overflow-hidden border-b border-[var(--shell-line)]">
        <div className="mx-auto max-w-[1400px] px-6 pt-10 xl:px-10">
          <AcademyPlate className="mx-auto h-[300px] w-full max-w-3xl" />
        </div>
      </section>

      {/* Real numbers */}
      <section className="shell-panel border-b border-[var(--shell-line)]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 px-6 py-10 lg:grid-cols-4 xl:px-10">
          {[
            { v: courses, l: "Courses published" },
            { v: lessons, l: "Lessons written" },
            { v: students, l: "Scholars enrolled" },
            { v: certificates, l: "Credentials issued" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="gold-leaf font-serif text-4xl font-bold">{s.v}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--shell-text-muted)]">
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="paper border-b border-[var(--border)] px-6 py-14 xl:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl font-bold text-[var(--brand)]">
              What you get
            </h2>
            <div
              className="mt-3 flex items-center justify-center gap-2.5"
              aria-hidden="true"
            >
              <span className="rule-fade w-14" />
              <Diamond size={5} />
              <span className="rule-fade w-14" />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 0.06}>
                <div className="group h-full rounded-sm border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)]">
                  <span className="mb-4 inline-grid h-12 w-12 place-items-center rounded-sm border border-[var(--gold)] text-[var(--gold)] transition-all duration-300 group-hover:bg-[var(--gold-soft)] group-hover:shadow-[0_0_14px_var(--academy-glow)]">
                    <Icon name={p.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[var(--text)]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How learning works */}
      <section className="shell-panel border-b border-[var(--shell-line)] px-6 py-14 xl:px-10">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="text-center font-serif text-3xl font-bold text-[var(--shell-text)]">
            How learning works
          </h2>
          <div
            className="mt-3 flex items-center justify-center gap-2.5"
            aria-hidden="true"
          >
            <span className="rule-fade w-14" />
            <Diamond size={5} />
            <span className="rule-fade w-14" />
          </div>

          <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.n} className="relative text-center">
                {/* Connector between steps on wide screens */}
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-[-12px] top-7 hidden h-px w-6 bg-[var(--shell-line)] lg:block"
                  />
                )}
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[var(--gold)] font-serif text-lg font-bold text-[var(--gold)]">
                  {s.n}
                </span>
                <h3 className="mt-4 font-serif text-xl font-bold text-[var(--shell-text)]">
                  {s.title}
                </h3>
                <p className="mx-auto mt-1.5 max-w-[16rem] text-sm leading-relaxed text-[var(--shell-text-muted)]">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Closing call */}
      <section className="paper px-6 py-16 text-center xl:px-10">
        <h2 className="font-serif text-3xl font-bold text-[var(--brand)] sm:text-4xl">
          Your next discovery awaits.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[var(--text-muted)]">
          Pick a department, choose a course, and begin.
        </p>
        <Link
          href="/courses"
          className="rune-edge mt-8 inline-flex items-center gap-3 rounded-md border border-[var(--gold-bright)] bg-gradient-to-b from-[var(--gold)] to-[var(--gold-dim)] px-7 py-3.5 font-semibold text-[var(--on-gold)] shadow-[0_0_24px_var(--academy-glow)] transition hover:brightness-110"
        >
          Begin Learning
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </section>
    </>
  );
}
