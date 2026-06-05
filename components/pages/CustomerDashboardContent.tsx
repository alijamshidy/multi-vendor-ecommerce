"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import SummaryCard from "@/components/commerce/SummaryCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStoreInit } from "@/hooks/use-store-init";
import useCartStore from "@/store/cartStore";
import useOrderStore from "@/store/orderStore";
import useUserStore from "@/store/userStore";
import { Heart, Package, ShoppingCart, UserRound } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CustomerDashboardContent({
  locale,
}: {
  locale: string;
}) {
  const t = useTranslations("dashboard");
  const itemCount = useCartStore(state => state.itemCount);
  const fetchItems = useCartStore(state => state.fetchItems);
  const orders = useOrderStore(state => state.orders);
  const fetchOrders = useOrderStore(state => state.fetchOrders);
  const profile = useUserStore(state => state.profile);
  const fetchProfile = useUserStore(state => state.fetchProfile);

  useStoreInit(async () => {
    await Promise.all([fetchItems(), fetchOrders(), fetchProfile()]);
  });

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("customer")}
        title={t("title")}
        description={t("description")}
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label={t("cartItems")}
          value={String(itemCount)}
          icon={ShoppingCart}
        />
        <SummaryCard
          label={t("wishlist")}
          value="—"
          icon={Heart}
        />
        <SummaryCard
          label={t("orders")}
          value={String(orders.length)}
          icon={Package}
        />
        <SummaryCard
          label={t("profile")}
          value={profile?.full_name ? t("ready") : t("incomplete")}
          icon={UserRound}
        />
      </section>
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle>{t("quickActions")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild>
            <Link href={`/${locale}/products`}>{t("browseProducts")}</Link>
          </Button>
          <Button
            variant="outline"
            asChild>
            <Link href={`/${locale}/orders`}>{t("viewOrders")}</Link>
          </Button>
          <Button
            variant="outline"
            asChild>
            <Link href={`/${locale}/wishlist`}>{t("openWishlist")}</Link>
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}
