"use client";

import FilterPanel from "@/components/products/FilterPanel";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useStoreInit } from "@/hooks/use-store-init";
import { buildProductQueryFromSearchParams } from "@/lib/product-query";
import useManagementStore from "@/store/managementStore";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function SellerProductsContent() {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const queryKey = searchParams.toString();
  const products = useManagementStore(state => state.products);
  const fetchProducts = useManagementStore(state => state.fetchProducts);
  const isLoading = useManagementStore(state => state.loading.fetchProducts);

  useStoreInit(
    () => fetchProducts(buildProductQueryFromSearchParams(searchParams)),
    [queryKey],
  );

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("seller")}
        title={t("myProducts")}
        description={t("myProductsDescription")}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_1fr]">
        <div className="rounded-sm border p-4">
          <FilterPanel />
        </div>
        <section className="space-y-4">
          {isLoading && products.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {tCommon("loadingProducts")}
            </p>
          ) : products.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noProducts")}</p>
          ) : (
            products.map(product => (
              <Card
                key={product.id}
                className="rounded-md">
                <CardContent className="grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <span className="font-medium capitalize">{product.label}</span>
                  <Badge className="w-fit">{t("active")}</Badge>
                  <span className="text-sm text-muted-foreground sm:text-end">
                    {product.category}
                  </span>
                </CardContent>
              </Card>
            ))
          )}
        </section>
      </div>
    </PageShell>
  );
}
