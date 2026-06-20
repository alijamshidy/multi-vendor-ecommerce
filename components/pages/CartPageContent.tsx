"use client";

import CartLineItem from "@/components/commerce/CartLineItem";
import { CartPageSkeleton } from "@/components/commerce/CartItemsSkeleton";
import OrderSummary from "@/components/commerce/OrderSummary";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import useCheckoutStore from "@/store/checkoutStore";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function groupItemsByShop(
  items: ReturnType<typeof useCartStore.getState>["items"],
) {
  const groups = new Map<
    string,
    ReturnType<typeof useCartStore.getState>["items"]
  >();

  for (const item of items) {
    const key = item.product.shopName ?? item.product.sellerId ?? "default";
    const existing = groups.get(key) ?? [];
    existing.push(item);
    groups.set(key, existing);
  }

  return Array.from(groups.entries());
}

export default function CartPageContent({ locale }: { locale: string }) {
  const t = useTranslations("cart");
  const userId = useAuthStore(state => state.user?.id);
  const items = useCartStore(state => state.items);
  const fetchItems = useCartStore(state => state.fetchItems);
  const itemsFetched = useCartStore(state => state.itemsFetched);
  const errorMessage = useCartStore(state => state.errorMessage);
  const isLoading = useCartStore(state => state.loading.fetchItems);
  const couponCode = useCheckoutStore(state => state.couponCode);
  const setCouponCode = useCheckoutStore(state => state.setCouponCode);
  const [couponInput, setCouponInput] = useState(couponCode);
  const showSkeleton = (isLoading || !itemsFetched) && items.length === 0;

  useEffect(() => {
    void fetchItems({ force: true });
  }, [fetchItems, userId]);

  const { inStockItems, outOfStockItems } = useMemo(() => {
    const inStock: typeof items = [];
    const outOfStock: typeof items = [];

    for (const item of items) {
      if (item.product.isOutOfStock) {
        outOfStock.push(item);
      } else {
        inStock.push(item);
      }
    }

    return { inStockItems: inStock, outOfStockItems: outOfStock };
  }, [items]);

  const groupedInStock = useMemo(
    () => groupItemsByShop(inStockItems),
    [inStockItems],
  );

  const handleApplyCoupon = () => {
    setCouponCode(couponInput.trim());
    toast.success(t("couponApplied"));
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      {showSkeleton ? (
        <CartPageSkeleton />
      ) : (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{t("empty")}</p>
                {errorMessage ? (
                  <p className="text-sm text-destructive">{errorMessage}</p>
                ) : null}
                {!userId ? (
                  <p className="text-sm text-muted-foreground">
                    {t("loginRequired")}
                  </p>
                ) : null}
              </div>
            ) : (
              <>
                {groupedInStock.map(([shopKey, shopItems]) => (
                  <Card
                    key={shopKey}
                    className="rounded-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        {shopItems[0]?.product.shopName ?? t("defaultShop")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {shopItems.map(({ id, product, quantity }) => (
                        <CartLineItem
                          key={id}
                          id={id}
                          product={product}
                          quantity={quantity}
                          locale={locale}
                        />
                      ))}
                    </CardContent>
                  </Card>
                ))}

                {outOfStockItems.length > 0 ? (
                  <Card className="rounded-md border-destructive/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-destructive">
                        {t("outOfStock")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 opacity-70">
                      {outOfStockItems.map(({ id, product, quantity }) => (
                        <CartLineItem
                          key={id}
                          id={id}
                          product={product}
                          quantity={quantity}
                          locale={locale}
                        />
                      ))}
                    </CardContent>
                  </Card>
                ) : null}

                <Card className="rounded-md">
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="coupon">{t("couponCode")}</Label>
                      <Input
                        id="coupon"
                        value={couponInput}
                        onChange={event => setCouponInput(event.target.value)}
                        placeholder={t("couponPlaceholder")}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleApplyCoupon}>
                      {t("applyCoupon")}
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
            <Separator />
            <Button
              variant="outline"
              asChild>
              <Link href={`/${locale}/products`}>{t("continueShopping")}</Link>
            </Button>
          </div>
          <OrderSummary locale={locale} />
        </section>
      )}
    </PageShell>
  );
}
