import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const schema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(20000),
});

export async function POST(
  req: Request,
  { params }: RouteContext<"/api/admin/courses/[id]/lessons">,
) {
  const admin = await requireAdmin();
  if (!admin)
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const { id: courseId } = await params;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid lesson data." },
      { status: 400 },
    );
  }

  const last = await prisma.lesson.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
  });

  const lesson = await prisma.lesson.create({
    data: {
      courseId,
      title: parsed.data.title,
      content: parsed.data.content,
      order: (last?.order ?? 0) + 1,
    },
  });

  return NextResponse.json({ id: lesson.id }, { status: 201 });
}
