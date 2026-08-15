/**
 * Each department carries its own jewel accent so courses read as a set of
 * distinct subjects at a glance.
 *
 * Two colour roles, and they are not interchangeable:
 *   from/to — decorative gradients only (tiles, washes)
 *   ink/inkDark — anything a reader must actually read, or any crest that
 *     carries meaning. These are darkened/lightened against the parchment
 *     and plum surfaces respectively and every pair clears WCAG AA.
 *
 * Using from/to for a label is the mistake to avoid: those hues were chosen
 * to look rich behind white glyphs and drop to ~2:1 as text on parchment.
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
  /** Readable on the parchment surfaces (light direction). */
  ink: string;
  /** Readable on the plum surfaces (dark direction). */
  inkDark: string;
  icon: string;
};

export const CATEGORIES: Record<CategoryKey, CategoryTheme> = {
  Development: {
    from: "#7A4E92",
    to: "#4C285F",
    ink: "#4A2560",
    inkDark: "#C9A6DC",
    icon: "code",
  },
  Data: {
    from: "#4E8F76",
    to: "#376B58",
    ink: "#28503F",
    inkDark: "#8FCBB2",
    icon: "chart",
  },
  Design: {
    from: "#B4436A",
    to: "#8C2946",
    ink: "#8C2946",
    inkDark: "#F0A3BB",
    icon: "palette",
  },
  Business: {
    from: "#C99632",
    to: "#9A7024",
    ink: "#7A5410",
    inkDark: "#E4BD68",
    icon: "megaphone",
  },
  Security: {
    from: "#3A6E96",
    to: "#234B69",
    ink: "#1D4463",
    inkDark: "#95C2E0",
    icon: "shield",
  },
  Communication: {
    from: "#3D7A6E",
    to: "#245349",
    ink: "#1E5349",
    inkDark: "#8ED0C2",
    icon: "chat",
  },
  General: {
    from: "#7A6A72",
    to: "#544750",
    ink: "#4A3F46",
    inkDark: "#C4B8BF",
    icon: "book",
  },
};

export const CATEGORY_NAMES = Object.keys(CATEGORIES) as CategoryKey[];

export function categoryTheme(name: string): CategoryTheme {
  return CATEGORIES[name as CategoryKey] ?? CATEGORIES.General;
}
