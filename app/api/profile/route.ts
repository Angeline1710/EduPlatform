import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CATEGORY_NAMES } from "@/lib/categories";
import { EDUCATION_LEVELS, EXPERIENCE_LEVELS } from "@/lib/profile";

/** Empty strings from the form mean "clear this", not "reject this". */
const blankToNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v;

const optionalUrl = z.preprocess(
  blankToNull,
  z.string().url().max(300).nullable().optional(),
);
const optionalText = (max: number) =>
  z.preprocess(blankToNull, z.string().max(max).nullable().optional());

const schema = z.object({
  // Name lives on User, not Profile, but it is edited from the same form.
  name: z.string().min(1).max(80).optional(),

  headline: optionalText(120),
  bio: optionalText(1000),
  dateOfBirth: z.preprocess(
    blankToNull,
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
      .nullable()
      .optional(),
  ),

  phone: optionalText(40),
  timezone: optionalText(60),
  pronouns: optionalText(40),
  languages: optionalText(160),
  avatarUrl: optionalUrl,
  isPublic: z.boolean().optional(),
  country: optionalText(80),
  city: optionalText(80),

  educationLevel: z.preprocess(
    blankToNull,
    z
      .enum(EDUCATION_LEVELS.map((l) => l.value) as [string, ...string[]])
      .nullable()
      .optional(),
  ),
  fieldOfStudy: optionalText(120),
  institution: optionalText(160),
  graduationYear: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
    z.number().int().min(1950).max(2100).nullable().optional(),
  ),
  occupation: optionalText(120),
  experienceLevel: z.preprocess(
    blankToNull,
    z
      .enum(EXPERIENCE_LEVELS.map((l) => l.value) as [string, ...string[]])
      .nullable()
      .optional(),
  ),

  interests: z.array(z.enum(CATEGORY_NAMES)).max(7).optional(),
  goals: optionalText(600),
  weeklyHours: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
    z.number().int().min(0).max(80).nullable().optional(),
  ),

  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  websiteUrl: optionalUrl,

  marketingOptIn: z.boolean().optional(),
});

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ?? "Some details were not valid.",
      },
      { status: 400 },
    );
  }

  const { name, interests, dateOfBirth, ...rest } = parsed.data;
  const userId = session.user.id;

  // A date of birth in the future, or implying an implausible age, is a typo
  // rather than a fact — reject it here instead of storing it and deriving
  // nonsense from it later.
  let dob: Date | null | undefined;
  if (dateOfBirth === null) dob = null;
  else if (dateOfBirth) {
    const d = new Date(`${dateOfBirth}T00:00:00Z`);
    if (Number.isNaN(d.getTime())) {
      return NextResponse.json(
        { error: "That date is not valid." },
        { status: 400 },
      );
    }
    const years = (Date.now() - d.getTime()) / (365.25 * 86_400_000);
    if (years < 5 || years > 120) {
      return NextResponse.json(
        { error: "Please check your date of birth." },
        { status: 400 },
      );
    }
    dob = d;
  }

  const data = {
    ...rest,
    ...(dob !== undefined ? { dateOfBirth: dob } : {}),
    ...(interests ? { interests: JSON.stringify(interests) } : {}),
  };

  await prisma.$transaction([
    ...(name
      ? [prisma.user.update({ where: { id: userId }, data: { name } })]
      : []),
    prisma.profile.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
