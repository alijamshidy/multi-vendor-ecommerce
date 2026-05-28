import React from "react";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <div dir={locale === "fa" ? "rtl" : "ltr"}>{children}</div>;
}
