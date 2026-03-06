import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role as string | undefined;

    // Student coba akses /admin → tolak
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Admin akses /dashboard → arahkan ke /admin
    if (pathname === "/dashboard" && role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: [
    "/dashboard", // ← eksplisit tanpa trailing
    "/dashboard/:path*",
    "/admin", // ← eksplisit tanpa trailing
    "/admin/:path*",
    "/courses/:path*",
    "/profile/:path*",
  ],
};
