"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import Filter from "@/components/products/Filter";
import MobileFilterDropdown from "@/components/products/MobileFilterDropdown";
import ChangeItemPerPage from "@/components/products/ChangeItemPerPage";
import ChangeSorting from "@/components/products/ChangeSorting";
import ProductsPagination from "@/components/products/Pagination";
import ProductGrid from "@/components/products/ProductGrid";
import ProductGridSkeleton from "@/components/products/ProductGridSkeleton";
import { useSetBreadcrumbLabel } from "@/context/breadcrumb-context";
import { useQueryParams } from "@/hooks/use-query-params";
import { useStoreInit, useStoreInitOnce } from "@/hooks/use-store-init";
import type { CatalogScope } from "@/lib/catalog-paths";
import {
  buildCategoryProductQuery,
  buildCategorySearchQuery,
  getCurrentPage,
  getItemsPerPage,
  getTotalPages,
} from "@/lib/product-query";
import useCategoryStore from "@/store/categoryStore";
import useProductStore from "@/store/productStore";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";

export default function CategoryDetailPageContent({
  locale,
  categorySlug,
  scope = "public",
}: {
  locale: string;
  categorySlug: string;
  scope?: CatalogScope;
}) {
  const t = useTranslations("product");
  const tCatalog = useTranslations("catalog");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const { setQueryParam } = useQueryParams();
  const queryKey = searchParams.toString();

  const activeCategory = useCategoryStore(state => state.activeCategory);
  const categoryError = useCategoryStore(state => state.errorMessage);
  const fetchCategoryBySlug = useCategoryStore(
    state => state.fetchCategoryBySlug,
  );
  const isLoadingCategory = useCategoryStore(
    state => state.loading.fetchCategory,
  );

  const products = useProductStore(state => state.products);
  const totalCount = useProductStore(state => state.totalCount);
  const productError = useProductStore(state => state.errorMessage);
  const fetchProducts = useProductStore(state => state.fetchProducts);
  const fetchPriceBounds = useProductStore(state => state.fetchPriceBounds);
  const priceBounds = useProductStore(state => state.priceBounds);
  const priceBoundsLoaded = useProductStore(state => state.priceBoundsLoaded);
  const isLoadingProducts = useProductStore(
    state => state.loading.fetchProducts,
  );

  useStoreInitOnce(() => {
    void fetchPriceBounds();
  }, [fetchPriceBounds]);

  useStoreInit(async () => {
    useCategoryStore.setState({ errorMessage: "" });
    await fetchCategoryBySlug(categorySlug);
  }, [categorySlug]);

  const categoryMatchesSlug =
    activeCategory?.href === decodeURIComponent(categorySlug);

  useStoreInit(async () => {
    if (isLoadingCategory || !priceBoundsLoaded) return;

    if (categoryMatchesSlug && activeCategory) {
      await fetchProducts(
        buildCategoryProductQuery(
          searchParams,
          activeCategory.href,
          priceBounds,
        ),
      );
      return;
    }

    if (!activeCategory) {
      await fetchProducts(
        buildCategorySearchQuery(searchParams, categorySlug, priceBounds),
      );
    }
  }, [
    categorySlug,
    categoryMatchesSlug,
    activeCategory,
    queryKey,
    isLoadingCategory,
    priceBounds.min,
    priceBounds.max,
    priceBoundsLoaded,
  ]);

  const currentPage = getCurrentPage(searchParams);
  const itemsPerPage = getItemsPerPage(searchParams);
  const totalPages = getTotalPages(totalCount, itemsPerPage);
  const title = activeCategory?.label || categorySlug;
  useSetBreadcrumbLabel(title);
  const errorMessage = categoryError || productError;
  const isInitialLoading =
    (isLoadingCategory || isLoadingProducts) && products.length === 0;

  const eyebrow =
    scope === "admin"
      ? tCatalog("adminEyebrow")
      : scope === "customer"
        ? tCatalog("customerEyebrow")
        : t("categoryEyebrow");

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
        description={t("categoryDescription")}
      />

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="w-full shrink-0 md:hidden">
          <MobileFilterDropdown hiddenSections={["category"]} />
        </div>
        <Filter hiddenSections={["category"]} />

        <div className="w-full min-w-0 flex-1 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="text-lg font-medium">
              {totalCount} {totalCount === 1 ? "product" : "products"}
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <ChangeItemPerPage />
              <ChangeSorting />
            </div>
          </div>
          <Separator />

          {isInitialLoading ? (
            <ProductGridSkeleton count={itemsPerPage} />
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
        </div>
      </div>
    </PageShell>
  );
}
