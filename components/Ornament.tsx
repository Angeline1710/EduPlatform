import Icon from "@/components/Icon";

/**
 * The ornamental vocabulary of the design: hexagon tiles, diamond rules,
 * the house crest, and drifting embers. Kept in one file so the motifs stay
 * consistent wherever they appear.
 */

/** Hexagonal icon tile — the signature element on every course card. */
export function HexTile({
  from,
  to,
  icon,
  size = 60,
  className = "",
}: {
  from: string;
  to: string;
  icon: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`relative grid shrink-0 place-items-center ${className}`}
      style={{ width: size, height: size * 1.08 }}
    >
      {/* Gold backing plate, very slightly larger, reads as an inlay */}
      <span
        className="hex absolute inset-0"
        style={{ background: "var(--gold)", opacity: 0.55 }}
      />
      <span
        className="hex absolute"
        style={{
          inset: 2,
          backgroundImage: `linear-gradient(150deg, ${from}, ${to})`,
        }}
      />
      {/* Glyph scales with the tile so one component covers every use */}
      <span
        className="relative text-white drop-shadow"
        style={{ width: size * 0.42, height: size * 0.42 }}
      >
        <Icon name={icon} className="h-full w-full" />
      </span>
    </span>
  );
}

/** Centred section heading flanked by diamond rules. */
export function DiamondHeading({
  children,
  tone = "dark",
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
}) {
  const color = tone === "dark" ? "var(--gold)" : "var(--gold)";
  return (
    <div className="flex items-center justify-center gap-4">
      <Rule />
      <h2
        className="text-center text-sm font-bold uppercase tracking-[0.32em]"
        style={{ color }}
      >
        {children}
      </h2>
      <Rule />
    </div>
  );
}

function Rule() {
  return (
    <span
      className="hidden flex-1 items-center gap-2 sm:flex"
      aria-hidden="true"
    >
      <span className="rule-fade flex-1" />
      <Diamond />
      <span className="rule-fade w-8" />
    </span>
  );
}

/** Small rotated square used as a divider jewel. */
export function Diamond({ size = 6 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block rotate-45 shrink-0"
      style={{
        width: size,
        height: size,
        background: "var(--gold)",
        boxShadow: "0 0 6px rgb(212 162 76 / 0.6)",
      }}
    />
  );
}

/** The house crest: a shield holding an open book, with laurel flourishes. */
export function Crest({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 44 50"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="crest-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--gold-bright)" />
          <stop offset="50%" stopColor="var(--gold)" />
          <stop offset="100%" stopColor="var(--gold-dim)" />
        </linearGradient>
      </defs>

      {/* Laurel sprigs either side */}
      <path
        d="M7 14c-3 6-3 14 1 20M37 14c3 6 3 14-1 20"
        stroke="url(#crest-gold)"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M6 18c-2.4-.6-3.8.4-4 2.4 2 .8 3.6.2 4-2.4zM6 24c-2.4-.6-3.8.4-4 2.4 2 .8 3.6.2 4-2.4zM38 18c2.4-.6 3.8.4 4 2.4-2 .8-3.6.2-4-2.4zM38 24c2.4-.6 3.8.4 4 2.4-2 .8-3.6.2-4-2.4z"
        fill="url(#crest-gold)"
        opacity="0.75"
      />

      {/* Shield */}
      <path
        d="M22 2 38 7v18c0 11-8 19-16 23C14 44 6 36 6 25V7L22 2z"
        stroke="url(#crest-gold)"
        strokeWidth="1.6"
        fill="rgb(212 162 76 / 0.08)"
      />

      {/* Open book */}
      <path
        d="M13 20c3-1.6 6-1.6 9 0v11c-3-1.6-6-1.6-9 0V20zM31 20c-3-1.6-6-1.6-9 0v11c3-1.6 6-1.6 9 0V20z"
        stroke="url(#crest-gold)"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M22 20v11" stroke="url(#crest-gold)" strokeWidth="1.2" />

      {/* Star above the book */}
      <path
        d="M22 11.5l1.1 2.6 2.8.3-2.1 1.9.6 2.7-2.4-1.4-2.4 1.4.6-2.7-2.1-1.9 2.8-.3L22 11.5z"
        fill="url(#crest-gold)"
      />
    </svg>
  );
}

/**
 * Ambient embers drifting upward. Purely decorative; the reduced-motion
 * rule in globals.css removes them outright rather than freezing them
 * mid-air, which would leave odd dots on the page.
 */
export function Embers({ count = 14 }: { count?: number }) {
  // Deterministic placement so server and client markup agree.
  const motes = Array.from({ length: count }, (_, i) => ({
    left: (i * 37) % 100,
    bottom: (i * 23) % 60,
    delay: (i * 0.7) % 7,
    duration: 6 + ((i * 1.3) % 4),
    size: 2 + (i % 3),
  }));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {motes.map((m, i) => (
        <span
          key={i}
          className="animate-ember absolute rounded-full"
          style={{
            left: `${m.left}%`,
            bottom: `${m.bottom}%`,
            width: m.size,
            height: m.size,
            background: "var(--gold-bright)",
            boxShadow: "0 0 6px rgb(240 208 137 / 0.9)",
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Four-pointed sparkle star, as scattered through the mockup's hero. */
export function Star({
  className = "",
  size = 14,
  delay = 0,
}: {
  className?: string;
  size?: number;
  delay?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`animate-sparkle absolute ${className}`}
      style={{ animationDelay: `${delay}s`, color: "var(--gold-bright)" }}
    >
      <path
        d="M12 0c.7 6.5 4.8 10.6 12 12-7.2 1.4-11.3 5.5-12 12-.7-6.5-4.8-10.6-12-12C7.2 10.6 11.3 6.5 12 0z"
        fill="currentColor"
      />
    </svg>
  );
}
