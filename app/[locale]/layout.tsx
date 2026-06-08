import JsonLd from "@/components/seo/JsonLd";
import LocaleSync from "@/components/Global/LocaleSync";
import { BreadcrumbProvider } from "@/context/breadcrumb-context";
import { routing } from "@/i18n/routing";
import {
  buildOrganizationJsonLd,
  buildPageMetadata,
  buildWebsiteJsonLd,
} from "@/lib/seo";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  return buildPageMetadata({
    title: t("siteTitle"),
    description: t("siteDescription"),
    locale,
    path: "",
  });
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "fa" ? "rtl" : "ltr";

  return (
    <NextIntlClientProvider messages={messages}>
      <BreadcrumbProvider>
        <div
          dir={dir}
          lang={locale}>
          <JsonLd
            data={[
              buildOrganizationJsonLd(locale),
              buildWebsiteJsonLd(locale),
            ]}
          />
          <LocaleSync locale={locale} />
          {children}
        </div>
      </BreadcrumbProvider>
    </NextIntlClientProvider>
  );
}
