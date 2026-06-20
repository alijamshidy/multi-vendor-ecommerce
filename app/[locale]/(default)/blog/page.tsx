import BlogPageContent from "@/components/pages/BlogPageContent";
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
    title: t("blogTitle"),
    description: t("blogDescription"),
    locale,
    path: "blog",
  });
}

export default function BlogPage() {
  return <BlogPageContent />;
}
