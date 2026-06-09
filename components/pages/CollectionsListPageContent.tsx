"use client";

import CatalogGrid from "@/components/catalog/CatalogGrid";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { useStoreInit } from "@/hooks/use-store-init";
import type { CatalogScope } from "@/lib/catalog-paths";
import useCollectionStore from "@/store/collectionStore";
import { useTranslations } from "next-intl";

export default function CollectionsListPageContent({
  scope,
}: {
  scope: CatalogScope;
}) {
  const t = useTranslations("catalog");
  const tCommon = useTranslations("common");
  const collections = useCollectionStore(state => state.collections);
  const errorMessage = useCollectionStore(state => state.errorMessage);
  const fetchCollections = useCollectionStore(state => state.fetchCollections);
  const isLoading = useCollectionStore(
    state => state.loading.fetchCollections,
  );
  const isAdmin = scope === "admin";

  useStoreInit(() => fetchCollections());

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

      {isLoading ? (
        <p className="text-sm text-muted-foreground">{tCommon("loading")}</p>
      ) : errorMessage && collections.length === 0 ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : collections.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t("noCollections")}
        </p>
      ) : (
        <CatalogGrid
          items={collections}
          scope={scope}
          type="collections"
          showMeta={isAdmin}
        />
      )}
    </PageShell>
  );
}
