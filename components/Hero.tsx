import Link from "next/link";
import Icon from "@/components/Icon";
import HeroVideo from "@/components/HeroVideo";
import { Diamond } from "@/components/Ornament";
import LivingInk from "@/components/magic/LivingInk";

const STATS = [
  { icon: "cap", value: "12+", label: "Expert Courses" },
  { icon: "crown", value: "Lifetime", label: "Access" },
  { icon: "learners", value: "1000+", label: "Happy Learners" },
  { icon: "headset", value: "24/7", label: "Support" },
];

export default function Hero({ courseCount }: { courseCount: number }) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* The film runs behind everything in this section. */}
      <HeroVideo />

      {/* Every piece of copy and the stats board sit above it. */}
      <div className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-8 px-6 py-20 lg:grid-cols-[minmax(0,1.15fr)_auto] lg:gap-10 lg:py-28 xl:px-10">
        <div className="animate-fade-up max-w-xl">
          <span className="mb-3 block text-[var(--gold-bright)]" aria-hidden="true">
            ✦
          </span>

          <div className="mb-4 flex items-center gap-3" aria-hidden="true">
            <span className="rule-fade w-14" />
            <Diamond size={5} />
          </div>

          <h1 className="font-serif text-[46px] font-bold leading-[1.05] tracking-tight text-[var(--hero-ink)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] sm:text-[58px]">
            <LivingInk interval={7}>Learn something</LivingInk>
            <br />
            <LivingInk interval={5}>
              <span className="gold-leaf glow-text">new today</span>
            </LivingInk>
          </h1>

          <div className="mt-5 flex items-center gap-3" aria-hidden="true">
            <span className="rule-fade w-10" />
            <Diamond size={5} />
            <span className="rule-fade w-24" />
            <Diamond size={5} />
            <span className="rule-fade w-10" />
          </div>

          <p className="mt-6 max-w-sm text-[17px] leading-relaxed text-[var(--hero-ink-muted)] drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
            {courseCount} expert-led courses. Buy once,
            <br className="hidden sm:block" /> keep lifetime access.
          </p>

          <Link
            href="/courses"
            className="rune-edge group mt-9 inline-flex items-center gap-3 rounded-md border border-[var(--gold-bright)] bg-gradient-to-b from-[var(--gold)] to-[var(--gold-dim)] px-7 py-3.5 font-semibold text-[var(--on-gold)] shadow-[0_0_28px_var(--academy-glow)] transition hover:brightness-110"
          >
            Explore Courses
            <Icon
              name="arrowRight"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Stats board — above the film, as requested */}
        <div className="ornate animate-fade-up rounded-sm border-[var(--gold)]/40 bg-black/45 p-5 backdrop-blur-md lg:w-[262px]">
          <ul className="space-y-4">
            {STATS.map((stat, i) => (
              <li
                key={stat.label}
                className="group flex items-center gap-3.5"
                style={{
                  animation: `fade-up 0.5s var(--ease-academy) ${0.15 + i * 0.09}s both`,
                }}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm border border-[var(--gold)]/50 text-[var(--gold-bright)] transition-all duration-300 group-hover:border-[var(--gold-bright)] group-hover:bg-[var(--gold-soft)] group-hover:shadow-[0_0_14px_var(--academy-glow)]">
                  <Icon name={stat.icon} className="h-[22px] w-[22px]" />
                </span>
                <span className="min-w-0">
                  <span className="block font-serif text-[17px] font-bold leading-tight text-[#F6F1EA]">
                    {stat.value}
                  </span>
                  <span className="block text-[13px] text-[#CFC4CE]">{stat.label}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
