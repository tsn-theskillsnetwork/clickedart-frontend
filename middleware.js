import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname, search, origin } = req.nextUrl;

  const protectedRoutes = ["/dashboard", "/profile", "/checkout"];
  const authRoutes = ["/signin", "/signup"];

  // If user tries to access protected routes without a token, store attempted URL
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const redirectUrl = new URL("/signin", origin);
    redirectUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(redirectUrl);
  }

  // If authenticated and visiting auth pages, redirect to stored page or home
  if (authRoutes.includes(pathname) && token) {
    const redirectUrl = new URL(req.nextUrl.searchParams.get("redirect") || "/", origin);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/signin", "/signup/:path*", "/checkout"],
};
