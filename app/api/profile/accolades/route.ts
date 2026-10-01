import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ACCOLADE_KINDS } from "@/lib/profile";

const schema = z.object({
  kind: z.enum(ACCOLADE_KINDS.map((k) => k.value) as [string, ...string[]]),
  title: z.string().min(1).max(160),
  issuer: z.string().max(160).optional().or(z.literal("")),
  year: z
    .preprocess(
      (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
      z.number().int().min(1950).max(2100).nullable(),
    )
    .optional(),
  url: z.string().url().max(300).optional().or(z.literal("")),
  description: z.string().max(500).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Check the details and try again." },
      { status: 400 },
    );
  }

  const { kind, title, issuer, year, url, description } = parsed.data;

  // The profile row may not exist yet if this is the first thing they add.
  const profile = await prisma.profile.upsert({
    where: { userId: session.user.id },
    update: {},
    create: { userId: session.user.id },
  });

  const accolade = await prisma.accolade.create({
    data: {
      profileId: profile.id,
      kind,
      title,
      issuer: issuer || null,
      year: year ?? null,
      url: url || null,
      description: description || null,
    },
  });

  return NextResponse.json({ id: accolade.id }, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required." }, { status: 400 });

  // Scoped through the owner's profile, so one scholar can never delete
  // another's record by guessing an id.
  const { count } = await prisma.accolade.deleteMany({
    where: { id, profile: { userId: session.user.id } },
  });

  if (count === 0) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
