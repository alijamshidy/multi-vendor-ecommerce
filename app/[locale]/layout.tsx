import LocaleSync from "@/components/Global/LocaleSync";
import React from "react";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dir = locale === "fa" ? "rtl" : "ltr";

  return (
    <div
      dir={dir}
      lang={locale}>
      <LocaleSync locale={locale} />
      {children}
    </div>
  );
}
