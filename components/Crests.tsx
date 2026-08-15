/**
 * Department crests.
 *
 * Every crest is an original mark built around the academy's "E" emblem —
 * no borrowed house symbols. Each is drawn on a 64×64 grid with a single
 * `currentColor` stroke so a crest inherits its department's accent and
 * stays legible on parchment or plum without per-theme variants.
 */

type CrestProps = { className?: string };

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Frame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" {...S}>
      {children}
    </svg>
  );
}

/** The E emblem, reused inside most crests. */
function Emblem({ x = 32, y = 33, scale = 1 }: { x?: number; y?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-4 -6h8M-4 -6v12M-4 0h6M-4 6h8" strokeWidth={2} />
    </g>
  );
}

/** All — compass rose, for navigating the whole archive. */
export function CrestAll({ className }: CrestProps) {
  return (
    <Frame className={className}>
      <circle cx="32" cy="32" r="20" />
      <circle cx="32" cy="32" r="14" strokeDasharray="1.5 3" />
      {/* Cardinal points */}
      <path d="M32 8l3 18-3 6-3-6 3-18zM32 56l3-18-3-6-3 6 3 18z" />
      <path d="M8 32l18 3 6-3-6-3-18 3zM56 32l-18 3-6-3 6-3 18 3z" />
      <Emblem scale={0.85} />
    </Frame>
  );
}

/** Development — laurelled shield, the craft of building. */
export function CrestDevelopment({ className }: CrestProps) {
  return (
    <Frame className={className}>
      <path d="M32 10l14 5v14c0 10-7 16-14 20-7-4-14-10-14-20V15l14-5z" />
      <path d="M12 24c-3 6-3 13 1 19M52 24c3 6 3 13-1 19" strokeWidth={1.2} />
      <path d="M11 30c-2.5-.6-4 .5-4.2 2.6 2.1.8 3.8.2 4.2-2.6zM11 37c-2.5-.6-4 .5-4.2 2.6 2.1.8 3.8.2 4.2-2.6zM53 30c2.5-.6 4 .5 4.2 2.6-2.1.8-3.8.2-4.2-2.6zM53 37c2.5-.6 4 .5 4.2 2.6-2.1.8-3.8.2-4.2-2.6z" />
      <path d="M32 4.5l1.4 3.2 3.5.4-2.6 2.4.7 3.4-3-1.8-3 1.8.7-3.4L27 8.1l3.5-.4L32 4.5z" />
      <Emblem y={32} scale={0.9} />
    </Frame>
  );
}

/** Data — a scrying orb on its stand: patterns read from the unseen. */
export function CrestData({ className }: CrestProps) {
  return (
    <Frame className={className}>
      <circle cx="32" cy="28" r="15" />
      <ellipse cx="32" cy="28" rx="15" ry="6" strokeWidth={1} strokeDasharray="2 3" />
      <path d="M22 43h20l-3 4H25zM20 47h24v3H20z" />
      <path d="M24 20c2-3 5-4.5 8-4.5" strokeWidth={1} opacity={0.7} />
      <Emblem y={28} scale={0.9} />
    </Frame>
  );
}

/** Design — the open codex and quill: form set down by hand. */
export function CrestDesign({ className }: CrestProps) {
  return (
    <Frame className={className}>
      <path d="M8 22c7-4 14-4 21 0v24c-7-4-14-4-21 0V22z" />
      <path d="M50 20c-4.5-1.6-9-1-13 2v24c4-3 8.5-3.6 13-2" />
      <path d="M29 22v24" strokeWidth={1.2} />
      {/* Quill */}
      <path d="M56 12c-6 3-11 9-13 16l-2 6 5-2c7-2.6 12-8 13-14l-3-6z" />
      <path d="M41 34l-5 6" strokeWidth={1.2} />
      <Emblem x={18} y={33} scale={0.8} />
    </Frame>
  );
}

/** Business — the alembic: raw material refined into value. */
export function CrestBusiness({ className }: CrestProps) {
  return (
    <Frame className={className}>
      <path d="M27 12h10v9l9 17c2.5 5-1 11-6.5 11h-15C19 49 15.5 43 18 38l9-17v-9z" />
      <path d="M27 21h10" strokeWidth={1.2} />
      <path d="M20 36h24" strokeWidth={1.2} strokeDasharray="2 2" opacity={0.7} />
      {/* Vapour */}
      <path d="M32 9c2-2 2-4 0-6M37 9c1.5-1.5 1.5-3 0-4.5" strokeWidth={1.2} opacity={0.65} />
      <Emblem y={39} scale={0.85} />
    </Frame>
  );
}

/** Security — warded shield and blade. */
export function CrestSecurity({ className }: CrestProps) {
  return (
    <Frame className={className}>
      <path d="M32 14l14 5v14c0 10-7 16-14 20-7-4-14-10-14-20V19l14-5z" />
      {/* Blade through the shield */}
      <path d="M32 4v12M28 16h8" strokeWidth={1.4} />
      <path d="M32 44v8" strokeWidth={1.4} opacity={0.8} />
      <Emblem y={33} scale={0.9} />
    </Frame>
  );
}

/** Communication — the messenger owl upon a sealed letter. */
export function CrestCommunication({ className }: CrestProps) {
  return (
    <Frame className={className}>
      {/* Letter */}
      <rect x="10" y="34" width="44" height="20" rx="2" />
      <path d="M10 36l22 13 22-13" strokeWidth={1.2} />
      {/* Owl */}
      <path d="M22 30c0-7 4.5-12 10-12s10 5 10 12c0 5-4.5 8-10 8s-10-3-10-8z" />
      <circle cx="28" cy="26" r="3.2" />
      <circle cx="36" cy="26" r="3.2" />
      <path d="M32 29.5l-1.6 2.4h3.2L32 29.5z" />
      <path d="M23 19l3 4M41 19l-3 4" strokeWidth={1.2} />
      <Emblem y={45} scale={0.75} />
    </Frame>
  );
}

/** General — the archive volume. */
export function CrestGeneral({ className }: CrestProps) {
  return (
    <Frame className={className}>
      <path d="M14 12h30a4 4 0 0 1 4 4v34a4 4 0 0 0-4-4H14V12z" />
      <path d="M14 46a4 4 0 0 0 0 8h34" strokeWidth={1.2} />
      <path d="M22 22h16M22 30h16" strokeWidth={1.2} opacity={0.7} />
      <Emblem y={38} scale={0.8} />
    </Frame>
  );
}

const CRESTS: Record<string, (p: CrestProps) => React.ReactElement> = {
  All: CrestAll,
  Development: CrestDevelopment,
  Data: CrestData,
  Design: CrestDesign,
  Business: CrestBusiness,
  Security: CrestSecurity,
  Communication: CrestCommunication,
  General: CrestGeneral,
};

export function DepartmentCrest({
  name,
  className = "h-10 w-10",
}: {
  name: string;
  className?: string;
}) {
  const C = CRESTS[name] ?? CrestGeneral;
  return <C className={className} />;
}

/**
 * The academy crest: shield geometry, open book, orbit and star, with the
 * E emblem at its heart. Used for the wordmark, seals and badges.
 */
export function AcademyCrest({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.14}
      viewBox="0 0 44 50"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="ac-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--gold-bright)" />
          <stop offset="55%" stopColor="var(--gold)" />
          <stop offset="100%" stopColor="var(--gold-dim)" />
        </linearGradient>
      </defs>

      {/* Orbit ring — knowledge in motion */}
      <ellipse
        cx="22"
        cy="25"
        rx="19"
        ry="8"
        stroke="url(#ac-gold)"
        strokeWidth="0.9"
        opacity="0.5"
        transform="rotate(-24 22 25)"
      />

      {/* Shield */}
      <path
        d="M22 3 37 7.5V25c0 10.5-7.5 18-15 21.5C14.5 43 7 35.5 7 25V7.5L22 3z"
        stroke="url(#ac-gold)"
        strokeWidth="1.6"
        fill="rgb(201 150 50 / 0.08)"
      />

      {/* Open book */}
      <path
        d="M13 21c3-1.5 6-1.5 9 0v11c-3-1.5-6-1.5-9 0V21zM31 21c-3-1.5-6-1.5-9 0v11c3-1.5 6-1.5 9 0V21z"
        stroke="url(#ac-gold)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />

      {/* E emblem on the spine */}
      <path
        d="M20 24h4M20 24v6M20 27h3M20 30h4"
        stroke="url(#ac-gold)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      {/* Star */}
      <path
        d="M22 11.5l1.2 2.8 3 .3-2.3 2 .7 2.9-2.6-1.5-2.6 1.5.7-2.9-2.3-2 3-.3L22 11.5z"
        fill="url(#ac-gold)"
      />
    </svg>
  );
}
