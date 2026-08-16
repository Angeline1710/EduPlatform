import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * Authoritative enrollment state for one course.
 *
 * The admission animation is driven from this, never from the client's own
 * optimism — so a seal is only ever stamped once the server agrees the
 * student actually holds the course.
 */
export type EnrollmentState =
  | "anonymous"
  | "suspended"
  | "not-enrolled"
  | "payment-pending"
  | "payment-failed"
  | "enrolled";

export async function GET(req: Request) {
  const courseId = new URL(req.url).searchParams.get("courseId");
  if (!courseId) {
    return NextResponse.json({ error: "courseId required." }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ state: "anonymous" satisfies EnrollmentState });
  }

  const userId = session.user.id;

  const [user, enrollment, latestPayment] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { status: true, name: true } }),
    prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } }),
    prisma.payment.findFirst({
      where: { userId, courseId },
      orderBy: { createdAt: "desc" },
      select: { status: true },
    }),
  ]);

  let state: EnrollmentState = "not-enrolled";
  if (user?.status === "SUSPENDED") state = "suspended";
  else if (enrollment) state = "enrolled";
  else if (latestPayment?.status === "PENDING") state = "payment-pending";
  else if (latestPayment?.status === "FAILED") state = "payment-failed";

  return NextResponse.json(
    {
      state,
      // The name is echoed back so the admission parchment is inscribed with
      // the account's real name rather than anything the client supplies.
      holderName: user?.name ?? null,
      enrolledAt: enrollment?.purchasedAt ?? null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
