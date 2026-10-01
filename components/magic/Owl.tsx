/** The academy's white messenger owl, drawn small enough to perch on a row. */
export default function Owl({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="owl-perch"
    >
      {/* Wings, folded */}
      <path
        d="M8 15c-1.6 2.4-2 5.4-1 8.2 1.4-.6 2.6-1.8 3.4-3.4M24 15c1.6 2.4 2 5.4 1 8.2-1.4-.6-2.6-1.8-3.4-3.4"
        fill="#EDE7E0"
        stroke="#CFC6BD"
        strokeWidth="0.7"
        className="owl-wing"
      />

      {/* Body */}
      <path
        d="M16 6c-5 0-8.4 4.2-8.4 9.6 0 4.6 3.6 8.4 8.4 8.4s8.4-3.8 8.4-8.4C24.4 10.2 21 6 16 6z"
        fill="#F7F4F0"
        stroke="#D8D0C8"
        strokeWidth="0.8"
      />

      {/* Ear tufts */}
      <path
        d="M9.6 9.4L7.4 5.6l4 1.6zM22.4 9.4l2.2-3.8-4 1.6z"
        fill="#F7F4F0"
        stroke="#D8D0C8"
        strokeWidth="0.7"
      />

      {/* Eyes — the blink is driven by CSS */}
      <circle
        cx="12.4"
        cy="13.4"
        r="3.4"
        fill="#FFFFFF"
        stroke="#D8D0C8"
        strokeWidth="0.6"
      />
      <circle
        cx="19.6"
        cy="13.4"
        r="3.4"
        fill="#FFFFFF"
        stroke="#D8D0C8"
        strokeWidth="0.6"
      />
      <circle cx="12.4" cy="13.4" r="1.7" fill="#2A1428" className="owl-eye" />
      <circle cx="19.6" cy="13.4" r="1.7" fill="#2A1428" className="owl-eye" />

      {/* Beak */}
      <path d="M16 15.4l-1.5 2.6h3z" fill="var(--gold)" />

      {/* Breast markings */}
      <path
        d="M13 19.5c1 .7 2 1 3 1s2-.3 3-1"
        stroke="#DCD4CC"
        strokeWidth="0.7"
        strokeLinecap="round"
      />

      {/* Talons gripping the row */}
      <path
        d="M13.6 24v2M16 24.2v2.2M18.4 24v2"
        stroke="var(--gold-dim)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
