import Link from "next/link";
import Icon from "@/components/Icon";
import AcademyPlate from "@/components/art/AcademyPlate";
import { Diamond, Star } from "@/components/Ornament";
import MagicParticles from "@/components/magic/MagicParticles";
import LivingInk from "@/components/magic/LivingInk";

const STATS = [
  { icon: "cap", value: "12+", label: "Expert Courses" },
  { icon: "crown", value: "Lifetime", label: "Access" },
  { icon: "learners", value: "1000+", label: "Happy Learners" },
  { icon: "headset", value: "24/7", label: "Support" },
];

export default function Hero({ courseCount }: { courseCount: number }) {
  return (
    <section className="hero-panel relative overflow-hidden">
      {/* One pooled canvas rather than a stack of animated DOM nodes */}
      <MagicParticles count={44} kind="ember" />

      {/* Scattered sparkles */}
      <Star className="left-[6%] top-[18%]" size={16} delay={0} />
      <Star className="left-[42%] top-[10%]" size={10} delay={1.2} />
      <Star className="right-[38%] top-[26%]" size={12} delay={2.4} />
      <Star className="left-[18%] bottom-[18%]" size={11} delay={1.8} />

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-8 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_auto] lg:gap-6 lg:py-16 xl:px-10">
        {/* Copy */}
        <div className="animate-fade-up">
          <span className="mb-3 block text-[var(--gold)]" aria-hidden="true">
            ✦
          </span>

          <div className="mb-4 flex items-center gap-3" aria-hidden="true">
            <span className="rule-fade w-14" />
            <Diamond size={5} />
          </div>

          <h1 className="font-serif text-[44px] font-bold leading-[1.06] tracking-tight text-[var(--shell-text)] sm:text-[54px]">
            <LivingInk interval={7}>Learn something</LivingInk>
            <br />
            <LivingInk interval={5}>
              <span className="gold-leaf glow-text">new today</span>
            </LivingInk>
          </h1>

          {/* Ornamental rule under the headline */}
          <div className="mt-5 flex items-center gap-3" aria-hidden="true">
            <span className="rule-fade w-10" />
            <Diamond size={5} />
            <span className="rule-fade w-24" />
            <Diamond size={5} />
            <span className="rule-fade w-10" />
          </div>

          <p className="mt-6 max-w-sm text-[17px] leading-relaxed text-[var(--shell-text-muted)]">
            {courseCount} expert-led courses. Buy once,
            <br className="hidden sm:block" /> keep lifetime access.
          </p>

          <Link
            href="#courses"
            className="rune-edge group mt-8 inline-flex items-center gap-3 rounded-md border border-[var(--gold-bright)] bg-gradient-to-b from-[var(--gold)] to-[var(--gold-dim)] px-7 py-3.5 font-semibold text-[var(--on-gold)] shadow-[0_0_24px_rgb(212_162_76/0.4)] transition hover:brightness-110"
          >
            Explore Courses
            <Icon
              name="arrowRight"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Academy */}
        <div className="relative hidden lg:block">
          <AcademyPlate className="h-[340px] w-full" />
        </div>

        {/* Stats panel */}
        <div className="ornate animate-fade-up rounded-sm bg-black/25 p-5 backdrop-blur-sm lg:w-[248px]">
          <ul className="space-y-4">
            {STATS.map((stat, i) => (
              <li
                key={stat.label}
                className="group flex items-center gap-3.5"
                style={{
                  animation: `fade-up 0.5s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.09}s both`,
                }}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm border border-[var(--shell-line)] text-[var(--gold)] transition-all duration-300 group-hover:border-[var(--gold)] group-hover:bg-[var(--gold-soft)] group-hover:shadow-[0_0_14px_rgb(212_162_76/0.35)]">
                  <Icon name={stat.icon} className="h-[22px] w-[22px]" />
                </span>
                <span className="min-w-0">
                  <span className="block font-serif text-[17px] font-bold leading-tight text-[var(--shell-text)]">
                    {stat.value}
                  </span>
                  <span className="block text-[13px] text-[var(--shell-text-muted)]">
                    {stat.label}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
