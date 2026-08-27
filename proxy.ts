import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const slug = process.env.ADMIN_ROUTE_SLUG;

  // Protect against direct access to the internal /admin paths
  if (nextUrl.pathname.startsWith("/admin")) {
    // Return a 404 response to completely hide the existence of the admin route
    // We rewrite to a non-existent path to trigger the default Next.js 404 behavior
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  // Handle access via the secret slug
  if (slug && nextUrl.pathname.startsWith(`/${slug}`)) {
    const isAdmin = req.auth?.user?.role === "ADMIN";
    
    // Auth check: redirect to login if not logged in or not admin
    if (!isAdmin && !nextUrl.pathname.endsWith("/login")) {
      return NextResponse.redirect(new URL(`/${slug}/login`, req.url));
    }
    
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
