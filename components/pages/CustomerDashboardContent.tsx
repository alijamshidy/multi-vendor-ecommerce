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
import useWishlistStore from "@/store/wishlistStore";
import { formatCurrency } from "@/utils/format";
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
  const dashboard = useOrderStore(state => state.dashboard);
  const fetchCustomerDashboard = useOrderStore(
    state => state.fetchCustomerDashboard,
  );
  const fetchOrders = useOrderStore(state => state.fetchOrders);
  const wishlistCount = useWishlistStore(state => state.itemCount);
  const fetchWishlist = useWishlistStore(state => state.fetchItems);
  const profile = useUserStore(state => state.profile);
  const fetchProfile = useUserStore(state => state.fetchProfile);

  useStoreInit(async () => {
    await Promise.all([
      fetchItems(),
      fetchOrders(),
      fetchProfile(),
      fetchWishlist(),
      fetchCustomerDashboard(),
    ]);
  });

  const totalOrders = dashboard?.totalOrder ?? 0;
  const pendingOrders = dashboard?.pendingOrder ?? 0;

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
          value={String(wishlistCount)}
          icon={Heart}
        />
        <SummaryCard
          label={t("orders")}
          value={String(totalOrders)}
          icon={Package}
        />
        <SummaryCard
          label={t("profile")}
          value={profile?.full_name ? t("ready") : t("incomplete")}
          icon={UserRound}
        />
      </section>

      {dashboard?.recentOrders && dashboard.recentOrders.length > 0 ? (
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>{t("recentOrders")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboard.recentOrders.slice(0, 5).map(order => (
              <div
                key={order._id}
                className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="font-medium">
                    #{String(order._id).slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-sm capitalize text-muted-foreground">
                    {order.status ?? "pending"}
                  </p>
                </div>
                <p className="font-semibold">
                  {formatCurrency(Number(order.price ?? 0))}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

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
          <Button
            variant="outline"
            asChild>
            <Link href={`/${locale}/profile`}>{t("openProfile")}</Link>
          </Button>
          {pendingOrders > 0 ? (
            <p className="w-full text-sm text-muted-foreground">
              {t("pendingOrdersHint", { count: pendingOrders })}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </PageShell>
  );
}
