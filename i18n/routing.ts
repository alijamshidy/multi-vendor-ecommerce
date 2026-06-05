import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fa"],
  defaultLocale: "en",
});

export type Locale = (typeof routing.locales)[number];

export const DEFAULT_LOCALE = routing.defaultLocale;
export const SUPPORTED_LOCALES = routing.locales;
