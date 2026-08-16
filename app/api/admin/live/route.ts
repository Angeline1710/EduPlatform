import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getLiveUsers, PRESENCE_WINDOW_MS } from "@/lib/analytics";

/** Polled by the admin dashboard for the "online now" panel. */
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const users = await getLiveUsers();

  return NextResponse.json(
    {
      count: users.length,
      windowMs: PRESENCE_WINDOW_MS,
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        lastSeenAt: u.lastSeenAt,
      })),
    },
    // Presence is worthless cached.
    { headers: { "Cache-Control": "no-store" } },
  );
}
