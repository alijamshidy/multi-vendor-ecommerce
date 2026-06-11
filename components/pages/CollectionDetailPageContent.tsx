"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { useSetBreadcrumbLabel } from "@/context/breadcrumb-context";
import ChangeItemPerPage from "@/components/products/ChangeItemPerPage";
import ProductsPagination from "@/components/products/Pagination";
import ProductGrid from "@/components/products/ProductGrid";
import { useQueryParams } from "@/hooks/use-query-params";
import { useStoreInit } from "@/hooks/use-store-init";
import { catalogSlugsMatch, type CatalogScope } from "@/lib/catalog-paths";
import {
  getCurrentPage,
  getItemsPerPage,
  getTotalPages,
} from "@/lib/product-query";
import useCollectionStore from "@/store/collectionStore";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function CollectionDetailPageContent({
  locale,
  collectionSlug,
  scope = "public",
}: {
  locale: string;
  collectionSlug: string;
  scope?: CatalogScope;
}) {
  const t = useTranslations("catalog");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const { setQueryParam } = useQueryParams();

  const activeCollection = useCollectionStore(state => state.activeCollection);
  const collectionProducts = useCollectionStore(state => state.collectionProducts);
  const collectionError = useCollectionStore(state => state.errorMessage);
  const fetchCollectionBySlug = useCollectionStore(
    state => state.fetchCollectionBySlug,
  );
  const isLoadingCollection = useCollectionStore(
    state => state.loading.fetchCollection,
  );

  useStoreInit(async () => {
    useCollectionStore.setState({
      errorMessage: "",
      activeCollection: null,
      collectionProducts: [],
    });
    await fetchCollectionBySlug(collectionSlug);
  }, [collectionSlug, fetchCollectionBySlug]);

  const collectionMatchesSlug =
    activeCollection != null &&
    catalogSlugsMatch(activeCollection.href, collectionSlug);

  const currentPage = getCurrentPage(searchParams);
  const itemsPerPage = getItemsPerPage(searchParams);
  const totalCount = collectionMatchesSlug ? collectionProducts.length : 0;
  const totalPages = getTotalPages(totalCount, itemsPerPage);

  const paginatedProducts = useMemo(() => {
    if (!collectionMatchesSlug) return [];
    const start = (currentPage - 1) * itemsPerPage;
    return collectionProducts.slice(start, start + itemsPerPage);
  }, [collectionMatchesSlug, collectionProducts, currentPage, itemsPerPage]);

  const title = activeCollection?.label || collectionSlug;
  useSetBreadcrumbLabel(title);

  const isInitialLoading = isLoadingCollection && collectionProducts.length === 0;

  const eyebrow =
    scope === "admin"
      ? t("adminEyebrow")
      : scope === "customer"
        ? t("customerEyebrow")
        : t("publicEyebrow");

  useEffect(() => {
    if (isLoadingCollection || totalCount === 0 || totalPages === 0) return;
    if (currentPage > totalPages) {
      setQueryParam("page", totalPages);
    }
  }, [currentPage, isLoadingCollection, setQueryParam, totalCount, totalPages]);

  return (
    <PageShell>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={
          activeCollection?.description || t("collectionDetailDescription")
        }
      />

      <div className="mb-6 flex justify-end">
        <ChangeItemPerPage />
      </div>

      {isInitialLoading ? (
        <p className="text-sm text-muted-foreground">
          {tCommon("loadingProducts")}
        </p>
      ) : collectionError && collectionProducts.length === 0 ? (
        <p className="text-sm text-destructive">{collectionError}</p>
      ) : paginatedProducts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {tCommon("noItemsFound")}
        </p>
      ) : (
        <ProductGrid
          products={paginatedProducts}
          locale={locale}
        />
      )}

      {paginatedProducts.length > 0 ? (
        <ProductsPagination totalCount={totalCount} />
      ) : null}
    </PageShell>
  );
}
