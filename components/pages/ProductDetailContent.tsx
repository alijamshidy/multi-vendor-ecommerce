"use client";

import OrderSummary from "@/components/commerce/OrderSummary";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import ProductFeatureList from "@/components/commerce/ProductFeatureList";
import ProductButton from "@/components/products/ProductButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useStoreInit } from "@/hooks/use-store-init";
import useCartStore from "@/store/cartStore";
import useProductStore from "@/store/productStore";
import { formatCurrency } from "@/utils/format";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

const features = [
  { icon: Truck, text: "Estimated delivery in 3-5 business days" },
  { icon: ShieldCheck, text: "Buyer protection included" },
  { icon: CheckCircle2, text: "Quality checked before shipping" },
];

export default function ProductDetailContent({
  locale,
  id,
}: {
  locale: string;
  id: string;
}) {
  const product = useProductStore(state => state.product);
  const fetchProduct = useProductStore(state => state.fetchProduct);
  const isLoading = useProductStore(state => state.loading.fetchProduct);
  const addItem = useCartStore(state => state.addItem);
  const isAdding = useCartStore(state => state.loading.addItem);

  useStoreInit(() => fetchProduct(id), [id]);

  if (isLoading && !product) {
    return (
      <PageShell>
        <div className="py-16 text-center text-muted-foreground">
          Loading product...
        </div>
      </PageShell>
    );
  }

  if (!product) {
    return (
      <PageShell>
        <div className="py-16 text-center text-muted-foreground">
          Product not found.
        </div>
      </PageShell>
    );
  }

  const handleAddToCart = async () => {
    try {
      await addItem({ product: product.id, quantity: 1 });
      toast.success("Added to cart");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add to cart",
      );
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow={product.category}
        title={product.label}
        description={product.description}
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="rounded-md">
          <CardContent className="grid gap-6 p-4 md:grid-cols-2 md:p-6">
            <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
              <Image
                src={product.images[0].url}
                alt={product.label}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <Badge className="w-fit">Verified seller</Badge>
                <p className="text-3xl font-semibold">
                  {formatCurrency(product.price)}
                </p>
                <p className="leading-7 text-muted-foreground">
                  Reliable marketplace item with protected checkout, fast
                  dispatch, and support from the vendor team.
                </p>
                <ProductFeatureList features={features} />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  className="flex-1"
                  disabled={isAdding}
                  onClick={handleAddToCart}>
                  {isAdding ? "Adding..." : "Add to cart"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  asChild>
                  <Link href={`/${locale}/wishlist`}>Save item</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <OrderSummary locale={locale} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">More actions</h2>
          <Separator className="hidden flex-1 sm:block" />
        </div>
        <div className="flex flex-wrap gap-2">
          <ProductButton type="wishlist" />
          <ProductButton type="details" />
          <ProductButton type="addToCart" />
        </div>
      </section>
    </PageShell>
  );
}
