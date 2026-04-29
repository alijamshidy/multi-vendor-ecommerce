"use client";

import { usePathname, useSearchParams } from "next/navigation";

export function GetLocale() {
  const path = usePathname();
  const locale = path.split("/")[1];
  return locale;
}
export function GetAfterUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pathWithoutLocale = pathname.slice(3);
  // حذف اسلش اول اگر لازم است:
  const finalPath = pathWithoutLocale.substring(1);

  const queryString = searchParams.toString();
  const result = `${finalPath}?${queryString}`;
  return result;
}
export function GetSearchParams() {
  const searchParams = useSearchParams();

  // اگر بخواهید همان رشته خام با && را داشته باشید
  const rawQueryString = window.location.search.substring(1);
  console.log(rawQueryString); // "layout=grid&&range=10&&category=a"

  // یا ساخت رشته از پارامترها (ولی اینجا && را به & تبدیل می‌کند)
  const queryString = searchParams.toString(); // "layout=grid&range=10&category=a"
  return queryString;
}
