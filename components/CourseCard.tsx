import Link from "next/link";
import Icon from "@/components/Icon";
import { categoryTheme } from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import { HexTile } from "@/components/Ornament";

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
      className="group relative flex gap-4 rounded-sm border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)] hover:shadow-[var(--shadow-lift)]"
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

      <HexTile from={theme.from} to={theme.to} icon={theme.icon} size={58} />

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
  );
}
