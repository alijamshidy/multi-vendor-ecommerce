"use client";

import PageShell from "@/components/commerce/PageShell";
import ProductFeatureList from "@/components/commerce/ProductFeatureList";
import RelatedProducts from "@/components/products/RelatedProducts";
import ProductReviewsClient from "@/components/reviews/ProductReviewsClient";
import SubmitReview from "@/components/reviews/SubmitReview";
import ProductImageGallery from "@/components/single-product/ProductImageGallery";
import ShareButton from "@/components/single-product/ShareButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useStoreInit } from "@/hooks/use-store-init";
import useCartStore from "@/store/cartStore";
import useProductStore from "@/store/productStore";
import { formatCurrency } from "@/utils/format";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";

export default function ProductDetailContent({
  locale,
  id,
}: {
  locale: string;
  id: string;
}) {
  const t = useTranslations("product");
  const tCart = useTranslations("cart");
  const tCommon = useTranslations("common");
  const features = [
    { icon: Truck, text: t("deliveryEstimate") },
    { icon: ShieldCheck, text: t("buyerProtection") },
    { icon: CheckCircle2, text: t("qualityChecked") },
  ];

  const product = useProductStore(state => state.product);
  const fetchProduct = useProductStore(state => state.fetchProduct);
  const isLoading = useProductStore(state => state.loading.fetchProduct);
  const errorMessage = useProductStore(state => state.errorMessage);
  const addItem = useCartStore(state => state.addItem);
  const isAdding = useCartStore(state => state.loading.addItem);

  useStoreInit(() => fetchProduct(id), [id]);

  if (isLoading || (!product && !errorMessage)) {
    return (
      <PageShell>
        <div className="py-16 text-center text-muted-foreground">
          {tCommon("loadingProduct")}
        </div>
      </PageShell>
    );
  }

  if (!product) {
    return (
      <PageShell>
        <div className="py-16 text-center text-destructive">
          {errorMessage || t("notFound")}
        </div>
      </PageShell>
    );
  }

  const handleAddToCart = async () => {
    try {
      await addItem({ product: product.id, quantity: 1 });
      toast.success(tCart("addedToCart"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : tCart("addToCartFailed"),
      );
    }
  };

  return (
    <PageShell>
      <Card className="rounded-md">
        <CardContent className="grid gap-8 p-4 md:grid-cols-2 md:p-8">
          <ProductImageGallery product={product} />

          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              {product.category ? (
                <p className="text-sm font-medium uppercase tracking-wide text-primary">
                  {product.category}
                </p>
              ) : null}
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
                  {product.label}
                </h1>
              </div>
              <p className="text-3xl font-semibold">
                {formatCurrency(product.price)}
              </p>
              {product.description ? (
                <p className="leading-7 text-muted-foreground">
                  {product.description}
                </p>
              ) : null}
              <ProductFeatureList features={features} />
            </div>

            <Separator />

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                className="flex-1 sm:min-w-40"
                disabled={isAdding}
                onClick={handleAddToCart}>
                {isAdding ? tCart("adding") : tCart("addToCart")}
              </Button>
              <Button
                variant="outline"
                className="flex-1 sm:min-w-40"
                asChild>
                <Link href={`/${locale}/wishlist`}>{t("saveItem")}</Link>
              </Button>
            </div>
            <ShareButton
              productId={product.id}
              name={product.label}
              locale={locale}
              label={t("share")}
            />
          </div>
        </CardContent>
      </Card>

      <section className="mt-12 space-y-12">
        <ProductReviewsClient productId={product.id} />
        <SubmitReview productId={product.id} />
        <RelatedProducts
          productId={product.id}
          locale={locale}
        />
      </section>
    </PageShell>
  );
}
