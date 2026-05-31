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
  const segments = pathname.split("/").filter(Boolean);
  const pathWithoutLocale =
    segments.length > 1 ? segments.slice(1).join("/") : "";
  const queryString = searchParams.toString();

  if (!pathWithoutLocale && !queryString) {
    return "";
  }

  if (!queryString) {
    return pathWithoutLocale;
  }

  return `${pathWithoutLocale}?${queryString}`;
}
export function GetSearchParams() {
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();
  return queryString;
}
export const RemoveLayoutParam = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  params.delete("layout");
  const newQuery = params.toString();
  const newUrl = `&${newQuery}`;
  if (newQuery == "") {
    return "";
  }
  return newUrl;
};
export function parseQueryString({
  str,
}: {
  str: string;
}): Record<string, string | number> {
  const result: Record<string, string | number> = {};
  const pairs = str.split("&");
  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    if (!key || !value) continue;
    const trimmedValue = value.trim();
    const num = Number(trimmedValue);
    if (!isNaN(num) && trimmedValue !== "") {
      result[key] = num;
    } else {
      result[key] = trimmedValue.replace(/^["']|["']$/g, "");
    }
  }
  return result;
}
