import { CATEGORY_NAMES } from "@/lib/categories";

/**
 * The profile's vocabulary and pure helpers.
 *
 * Deliberately free of any database import: the edit form is a client
 * component and needs these options and validators, and pulling the Prisma
 * client in behind them would drag the server runtime into the browser
 * bundle. Anything needing the database lives in lib/profile.ts instead.
 */

export const EDUCATION_LEVELS = [
  { value: "SECONDARY", label: "Secondary school" },
  { value: "DIPLOMA", label: "Diploma" },
  { value: "BACHELORS", label: "Bachelor's degree" },
  { value: "MASTERS", label: "Master's degree" },
  { value: "DOCTORATE", label: "Doctorate" },
  { value: "SELF_TAUGHT", label: "Self-taught" },
  { value: "OTHER", label: "Other" },
] as const;

export const EXPERIENCE_LEVELS = [
  { value: "BEGINNER", label: "Beginner", hint: "New to the subject" },
  { value: "INTERMEDIATE", label: "Intermediate", hint: "Comfortable with the basics" },
  { value: "ADVANCED", label: "Advanced", hint: "Working at a professional level" },
] as const;

export const ACCOLADE_KINDS = [
  { value: "COMPETITION", label: "Competition" },
  { value: "CERTIFICATION", label: "Certification" },
  { value: "AWARD", label: "Award" },
  { value: "PUBLICATION", label: "Publication" },
  { value: "PROJECT", label: "Project" },
] as const;

export function educationLabel(value?: string | null) {
  return EDUCATION_LEVELS.find((l) => l.value === value)?.label ?? null;
}

export function experienceLabel(value?: string | null) {
  return EXPERIENCE_LEVELS.find((l) => l.value === value)?.label ?? null;
}

export function accoladeLabel(value?: string | null) {
  return ACCOLADE_KINDS.find((k) => k.value === value)?.label ?? "Accolade";
}

/**
 * Age from date of birth.
 *
 * Derived rather than stored, so it can never drift out of date, and it
 * accounts for whether this year's birthday has already passed.
 */
export function ageFrom(dob?: Date | null): number | null {
  if (!dob) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age--;
  return age >= 0 && age < 130 ? age : null;
}

/** Interests are stored as JSON; a malformed value must not break the page. */
export function parseInterests(raw?: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (v): v is string =>
        typeof v === "string" && (CATEGORY_NAMES as readonly string[]).includes(v),
    );
  } catch {
    return [];
  }
}

type ProfileLike = {
  headline?: string | null;
  bio?: string | null;
  dateOfBirth?: Date | null;
  phone?: string | null;
  country?: string | null;
  educationLevel?: string | null;
  fieldOfStudy?: string | null;
  occupation?: string | null;
  experienceLevel?: string | null;
  interests?: string | null;
  goals?: string | null;
  weeklyHours?: number | null;
  accolades?: unknown[];
};

/**
 * How complete the record is, and what is still missing.
 *
 * The missing list is returned rather than only a percentage, so the page can
 * ask for the specific things that would actually improve recommendations
 * instead of nagging for a number.
 */
export function completeness(profile: ProfileLike | null) {
  const checks: { key: string; label: string; done: boolean; helps: string }[] = [
    {
      key: "headline",
      label: "A headline",
      done: Boolean(profile?.headline),
      helps: "Tells others who you are",
    },
    {
      key: "dateOfBirth",
      label: "Date of birth",
      done: Boolean(profile?.dateOfBirth),
      helps: "Lets us pitch courses at the right level",
    },
    {
      key: "country",
      label: "Where you are",
      done: Boolean(profile?.country),
      helps: "Used for timing and local offers",
    },
    {
      key: "educationLevel",
      label: "Education level",
      done: Boolean(profile?.educationLevel),
      helps: "Sets the depth the owl suggests",
    },
    {
      key: "fieldOfStudy",
      label: "Field of study",
      done: Boolean(profile?.fieldOfStudy),
      helps: "Points the owl at the right department",
    },
    {
      key: "experienceLevel",
      label: "Experience level",
      done: Boolean(profile?.experienceLevel),
      helps: "Stops beginners being sent advanced material",
    },
    {
      key: "interests",
      label: "Subjects you care about",
      done: parseInterests(profile?.interests).length > 0,
      helps: "The strongest signal the owl has",
    },
    {
      key: "goals",
      label: "What you want to achieve",
      done: Boolean(profile?.goals),
      helps: "Shapes the order courses are suggested in",
    },
    {
      key: "accolades",
      label: "Competitions or certifications",
      done: (profile?.accolades?.length ?? 0) > 0,
      helps: "Shows what you have already proven",
    },
  ];

  const done = checks.filter((c) => c.done).length;
  return {
    percent: Math.round((done / checks.length) * 100),
    done,
    total: checks.length,
    missing: checks.filter((c) => !c.done),
  };
}
