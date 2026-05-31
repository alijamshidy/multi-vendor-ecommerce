"use client";

import { useEffect } from "react";

export default function LocaleSync({ locale }: { locale: string }) {
  useEffect(() => {
    const dir = locale === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  return null;
}
