"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import SummaryCard from "@/components/commerce/SummaryCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useStoreInit } from "@/hooks/use-store-init";
import useOrderStore from "@/store/orderStore";
import { formatCurrency } from "@/utils/format";
import { Clock3, PackageCheck, ReceiptText } from "lucide-react";
import { useTranslations } from "next-intl";

export default function OrdersPageContent() {
  const t = useTranslations("orders");
  const tCommon = useTranslations("common");
  const orders = useOrderStore(state => state.orders);
  const fetchOrders = useOrderStore(state => state.fetchOrders);
  const isLoading = useOrderStore(state => state.loading.fetchOrders);

  useStoreInit(() => fetchOrders());

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
          <p className="text-sm text-muted-foreground">
            {tCommon("loadingOrders")}
          </p>
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
