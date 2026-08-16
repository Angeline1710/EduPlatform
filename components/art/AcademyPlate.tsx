import EngravingDefs from "./EngravingDefs";

/**
 * The academy, drawn as an engraved plate.
 *
 * Deliberately not built from rectangles. Every roof is an arc, every tree a
 * closed bezier, every hill a curve — because straight-edged primitives are
 * what made the previous version read as machine-drawn. Tone comes from
 * hatch density rather than flat fills, and the composition is asymmetric on
 * purpose: a mirrored building looks stamped.
 */
export default function AcademyPlate({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 380"
      className={className}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <EngravingDefs idPrefix="plate" />

      {/* ---------------- Sky ---------------- */}
      <g className="text-[#3A1825]">
        <rect width="520" height="290" fill="url(#plate-sky)" />
        {/* Stippled upper sky, thinning toward the horizon */}
        <rect width="520" height="150" fill="url(#plate-stipple)" opacity="0.5" />
      </g>

      {/* Moon, low and off-centre */}
      <g>
        <circle cx="404" cy="74" r="46" fill="url(#plate-glow)" />
        <circle cx="404" cy="74" r="21" fill="#F4EFE7" opacity="0.9" />
        {/* Craters, uneven — a clean disc looks printed */}
        <circle cx="398" cy="68" r="4.5" fill="#D8CFC6" opacity="0.55" />
        <circle cx="409" cy="80" r="3" fill="#D8CFC6" opacity="0.45" />
        <circle cx="411" cy="66" r="2.2" fill="#D8CFC6" opacity="0.4" />
      </g>

      {/* Cloud bands, drawn as long shallow curves */}
      <g stroke="#F4EFE7" fill="none" opacity="0.22" strokeLinecap="round">
        <path d="M40 96c34-13 62 6 96-3 27-7 44-17 72-11" strokeWidth="1.1" />
        <path d="M300 122c30-10 56 4 84-4 22-6 38-14 62-9" strokeWidth="0.9" opacity="0.7" />
        <path d="M12 140c40-11 70 8 108-2" strokeWidth="0.7" opacity="0.5" />
      </g>

      {/* Constellation, faint */}
      <g stroke="#E4BD68" fill="#E4BD68" opacity="0.4">
        <path d="M96 44l30 18 26-9 22 22" strokeWidth="0.45" fill="none" strokeDasharray="1.5 4" />
        <circle cx="96" cy="44" r="1.5" />
        <circle cx="126" cy="62" r="1.1" />
        <circle cx="152" cy="53" r="1.3" />
        <circle cx="174" cy="75" r="1" />
      </g>

      {/* ---------------- Distant ridge ---------------- */}
      <g className="text-[#2A1428]">
        <path
          d="M0 214c46-30 78-14 116-38 30-19 54-8 84-30 26-19 52-6 78-22 30-18 60-4 90-20 26-14 40-6 52-14v138H0z"
          fill="#2A1428"
          opacity="0.75"
        />
        <path
          d="M0 214c46-30 78-14 116-38 30-19 54-8 84-30 26-19 52-6 78-22 30-18 60-4 90-20 26-14 40-6 52-14v138H0z"
          fill="url(#plate-hatch-light)"
          opacity="0.5"
        />
      </g>

      {/* ---------------- The observatory tower (left, tall) ---------------- */}
      <g className="text-[#1B1019]">
        {/* Shaft — slightly tapered, not a rectangle */}
        <path
          d="M104 300c-1-38 1-76 4-114 1-9 3-16 10-16s9 7 10 16c3 38 5 76 4 114z"
          fill="#3A1825"
        />
        <path
          d="M104 300c-1-38 1-76 4-114 1-9 3-16 10-16s9 7 10 16c3 38 5 76 4 114z"
          fill="url(#plate-hatch-mid)"
          opacity="0.55"
        />
        {/* Dome — a true arc */}
        <path
          d="M100 172c0-22 8-34 18-34s18 12 18 34c-6-4-12-6-18-6s-12 2-18 6z"
          fill="#542638"
        />
        <path
          d="M100 172c0-22 8-34 18-34s18 12 18 34c-6-4-12-6-18-6s-12 2-18 6z"
          fill="url(#plate-hatch-light)"
          opacity="0.6"
        />
        {/* Telescope slit, angled */}
        <path d="M112 142c4-3 9-3 13 0l-5 24h-4z" fill="#1B1019" opacity="0.85" />
        {/* Finial */}
        <path d="M118 130v-12M113 122h10" stroke="#C99632" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="118" cy="116" r="2.4" fill="#E4BD68" />
      </g>

      {/* ---------------- The great hall (centre) ---------------- */}
      <g>
        {/* Body, with a subtle batter to the walls */}
        <path d="M196 300c-2-44-1-70 0-92h128c1 22 2 48 0 92z" fill="#3A1825" />
        <path d="M196 300c-2-44-1-70 0-92h128c1 22 2 48 0 92z" fill="url(#plate-hatch-mid)" opacity="0.5" />

        {/* Gable roof as a shallow curve rather than a triangle */}
        <path d="M190 208c22-34 44-52 70-52s48 18 70 52c-24-8-46-11-70-11s-46 3-70 11z" fill="#542638" />
        <path d="M190 208c22-34 44-52 70-52s48 18 70 52c-24-8-46-11-70-11s-46 3-70 11z" fill="url(#plate-hatch-dark)" opacity="0.45" />

        {/* Arched entrance — the light source of the whole plate */}
        <path d="M246 300v-38c0-8 6-14 14-14s14 6 14 14v38z" fill="#E4BD68" opacity="0.92" filter="url(#plate-bloom)" />
        <path d="M246 300v-38c0-8 6-14 14-14s14 6 14 14v38z" fill="none" stroke="#C99632" strokeWidth="1.1" />
        <path d="M260 248v52" stroke="#8A5A18" strokeWidth="0.8" opacity="0.5" />

        {/* Rose window */}
        <circle cx="260" cy="226" r="13" fill="#E4BD68" opacity="0.8" filter="url(#plate-bloom)" />
        <circle cx="260" cy="226" r="13" fill="none" stroke="#C99632" strokeWidth="1" />
        <path
          d="M260 213v26M247 226h26M251 217l18 18M269 217l-18 18"
          stroke="#8A5A18"
          strokeWidth="0.7"
          opacity="0.7"
        />

        {/* Lancet windows, hand-spaced not on a grid */}
        {[
          { x: 212, y: 240, h: 20 },
          { x: 228, y: 244, h: 17 },
          { x: 292, y: 243, h: 18 },
          { x: 308, y: 240, h: 20 },
        ].map((w, i) => (
          <path
            key={i}
            d={`M${w.x} ${w.y + w.h}v-${w.h - 5}c0-4 3-6 5-6s5 2 5 6v${w.h - 5}z`}
            fill="#E4BD68"
            opacity="0.75"
            className="animate-flicker"
            style={{ animationDelay: `${i * 0.9}s` }}
          />
        ))}
      </g>

      {/* ---------------- Library wing (right, lower) ---------------- */}
      <g>
        <path d="M336 300c-1-30 0-46 1-62h92c1 16 2 32 1 62z" fill="#3A1825" />
        <path d="M336 300c-1-30 0-46 1-62h92c1 16 2 32 1 62z" fill="url(#plate-hatch-light)" opacity="0.6" />
        {/* Curved eaves */}
        <path d="M330 238c20-22 40-32 52-32s32 10 52 32c-20-6-36-8-52-8s-32 2-52 8z" fill="#542638" />
        {[352, 372, 396, 416].map((x, i) => (
          <path
            key={x}
            d={`M${x} 282v-16c0-3 2-5 4-5s4 2 4 5v16z`}
            fill="#E4BD68"
            opacity="0.65"
            className="animate-flicker"
            style={{ animationDelay: `${0.4 + i * 0.7}s` }}
          />
        ))}
      </g>

      {/* ---------------- Light shafts from the door ---------------- */}
      <g opacity="0.5">
        <path d="M250 300l-40 66h100l-36-66z" fill="url(#plate-shaft)" transform="rotate(180 260 333)" />
      </g>

      {/* ---------------- Trees: closed beziers, no triangles ---------------- */}
      <g>
        {/* Left cluster */}
        <path
          d="M62 300c-14-4-22-16-20-30 1-9 7-15 6-24-1-11 6-20 16-20s17 9 16 20c-1 9 5 15 6 24 2 14-6 26-20 30z"
          fill="#241026"
        />
        <path d="M64 300v-34" stroke="#1B1019" strokeWidth="2.4" strokeLinecap="round" />
        <path
          d="M62 300c-14-4-22-16-20-30 1-9 7-15 6-24-1-11 6-20 16-20s17 9 16 20c-1 9 5 15 6 24 2 14-6 26-20 30z"
          fill="url(#plate-cross)"
          opacity="0.3"
          className="text-[#0F0710]"
        />

        {/* Right cluster, different silhouette */}
        <path
          d="M470 300c-16-6-24-20-20-34 3-10 9-14 9-24 0-12 8-20 17-20s17 8 17 20c0 10 6 14 9 24 4 14-4 28-20 34z"
          fill="#241026"
        />
        <path d="M476 300v-38" stroke="#1B1019" strokeWidth="2.6" strokeLinecap="round" />

        {/* Small sapling, breaks the symmetry */}
        <path
          d="M164 300c-9-3-14-11-12-19 1-6 4-9 4-15 0-7 4-12 10-12s10 5 10 12c0 6 3 9 4 15 2 8-3 16-12 19z"
          fill="#2A1428"
          opacity="0.9"
        />
      </g>

      {/* ---------------- Ground, curved not flat ---------------- */}
      <path
        d="M0 300c62 6 118-4 178 1 54 5 96 8 152 3 54-5 118-8 190-4v80H0z"
        fill="#1B1019"
      />
      <path
        d="M0 300c62 6 118-4 178 1 54 5 96 8 152 3 54-5 118-8 190-4v80H0z"
        fill="url(#plate-hatch-dark)"
        opacity="0.35"
        className="text-[#0F0710]"
      />

      {/* Path leading to the door, tapering with distance */}
      <path
        d="M238 380c4-30 12-56 20-80h4c8 24 16 50 20 80z"
        fill="#3A1825"
        opacity="0.65"
      />
      <path
        d="M238 380c4-30 12-56 20-80h4c8 24 16 50 20 80z"
        fill="url(#plate-stipple)"
        opacity="0.5"
        className="text-[#E4BD68]"
      />

      {/* ---------------- Mist at the base ---------------- */}
      <path
        d="M0 286c70 10 120-6 190 2 58 7 104 10 168 2 60-8 120-6 162 0v34H0z"
        fill="url(#plate-mist)"
        className="plate-mist"
      />

      {/* ---------------- Birds: three curved strokes ---------------- */}
      <g stroke="#F4EFE7" fill="none" opacity="0.5" strokeLinecap="round" strokeWidth="1.1">
        <path d="M148 106c4-5 8-5 11 0M159 106c4-5 8-5 11 0" className="bird-drift" />
        <path
          d="M186 88c3-4 6-4 8 0M194 88c3-4 6-4 8 0"
          opacity="0.7"
          className="bird-drift"
          style={{ animationDelay: "2.4s" }}
        />
      </g>

      {/* Plate grain over everything */}
      <rect width="520" height="380" filter="url(#plate-grain)" opacity="0.5" pointerEvents="none" />
    </svg>
  );
}
