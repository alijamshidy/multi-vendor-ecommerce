"use client";

import CartLineItem from "@/components/commerce/CartLineItem";
import OrderSummary from "@/components/commerce/OrderSummary";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useStoreInit } from "@/hooks/use-store-init";
import useCartStore from "@/store/cartStore";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CartPageContent({ locale }: { locale: string }) {
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");
  const items = useCartStore(state => state.items);
  const fetchItems = useCartStore(state => state.fetchItems);
  const isLoading = useCartStore(state => state.loading.fetchItems);

  useStoreInit(() => fetchItems());

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          {isLoading && items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {tCommon("loadingCart")}
            </p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
          ) : (
            items.map(({ product, quantity }) => (
              <CartLineItem
                key={product.id}
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
    </PageShell>
  );
}
