"use client";

import DashboardSalesChart from "@/components/commerce/DashboardSalesChart";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import SummaryCard from "@/components/commerce/SummaryCard";
import SummaryCardsSkeleton from "@/components/commerce/SummaryCardsSkeleton";
import BorderedListSkeleton from "@/components/commerce/BorderedListSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStoreInit } from "@/hooks/use-store-init";
import useAdminStore from "@/store/adminStore";
import { formatCurrency } from "@/utils/format";
import {
  CircleDollarSign,
  Package,
  ReceiptText,
  ShoppingBag,
  TrendingUp,
  UsersRound,
  Warehouse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const CHECKPOINT_ICONS: LucideIcon[] = [
  CircleDollarSign,
  ReceiptText,
  ShoppingBag,
  Warehouse,
  UsersRound,
  TrendingUp,
  Package,
];

function formatCheckpointValue(name: string, total: number): string {
  const lower = name.toLowerCase();
  if (
    lower.includes("revenue") ||
    lower.includes("price") ||
    lower.includes("gmv") ||
    lower.includes("sale") ||
    lower.includes("amount")
  ) {
    return formatCurrency(total);
  }
  return String(total);
}

export default function AdminDashboardPageContent() {
  const t = useTranslations("adminDashboard");
  const checkpoints = useAdminStore(state => state.checkpoints);
  const orders = useAdminStore(state => state.orders);
  const errorMessage = useAdminStore(state => state.errorMessage);
  const ordersError = useAdminStore(state => state.ordersError);
  const fetchDashboardTotals = useAdminStore(state => state.fetchDashboardTotals);
  const isLoadingTotals = useAdminStore(state => state.loading.fetchTotals);

  useStoreInit(() => {
    void fetchDashboardTotals();
  });

  const isLoading = isLoadingTotals && checkpoints.length === 0;

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      {errorMessage ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : null}

      {isLoading ? (
        <SummaryCardsSkeleton count={4} />
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {checkpoints.length > 0 ? (
            checkpoints.map((checkpoint, index) => (
              <SummaryCard
                key={`${checkpoint.index}-${checkpoint.name}`}
                label={checkpoint.name}
                value={formatCheckpointValue(
                  checkpoint.name,
                  checkpoint.total,
                )}
                icon={CHECKPOINT_ICONS[index % CHECKPOINT_ICONS.length]}
              />
            ))
          ) : (
            <>
              <SummaryCard
                label={t("orders")}
                value="—"
                icon={ReceiptText}
              />
              <SummaryCard
                label={t("revenue")}
                value="—"
                icon={CircleDollarSign}
              />
            </>
          )}
        </section>
      )}

      <DashboardSalesChart />

      <div className="grid gap-6">
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>{t("recentOrders")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ordersError ? (
              <p className="text-sm text-destructive">{ordersError}</p>
            ) : null}
            {isLoadingTotals && orders.length === 0 ? (
              <BorderedListSkeleton
                count={5}
                columns={4}
              />
            ) : orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("noOrders")}</p>
            ) : (
              orders.slice(0, 5).map(order => (
                <div
                  key={order.fullId}
                  className="grid gap-1 rounded-md border p-3 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <p className="font-medium">#{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.statusLabel}
                  </p>
                  <p className="font-semibold sm:text-end">
                    {formatCurrency(order.total)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
