"use client";

import CartLineItem from "@/components/commerce/CartLineItem";
import { CartPageSkeleton } from "@/components/commerce/CartItemsSkeleton";
import OrderSummary from "@/components/commerce/OrderSummary";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function CartPageContent({ locale }: { locale: string }) {
  const t = useTranslations("cart");
  const userId = useAuthStore(state => state.user?.id);
  const items = useCartStore(state => state.items);
  const fetchItems = useCartStore(state => state.fetchItems);
  const itemsFetched = useCartStore(state => state.itemsFetched);
  const errorMessage = useCartStore(state => state.errorMessage);
  const isLoading = useCartStore(state => state.loading.fetchItems);
  const showSkeleton = (isLoading || !itemsFetched) && items.length === 0;

  useEffect(() => {
    void fetchItems({ force: true });
  }, [fetchItems, userId]);

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
              items.map(({ id, product, quantity }) => (
                <CartLineItem
                  key={id}
                  id={id}
                  product={product}
                  quantity={quantity}
                  locale={locale}
                />
              ))
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
