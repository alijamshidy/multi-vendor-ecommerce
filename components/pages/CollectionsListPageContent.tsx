"use client";

import CatalogGrid from "@/components/catalog/CatalogGrid";
import CatalogGridSkeleton from "@/components/catalog/CatalogGridSkeleton";
import CatalogSearchBar from "@/components/catalog/CatalogSearchBar";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Button } from "@/components/ui/button";
import { useStoreInit } from "@/hooks/use-store-init";
import { Link } from "@/i18n/navigation";
import type { CatalogScope } from "@/lib/catalog-paths";
import { buildListQueryFromSearchParams } from "@/lib/list-query";
import useCollectionStore from "@/store/collectionStore";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

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
  const deleteCollection = useCollectionStore(state => state.deleteCollection);
  const isLoading = useCollectionStore(
    state => state.loading.fetchCollections,
  );
  const isAdmin = scope === "admin";

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

  const handleDeleteCollection = async (item: {
    href: string;
    label: string;
  }) => {
    if (!window.confirm(t("deleteCollectionConfirm", { name: item.label }))) {
      return;
    }

    try {
      await deleteCollection(item.href);
      toast.success(t("collectionDeleted"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("collectionDeleteFailed"),
      );
    }
  };

  return (
    <PageShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          eyebrow={eyebrow}
          title={t("collectionsTitle")}
          description={t("collectionsListDescription")}
        />
        {isAdmin ? (
          <Button
            asChild
            className="shrink-0">
            <Link href="/admin/collections/create">
              <Plus className="size-4" />
              {t("createCollection")}
            </Link>
          </Button>
        ) : null}
      </div>

      <CatalogSearchBar />

      {isLoading ? (
        <CatalogGridSkeleton />
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
          onDelete={isAdmin ? handleDeleteCollection : undefined}
        />
      )}
    </PageShell>
  );
}
