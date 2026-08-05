import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const PUBLIC_API_PATHS = ["/api/auth/login", "/api/auth/logout", "/api/health"];

// Endpoints any authenticated user may hit (customer self-service).
const ANY_AUTH_API_PATHS = [
  "/api/auth/me",
  "/api/customers/dashboard",
];

const isApiPath = (pathname: string) => pathname.startsWith("/api");

// e.g. /api/customers/MMK001/calendar or /api/customers/MMK001/quantity
const CUSTOMER_SELF_SERVICE_API =
  /^\/api\/customers\/[^/]+\/(calendar|quantity)$/;

const isAdminRoute = (pathname: string) =>
  /^\/(en|hi|pa)\/admin(\/.*)?$/.test(pathname);

const isCustomerRoute = (pathname: string) =>
  /^\/(en|hi|pa)\/customer(\/.*)?$/.test(pathname);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. API routes are handled before the intl middleware so the locale
  //    middleware never redirects or rewrites them.
  if (isApiPath(pathname)) {
    if (PUBLIC_API_PATHS.includes(pathname)) {
      return NextResponse.next();
    }

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }

    const isAdmin = payload.role === "ADMIN" || payload.role === "SUPER_ADMIN";

    if (!isAdmin) {
      // Customers may only access their own self-service endpoints.
      const allowed =
        ANY_AUTH_API_PATHS.includes(pathname) ||
        CUSTOMER_SELF_SERVICE_API.test(pathname);

      if (!allowed) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.next();
  }

  // 2. Run intl middleware for page routes
  const response = intlMiddleware(request);

  // 3. Custom Auth Logic - Protect admin and customer pages
  if (isAdminRoute(pathname) || isCustomerRoute(pathname)) {
    const token = request.cookies.get("token")?.value;
    const localeMatch = pathname.match(/^\/(en|hi|pa)\b/);
    const locale = localeMatch ? localeMatch[1] : "en";
    const loginUrl = new URL(`/login?locale=${locale}`, request.url);

    if (!token) {
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      const redirectResponse = NextResponse.redirect(loginUrl);
      // Clear the invalid token cookie
      redirectResponse.cookies.set("token", "", { maxAge: 0, path: "/" });
      return redirectResponse;
    }

    // Role verification
    if (isAdminRoute(pathname) && payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN") {
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.cookies.set("token", "", { maxAge: 0, path: "/" });
      return redirectResponse;
    }

    if (isCustomerRoute(pathname) && payload.role !== "CUSTOMER" && payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN") {
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.cookies.set("token", "", { maxAge: 0, path: "/" });
      return redirectResponse;
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|apple-touch-icon.png|.*\\.png$).*)"],
};
