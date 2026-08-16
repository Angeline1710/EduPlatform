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
  published: z.boolean(),
});

export async function PUT(req: Request, { params }: RouteContext<"/api/admin/courses/[id]">) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const { id } = await params;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid course data." }, { status: 400 });
  }

  const { title, description, price, category, thumbnailUrl, gifUrl, published } =
    parsed.data;

  await prisma.course.update({
    where: { id },
    data: {
      title,
      description,
      price,
      category,
      thumbnailUrl: thumbnailUrl || null,
      gifUrl: gifUrl || null,
      published,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: RouteContext<"/api/admin/courses/[id]">) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const { id } = await params;

  const enrollmentCount = await prisma.enrollment.count({ where: { courseId: id } });
  if (enrollmentCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete: ${enrollmentCount} student(s) are enrolled. Unpublish it instead.` },
      { status: 409 }
    );
  }

  await prisma.course.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
