"use client";
import { productType } from "@/utils/products";
import { Separator } from "../ui/separator";
import { useSidebar } from "../ui/sidebar";
import ChangeItemPerPage from "./ChangeItemPerPage";
import ChangeLayout from "./ChangeLayout";
import ChangeSorting from "./ChangeSorting";
import Pagination from "./Pagination";
import ProductsGrid from "./ProductsGrid";
import ProductsList from "./ProductsList";

export default function ProductsContainer({
  layout,
  totalProducts,
  products,
}: {
  layout: string;
  totalProducts: number;
  products: productType[];
}) {
  const { open } = useSidebar();
  return (
    <div className="w-full min-w-0 md:w-[90%]">
      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="font-medium text-lg">
            {totalProducts} product{totalProducts > 1 && "s"}
          </h4>
          <ChangeLayout />
        </div>
        <Separator className="mt-4" />
      </section>
      {/*  */}
      <section className="flex items-center justify-between">
        <div className="flex justify-between items-center w-full flex-col lg:flex-row gap-y-3 lg:gap-y-0">
          <ChangeItemPerPage />
          <ChangeSorting />
        </div>
        <Separator className="mt-4" />
      </section>
      {/* PRODUCTS */}
      <div>
        {totalProducts === 0 ? (
          <h5 className="text-2xl mt-16">
            Sorry, no products matched your search...
          </h5>
        ) : layout === "grid" ? (
          <>
            <ProductsGrid
              products={products}
              open={open}
            />
            <Pagination />
          </>
        ) : (
          <>
            <ProductsList products={products} />
            <Pagination />
          </>
        )}
      </div>
    </div>
  );
}
