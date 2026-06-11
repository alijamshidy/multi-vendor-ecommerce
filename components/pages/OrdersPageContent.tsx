"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import SummaryCard from "@/components/commerce/SummaryCard";
import OrderFilterPanel from "@/components/orders/OrderFilterPanel";
import BorderedListSkeleton from "@/components/commerce/BorderedListSkeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useStoreInit } from "@/hooks/use-store-init";
import { buildOrderQueryFromSearchParams } from "@/lib/order-query";
import useOrderStore from "@/store/orderStore";
import { formatCurrency } from "@/utils/format";
import { Clock3, PackageCheck, ReceiptText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function OrdersPageContent() {
  const t = useTranslations("orders");
  const searchParams = useSearchParams();
  const queryKey = searchParams.toString();
  const orders = useOrderStore(state => state.orders);
  const fetchOrders = useOrderStore(state => state.fetchOrders);
  const isLoading = useOrderStore(state => state.loading.fetchOrders);

  useStoreInit(
    () => fetchOrders(buildOrderQueryFromSearchParams(searchParams)),
    [queryKey],
  );

  const openOrders = orders.filter(order => order.status !== "Delivered").length;
  const deliveredOrders = orders.filter(
    order => order.status === "Delivered",
  ).length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <OrderFilterPanel />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          label={t("openOrders")}
          value={String(openOrders)}
          icon={Clock3}
        />
        <SummaryCard
          label={t("delivered")}
          value={String(deliveredOrders)}
          icon={PackageCheck}
        />
        <SummaryCard
          label={t("totalSpent")}
          value={formatCurrency(totalSpent)}
          icon={ReceiptText}
        />
      </section>
      <section className="space-y-4">
        {isLoading && orders.length === 0 ? (
          <BorderedListSkeleton
            count={5}
            columns={4}
          />
        ) : orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          orders.map(order => (
            <Card
              key={order.id}
              className="rounded-md">
              <CardContent className="grid gap-3 p-4 sm:grid-cols-4 sm:items-center">
                <p className="font-medium">{order.id}</p>
                <Badge
                  variant={
                    order.status === "Delivered" ? "secondary" : "default"
                  }
                  className="w-fit">
                  {order.status}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {tCommon("itemCount", { count: order.items })}
                </p>
                <p className="font-semibold sm:text-end">
                  {formatCurrency(order.total)}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </section>
    </PageShell>
  );
}
