import ProductsPageContent from "@/components/pages/ProductsPageContent";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  return buildPageMetadata({
    title: t("productsTitle"),
    description: t("productsDescription"),
    locale,
    path: "/products",
  });
}

function ProductsPageFallback() {
  return (
    <div className="py-12 text-center text-muted-foreground">Loading...</div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageContent />
    </Suspense>
  );
}
