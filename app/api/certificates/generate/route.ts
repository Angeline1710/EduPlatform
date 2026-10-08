import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error:
        "Credential issuance through this endpoint is disabled. Credentials can only be issued through the authenticated claim flow.",
    },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
