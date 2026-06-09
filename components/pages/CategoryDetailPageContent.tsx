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
  const isLoadingProducts = useProductStore(
    state => state.loading.fetchProducts,
  );

  useStoreInit(async () => {
    useCategoryStore.setState({ errorMessage: "" });
    await fetchCategoryBySlug(categorySlug);
  }, [categorySlug]);

  const categoryMatchesSlug =
    activeCategory?.href === decodeURIComponent(categorySlug);

  useStoreInit(async () => {
    if (isLoadingCategory) return;

    if (categoryMatchesSlug && activeCategory) {
      await fetchProducts(
        buildCategoryProductQuery(searchParams, activeCategory.id),
      );
      return;
    }

    if (!activeCategory) {
      await fetchProducts(buildCategorySearchQuery(searchParams, categorySlug));
    }
  }, [
    categorySlug,
    categoryMatchesSlug,
    activeCategory,
    queryKey,
    isLoadingCategory,
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
