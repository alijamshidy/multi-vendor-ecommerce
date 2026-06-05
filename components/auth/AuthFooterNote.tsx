"use client";

import { FieldDescription } from "@/components/ui/field";
import { useTranslations } from "next-intl";

export default function AuthFooterNote() {
  const t = useTranslations("auth");

  return (
    <FieldDescription className="px-2 text-center text-xs sm:px-4">
      {t("termsPrefix")}{" "}
      <a
        href="#"
        className="underline-offset-4 hover:underline">
        {t("termsOfService")}
      </a>{" "}
      {t("and")}{" "}
      <a
        href="#"
        className="underline-offset-4 hover:underline">
        {t("privacyPolicy")}
      </a>
      .
    </FieldDescription>
  );
}
