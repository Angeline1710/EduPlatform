import { formatPrice } from "@/lib/format";

/**
 * Thirty-day captured-revenue bars.
 *
 * Drawn as flex columns rather than a chart library — one dependency saved
 * and it inherits the theme tokens for free. Every day is present, so quiet
 * days read as genuine gaps instead of being skipped.
 */
export default function RevenueChart({
  series,
}: {
  series: { date: string; amount: number }[];
}) {
  const max = Math.max(...series.map((d) => d.amount), 1);
  const total = series.reduce((s, d) => s + d.amount, 0);
  const best = series.reduce(
    (a, b) => (b.amount > a.amount ? b : a),
    series[0],
  );

  const fmtDay = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return (
    <div className="rounded-sm border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-serif text-lg font-bold text-[var(--text)]">
          Last 30 days
        </h3>
        <p className="text-sm text-[var(--text-muted)]">
          <span className="font-serif text-xl font-bold text-[var(--gold)]">
            {formatPrice(total)}
          </span>{" "}
          captured
        </p>
      </div>

      <div
        className="flex h-32 items-end gap-[3px]"
        role="img"
        aria-label={`Daily captured revenue for the last 30 days, totalling ${formatPrice(total)}`}
      >
        {series.map((d) => {
          const pct = (d.amount / max) * 100;
          return (
            <div
              key={d.date}
              className="group relative flex-1"
              style={{ height: "100%" }}
            >
              <div
                className="absolute bottom-0 w-full rounded-t-[2px] bg-[var(--surface-2)]"
                style={{ height: "100%" }}
              />
              <div
                className="absolute bottom-0 w-full rounded-t-[2px] bg-gradient-to-t from-[var(--gold-dim)] to-[var(--gold)] transition-all duration-500"
                style={{ height: `${Math.max(pct, d.amount > 0 ? 4 : 0)}%` }}
              />
              {/* Tooltip on hover */}
              <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-sm border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[11px] shadow-[var(--shadow-lift)] group-hover:block">
                <span className="font-semibold text-[var(--text)]">
                  {formatPrice(d.amount)}
                </span>
                <span className="text-[var(--text-faint)]">
                  {" "}
                  · {fmtDay(d.date)}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex justify-between text-[11px] text-[var(--text-faint)]">
        <span>{fmtDay(series[0].date)}</span>
        {best.amount > 0 && <span>Best day {formatPrice(best.amount)}</span>}
        <span>{fmtDay(series[series.length - 1].date)}</span>
      </div>
    </div>
  );
}
