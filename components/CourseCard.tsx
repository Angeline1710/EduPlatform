import Link from "next/link";
import Icon from "@/components/Icon";
import { categoryTheme } from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import { DepartmentCrest } from "@/components/Crests";
import HoverCard from "@/components/magic/HoverCard";

type CourseCardProps = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  lessonCount: number;
  /** Optional admin-supplied GIF, shown in place of the crest. */
  gifUrl?: string | null;
};

export default function CourseCard({
  id,
  title,
  description,
  price,
  category,
  lessonCount,
  gifUrl,
}: CourseCardProps) {
  const theme = categoryTheme(category);

  return (
    <HoverCard className="h-full">
      <Link
        href={`/courses/${id}`}
        className="group relative flex h-full gap-4 rounded-sm border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] transition-colors duration-300 hover:border-[var(--gold)]"
      >
      {/* Gold corner ticks appear on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-[var(--gold)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-[var(--gold)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {gifUrl ? (
        /* Admin-supplied GIF replaces the crest. Plain <img>: the URL is
           arbitrary, so it cannot go through the optimiser's allowlist. */
        <span className="mt-0.5 block h-12 w-12 shrink-0 overflow-hidden rounded-md border border-[var(--gold)] shadow-[0_0_10px_var(--academy-glow)] transition-transform duration-500 group-hover:scale-110">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={gifUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
        </span>
      ) : (
        /* Department crest. Uses the readable ink role, not the gradient hue,
           so the mark holds up on parchment as well as plum. */
        <span
          className="accent mt-0.5 shrink-0 transition-transform duration-500 group-hover:scale-110"
          style={
            {
              "--accent-light": theme.ink,
              "--accent-dark": theme.inkDark,
            } as React.CSSProperties
          }
        >
          <DepartmentCrest name={category} className="h-12 w-12" />
        </span>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Bookmark sits opposite the title, as in the reference */}
        <span
          aria-hidden="true"
          className="absolute right-4 top-4 text-[var(--text-faint)] transition-colors duration-300 group-hover:text-[var(--gold)]"
        >
          <Icon name="bookmark" className="h-[18px] w-[18px]" />
        </span>

        <h3 className="mb-1.5 max-w-[85%] font-serif text-[17px] font-bold leading-snug text-[var(--text)]">
          {title}
        </h3>

        <p className="mb-4 line-clamp-3 flex-1 text-[13.5px] leading-relaxed text-[var(--text-muted)]">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <span className="font-serif text-[19px] font-bold text-[var(--brand)] transition-colors group-hover:text-[var(--gold-dim)]">
            {formatPrice(price)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-faint)]">
            <Icon name="clock" className="h-3.5 w-3.5" />
            {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
          </span>
        </div>
      </div>
      </Link>
    </HoverCard>
  );
}
