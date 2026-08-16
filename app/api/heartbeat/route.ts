import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * Marks the signed-in user as currently present.
 *
 * The client pings this on an interval while a tab is open and focused.
 * `lastSeenAt` is the only source for the admin dashboard's live count, so
 * that number always reflects real sessions rather than an estimate.
 */
export async function POST() {
  const session = await auth();
  // Signed-out visitors are simply not counted; that is not an error.
  if (!session?.user) return NextResponse.json({ ok: true, tracked: false });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { lastSeenAt: new Date() },
  });

  return NextResponse.json({ ok: true, tracked: true });
}
