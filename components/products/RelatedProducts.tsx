"use client";

import SectionTitle from "@/components/Global/SectionTitle";
import ProductGrid from "@/components/products/ProductGrid";
import { useStoreInit } from "@/hooks/use-store-init";
import useProductStore from "@/store/productStore";
import { useTranslations } from "next-intl";

export default function RelatedProducts({
  productId,
  locale,
}: {
  productId: string;
  locale: string;
}) {
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  const similarProducts = useProductStore(state => state.similarProducts);
  const fetchSimilarProducts = useProductStore(
    state => state.fetchSimilarProducts,
  );
  const isLoading = useProductStore(state => state.loading.fetchSimilar);

  useStoreInit(() => fetchSimilarProducts(productId), [productId]);

  if (!isLoading && similarProducts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <SectionTitle text={t("relatedProducts")} />
      {isLoading && similarProducts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {tCommon("loadingProducts")}
        </p>
      ) : (
        <ProductGrid
          products={similarProducts}
          locale={locale}
          compact
          hoverActions
        />
      )}
    </section>
  );
}
