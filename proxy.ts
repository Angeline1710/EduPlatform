import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

function redirectToPath(path: string) {
  return new NextResponse(null, {
    status: 307,
    headers: { Location: path },
  });
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) return redirectToPath("/admin/login");
    if (user.role !== "ADMIN")
      return redirectToPath("/");
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/learn")) {
    if (!user) return redirectToPath("/login");
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/learn/:path*"],
};
