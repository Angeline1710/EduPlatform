import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

function redirectToRequestOrigin(
  req: Parameters<Parameters<typeof auth>[0]>[0],
  path: string,
) {
  const forwardedHost = req.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    .trim();
  const forwardedProtocol = req.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    .trim();
  const requestHost = forwardedHost ?? req.headers.get("host")?.split(",")[0].trim();
  const protocol =
    forwardedProtocol === "http" || forwardedProtocol === "https"
      ? forwardedProtocol
      : req.nextUrl.protocol.slice(0, -1);
  const origin = requestHost
    ? `${protocol}://${requestHost}`
    : req.nextUrl.origin;

  return NextResponse.redirect(new URL(path, origin));
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) return redirectToRequestOrigin(req, "/admin/login");
    if (user.role !== "ADMIN")
      return redirectToRequestOrigin(req, "/");
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/learn")) {
    if (!user) return redirectToRequestOrigin(req, "/login");
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/learn/:path*"],
};
