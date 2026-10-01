/**
 * Department crests, cut as engravings.
 *
 * The earlier set was uniform-weight outlines on primitive shapes, which is
 * why it looked plotted. These are drawn the way an engraver works:
 *
 *   - contours are curves, and closed forms are FILLED then relieved with
 *     highlights, rather than left as hollow outlines
 *   - weight varies between the outer contour, interior detail, and texture
 *   - tone comes from hatch fills layered over the form
 *
 * Each takes `currentColor`, so one drawing serves both themes.
 */

type CrestProps = { className?: string };

/** Hatch + stipple patterns, scoped per crest so ids never collide. */
function CrestDefs({ id }: { id: string }) {
  return (
    <defs>
      <pattern
        id={`${id}-h`}
        width="3.2"
        height="3.2"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(38)"
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="3.2"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.34"
        />
      </pattern>
      <pattern
        id={`${id}-x`}
        width="3.4"
        height="3.4"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M0 0L3.4 3.4M3.4 0L0 3.4"
          stroke="currentColor"
          strokeWidth="0.55"
          opacity="0.28"
        />
      </pattern>
    </defs>
  );
}

function Plate({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <CrestDefs id={id} />
      {children}
    </svg>
  );
}

/** The E emblem, cut rather than stroked. */
function Emblem({
  x = 32,
  y = 33,
  s = 1,
}: {
  x?: number;
  y?: number;
  s?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M-4.6 -7.2h9.2c.5 0 .8.4.8 1s-.3 1-.8 1h-6.6v4h5c.5 0 .8.4.8 1s-.3 1-.8 1h-5v4.4h6.8c.5 0 .8.4.8 1s-.3 1-.8 1h-9.4c-.6 0-1-.5-1-1.2v-12c0-.7.4-1.2 1-1.2z"
        fill="currentColor"
      />
    </g>
  );
}

/** All — a compass rose, points swelling from the centre. */
export function CrestAll({ className }: CrestProps) {
  return (
    <Plate id="c-all" className={className}>
      <circle cx="32" cy="32" r="21" fill="currentColor" opacity="0.07" />
      <circle cx="32" cy="32" r="21" stroke="currentColor" strokeWidth="1.5" />
      <circle
        cx="32"
        cy="32"
        r="15.5"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeDasharray="1.2 3"
        opacity="0.7"
      />

      {/* Cardinal points — each a swelling lozenge, not a line */}
      <path
        d="M32 6c1.6 8 2.8 14 4.6 19.4C34.6 27 33.4 27.6 32 27.6s-2.6-.6-4.6-2.2C29.2 20 30.4 14 32 6z"
        fill="currentColor"
      />
      <path
        d="M32 58c-1.6-8-2.8-14-4.6-19.4 2 1.6 3.2 2.2 4.6 2.2s2.6-.6 4.6-2.2C34.8 44 33.6 50 32 58z"
        fill="currentColor"
        opacity="0.82"
      />
      <path
        d="M6 32c8-1.6 14-2.8 19.4-4.6-1.6 2-2.2 3.2-2.2 4.6s.6 2.6 2.2 4.6C20 34.8 14 33.6 6 32z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M58 32c-8 1.6-14 2.8-19.4 4.6 1.6-2 2.2-3.2 2.2-4.6s-.6-2.6-2.2-4.6C44 29.2 50 30.4 58 32z"
        fill="currentColor"
        opacity="0.7"
      />

      {/* Diagonal minor points, thinner */}
      <path
        d="M46 18c-3.4 5.4-6 8.8-9 11.6 1-2.4 1.2-3.6.6-4.6-.6-1-1.8-1.4-4.2-1.4 3.6-2.4 7.2-4 12.6-5.6z"
        fill="currentColor"
        opacity="0.4"
      />

      <circle cx="32" cy="32" r="9" fill="currentColor" opacity="0.1" />
      <Emblem s={0.82} />
    </Plate>
  );
}

/** Development — a laurelled shield, filled and relieved. */
export function CrestDevelopment({ className }: CrestProps) {
  return (
    <Plate id="c-dev" className={className}>
      {/* Shield body: shoulders curve outward, base draws to a point */}
      <path
        d="M32 9c6.4 1.4 12 3 15.6 4.6.6 12.4-.4 21.4-3.4 27.6C41 47.6 37 51.8 32 55c-5-3.2-9-7.4-12.2-13.8-3-6.2-4-15.2-3.4-27.6C20 12 25.6 10.4 32 9z"
        fill="currentColor"
        opacity="0.12"
      />
      <path
        d="M32 9c6.4 1.4 12 3 15.6 4.6.6 12.4-.4 21.4-3.4 27.6C41 47.6 37 51.8 32 55c-5-3.2-9-7.4-12.2-13.8-3-6.2-4-15.2-3.4-27.6C20 12 25.6 10.4 32 9z"
        fill="url(#c-dev-h)"
      />
      <path
        d="M32 9c6.4 1.4 12 3 15.6 4.6.6 12.4-.4 21.4-3.4 27.6C41 47.6 37 51.8 32 55c-5-3.2-9-7.4-12.2-13.8-3-6.2-4-15.2-3.4-27.6C20 12 25.6 10.4 32 9z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      {/* Inner relief line, thinner */}
      <path
        d="M32 13.5c5 1.2 9.4 2.4 12.2 3.6.5 10.6-.3 18.2-2.7 23.4-2.5 5.4-5.7 8.9-9.5 11.6-3.8-2.7-7-6.2-9.5-11.6-2.4-5.2-3.2-12.8-2.7-23.4 2.8-1.2 7.2-2.4 12.2-3.6z"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.55"
      />

      {/* Laurel sprigs — curved, leaves as teardrops */}
      <path
        d="M13 22c-3.4 7-3 15 1.2 21.4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M51 22c3.4 7 3 15-1.2 21.4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.85"
      />
      {[26, 32, 38].map((y, i) => (
        <g key={y} opacity={0.8 - i * 0.08}>
          <path
            d={`M12.6 ${y}c-3.6-1.4-6 0-6.4 2.8 2.8 1.4 5.4.4 6.4-2.8z`}
            fill="currentColor"
          />
          <path
            d={`M51.4 ${y}c3.6-1.4 6 0 6.4 2.8-2.8 1.4-5.4.4-6.4-2.8z`}
            fill="currentColor"
          />
        </g>
      ))}

      <Emblem y={32} s={0.9} />
    </Plate>
  );
}

/** Data — a scrying orb, with a struck highlight. */
export function CrestData({ className }: CrestProps) {
  return (
    <Plate id="c-data" className={className}>
      <circle cx="32" cy="27" r="16" fill="currentColor" opacity="0.1" />
      <circle cx="32" cy="27" r="16" fill="url(#c-data-x)" />
      <circle cx="32" cy="27" r="16" stroke="currentColor" strokeWidth="1.7" />

      {/* Equator and meridian, suggesting a sphere */}
      <ellipse
        cx="32"
        cy="27"
        rx="16"
        ry="5.6"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.55"
      />
      <ellipse
        cx="32"
        cy="27"
        rx="6.4"
        ry="16"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.4"
      />

      {/* Specular highlight — an engraver leaves this blank */}
      <path
        d="M23 19c2-3.4 5-5.4 8.4-5.8-2.6 1.6-4.6 3.6-6 6.4-.8 1.6-2.4 1.2-2.4-.6z"
        fill="currentColor"
        opacity="0.5"
      />

      {/* Stand: curved bracket, then a swelling foot */}
      <path
        d="M22 43.5c3.6 2.6 16.4 2.6 20 0-1.4 3.4-3.4 5.2-4.6 6.5h-10.8c-1.2-1.3-3.2-3.1-4.6-6.5z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M20.5 51c3-1.4 20-1.4 23 0 1 .6 1 2.6-1 2.6h-21c-2 0-2-2-1-2.6z"
        fill="currentColor"
      />

      <Emblem y={27} s={0.9} />
    </Plate>
  );
}

/** Design — an open codex with a quill laid across it. */
export function CrestDesign({ className }: CrestProps) {
  return (
    <Plate id="c-design" className={className}>
      {/* Left leaf, curling at the fore-edge */}
      <path
        d="M8 21c7-4.4 14.6-4.4 22 0v25c-7.4-4.4-15-4.4-22 0z"
        fill="currentColor"
        opacity="0.1"
      />
      <path
        d="M8 21c7-4.4 14.6-4.4 22 0v25c-7.4-4.4-15-4.4-22 0z"
        fill="url(#c-design-h)"
      />
      <path
        d="M8 21c7-4.4 14.6-4.4 22 0v25c-7.4-4.4-15-4.4-22 0z"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      {/* Right leaf */}
      <path
        d="M56 21c-7-4.4-14.6-4.4-22 0v25c7.4-4.4 15-4.4 22 0z"
        fill="currentColor"
        opacity="0.07"
      />
      <path
        d="M56 21c-7-4.4-14.6-4.4-22 0v25c7.4-4.4 15-4.4 22 0z"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      {/* Spine */}
      <path
        d="M32 19.4c.9 0 1.4.7 1.4 1.6v25c0 .9-.5 1.6-1.4 1.6s-1.4-.7-1.4-1.6V21c0-.9.5-1.6 1.4-1.6z"
        fill="currentColor"
      />

      {/* Ruled lines, shortening down the page */}
      {[27, 31, 35].map((y, i) => (
        <g key={y} opacity={0.45 - i * 0.07}>
          <path
            d={`M13 ${y}h${13 - i * 2}`}
            stroke="currentColor"
            strokeWidth="0.65"
            strokeLinecap="round"
          />
          <path
            d={`M${38 + i * 2} ${y}h${13 - i * 2}`}
            stroke="currentColor"
            strokeWidth="0.65"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* Quill: barbs as a swelling blade, nib tapering to a point */}
      <path
        d="M58 6c-5.6 3.6-10.4 9.6-13.4 16.6-1 2.4-1.6 4.4-2 6.4 2-1 4-2.2 6-3.6 6-4.4 9.6-10.4 10.6-16.4.2-1.4.6-2.4-1.2-3z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M44.6 28.4l-4.2 5c-.5.6-1.4.6-1.9 0-.5-.5-.4-1.2 0-1.7l4.5-4.6z"
        fill="currentColor"
      />
      <path
        d="M54 11c-3.4 2.6-6.4 6-8.6 9.8"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.5"
      />

      <Emblem x={19} y={33} s={0.72} />
    </Plate>
  );
}

/** Business — an alembic, with vapour rising. */
export function CrestBusiness({ className }: CrestProps) {
  return (
    <Plate id="c-biz" className={className}>
      {/* Neck swells into a bulb — one continuous contour */}
      <path
        d="M27.5 13h9v7.4c0 1.6.3 2.6 1.1 4.2 5.6 10.4 8 15 8.8 19.4 1.2 6.4-3.6 11.4-10.4 11.4h-9c-6.8 0-11.6-5-10.4-11.4.8-4.4 3.2-9 8.8-19.4.8-1.6 1.1-2.6 1.1-4.2z"
        fill="currentColor"
        opacity="0.1"
      />
      <path
        d="M27.5 13h9v7.4c0 1.6.3 2.6 1.1 4.2 5.6 10.4 8 15 8.8 19.4 1.2 6.4-3.6 11.4-10.4 11.4h-9c-6.8 0-11.6-5-10.4-11.4.8-4.4 3.2-9 8.8-19.4.8-1.6 1.1-2.6 1.1-4.2z"
        fill="url(#c-biz-h)"
      />
      <path
        d="M27.5 13h9v7.4c0 1.6.3 2.6 1.1 4.2 5.6 10.4 8 15 8.8 19.4 1.2 6.4-3.6 11.4-10.4 11.4h-9c-6.8 0-11.6-5-10.4-11.4.8-4.4 3.2-9 8.8-19.4.8-1.6 1.1-2.6 1.1-4.2z"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      {/* Lip */}
      <path
        d="M26 12.6c0-.9.6-1.6 1.5-1.6h9c.9 0 1.5.7 1.5 1.6s-.6 1.6-1.5 1.6h-9c-.9 0-1.5-.7-1.5-1.6z"
        fill="currentColor"
      />

      {/* Liquid line, curved as if settled */}
      <path
        d="M18.6 39c8.6 2.6 18.2 2.6 26.8 0"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.6"
      />

      {/* Vapour: two curling wisps of different length */}
      <path
        d="M31 9c2.4-2.2 2.4-4.4 0-6.6"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.6"
        fill="none"
      />
      <path
        d="M37 9c1.8-1.8 1.8-3.4 0-5"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.45"
        fill="none"
      />

      <Emblem y={44} s={0.82} />
    </Plate>
  );
}

/** Security — a warded shield with a blade behind it. */
export function CrestSecurity({ className }: CrestProps) {
  return (
    <Plate id="c-sec" className={className}>
      {/* Blade, behind — tapered to a point */}
      <path d="M32 2l2.4 6.6-2.4 3-2.4-3z" fill="currentColor" opacity="0.9" />
      <path
        d="M29.6 11.6h4.8l-1 34-1.4 3-1.4-3z"
        fill="currentColor"
        opacity="0.55"
      />
      <path
        d="M23 14.6h18c.7 0 1.2.5 1.2 1.2s-.5 1.2-1.2 1.2H23c-.7 0-1.2-.5-1.2-1.2s.5-1.2 1.2-1.2z"
        fill="currentColor"
      />

      {/* Shield over it */}
      <path
        d="M32 15c6.2 1.4 11.6 2.9 15.1 4.5.6 12-.4 20.7-3.3 26.7C40.7 52.3 36.8 56.4 32 59.5c-4.8-3.1-8.7-7.2-11.8-13.3-2.9-6-3.9-14.7-3.3-26.7 3.5-1.6 8.9-3.1 15.1-4.5z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M32 15c6.2 1.4 11.6 2.9 15.1 4.5.6 12-.4 20.7-3.3 26.7C40.7 52.3 36.8 56.4 32 59.5c-4.8-3.1-8.7-7.2-11.8-13.3-2.9-6-3.9-14.7-3.3-26.7 3.5-1.6 8.9-3.1 15.1-4.5z"
        fill="url(#c-sec-x)"
      />
      <path
        d="M32 15c6.2 1.4 11.6 2.9 15.1 4.5.6 12-.4 20.7-3.3 26.7C40.7 52.3 36.8 56.4 32 59.5c-4.8-3.1-8.7-7.2-11.8-13.3-2.9-6-3.9-14.7-3.3-26.7 3.5-1.6 8.9-3.1 15.1-4.5z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <Emblem y={35} s={0.88} />
    </Plate>
  );
}

/** Communication — the messenger owl on a sealed letter. */
export function CrestCommunication({ className }: CrestProps) {
  return (
    <Plate id="c-comm" className={className}>
      {/* Letter, with a softly curved flap */}
      <path
        d="M9 35h46c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2V37c0-1.1.9-2 2-2z"
        fill="currentColor"
        opacity="0.1"
      />
      <path
        d="M9 35h46c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2V37c0-1.1.9-2 2-2z"
        fill="url(#c-comm-h)"
      />
      <path
        d="M9 35h46c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2V37c0-1.1.9-2 2-2z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7.6 36.4C15 42.6 24 47.4 32 47.4s17-4.8 24.4-11"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />

      {/* Owl: body as one closed curve, wider at the shoulders */}
      <path
        d="M32 10c6.6 0 11.4 5.4 11.4 12.6 0 6.6-5 11.4-11.4 11.4s-11.4-4.8-11.4-11.4C20.6 15.4 25.4 10 32 10z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M32 10c6.6 0 11.4 5.4 11.4 12.6 0 6.6-5 11.4-11.4 11.4s-11.4-4.8-11.4-11.4C20.6 15.4 25.4 10 32 10z"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      {/* Ear tufts, asymmetric */}
      <path
        d="M23.4 13.4c-1.4-2.6-2-4.4-1.6-5.6 1.6.6 3 2 4.4 4.2z"
        fill="currentColor"
      />
      <path
        d="M40.6 13c1.6-2.4 2.4-4 2.2-5.2-1.6.4-3.2 1.6-4.8 3.6z"
        fill="currentColor"
        opacity="0.9"
      />

      {/* Facial disc + eyes, left blank so they read as light */}
      <circle cx="27.4" cy="21" r="4" stroke="currentColor" strokeWidth="1" />
      <circle cx="36.6" cy="21" r="4" stroke="currentColor" strokeWidth="1" />
      <circle cx="27.4" cy="21" r="1.9" fill="currentColor" />
      <circle cx="36.6" cy="21" r="1.9" fill="currentColor" />

      {/* Beak */}
      <path d="M32 23.6l-1.8 3.4h3.6z" fill="currentColor" />

      {/* Breast hatching — the owl's markings */}
      <path
        d="M27 29.4c1.6 1.2 3.2 1.8 5 1.8s3.4-.6 5-1.8"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.6"
      />

      <Emblem y={45} s={0.7} />
    </Plate>
  );
}

/** General — the archive volume. */
export function CrestGeneral({ className }: CrestProps) {
  return (
    <Plate id="c-gen" className={className}>
      <path
        d="M14 11h30c2.2 0 4 1.8 4 4v34c0-2.2-1.8-4-4-4H14z"
        fill="currentColor"
        opacity="0.1"
      />
      <path
        d="M14 11h30c2.2 0 4 1.8 4 4v34c0-2.2-1.8-4-4-4H14z"
        fill="url(#c-gen-h)"
      />
      <path
        d="M14 11h30c2.2 0 4 1.8 4 4v34c0-2.2-1.8-4-4-4H14z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M14 45c-2.2 0-4 1.8-4 4s1.8 4 4 4h34"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.75"
      />
      {[21, 27].map((y, i) => (
        <path
          key={y}
          d={`M21 ${y}h${18 - i * 4}`}
          stroke="currentColor"
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity={0.5 - i * 0.1}
        />
      ))}
      <Emblem y={37} s={0.78} />
    </Plate>
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
 * The academy crest: shield, open book, orbit and star, with the E emblem at
 * its heart. Cut the same way as the departments so the family reads as one.
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
        <pattern
          id="ac-h"
          width="2.6"
          height="2.6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(38)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="2.6"
            stroke="var(--gold)"
            strokeWidth="0.6"
            opacity="0.3"
          />
        </pattern>
      </defs>

      {/* Orbit, tilted */}
      <ellipse
        cx="22"
        cy="24"
        rx="19.5"
        ry="8"
        stroke="url(#ac-gold)"
        strokeWidth="0.8"
        opacity="0.45"
        transform="rotate(-22 22 24)"
      />

      {/* Shield: filled, hatched, then contoured */}
      <path
        d="M22 3c4.6 1 8.6 2.1 11.2 3.3.5 8.8-.3 15.3-2.4 19.7-2.3 4.6-5.2 7.6-8.8 9.9-3.6-2.3-6.5-5.3-8.8-9.9-2.1-4.4-2.9-10.9-2.4-19.7C13.4 5.1 17.4 4 22 3z"
        transform="translate(0 4) scale(1 1.25)"
        fill="url(#ac-h)"
      />
      <path
        d="M22 3c6 1.3 11.2 2.8 14.6 4.3.6 11.6-.4 20-3.2 25.8C30.5 39 26.7 43 22 46c-4.7-3-8.5-7-11.4-12.9C7.8 27.3 6.8 18.9 7.4 7.3 10.8 5.8 16 4.3 22 3z"
        stroke="url(#ac-gold)"
        strokeWidth="1.6"
      />

      {/* Open book, leaves curling */}
      <path
        d="M12.6 20.4c3-1.7 6.2-1.7 9.4 0v11.2c-3.2-1.7-6.4-1.7-9.4 0z"
        stroke="url(#ac-gold)"
        strokeWidth="1.15"
      />
      <path
        d="M31.4 20.4c-3-1.7-6.2-1.7-9.4 0v11.2c3.2-1.7 6.4-1.7 9.4 0z"
        stroke="url(#ac-gold)"
        strokeWidth="1.15"
      />
      <path
        d="M22 19.6c.6 0 1 .5 1 1.1v11c0 .6-.4 1.1-1 1.1s-1-.5-1-1.1v-11c0-.6.4-1.1 1-1.1z"
        fill="url(#ac-gold)"
      />

      {/* Star, points swelling */}
      <path
        d="M22 9.6c.7 3.2 1.4 4.6 2.4 5.4 1 .8 2.4 1 4.6 1.3-2.2.3-3.6.5-4.6 1.3-1 .8-1.7 2.2-2.4 5.4-.7-3.2-1.4-4.6-2.4-5.4-1-.8-2.4-1-4.6-1.3 2.2-.3 3.6-.5 4.6-1.3 1-.8 1.7-2.2 2.4-5.4z"
        fill="url(#ac-gold)"
      />
    </svg>
  );
}
