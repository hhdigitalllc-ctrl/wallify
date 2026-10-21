import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Public pages that exist under /[locale]. English is served from the root and
// rewritten to /en internally, so existing links keep working.
const PUBLIC = /^\/(features|pricing|compare|faq|brand|terms|privacy|refunds|login|signup)$|^\/(collect|wall)\/[^/]+$/;
const LOCALE_PREFIX = /^\/(en|fr|ar)(?=\/|$)/;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /en/... is the same as /... : keep one canonical URL
  if (pathname.startsWith("/en") && LOCALE_PREFIX.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  const bare = pathname.replace(LOCALE_PREFIX, "") || "/";
  const needsAuthCheck =
    pathname.startsWith("/dashboard") || bare === "/login" || bare === "/signup";

  const hasLocale = LOCALE_PREFIX.test(pathname);
  const isEnglishPublic = !hasLocale && (pathname === "/" || PUBLIC.test(pathname));
  const rewriteTo = isEnglishPublic ? `/en${pathname === "/" ? "" : pathname}` : undefined;

  if (needsAuthCheck) return updateSession(request, rewriteTo);

  if (rewriteTo) {
    const url = request.nextUrl.clone();
    url.pathname = rewriteTo;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Skip API routes, the auth callback, the embeddable widget, Next internals and any file.
export const config = {
  matcher: ["/((?!api|auth|widget|_next|.*\\..*).*)"],
};
