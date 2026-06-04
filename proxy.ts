// middleware.ts
import { Categorys } from "@/utils/Category";
import type { AuthRole } from "@/lib/auth-cookie";
import { isSafeCallbackUrl } from "@/lib/auth-cookie";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DEFAULT_LOCALE = "en";

const publicPaths = [
  "",
  "login",
  "register",
  "products",
  "reset_password",
  "about",
  "reviews",
  "contact",
];

const categoryPaths = Categorys.map(category => category.href);

/** First path segment after locale that always requires authentication. */
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

  // Dynamic category pages from API: /{locale}/{category-slug}
  if (
    pathParts.length === 1 &&
    !protectedFirstSegments.has(firstPathPart)
  ) {
    return true;
  }

  return false;
}

// استخراج لوکیل از مسیر (در صورت وجود)
function getLocaleFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  return match ? match[1] : null;
}

function getDefaultDashboardPath(locale: string, role?: AuthRole): string {
  if (role === "admin") return `/${locale}/admin/dashboard`;
  if (role === "seller") return `/${locale}/seller/dashboard`;
  return `/${locale}/customer/dashboard`;
}

function getAuthFromRequest(request: NextRequest) {
  const rawToken = request.cookies.get("accessToken")?.value?.trim();
  let accessToken = rawToken;

  if (rawToken) {
    try {
      accessToken = decodeURIComponent(rawToken);
    } catch {
      accessToken = rawToken;
    }
  }

  const role = request.cookies.get("authRole")?.value as AuthRole | undefined;

  return {
    isAuthenticated: Boolean(accessToken),
    role,
  };
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. هدایت ریشه '/' به '/en'
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
  }

  // 2. پروکسی API (اختیاری)
  if (pathname.startsWith("/api/proxy/")) {
    const newUrl = pathname.replace("/api/proxy", "");
    return NextResponse.rewrite(new URL(newUrl, "http://localhost:8000"));
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }
  // 3. کنترل دسترسی و احراز هویت
  const { isAuthenticated, role } = getAuthFromRequest(request);

  const isPublic = isPublicPath(pathname);

  // اگر کاربر لاگین کرده و در صفحات لاگین/ثبت‌نام است → هدایت به callbackUrl یا داشبورد
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

  // صفحات عمومی → دسترسی آزاد
  if (isPublic) {
    return NextResponse.next();
  }

  // صفحات غیرعمومی: احراز هویت لازم است
  if (!isAuthenticated) {
    const locale = getLocaleFromPath(pathname) || DEFAULT_LOCALE;
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // بررسی نقش برای مسیرهای ادمین
  const isAdminRoute = pathname.includes("/admin");
  if (isAdminRoute && role !== "admin") {
    const locale = getLocaleFromPath(pathname) || DEFAULT_LOCALE;
    return NextResponse.redirect(
      new URL(getDefaultDashboardPath(locale, role), request.url),
    );
  }

  // جلوگیری از دسترسی ادمین به صفحات مشتری (اختیاری)
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
  // هدایت ریشه با تشخیص زبان مرورگر
  if (pathname === "/") {
    const acceptLanguage = request.headers.get("accept-language") || "";
    const preferredLocale =
      acceptLanguage.split(",")[0]?.split("-")[0] || DEFAULT_LOCALE;
    const supportedLocales = ["en", "fa"]; // لوکیل‌های پشتیبانی شده
    const locale = supportedLocales.includes(preferredLocale)
      ? preferredLocale
      : DEFAULT_LOCALE;
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }
  return NextResponse.next();
}

// پیکربندی مسیرهای تحت نظر middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|css|js|json|woff|woff2|ttf|eot|txt|pdf|xml)$).*)",
  ],
};
