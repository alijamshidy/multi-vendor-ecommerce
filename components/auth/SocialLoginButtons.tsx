"use client";

import { useTranslations } from "next-intl";

/** Social login is not supported by the marketplace API. */
export default function SocialLoginButtons() {
  const t = useTranslations("auth");
  return (
    <p className="text-center text-sm text-muted-foreground">
      {t("socialLoginUnavailable")}
    </p>
  );
}
