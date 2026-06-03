"use client";

import Container from "@/components/Global/Container";
import Filter from "@/components/products/Filter";
import MobileFilterSheet from "@/components/products/MobileFilterSheet";
import ProductsContainer from "@/components/products/ProductsContainer";
import { useStoreInit } from "@/hooks/use-store-init";
import useProductStore from "@/store/productStore";
import { Suspense } from "react";

export default function ProductsPageContent({ layout }: { layout: string }) {
  const products = useProductStore(state => state.products);
  const totalCount = useProductStore(state => state.totalCount);
  const fetchProducts = useProductStore(state => state.fetchProducts);
  const isLoading = useProductStore(state => state.loading.fetchProducts);

  useStoreInit(() => fetchProducts());

  return (
    <Container className="flex flex-col mt-12 md:mt-0 gap-6 md:flex-row md:items-start md:justify-center">
      <div className="w-full shrink-0 md:w-auto">
        <MobileFilterSheet />
      </div>
      <Filter />
      <Suspense fallback={<div>loading ...</div>}>
        {isLoading && products.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Loading products...
          </div>
        ) : (
          <ProductsContainer
            layout={layout}
            totalProducts={totalCount}
            products={products}
          />
        )}
      </Suspense>
    </Container>
  );
}
