import CollectionDetailPageContent from "@/components/pages/CollectionDetailPageContent";
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
    type: "collections",
    scope: "customer",
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
      <CollectionDetailPageContent
        locale={locale}
        collectionSlug={slug}
        scope="customer"
      />
    </Suspense>
  );
}
