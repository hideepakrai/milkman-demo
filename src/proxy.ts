import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // 1. Run intl middleware first
  const response = intlMiddleware(request);

  // 2. Custom Auth Logic - DISABLED for public access
  /* Auth checks removed to allow direct access to all pages */

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|milk3.png).*)"],
};
