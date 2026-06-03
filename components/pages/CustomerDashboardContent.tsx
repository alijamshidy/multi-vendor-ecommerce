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

export default function CustomerDashboardContent({
  locale,
}: {
  locale: string;
}) {
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
        eyebrow="Customer"
        title="Your dashboard"
        description="A compact overview of your marketplace activity."
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Cart items"
          value={String(itemCount)}
          icon={ShoppingCart}
        />
        <SummaryCard
          label="Wishlist"
          value="—"
          icon={Heart}
        />
        <SummaryCard
          label="Orders"
          value={String(orders.length)}
          icon={Package}
        />
        <SummaryCard
          label="Profile"
          value={profile?.full_name ? "Ready" : "Incomplete"}
          icon={UserRound}
        />
      </section>
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild>
            <Link href={`/${locale}/products`}>Browse products</Link>
          </Button>
          <Button
            variant="outline"
            asChild>
            <Link href={`/${locale}/orders`}>View orders</Link>
          </Button>
          <Button
            variant="outline"
            asChild>
            <Link href={`/${locale}/wishlist`}>Open wishlist</Link>
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}
