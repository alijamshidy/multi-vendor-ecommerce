import { DEFAULT_LOCALE, routing } from "@/i18n/routing";
import type { AuthRole } from "@/lib/auth-cookie";
import { isSafeCallbackUrl } from "@/lib/auth-cookie";
import { Categorys } from "@/utils/category";
import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const handleI18nRouting = createIntlMiddleware(routing);

const publicPaths = [
  "",
  "login",
  "register",
  "products",
  "categories",
  "collections",
  "reset_password",
  "about",
  "reviews",
  "contact",
];

const categoryPaths = Categorys.map(category => category.href);

const protectedFirstSegments = new Set([
  "admin",
  "seller",
  "customer",
  "dashboard",
  "cart",
  "checkout",
  "orders",
  "wishlist",
  "profile",
]);

function isPublicPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return true;

  const firstSegment = segments[0];
  const isLocale = firstSegment.length === 2;
  const pathWithoutLocale = isLocale
    ? segments.slice(1).join("/")
    : segments.join("/");

  const pathParts = pathWithoutLocale.split("/").filter(Boolean);
  const firstPathPart = pathParts[0] ?? "";

  if (firstPathPart === "") return true;
  if (publicPaths.includes(firstPathPart)) return true;
  if (categoryPaths.includes(firstPathPart)) return true;

  if (pathParts.length === 1 && !protectedFirstSegments.has(firstPathPart)) {
    return true;
  }

  return false;
}

function getLocaleFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  return match ? match[1] : null;
}

/** First path segment after optional locale, e.g. `/en/admin/sellers` → `admin`. */
function getRouteRootSegment(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const locale = getLocaleFromPath(pathname);
  const index = locale ? 1 : 0;
  return segments[index] ?? null;
}

function isAdminRoutePath(pathname: string): boolean {
  return getRouteRootSegment(pathname) === "admin";
}

function isSellerRoutePath(pathname: string): boolean {
  return getRouteRootSegment(pathname) === "seller";
}

function getDefaultDashboardPath(locale: string, role?: AuthRole): string {
  if (role === "admin") return `/${locale}/admin/dashboard`;
  if (role === "seller") return `/${locale}/seller/dashboard`;
  return `/${locale}/customer/dashboard`;
}

function decodeCookieToken(raw: string | undefined): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;

  try {
    return decodeURIComponent(trimmed);
  } catch {
    return trimmed;
  }
}

function getAuthFromRequest(request: NextRequest) {
  const accessToken = decodeCookieToken(
    request.cookies.get("accessToken")?.value,
  );
  const customerToken = decodeCookieToken(
    request.cookies.get("customerToken")?.value,
  );
  const role = request.cookies.get("authRole")?.value as AuthRole | undefined;

  return {
    isAuthenticated: Boolean(accessToken ?? customerToken),
    role,
  };
}

function runAuthChecks(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  const { isAuthenticated, role } = getAuthFromRequest(request);
  const isPublic = isPublicPath(pathname);

  const isLoginOrRegister =
    pathname.includes("/login") || pathname.includes("/register");
  if (isAuthenticated && isLoginOrRegister) {
    const locale = getLocaleFromPath(pathname) || DEFAULT_LOCALE;
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    const destination = isSafeCallbackUrl(callbackUrl)
      ? callbackUrl
      : getDefaultDashboardPath(locale, role);
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (isPublic) {
    return null;
  }

  if (!isAuthenticated) {
    const locale = getLocaleFromPath(pathname) || DEFAULT_LOCALE;
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAdminRoute = isAdminRoutePath(pathname);
  if (isAdminRoute && role !== "admin") {
    const locale = getLocaleFromPath(pathname) || DEFAULT_LOCALE;
    return NextResponse.redirect(
      new URL(getDefaultDashboardPath(locale, role), request.url),
    );
  }

  const isSellerRoute = isSellerRoutePath(pathname);
  if (isSellerRoute && role !== "seller") {
    const locale = getLocaleFromPath(pathname) || DEFAULT_LOCALE;
    return NextResponse.redirect(
      new URL(getDefaultDashboardPath(locale, role), request.url),
    );
  }

  const isCustomerRoute =
    pathname.includes("/customer/dashboard") ||
    pathname.includes("/profile") ||
    pathname.includes("/orders");
  if (isCustomerRoute && role === "admin") {
    const locale = getLocaleFromPath(pathname) || DEFAULT_LOCALE;
    return NextResponse.redirect(
      new URL(getDefaultDashboardPath(locale, role), request.url),
    );
  }

  return null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const intlResponse = handleI18nRouting(request);

  if (intlResponse.headers.get("location")) {
    return intlResponse;
  }

  const authResponse = runAuthChecks(request);
  if (authResponse) {
    return authResponse;
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|css|js|json|woff|woff2|ttf|eot|txt|pdf|xml)$).*)",
  ],
};
