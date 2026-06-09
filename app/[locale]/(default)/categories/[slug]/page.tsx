import CategoryDetailPageContent from "@/components/pages/CategoryDetailPageContent";
import {
  buildCatalogDetailMetadata,
  CatalogPageFallback,
} from "@/lib/catalog-metadata";
import type { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  return buildCatalogDetailMetadata({
    locale,
    type: "categories",
    scope: "public",
    slug,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  return (
    <Suspense fallback={<CatalogPageFallback />}>
      <CategoryDetailPageContent
        locale={locale}
        categorySlug={slug}
        scope="public"
      />
    </Suspense>
  );
}
