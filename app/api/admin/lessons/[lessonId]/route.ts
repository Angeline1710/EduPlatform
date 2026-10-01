import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const schema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(20000),
});

export async function PUT(
  req: Request,
  { params }: RouteContext<"/api/admin/lessons/[lessonId]">,
) {
  const admin = await requireAdmin();
  if (!admin)
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const { lessonId } = await params;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid lesson data." },
      { status: 400 },
    );
  }

  await prisma.lesson.update({
    where: { id: lessonId },
    data: parsed.data,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: RouteContext<"/api/admin/lessons/[lessonId]">,
) {
  const admin = await requireAdmin();
  if (!admin)
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const { lessonId } = await params;
  await prisma.lesson.delete({ where: { id: lessonId } });

  return NextResponse.json({ ok: true });
}
