"use client";

import CatalogGrid from "@/components/catalog/CatalogGrid";
import CatalogGridSkeleton from "@/components/catalog/CatalogGridSkeleton";
import CatalogSearchBar from "@/components/catalog/CatalogSearchBar";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { useStoreInit } from "@/hooks/use-store-init";
import type { CatalogScope } from "@/lib/catalog-paths";
import { buildListQueryFromSearchParams } from "@/lib/list-query";
import useCollectionStore from "@/store/collectionStore";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function CollectionsListPageContent({
  scope,
}: {
  scope: CatalogScope;
}) {
  const t = useTranslations("catalog");
  const searchParams = useSearchParams();
  const queryKey = searchParams.toString();
  const collections = useCollectionStore(state => state.collections);
  const errorMessage = useCollectionStore(state => state.errorMessage);
  const fetchCollections = useCollectionStore(state => state.fetchCollections);
  const isLoading = useCollectionStore(
    state => state.loading.fetchCollections,
  );

  useStoreInit(
    () => fetchCollections(buildListQueryFromSearchParams(searchParams)),
    [queryKey],
  );

  const eyebrow =
    scope === "admin"
      ? t("adminEyebrow")
      : scope === "customer"
        ? t("customerEyebrow")
        : t("publicEyebrow");

  return (
    <PageShell>
      <PageHeader
        eyebrow={eyebrow}
        title={t("collectionsTitle")}
        description={t("collectionsListDescription")}
      />

      <CatalogSearchBar />

      {isLoading ? (
        <CatalogGridSkeleton />
      ) : errorMessage && collections.length === 0 ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : collections.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noCollections")}</p>
      ) : (
        <CatalogGrid
          items={collections}
          scope={scope}
          type="collections"
        />
      )}
    </PageShell>
  );
}
