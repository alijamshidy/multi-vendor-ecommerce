import AboutPageContent from "@/components/pages/AboutPageContent";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  return buildPageMetadata({
    title: t("aboutTitle"),
    description: t("aboutDescription"),
    locale,
    path: "about",
  });
}

export default function AboutPage() {
  return <AboutPageContent />;
}
