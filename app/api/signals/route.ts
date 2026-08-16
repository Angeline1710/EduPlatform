import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const schema = z.object({
  kind: z.enum(["search", "course_view", "category_view", "enroll_intent", "enrolled"]),
  value: z.string().min(1).max(200),
  courseId: z.string().max(64).optional(),
  category: z.string().max(64).optional(),
  /** Only used when nobody is signed in. */
  anonId: z.string().max(64).optional(),
});

/**
 * Records one act of interest.
 *
 * Deliberately forgiving: a failed signal must never interrupt browsing, so
 * anything malformed is dropped quietly with a 204 rather than surfaced as
 * an error the visitor could notice.
 */
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return new NextResponse(null, { status: 204 });

  const session = await auth();
  const { kind, value, courseId, category, anonId } = parsed.data;

  // A signed-in user is attributed by id; only fall back to the browser's
  // anonymous id when there is no session, so history is never double-counted.
  const userId = session?.user?.id ?? null;

  await prisma.signal.create({
    data: {
      userId,
      anonId: userId ? null : (anonId ?? null),
      kind,
      value: value.slice(0, 200),
      courseId: courseId ?? null,
      category: category ?? null,
    },
  });

  return new NextResponse(null, { status: 204 });
}
