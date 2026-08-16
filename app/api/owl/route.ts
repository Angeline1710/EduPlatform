import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getInterestProfile } from "@/lib/interest";

/** What the owl currently believes about this visitor. */
export async function GET(req: Request) {
  const anonId = new URL(req.url).searchParams.get("anonId");
  const session = await auth();

  const profile = await getInterestProfile({
    userId: session?.user?.id ?? null,
    anonId,
  });

  return NextResponse.json(
    {
      name: session?.user?.name?.split(" ")[0] ?? null,
      ...profile,
    },
    // Advice must reflect the very last thing the visitor did.
    { headers: { "Cache-Control": "no-store" } },
  );
}
