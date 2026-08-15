import Link from "next/link";
import Icon from "@/components/Icon";
import { categoryTheme } from "@/lib/categories";
import { formatPrice } from "@/lib/format";

type CourseCardProps = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  lessonCount: number;
};

export default function CourseCard({
  id,
  title,
  description,
  price,
  category,
  lessonCount,
}: CourseCardProps) {
  const theme = categoryTheme(category);

  return (
    <Link
      href={`/courses/${id}`}
      className="focus-ring group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:border-[var(--glow)] hover:shadow-lg lift"
    >
      {/* Magical glow background on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-0"
        style={{
          background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
        }}
      />

      <div className="relative z-10 flex gap-4">
        {/* Hexagonal-style icon with glow */}
        <div className="shrink-0 relative">
          <span
            className="grid h-16 w-16 place-items-center rounded-2xl text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
              boxShadow: `0 0 16px ${theme.from}40, 0 4px 12px ${theme.from}30`,
            }}
          >
            <Icon name={theme.icon} className="h-7 w-7" />
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-faint)] group-hover:text-[var(--brand)] transition">
            {category}
          </span>
          <h3 className="mb-2 font-bold leading-snug text-[var(--text)] group-hover:text-[var(--brand)] transition">
            {title}
          </h3>
          <p className="mb-5 line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
            {description}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] group-hover:border-[var(--glow)] transition">
            <span
              className="text-lg font-bold glow-text"
              style={
                {
                  "--accent-light": theme.text,
                  "--accent-dark": theme.textDark,
                } as React.CSSProperties
              }
            >
              {formatPrice(price)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-faint)] group-hover:text-[var(--brand)] transition">
              <Icon name="clock" className="h-4 w-4" />
              {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
