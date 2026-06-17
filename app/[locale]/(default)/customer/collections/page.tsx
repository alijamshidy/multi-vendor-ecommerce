import CollectionsListPageContent from "@/components/pages/CollectionsListPageContent";
import {
  buildCatalogListMetadata,
  CatalogPageFallback,
} from "@/lib/catalog-metadata";
import type { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildCatalogListMetadata({
    locale,
    type: "collections",
    scope: "customer",
  });
}

export default function Page() {
  return (
    <Suspense fallback={<CatalogPageFallback />}>
      <CollectionsListPageContent scope="customer" />
    </Suspense>
  );
}
