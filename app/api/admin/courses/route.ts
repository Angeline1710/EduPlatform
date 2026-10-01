import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { CATEGORY_NAMES } from "@/lib/categories";

const schema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  price: z.number().int().min(0),
  category: z.enum(CATEGORY_NAMES),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  gifUrl: z.string().url().optional().or(z.literal("")),
  published: z.boolean().optional(),
});

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin)
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid course data." },
      { status: 400 },
    );
  }

  const {
    title,
    description,
    price,
    category,
    thumbnailUrl,
    gifUrl,
    published,
  } = parsed.data;

  const course = await prisma.course.create({
    data: {
      title,
      description,
      price,
      category,
      thumbnailUrl: thumbnailUrl || null,
      gifUrl: gifUrl || null,
      published: published ?? false,
      createdById: admin.id,
    },
  });

  return NextResponse.json({ id: course.id }, { status: 201 });
}
