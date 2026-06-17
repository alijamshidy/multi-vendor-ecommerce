"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStoreInit } from "@/hooks/use-store-init";
import { Link } from "@/i18n/navigation";
import type { AuthRole } from "@/lib/auth-types";
import useOrderStore from "@/store/orderStore";
import { formatCurrency } from "@/utils/format";
import { useTranslations } from "next-intl";

type OrderDetailPageContentProps = {
  orderId: string;
  role: AuthRole;
};

export default function OrderDetailPageContent({
  orderId,
  role,
}: OrderDetailPageContentProps) {
  const t = useTranslations("orderDetail");
  const order = useOrderStore(state => state.activeOrder);
  const errorMessage = useOrderStore(state => state.errorMessage);
  const fetchOrder = useOrderStore(state => state.fetchOrder);
  const fetchAdminOrder = useOrderStore(state => state.fetchAdminOrder);
  const fetchSellerOrder = useOrderStore(state => state.fetchSellerOrder);
  const isLoadingCustomer = useOrderStore(state => state.loading.fetchOrder);
  const isLoadingAdmin = useOrderStore(state => state.loading.fetchAdminOrder);
  const isLoadingSeller = useOrderStore(state => state.loading.fetchSellerOrder);

  const isLoading =
    role === "admin"
      ? isLoadingAdmin
      : role === "seller"
        ? isLoadingSeller
        : isLoadingCustomer;

  useStoreInit(() => {
    if (role === "admin") return fetchAdminOrder(orderId);
    if (role === "seller") return fetchSellerOrder(orderId);
    return fetchOrder(orderId);
  }, [orderId, role]);

  const backHref =
    role === "admin"
      ? "/admin/sales"
      : role === "seller"
        ? "/seller/orders"
        : "/orders";

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title", { id: order?.id ?? orderId.slice(0, 8).toUpperCase() })}
        description={t("description")}
      />

      <Button
        variant="outline"
        size="sm"
        asChild
        className="w-fit">
        <Link href={backHref}>{t("backToOrders")}</Link>
      </Button>

      {errorMessage ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : null}

      {isLoading && !order ? (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      ) : !order ? (
        <p className="text-sm text-muted-foreground">{t("notFound")}</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle>{t("summary")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("status")}
                </span>
                <Badge className="capitalize">{order.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("items")}
                </span>
                <span>{order.items}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("shipping")}
                </span>
                <span>{formatCurrency(order.shippingFee ?? 0)}</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>{t("total")}</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          {order.shippingInfo ? (
            <Card className="rounded-md">
              <CardHeader>
                <CardTitle>{t("shippingInfo")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {Object.entries(order.shippingInfo).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between gap-4">
                    <span className="capitalize text-muted-foreground">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-end">{String(value ?? "")}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {order.products && order.products.length > 0 ? (
            <Card className="rounded-md lg:col-span-2">
              <CardHeader>
                <CardTitle>{t("products")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.products.map((product, index) => {
                  const record = product as Record<string, unknown>;
                  const name =
                    String(record.name ?? record.productName ?? `Item ${index + 1}`);
                  const price = Number(record.price ?? 0);
                  const quantity = Number(record.quantity ?? 1);

                  return (
                    <div
                      key={`${name}-${index}`}
                      className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <p className="font-medium">{name}</p>
                        <p className="text-sm text-muted-foreground">
                          {t("quantity", { count: quantity })}
                        </p>
                      </div>
                      <p className="font-semibold">{formatCurrency(price)}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}
    </PageShell>
  );
}
