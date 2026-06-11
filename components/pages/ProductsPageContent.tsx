"use client";

import Container from "@/components/Global/Container";
import Filter from "@/components/products/Filter";
import MobileFilterDropdown from "@/components/products/MobileFilterDropdown";
import ProductsContainer from "@/components/products/ProductsContainer";
import ProductGridSkeleton from "@/components/products/ProductGridSkeleton";
import { useQueryParams } from "@/hooks/use-query-params";
import { useStoreInit, useStoreInitOnce } from "@/hooks/use-store-init";
import {
  buildProductQueryFromSearchParams,
  getCurrentPage,
  getItemsPerPage,
  getTotalPages,
} from "@/lib/product-query";
import useProductStore from "@/store/productStore";
import useCategoryStore from "@/store/categoryStore";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ProductsPageContent() {
  const searchParams = useSearchParams();
  const { setQueryParam } = useQueryParams();
  const layout = searchParams.get("layout") || "grid";
  const queryKey = searchParams.toString();

  const products = useProductStore(state => state.products);
  const totalCount = useProductStore(state => state.totalCount);
  const errorMessage = useProductStore(state => state.errorMessage);
  const fetchProducts = useProductStore(state => state.fetchProducts);
  const fetchPriceBounds = useProductStore(state => state.fetchPriceBounds);
  const fetchCategories = useCategoryStore(state => state.fetchCategories);
  const priceBounds = useProductStore(state => state.priceBounds);
  const priceBoundsLoaded = useProductStore(state => state.priceBoundsLoaded);
  const isLoading = useProductStore(state => state.loading.fetchProducts);

  useStoreInitOnce(() => {
    void fetchPriceBounds();
    void fetchCategories();
  }, [fetchPriceBounds, fetchCategories]);

  useStoreInit(async () => {
    if (!priceBoundsLoaded) return;
    await fetchProducts(
      buildProductQueryFromSearchParams(searchParams, priceBounds),
    );
  }, [queryKey, priceBounds.min, priceBounds.max, priceBoundsLoaded]);

  const currentPage = getCurrentPage(searchParams);
  const itemsPerPage = getItemsPerPage(searchParams);
  const totalPages = getTotalPages(totalCount, itemsPerPage);

  useEffect(() => {
    if (isLoading || totalCount === 0 || totalPages === 0) return;
    if (currentPage > totalPages) {
      setQueryParam("page", totalPages);
    }
  }, [currentPage, isLoading, setQueryParam, totalCount, totalPages]);

  return (
    <Container className="mt-12 flex flex-col gap-6 md:mt-0 md:flex-row md:items-start md:justify-center xl:w-[95%]">
      <div className="w-full shrink-0 md:hidden">
        <MobileFilterDropdown />
      </div>
      <Filter />
      {isLoading && products.length === 0 ? (
        <ProductGridSkeleton
          count={itemsPerPage}
          className="w-full min-w-0 md:w-[90%]"
        />
      ) : errorMessage && products.length === 0 ? (
        <div className="py-12 text-center text-destructive">{errorMessage}</div>
      ) : (
        <ProductsContainer
          layout={layout}
          totalProducts={totalCount}
          products={products}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      )}
    </Container>
  );
}
