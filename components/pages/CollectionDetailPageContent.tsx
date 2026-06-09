"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { useSetBreadcrumbLabel } from "@/context/breadcrumb-context";
import ChangeItemPerPage from "@/components/products/ChangeItemPerPage";
import ProductsPagination from "@/components/products/Pagination";
import ProductGrid from "@/components/products/ProductGrid";
import { useQueryParams } from "@/hooks/use-query-params";
import { useStoreInit } from "@/hooks/use-store-init";
import type { CatalogScope } from "@/lib/catalog-paths";
import {
  buildCollectionProductQuery,
  buildCollectionSearchQuery,
  getCurrentPage,
  getItemsPerPage,
  getTotalPages,
} from "@/lib/product-query";
import useCollectionStore from "@/store/collectionStore";
import useProductStore from "@/store/productStore";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

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
  const queryKey = searchParams.toString();

  const activeCollection = useCollectionStore(state => state.activeCollection);
  const collectionError = useCollectionStore(state => state.errorMessage);
  const fetchCollectionBySlug = useCollectionStore(
    state => state.fetchCollectionBySlug,
  );
  const isLoadingCollection = useCollectionStore(
    state => state.loading.fetchCollection,
  );

  const products = useProductStore(state => state.products);
  const totalCount = useProductStore(state => state.totalCount);
  const productError = useProductStore(state => state.errorMessage);
  const fetchProducts = useProductStore(state => state.fetchProducts);
  const isLoadingProducts = useProductStore(
    state => state.loading.fetchProducts,
  );

  useStoreInit(async () => {
    useCollectionStore.setState({ errorMessage: "" });
    await fetchCollectionBySlug(collectionSlug);
  }, [collectionSlug]);

  const collectionMatchesSlug =
    activeCollection?.href === decodeURIComponent(collectionSlug);

  useStoreInit(async () => {
    if (isLoadingCollection) return;

    if (collectionMatchesSlug && activeCollection) {
      await fetchProducts(
        buildCollectionProductQuery(searchParams, activeCollection.id),
      );
      return;
    }

    if (!activeCollection) {
      await fetchProducts(
        buildCollectionSearchQuery(searchParams, collectionSlug),
      );
    }
  }, [
    collectionSlug,
    collectionMatchesSlug,
    activeCollection,
    queryKey,
    isLoadingCollection,
  ]);

  const currentPage = getCurrentPage(searchParams);
  const itemsPerPage = getItemsPerPage(searchParams);
  const totalPages = getTotalPages(totalCount, itemsPerPage);
  const title = activeCollection?.label || collectionSlug;
  useSetBreadcrumbLabel(title);
  const errorMessage = collectionError || productError;
  const isInitialLoading =
    (isLoadingCollection || isLoadingProducts) && products.length === 0;

  const eyebrow =
    scope === "admin"
      ? t("adminEyebrow")
      : scope === "customer"
        ? t("customerEyebrow")
        : t("publicEyebrow");

  useEffect(() => {
    if (isLoadingProducts || totalCount === 0 || totalPages === 0) return;
    if (currentPage > totalPages) {
      setQueryParam("page", totalPages);
    }
  }, [currentPage, isLoadingProducts, setQueryParam, totalCount, totalPages]);

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
      ) : errorMessage && products.length === 0 ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {tCommon("noItemsFound")}
        </p>
      ) : (
        <div
          className={
            isLoadingProducts ? "opacity-60 transition-opacity" : undefined
          }>
          <ProductGrid
            products={products}
            locale={locale}
          />
          <ProductsPagination totalCount={totalCount} />
        </div>
      )}
    </PageShell>
  );
}
