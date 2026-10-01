import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) return NextResponse.redirect(new URL("/admin/login", req.url));
    if (user.role !== "ADMIN")
      return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/learn")) {
    if (!user) return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/learn/:path*"],
};
