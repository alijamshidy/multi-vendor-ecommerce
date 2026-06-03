"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useStoreInit } from "@/hooks/use-store-init";
import useManagementStore from "@/store/managementStore";

export default function SellerProductsContent() {
  const products = useManagementStore(state => state.products);
  const fetchProducts = useManagementStore(state => state.fetchProducts);
  const isLoading = useManagementStore(state => state.loading.fetchProducts);

  useStoreInit(() => fetchProducts());

  return (
    <PageShell>
      <PageHeader
        eyebrow="Seller"
        title="My products"
        description="A responsive listing management view for vendor inventory."
      />
      <section className="space-y-4">
        {isLoading && products.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-muted-foreground">No products yet.</p>
        ) : (
          products.map(product => (
            <Card
              key={product.id}
              className="rounded-md">
              <CardContent className="grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                <span className="font-medium capitalize">{product.label}</span>
                <Badge className="w-fit">Active</Badge>
                <span className="text-sm text-muted-foreground sm:text-end">
                  {product.category}
                </span>
              </CardContent>
            </Card>
          ))
        )}
      </section>
    </PageShell>
  );
}
