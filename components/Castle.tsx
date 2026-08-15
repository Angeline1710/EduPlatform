/**
 * The academy: a spired hall on a rise of books, under an arcane ring.
 * Windows flicker on independent delays so the building reads as inhabited.
 */
export default function Castle({ className = "" }: { className?: string }) {
  // Deterministic window placement — no randomness, so SSR and client match.
  const windows = [
    { x: 176, y: 150, w: 7, h: 11, d: 0 },
    { x: 190, y: 148, w: 7, h: 11, d: 1.1 },
    { x: 204, y: 150, w: 7, h: 11, d: 2.3 },
    { x: 164, y: 176, w: 8, h: 13, d: 0.6 },
    { x: 180, y: 174, w: 8, h: 13, d: 1.7 },
    { x: 196, y: 174, w: 8, h: 13, d: 0.3 },
    { x: 212, y: 176, w: 8, h: 13, d: 2.8 },
    { x: 128, y: 186, w: 7, h: 11, d: 1.4 },
    { x: 248, y: 186, w: 7, h: 11, d: 2.1 },
    { x: 116, y: 214, w: 6, h: 10, d: 0.9 },
    { x: 260, y: 214, w: 6, h: 10, d: 1.9 },
  ];

  return (
    <svg
      viewBox="0 0 384 300"
      className={className}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id="cst-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b3a63" />
          <stop offset="100%" stopColor="#311c38" />
        </linearGradient>
        <linearGradient id="cst-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6d4576" />
          <stop offset="100%" stopColor="#3d2145" />
        </linearGradient>
        <linearGradient id="cst-book" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8a5a2b" />
          <stop offset="100%" stopColor="#c08a3e" />
        </linearGradient>
        <radialGradient id="cst-halo" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#f0d089" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#f0d089" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cst-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0d089" />
          <stop offset="100%" stopColor="#a87c33" />
        </linearGradient>
      </defs>

      {/* Warm halo behind the hall */}
      <circle cx="192" cy="170" r="130" fill="url(#cst-halo)" />

      {/* Arcane ring */}
      <g stroke="url(#cst-gold)" opacity="0.5">
        <circle cx="192" cy="150" r="118" strokeWidth="1" strokeDasharray="2 7" />
        <circle cx="192" cy="150" r="104" strokeWidth="0.7" />
      </g>

      {/* Side towers */}
      <path d="M112 200h28v66h-28z" fill="url(#cst-stone)" />
      <path d="M126 150l18 34h-36z" fill="url(#cst-roof)" />
      <path d="M244 200h28v66h-28z" fill="url(#cst-stone)" />
      <path d="M258 150l18 34h-36z" fill="url(#cst-roof)" />

      {/* Main hall */}
      <path d="M152 168h80v98h-80z" fill="url(#cst-stone)" />
      <path d="M192 108l34 60h-68z" fill="url(#cst-roof)" />

      {/* Flanking spires */}
      <path d="M160 140h16v28h-16z" fill="url(#cst-stone)" />
      <path d="M168 112l11 28h-22z" fill="url(#cst-roof)" />
      <path d="M208 140h16v28h-16z" fill="url(#cst-stone)" />
      <path d="M216 112l11 28h-22z" fill="url(#cst-roof)" />

      {/* Finials */}
      <g fill="url(#cst-gold)">
        <path d="M192 100l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" />
        <circle cx="126" cy="146" r="2.4" />
        <circle cx="258" cy="146" r="2.4" />
      </g>

      {/* Clock face on the gable */}
      <circle cx="192" cy="196" r="12" stroke="url(#cst-gold)" strokeWidth="1.4" />
      <path d="M192 189v7l5 3" stroke="url(#cst-gold)" strokeWidth="1.4" strokeLinecap="round" />

      {/* Lit windows */}
      <g>
        {windows.map((w, i) => (
          <rect
            key={i}
            x={w.x}
            y={w.y}
            width={w.w}
            height={w.h}
            rx={w.w / 2}
            fill="#f6d68f"
            className="animate-flicker"
            style={{ animationDelay: `${w.d}s` }}
          />
        ))}
      </g>

      {/* Grand door, glowing */}
      <path
        d="M182 266v-26a10 10 0 0 1 20 0v26z"
        fill="#f6d68f"
        opacity="0.9"
        className="animate-flicker"
        style={{ animationDelay: "0.4s" }}
      />

      {/* Steps */}
      <path d="M168 266h48v5h-48zM162 271h60v5h-60zM156 276h72v6h-72z" fill="#4a2b52" />

      {/* Stack of tomes the hall rests upon */}
      <g>
        <rect x="86" y="278" width="104" height="12" rx="2" fill="url(#cst-book)" />
        <rect x="96" y="266" width="88" height="12" rx="2" fill="#7a4a86" />
        <rect x="198" y="278" width="100" height="12" rx="2" fill="#7a4a86" />
        <rect x="206" y="266" width="84" height="12" rx="2" fill="url(#cst-book)" />
        <path
          d="M90 284h96M100 272h80M202 284h92M210 272h76"
          stroke="#f0d089"
          strokeWidth="0.7"
          opacity="0.55"
        />
      </g>

      {/* Armillary globe on its stand */}
      <g stroke="url(#cst-gold)" strokeWidth="1.3">
        <circle cx="70" cy="242" r="20" />
        <ellipse cx="70" cy="242" rx="20" ry="8" />
        <ellipse cx="70" cy="242" rx="8" ry="20" />
        <path d="M70 262v14M60 276h20" strokeLinecap="round" />
      </g>

      {/* Conifers */}
      <g fill="#2f1c3a">
        <path d="M318 276l-15-30-15 30zM318 258l-15-28-15 28z" />
        <path d="M352 276l-12-24-12 24zM352 262l-12-22-12 22z" />
        <path d="M58 276l-13-26-13 26z" />
      </g>

      {/* Ground line */}
      <path d="M0 290h384" stroke="url(#cst-gold)" strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
}
