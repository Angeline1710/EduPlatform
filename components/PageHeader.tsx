import { Diamond } from "@/components/Ornament";
import { AcademyCrest } from "@/components/Crests";
import LivingInk from "@/components/magic/LivingInk";
import MagicParticles from "@/components/magic/MagicParticles";

/**
 * The banner every top-level page opens with, so each route announces itself
 * as its own place rather than looking like a scrolled section of the home
 * page.
 */
export default function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="hero-panel relative overflow-hidden border-b border-[var(--shell-line)]">
      <MagicParticles count={26} kind="ember" />

      <div className="relative mx-auto max-w-[1400px] px-6 py-14 text-center xl:px-10">
        <div className="mb-4 flex items-center justify-center gap-3" aria-hidden="true">
          <span className="rule-fade w-16 sm:w-24" />
          <span className="text-[var(--gold)]">
            <AcademyCrest size={24} />
          </span>
          <span className="rule-fade w-16 sm:w-24" />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--gold)]">
          {eyebrow}
        </p>

        <h1 className="mt-3 font-serif text-[40px] leading-none tracking-tight text-[var(--shell-text)] sm:text-[52px]">
          <LivingInk>
            <span className="gold-leaf glow-text">{title}</span>
          </LivingInk>
        </h1>

        <div className="mt-5 flex items-center justify-center gap-2.5" aria-hidden="true">
          <span className="rule-fade w-14" />
          <Diamond size={5} />
          <span className="rule-fade w-14" />
        </div>

        {lead && (
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-[var(--shell-text-muted)]">
            {lead}
          </p>
        )}

        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
