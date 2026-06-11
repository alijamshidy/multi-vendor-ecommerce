"use client";



import PageHeader from "@/components/commerce/PageHeader";

import PageShell from "@/components/commerce/PageShell";

import SummaryCard from "@/components/commerce/SummaryCard";

import BorderedListSkeleton from "@/components/commerce/BorderedListSkeleton";

import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useStoreInit } from "@/hooks/use-store-init";

import useAdminStore from "@/store/adminStore";

import { formatCurrency } from "@/utils/format";

import { DollarSign, ReceiptText, ShoppingBag, TrendingUp } from "lucide-react";

import { useTranslations } from "next-intl";



type SalesOverviewProps = {

  role: "admin" | "seller";

};



function findCheckpointTotal(

  checkpoints: Array<{ name: string; total: number }>,

  keywords: string[],

): number | null {

  const match = checkpoints.find(checkpoint =>

    keywords.some(keyword =>

      checkpoint.name.toLowerCase().includes(keyword),

    ),

  );

  return match?.total ?? null;

}



export default function SalesOverview({ role }: SalesOverviewProps) {

  const t = useTranslations("admin");

  const isAdmin = role === "admin";

  const checkpoints = useAdminStore(state => state.checkpoints);

  const sales = useAdminStore(state => state.sales);

  const orders = useAdminStore(state => state.orders);

  const errorMessage = useAdminStore(state => state.errorMessage);

  const ordersError = useAdminStore(state => state.ordersError);

  const fetchDashboardTotals = useAdminStore(state => state.fetchDashboardTotals);

  const fetchSales = useAdminStore(state => state.fetchSales);

  const fetchManagementOrders = useAdminStore(

    state => state.fetchManagementOrders,

  );

  const isLoadingTotals = useAdminStore(state => state.loading.fetchTotals);
  const isLoadingSales = useAdminStore(state => state.loading.fetchSales);
  const isLoadingOrders = useAdminStore(state => state.loading.fetchOrders);
  const isLoading = isLoadingTotals || isLoadingSales || isLoadingOrders;



  useStoreInit(() => {

    void fetchDashboardTotals();

    void fetchSales(1);

    void fetchManagementOrders({ page: 1 });

  });



  const revenueTotal =

    findCheckpointTotal(checkpoints, ["revenue", "sale", "gmv", "amount"]) ?? 0;

  const ordersTotal =

    findCheckpointTotal(checkpoints, ["order"]) ?? orders.length;



  return (

    <PageShell>

      <PageHeader

        eyebrow={isAdmin ? t("adminRole") : t("seller")}

        title={isAdmin ? t("platformSales") : t("yourSales")}

        description={

          isAdmin ? t("platformDescription") : t("sellerDescription")

        }

      />



      {errorMessage ? (

        <p className="text-sm text-destructive">{errorMessage}</p>

      ) : null}



      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard

          label={t("revenue")}

          value={

            isLoading && checkpoints.length === 0

              ? "—"

              : formatCurrency(revenueTotal)

          }

          icon={DollarSign}

        />

        <SummaryCard

          label={t("orders")}

          value={

            isLoading && orders.length === 0 ? "—" : String(ordersTotal)

          }

          icon={ReceiptText}

        />

        <SummaryCard

          label={t("growth")}

          value={

            sales.length > 0

              ? String(

                  sales.reduce((sum, item) => sum + item.numOrders, 0),

                )

              : "—"

          }

          icon={TrendingUp}

        />

        <SummaryCard

          label={isAdmin ? t("activeSellers") : t("customers")}

          value={

            sales.length > 0

              ? String(sales.length)

              : "—"

          }

          icon={ShoppingBag}

        />

      </section>



      <Card className="rounded-md">

        <CardHeader>

          <CardTitle>{t("recentTransactions")}</CardTitle>

        </CardHeader>

        <CardContent className="space-y-3">

          {ordersError ? (
            <p className="text-sm text-destructive">{ordersError}</p>
          ) : null}

          {isLoading && orders.length === 0 ? (

            <BorderedListSkeleton
              count={5}
              columns={4}
            />

          ) : orders.length === 0 ? (

            <p className="text-sm text-muted-foreground">{t("noOrders")}</p>

          ) : (

            orders.slice(0, 10).map(order => (

              <div

                key={order.fullId}

                className="grid gap-2 rounded-md border p-4 sm:grid-cols-4 sm:items-center">

                <p className="font-medium">#{order.id}</p>

                <p className="text-sm text-muted-foreground">

                  {order.itemsCount} {t("items")}

                </p>

                <Badge

                  variant={order.status === 4 ? "secondary" : "default"}

                  className="w-fit">

                  {order.statusLabel}

                </Badge>

                <p className="font-semibold sm:text-end">

                  {formatCurrency(order.total)}

                </p>

              </div>

            ))

          )}

        </CardContent>

      </Card>



      <Card className="rounded-md">

        <CardHeader>

          <CardTitle>{t("topProducts")}</CardTitle>

        </CardHeader>

        <CardContent className="space-y-3">

          {isLoading && sales.length === 0 ? (

            <BorderedListSkeleton count={5} />

          ) : sales.length === 0 ? (

            <p className="text-sm text-muted-foreground">{t("noSalesData")}</p>

          ) : (

            sales.slice(0, 10).map(item => (

              <div

                key={item.id}

                className="grid gap-2 rounded-md border p-4 sm:grid-cols-3 sm:items-center">

                <p className="font-medium capitalize">{item.name}</p>

                <p className="text-sm text-muted-foreground">

                  {t("ordersCount", { count: item.numOrders })}

                </p>

                <p className="font-semibold sm:text-end">

                  {formatCurrency(item.totalSale)}

                </p>

              </div>

            ))

          )}

        </CardContent>

      </Card>

    </PageShell>

  );

}


