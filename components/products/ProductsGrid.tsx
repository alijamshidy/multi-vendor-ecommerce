"use client";

import { GetLocale } from "@/utils/GetUrlParams";
import { productType } from "@/utils/products";
import ProductGridCard from "./ProductGridCard";

export default function ProductsGrid({
  products,
  open,
}: {
  products: productType[];
  open: boolean;
}) {
  const locale = GetLocale();

  return (
    <div
      className={`pt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 ${open ? "lg:grid-cols-2 2xl:grid-cols-3" : "lg:grid-cols-3 2xl:grid-cols-4"}`}>
      {products.map(product => (
        <ProductGridCard
          key={product.id}
          product={product}
          href={`/${locale}/products/${product.id}`}
        />
      ))}
    </div>
  );
}
