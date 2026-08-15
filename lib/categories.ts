/**
 * Each category carries its own accent so course cards read as a set of
 * distinct subjects at a glance. `from`/`to` drive the icon tile gradient;
 * `text` is the price/label colour and is picked to stay legible on both
 * the light and dark surface tokens.
 */
export type CategoryKey =
  | "Development"
  | "Data"
  | "Design"
  | "Business"
  | "Security"
  | "Communication"
  | "General";

type CategoryTheme = {
  from: string;
  to: string;
  text: string;
  textDark: string;
  icon: string;
};

export const CATEGORIES: Record<CategoryKey, CategoryTheme> = {
  Development: {
    from: "#8b5cf6",
    to: "#6366f1",
    text: "#6d3ded",
    textDark: "#a78bfa",
    icon: "code",
  },
  Data: {
    from: "#10b981",
    to: "#059669",
    text: "#047857",
    textDark: "#34d399",
    icon: "chart",
  },
  Design: {
    from: "#ec4899",
    to: "#f43f5e",
    text: "#db2777",
    textDark: "#f472b6",
    icon: "palette",
  },
  Business: {
    from: "#f59e0b",
    to: "#f97316",
    text: "#c2410c",
    textDark: "#fbbf24",
    icon: "megaphone",
  },
  Security: {
    from: "#0ea5e9",
    to: "#0284c7",
    text: "#0369a1",
    textDark: "#38bdf8",
    icon: "shield",
  },
  Communication: {
    from: "#14b8a6",
    to: "#0d9488",
    text: "#0f766e",
    textDark: "#2dd4bf",
    icon: "chat",
  },
  General: {
    from: "#64748b",
    to: "#475569",
    text: "#475569",
    textDark: "#94a3b8",
    icon: "book",
  },
};

export const CATEGORY_NAMES = Object.keys(CATEGORIES) as CategoryKey[];

export function categoryTheme(name: string): CategoryTheme {
  return CATEGORIES[name as CategoryKey] ?? CATEGORIES.General;
}
