"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import BorderedListSkeleton from "@/components/commerce/BorderedListSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStoreInit } from "@/hooks/use-store-init";
import { Link } from "@/i18n/navigation";
import useOrderStore from "@/store/orderStore";
import { formatCurrency } from "@/utils/format";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export default function SellerOrdersPageContent() {
  const t = useTranslations("sellerOrders");
  const orders = useOrderStore(state => state.sellerOrders);
  const fetchSellerOrders = useOrderStore(state => state.fetchSellerOrders);
  const updateOrderStatus = useOrderStore(state => state.updateOrderStatus);
  const isLoading = useOrderStore(state => state.loading.fetchSellerOrders);
  const isUpdating = useOrderStore(state => state.loading.updateStatus);
  const errorMessage = useOrderStore(state => state.errorMessage);
  const [statusDrafts, setStatusDrafts] = useState<Record<string, string>>({});

  useStoreInit(() => fetchSellerOrders());

  const handleStatusUpdate = async (orderId: string) => {
    const status = statusDrafts[orderId];
    if (!status) return;

    try {
      await updateOrderStatus({ orderId, status, role: "seller" });
      toast.success(t("statusUpdated"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("statusUpdateFailed"),
      );
    }
  };

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
              key={order.fullId}
              className="rounded-md">
              <CardContent className="grid gap-4 p-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
                <div className="space-y-1">
                  <p className="font-medium">#{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("itemsCount", { count: order.itemsCount })}
                  </p>
                  <Badge
                    variant={
                      order.status.toLowerCase() === "delivered"
                        ? "secondary"
                        : "default"
                    }
                    className="w-fit capitalize">
                    {order.statusLabel}
                  </Badge>
                </div>
                <p className="font-semibold">{formatCurrency(order.total)}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild>
                    <Link href={`/seller/orders/${order.fullId}`}>
                      {t("viewDetails")}
                    </Link>
                  </Button>
                  <Select
                    value={statusDrafts[order.fullId] ?? order.status}
                    onValueChange={value =>
                      setStatusDrafts(current => ({
                        ...current,
                        [order.fullId]: value,
                      }))
                    }>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={t("selectStatus")} />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(status => (
                        <SelectItem
                          key={status}
                          value={status}
                          className="capitalize">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    disabled={isUpdating}
                    onClick={() => void handleStatusUpdate(order.fullId)}>
                    {t("updateStatus")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </section>
    </PageShell>
  );
}
