import ContactPageContent from "@/components/pages/ContactPageContent";
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
    title: t("contactTitle"),
    description: t("contactDescription"),
    locale,
    path: "contact",
  });
}

export default function ContactPage() {
  return <ContactPageContent />;
}
