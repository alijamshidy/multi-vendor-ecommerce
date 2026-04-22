// // src/i18n.ts
// import { getRequestConfig, GetRequestConfigParams } from "next-intl/server";
// import { notFound } from "next/navigation";

// export const locales = ["en", "fa", "ar"] as const;
// export const defaultLocale = "fa" as const;

// export type Locale = (typeof locales)[number];

// export default getRequestConfig(async (request: GetRequestConfigParams) => {
//   // استخراج locale از URL
//   console.log(request);
//   const { pathname, search } = request;

//   // بررسی اینکه locale معتبر است
//   const pathnameHasLocale = locales.some(
//     locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
//   );

//   let locale: string = defaultLocale;

//   if (pathnameHasLocale) {
//     locale = pathname.split("/")[1] || defaultLocale;
//   }

//   if (!locales.includes(locale as any)) {
//     notFound();
//   }

//   return {
//     locale,
//     messages: (await import(`../messages/${locale}.json`)).default,
//   };
// });
