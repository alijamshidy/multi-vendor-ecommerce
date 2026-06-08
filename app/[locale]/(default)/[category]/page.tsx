import CategoryPageContent from "@/components/pages/CategoryPageContent";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const label = category.replace(/-/g, " ");

  return buildPageMetadata({
    title: t("categoryTitle", { name: label }),
    description: t("categoryDescription", { name: label }),
    locale,
    path: `/${category}`,
  });
}

function CategoryPageFallback() {
  return (
    <div className="py-12 text-center text-muted-foreground">Loading...</div>
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;

  return (
    <Suspense fallback={<CategoryPageFallback />}>
      <CategoryPageContent
        locale={locale}
        categorySlug={category}
      />
    </Suspense>
  );
}
