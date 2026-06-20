"use client";

import DashboardSalesChart from "@/components/commerce/DashboardSalesChart";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import SummaryCard from "@/components/commerce/SummaryCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStoreInit } from "@/hooks/use-store-init";
import { Link } from "@/i18n/navigation";
import useManagementStore from "@/store/managementStore";
import useOrderStore from "@/store/orderStore";
import { formatCurrency } from "@/utils/format";
import { DollarSign, PackageSearch, ShoppingBag, Store } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SellerDashboardPageContent() {
  const t = useTranslations("sellerDashboard");
  const sellerOrders = useOrderStore(state => state.sellerOrders);
  const fetchSellerOrders = useOrderStore(state => state.fetchSellerOrders);
  const isLoadingOrders = useOrderStore(
    state => state.loading.fetchSellerOrders,
  );
  const products = useManagementStore(state => state.products);
  const fetchProducts = useManagementStore(state => state.fetchProducts);
  const isLoadingProducts = useManagementStore(
    state => state.loading.fetchProducts,
  );

  useStoreInit(async () => {
    await Promise.all([
      fetchSellerOrders(),
      fetchProducts({ page: 1, parPage: 100 }),
    ]);
  });

  const activeListings = products.length;
  const pendingOrders = sellerOrders.filter(
    order => order.status.toLowerCase() !== "delivered",
  ).length;
  const totalSales = sellerOrders.reduce((sum, order) => sum + order.total, 0);
  const lowStock = products.filter(
    product => product.stock != null && product.stock <= 5,
  ).length;

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label={t("activeListings")}
          value={
            isLoadingProducts && products.length === 0
              ? "—"
              : String(activeListings)
          }
          icon={Store}
        />
        <SummaryCard
          label={t("pendingOrders")}
          value={
            isLoadingOrders && sellerOrders.length === 0
              ? "—"
              : String(pendingOrders)
          }
          icon={PackageSearch}
        />
        <SummaryCard
          label={t("sales")}
          value={
            isLoadingOrders && sellerOrders.length === 0
              ? "—"
              : formatCurrency(totalSales)
          }
          icon={DollarSign}
        />
        <SummaryCard
          label={t("stockAlerts")}
          value={
            isLoadingProducts && products.length === 0
              ? "—"
              : String(lowStock)
          }
          icon={ShoppingBag}
        />
      </section>
      <DashboardSalesChart />
      <Card className="rounded-md">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>{t("fulfillmentQueue")}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            asChild>
            <Link href="/seller/orders">{t("viewOrders")}</Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3">
          {isLoadingOrders && sellerOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("loading")}</p>
          ) : sellerOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noOrders")}</p>
          ) : (
            sellerOrders.slice(0, 5).map(order => (
              <div
                key={order.fullId}
                className="flex flex-col gap-2 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between">
                <span>{t("orderLabel", { id: order.id })}</span>
                <Badge className="w-fit capitalize">{order.statusLabel}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
