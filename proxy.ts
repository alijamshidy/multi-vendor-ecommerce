// middleware.ts
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// زبان پیش‌فرض
const DEFAULT_LOCALE = "en";

// مسیرهای عمومی (بدون نیاز به احراز هویت) - فقط نام مسیرها بدون لوکیل
const publicPaths = ["", "login", "register", "products"];

// بررسی عمومی بودن مسیر (با در نظر گرفتن لوکیل)
function isPublicPath(pathname: string): boolean {
  // حذف لوکیل از ابتدای مسیر (اگر وجود داشته باشد)
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return true; // مسیر ریشه '/'

  // بررسی وجود لوکیل دو حرفی
  const firstSegment = segments[0];
  const isLocale = firstSegment.length === 2;
  const pathWithoutLocale = isLocale
    ? segments.slice(1).join("/")
    : segments.join("/");

  const firstPathPart = pathWithoutLocale.split("/")[0];

  if (firstPathPart === "") return true; // فقط لوکیل (مثل /en)
  return publicPaths.includes(firstPathPart);
}

// استخراج لوکیل از مسیر (در صورت وجود)
function getLocaleFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  return match ? match[1] : null;
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
    return NextResponse.rewrite(new URL(newUrl, "http://localhost:5000"));
  }

  // 3. کنترل دسترسی و احراز هویت
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isAuthenticated = !!token;
  const role = token?.role as "admin" | "customer" | undefined;

  const isPublic = isPublicPath(pathname);

  // اگر کاربر لاگین کرده و در صفحات لاگین/ثبت‌نام است → هدایت به داشبورد
  const isLoginOrRegister =
    pathname.includes("/login") || pathname.includes("/register");
  if (isAuthenticated && isLoginOrRegister) {
    const locale = getLocaleFromPath(pathname) || DEFAULT_LOCALE;
    const dashboardPath =
      role === "admin" ? `/${locale}/admin/dashboard` : `/${locale}/dashboard`;
    return NextResponse.redirect(new URL(dashboardPath, request.url));
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
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // جلوگیری از دسترسی ادمین به صفحات مشتری (اختیاری)
  const isCustomerRoute =
    pathname.includes("/dashboard") ||
    pathname.includes("/profile") ||
    pathname.includes("/orders");
  if (isCustomerRoute && role === "admin") {
    const locale = getLocaleFromPath(pathname) || DEFAULT_LOCALE;
    return NextResponse.redirect(
      new URL(`/${locale}/admin/dashboard`, request.url),
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
