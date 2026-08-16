import { AcademyCrest } from "@/components/Crests";

/**
 * A scholar's likeness.
 *
 * Falls back to their initial rather than a generic silhouette, so a record
 * without a picture still looks deliberate. The image is a plain <img>: the
 * URL is arbitrary user input and cannot be added to the optimiser's host
 * allowlist ahead of time.
 */
export default function Avatar({
  name,
  src,
  size = 80,
  ring = true,
}: {
  name: string;
  src?: string | null;
  size?: number;
  ring?: boolean;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <span
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--surface-2)] ${
        ring ? "border-2 border-[var(--gold)] shadow-[0_0_18px_var(--academy-glow)]" : ""
      }`}
      style={{ width: size, height: size }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <>
          {/* A faint crest behind the initial, so the fallback still belongs
              to the academy rather than looking like a missing asset. */}
          <span className="absolute inset-0 grid place-items-center text-[var(--gold)] opacity-15">
            <AcademyCrest size={size * 0.7} />
          </span>
          <span
            className="relative font-serif font-bold text-[var(--brand)]"
            style={{ fontSize: size * 0.4 }}
          >
            {initial}
          </span>
        </>
      )}
    </span>
  );
}
