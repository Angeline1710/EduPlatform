/**
 * Shared engraving technique.
 *
 * The previous illustrations were built from rectangles and triangles with a
 * single uniform stroke — which is precisely why they read as machine-made.
 * Real copperplate work gets its character from three things, and every
 * definition here exists to supply one of them:
 *
 *   1. Tone from HATCHING, not flat fill. Density carries value.
 *   2. Line weight that VARIES. A tapered stroke reads as a hand; a constant
 *      one reads as a plotter.
 *   3. Texture — stipple, plate grain, broken contours.
 *
 * Everything is a <defs> block, so a plate includes it once and references
 * the patterns by id.
 */
export default function EngravingDefs({
  idPrefix = "eng",
}: {
  idPrefix?: string;
}) {
  const p = idPrefix;

  return (
    <defs>
      {/* ---- Hatching, three densities. Angled 35° like a burin cut. ---- */}
      <pattern
        id={`${p}-hatch-light`}
        width="7"
        height="7"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(35)"
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="7"
          stroke="currentColor"
          strokeWidth="0.55"
          opacity="0.5"
        />
      </pattern>

      <pattern
        id={`${p}-hatch-mid`}
        width="4"
        height="4"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(35)"
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="4"
          stroke="currentColor"
          strokeWidth="0.7"
          opacity="0.65"
        />
      </pattern>

      <pattern
        id={`${p}-hatch-dark`}
        width="2.4"
        height="2.4"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(35)"
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="2.4"
          stroke="currentColor"
          strokeWidth="0.85"
          opacity="0.8"
        />
      </pattern>

      {/* Cross-hatch: the deepest shadows, two burin passes crossing. */}
      <pattern
        id={`${p}-cross`}
        width="4"
        height="4"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M0 0L4 4M4 0L0 4"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.7"
        />
      </pattern>

      {/* Stipple: soft graded tone, as on skies and distant stone. */}
      <pattern
        id={`${p}-stipple`}
        width="9"
        height="9"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="1.5" cy="2" r="0.5" fill="currentColor" opacity="0.5" />
        <circle cx="6" cy="4.5" r="0.42" fill="currentColor" opacity="0.42" />
        <circle cx="3.4" cy="7.2" r="0.55" fill="currentColor" opacity="0.55" />
        <circle cx="7.8" cy="8.2" r="0.35" fill="currentColor" opacity="0.35" />
      </pattern>

      {/* ---- Tonal washes ---- */}
      <linearGradient id={`${p}-sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--plate-ink)" stopOpacity="0.95" />
        <stop offset="45%" stopColor="var(--plate-stone)" stopOpacity="0.7" />
        <stop offset="100%" stopColor="var(--plate-roof)" stopOpacity="0.25" />
      </linearGradient>

      <radialGradient id={`${p}-glow`} cx="50%" cy="50%">
        <stop offset="0%" stopColor="var(--plate-lit)" stopOpacity="0.55" />
        <stop offset="55%" stopColor="var(--gold)" stopOpacity="0.18" />
        <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
      </radialGradient>

      <linearGradient id={`${p}-mist`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--plate-paper)" stopOpacity="0" />
        <stop offset="60%" stopColor="var(--plate-paper)" stopOpacity="0.14" />
        <stop offset="100%" stopColor="var(--plate-paper)" stopOpacity="0.3" />
      </linearGradient>

      <linearGradient id={`${p}-shaft`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--plate-lit)" stopOpacity="0.42" />
        <stop offset="100%" stopColor="var(--plate-lit)" stopOpacity="0" />
      </linearGradient>

      {/* ---- Plate grain: the tooth of the paper the plate was pressed on ---- */}
      <filter id={`${p}-grain`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="4"
          result="n"
        />
        <feColorMatrix in="n" type="saturate" values="0" result="g" />
        <feComponentTransfer in="g" result="t">
          <feFuncA type="linear" slope="0.08" />
        </feComponentTransfer>
        <feComposite in="t" in2="SourceGraphic" operator="over" />
      </filter>

      {/* Slight ink bleed, so contours are not razor-clean */}
      <filter id={`${p}-bleed`} x="-8%" y="-8%" width="116%" height="116%">
        <feGaussianBlur stdDeviation="0.35" />
      </filter>

      {/* Warm bloom around lit windows */}
      <filter id={`${p}-bloom`} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="2.4" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

/**
 * A tapered ink stroke.
 *
 * Rendered as a filled outline rather than a stroked line, because SVG
 * strokes cannot vary in width along their length — and that variation is
 * most of what separates a drawn line from a plotted one.
 */
export function InkStroke({
  d,
  color = "currentColor",
  opacity = 1,
}: {
  d: string;
  color?: string;
  opacity?: number;
}) {
  return <path d={d} fill={color} opacity={opacity} />;
}
