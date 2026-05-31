import Container from "@/components/Global/Container";
import Filter from "@/components/products/Filter";
import MobileFilterSheet from "@/components/products/MobileFilterSheet";
import ProductsContainer from "@/components/products/ProductsContainer";
import { Products, productType } from "@/utils/products";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    layout: string;
  }>;
}) {
  const layout = (await searchParams).layout || "grid";
  const products: productType[] = Products;
  const totalProducts = products.length;

  return (
    <Container className="mt-8 flex flex-col gap-6 md:mt-36 md:flex-row md:items-start md:justify-center">
      <div className="w-full shrink-0 md:w-auto">
        <MobileFilterSheet />
      </div>
      <Filter />
      <Suspense fallback={<div>loading ...</div>}>
        <ProductsContainer
          layout={layout}
          totalProducts={totalProducts}
          products={products}
        />
      </Suspense>
    </Container>
  );
}
