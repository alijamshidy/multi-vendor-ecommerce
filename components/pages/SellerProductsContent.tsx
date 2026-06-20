"use client";

import FilterPanel from "@/components/products/FilterPanel";
import BorderedListSkeleton from "@/components/commerce/BorderedListSkeleton";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStoreInit } from "@/hooks/use-store-init";
import { Link } from "@/i18n/navigation";
import { buildManagementProductQueryFromSearchParams } from "@/lib/product-query";
import useManagementStore from "@/store/managementStore";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function SellerProductsContent() {
  const t = useTranslations("admin");
  const searchParams = useSearchParams();
  const queryKey = searchParams.toString();
  const products = useManagementStore(state => state.products);
  const fetchProducts = useManagementStore(state => state.fetchProducts);
  const deleteProduct = useManagementStore(state => state.deleteProduct);
  const isLoading = useManagementStore(state => state.loading.fetchProducts);
  const isDeleting = useManagementStore(state => state.loading.deleteProduct);

  useStoreInit(
    () => fetchProducts(buildManagementProductQueryFromSearchParams(searchParams)),
    [queryKey],
  );

  const handleDelete = async (id: string, label: string) => {
    if (!window.confirm(t("deleteConfirm", { name: label }))) return;

    try {
      await deleteProduct(id);
      toast.success(t("productDeleted"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("productDeleteFailed"),
      );
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("seller")}
        title={t("myProducts")}
        description={t("myProductsDescription")}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_1fr]">
        <div className="rounded-sm border p-4">
          <FilterPanel variant="management" />
        </div>
        <section className="space-y-4">
          {isLoading && products.length === 0 ? (
            <BorderedListSkeleton
              count={5}
              columns={3}
            />
          ) : products.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noProducts")}</p>
          ) : (
            products.map(product => (
              <Card
                key={product.id}
                className="rounded-md">
                <CardContent className="grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <div className="space-y-1">
                    <span className="font-medium capitalize">{product.label}</span>
                    <p className="text-sm text-muted-foreground">
                      {product.category}
                    </p>
                  </div>
                  <Badge className="w-fit">{t("active")}</Badge>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild>
                      <Link href={`/seller/products/${product.id}/edit`}>
                        {t("editProduct")}
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting}
                      onClick={() => void handleDelete(product.id, product.label)}>
                      {t("deleteProduct")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </section>
      </div>
    </PageShell>
  );
}
