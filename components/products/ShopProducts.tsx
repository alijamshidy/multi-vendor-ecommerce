"use client";

import SectionTitle from "@/components/global/SectionTitle";
import ProductGrid from "@/components/products/ProductGrid";
import { useTranslations } from "next-intl";
import type { productType } from "@/utils/products";

export default function ShopProducts({
  products,
  locale,
  shopName,
}: {
  products: productType[];
  locale: string;
  shopName?: string;
}) {
  const t = useTranslations("product");

  if (products.length === 0) return null;

  return (
    <section className="space-y-6">
      <SectionTitle
        text={
          shopName
            ? t("moreFromShop", { shop: shopName })
            : t("moreFromSameShop")
        }
      />
      <ProductGrid
        products={products}
        locale={locale}
      />
    </section>
  );
}
