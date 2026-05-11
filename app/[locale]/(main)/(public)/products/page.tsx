import Container from "@/components/Global/Container";
import Filter from "@/components/products/Filter";
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
    <Container className="mt-36 w-[90%] md:w-auto ml-[2%] min-w-[calc(95%-16rem)] max-w-[95%] mr-[4.5%] flex justify-center items-start">
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
