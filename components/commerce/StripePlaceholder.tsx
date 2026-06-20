"use client";

import { useTranslations } from "next-intl";

export default function StripePlaceholder() {
  const t = useTranslations("checkout");

  return (
    <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
      {t("stripePlaceholder")}
    </div>
  );
}
