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
      className="focus-ring group relative flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-lift)]"
    >
      <span
        className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white shadow-md transition duration-200 group-hover:scale-105"
        style={{ backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
      >
        <Icon name={theme.icon} className="h-6 w-6" />
      </span>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">
          {category}
        </span>
        <h3 className="mb-1.5 font-bold leading-snug text-[var(--text)]">{title}</h3>
        <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <span
            className="accent text-lg font-bold"
            style={
              {
                "--accent-light": theme.text,
                "--accent-dark": theme.textDark,
              } as React.CSSProperties
            }
          >
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
