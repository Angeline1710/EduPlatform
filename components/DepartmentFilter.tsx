import Link from "next/link";
import { DepartmentCrest } from "@/components/Crests";
import { categoryTheme } from "@/lib/categories";

/**
 * "Academy Departments" — the category filter.
 *
 * These are ordinary links, so filtering stays server-driven and shareable
 * by URL exactly as before; only the presentation changed.
 */
export default function DepartmentFilter({
  categories,
  active,
}: {
  categories: string[];
  active: string;
}) {
  const items = [{ name: "All", href: "/" }, ...categories.map((c) => ({
    name: c,
    href: `/?category=${encodeURIComponent(c)}`,
  }))];

  return (
    <ul
      id="categories"
      className="flex flex-wrap justify-center gap-3 sm:gap-4"
      aria-label="Academy departments"
    >
      {items.map((item, i) => {
        const isActive = item.name === "All" ? !active : active === item.name;
        const theme = categoryTheme(item.name);
        const isAll = item.name === "All";

        // Selected cards sit on plum and always take gold. Unselected cards
        // sit on a surface that flips with the theme, so they use the .accent
        // mechanism with the readable ink roles rather than the gradient hue.
        const inkVars = {
          "--accent-light": isAll ? "var(--gold-dim)" : theme.ink,
          "--accent-dark": isAll ? "var(--gold-bright)" : theme.inkDark,
        } as React.CSSProperties;

        return (
          <li
            key={item.name}
            style={{
              animation: `fade-up var(--t-emphasis) var(--ease-academy) ${i * 0.05}s both`,
            }}
          >
            <Link
              href={item.href}
              aria-current={isActive ? "true" : undefined}
              className="group relative block w-[104px] focus-visible:outline-none sm:w-[116px]"
            >
              <div
                className={`cartouche flex flex-col items-center gap-2 px-3 py-5 transition-all group-hover:-translate-y-1 ${
                  isActive ? "shadow-[var(--shadow-lift)]" : "shadow-[var(--shadow-card)]"
                }`}
                style={{
                  background: isActive ? "var(--academy-plum)" : "var(--surface)",
                  border: `1px solid ${isActive ? "var(--gold)" : "var(--border)"}`,
                }}
              >
                <span
                  className={`transition-transform duration-500 group-hover:scale-110 ${
                    isActive ? "" : "accent"
                  }`}
                  style={isActive ? { color: "var(--gold-bright)" } : inkVars}
                >
                  <DepartmentCrest name={item.name} className="h-11 w-11" />
                </span>

                <span
                  className={`font-serif text-[13px] font-bold leading-tight ${
                    isActive ? "" : "accent"
                  }`}
                  style={isActive ? { color: "var(--gold-bright)" } : inkVars}
                >
                  {item.name}
                </span>

                {/* Underline jewel */}
                <span
                  aria-hidden="true"
                  className={`flex items-center gap-1.5 ${isActive ? "" : "accent"}`}
                  style={isActive ? { color: "var(--gold)" } : inkVars}
                >
                  <span className="h-px w-5 bg-current opacity-55 transition-all duration-300 group-hover:w-7" />
                  <span className="h-1.5 w-1.5 rotate-45 bg-current transition-transform duration-300 group-hover:scale-125" />
                  <span className="h-px w-5 bg-current opacity-55 transition-all duration-300 group-hover:w-7" />
                </span>

                <span className="cartouche-rule" aria-hidden="true" />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
