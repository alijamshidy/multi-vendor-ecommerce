"use client";

import Container from "@/components/Global/Container";
import Filter from "@/components/products/Filter";
import MobileFilterSheet from "@/components/products/MobileFilterSheet";
import ProductsContainer from "@/components/products/ProductsContainer";
import { useQueryParams } from "@/hooks/use-query-params";
import { useStoreInit } from "@/hooks/use-store-init";
import {
  buildProductQueryFromSearchParams,
  getCurrentPage,
  getPageSize,
  getTotalPages,
} from "@/lib/product-query";
import useProductStore from "@/store/productStore";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ProductsPageContent() {
  const t = useTranslations("common");
  const searchParams = useSearchParams();
  const { setQueryParam } = useQueryParams();
  const layout = searchParams.get("layout") || "grid";
  const queryKey = searchParams.toString();

  const products = useProductStore(state => state.products);
  const totalCount = useProductStore(state => state.totalCount);
  const errorMessage = useProductStore(state => state.errorMessage);
  const fetchProducts = useProductStore(state => state.fetchProducts);
  const isLoading = useProductStore(state => state.loading.fetchProducts);

  useStoreInit(async () => {
    await fetchProducts(buildProductQueryFromSearchParams(searchParams));
  }, [queryKey]);

  const currentPage = getCurrentPage(searchParams);
  const pageSize = getPageSize(searchParams);
  const totalPages = getTotalPages(totalCount, pageSize);

  useEffect(() => {
    if (isLoading || totalCount === 0 || totalPages === 0) return;
    if (currentPage > totalPages) {
      setQueryParam("page", totalPages);
    }
  }, [currentPage, isLoading, setQueryParam, totalCount, totalPages]);

  return (
    <Container className="mt-12 flex flex-col gap-6 md:mt-0 md:flex-row md:items-start md:justify-center">
      <div className="w-full shrink-0 md:w-auto">
        <MobileFilterSheet />
      </div>
      <Filter />
      {isLoading && products.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          {t("loadingProducts")}
        </div>
      ) : errorMessage && products.length === 0 ? (
        <div className="py-12 text-center text-destructive">{errorMessage}</div>
      ) : (
        <ProductsContainer
          layout={layout}
          totalProducts={totalCount}
          products={products}
          isLoading={isLoading}
        />
      )}
    </Container>
  );
}
