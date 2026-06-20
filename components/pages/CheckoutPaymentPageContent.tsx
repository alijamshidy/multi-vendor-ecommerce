"use client";

import OrderSummary from "@/components/commerce/OrderSummary";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import StripePlaceholder from "@/components/commerce/StripePlaceholder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStoreInit } from "@/hooks/use-store-init";
import { useRouter } from "@/i18n/navigation";
import useCartStore from "@/store/cartStore";
import useCheckoutStore from "@/store/checkoutStore";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";

export default function CheckoutPaymentPageContent({
  locale,
}: {
  locale: string;
}) {
  const t = useTranslations("checkout");
  const router = useRouter();
  const fetchItems = useCartStore(state => state.fetchItems);
  const checkout = useCartStore(state => state.checkout);
  const itemCount = useCartStore(state => state.itemCount);
  const isCheckingOut = useCartStore(state => state.loading.checkout);
  const shippingInfo = useCheckoutStore(state => state.shippingInfo);
  const buyNowItem = useCheckoutStore(state => state.buyNowItem);
  const paymentMethod = useCheckoutStore(state => state.paymentMethod);
  const setPaymentMethod = useCheckoutStore(state => state.setPaymentMethod);
  const clearCheckout = useCheckoutStore(state => state.clearCheckout);

  useStoreInit(() => fetchItems());

  useEffect(() => {
    if (!shippingInfo) {
      router.replace("/checkout/shipping");
    }
  }, [shippingInfo, locale, router]);

  const hasItems = itemCount > 0 || Boolean(buyNowItem);

  const handlePlaceOrder = async () => {
    if (!shippingInfo) {
      toast.error(t("shippingRequired"));
      return;
    }

    if (!hasItems) {
      toast.error(t("emptyCart"));
      return;
    }

    try {
      const productOverride = buyNowItem
        ? [
            {
              productId: buyNowItem.productId,
              quantity: buyNowItem.quantity,
              price: buyNowItem.product.price,
            },
          ]
        : undefined;

      await checkout(shippingInfo, { products: productOverride });
      clearCheckout();
      toast.success(t("orderPlaced"));
      router.push("/orders");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("checkoutFailed"),
      );
    }
  };

  if (!shippingInfo) {
    return null;
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("paymentEyebrow")}
        title={t("paymentTitle")}
        description={t("paymentDescription")}
      />
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>{t("paymentMethod")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs
              value={paymentMethod}
              onValueChange={value =>
                setPaymentMethod(value as "stripe" | "cod")
              }>
              <TabsList>
                <TabsTrigger value="cod">{t("cod")}</TabsTrigger>
                <TabsTrigger value="stripe">{t("stripe")}</TabsTrigger>
              </TabsList>
              <TabsContent
                value="cod"
                className="mt-4 space-y-2">
                <Label>{t("codDescription")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("codHint")}
                </p>
              </TabsContent>
              <TabsContent
                value="stripe"
                className="mt-4">
                <StripePlaceholder />
              </TabsContent>
            </Tabs>
            <Button
              className="w-full"
              disabled={isCheckingOut || !hasItems}
              onClick={() => void handlePlaceOrder()}>
              {isCheckingOut ? t("placingOrder") : t("payNow")}
            </Button>
          </CardContent>
        </Card>
        <OrderSummary
          locale={locale}
          showCheckoutButton={false}
        />
      </section>
    </PageShell>
  );
}
