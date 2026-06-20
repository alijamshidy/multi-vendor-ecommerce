"use client";

import type { ReactNode } from "react";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import BorderedListSkeleton from "@/components/commerce/BorderedListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStoreInit } from "@/hooks/use-store-init";
import { Link } from "@/i18n/navigation";
import useSellerStore from "@/store/sellerStore";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function AdminSellersPageContent() {
  const t = useTranslations("sellers");
  const pendingSellers = useSellerStore(state => state.pendingSellers);
  const activeSellers = useSellerStore(state => state.activeSellers);
  const deactiveSellers = useSellerStore(state => state.deactiveSellers);
  const fetchPendingSellers = useSellerStore(state => state.fetchPendingSellers);
  const fetchActiveSellers = useSellerStore(state => state.fetchActiveSellers);
  const fetchDeactiveSellers = useSellerStore(
    state => state.fetchDeactiveSellers,
  );
  const updateSellerStatus = useSellerStore(state => state.updateSellerStatus);
  const errorMessage = useSellerStore(state => state.errorMessage);
  const isLoadingPending = useSellerStore(state => state.loading.fetchPending);
  const isLoadingActive = useSellerStore(state => state.loading.fetchActive);
  const isLoadingDeactive = useSellerStore(state => state.loading.fetchDeactive);
  const isUpdating = useSellerStore(state => state.loading.updateStatus);

  useStoreInit(async () => {
    await Promise.all([
      fetchPendingSellers(),
      fetchActiveSellers(),
      fetchDeactiveSellers(),
    ]);
  });

  const handleStatusUpdate = async (
    sellerId: string,
    status: "active" | "deactive",
  ) => {
    try {
      await updateSellerStatus({ sellerId, status });
      toast.success(
        status === "active" ? t("approvedSuccess") : t("deactivatedSuccess"),
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("statusUpdateFailed"),
      );
    }
  };

  const renderSellerList = (
    sellers: typeof pendingSellers,
    isLoading: boolean,
    emptyMessage: string,
    actions: (seller: (typeof pendingSellers)[number]) => ReactNode,
  ) => {
    if (isLoading && sellers.length === 0) {
      return <BorderedListSkeleton count={4} columns={4} />;
    }

    if (sellers.length === 0) {
      return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
    }

    return (
      <div className="space-y-3">
        {sellers.map(seller => (
          <Card
            key={seller.id}
            className="rounded-md">
            <CardContent className="grid gap-4 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <Avatar className="size-12">
                <AvatarImage
                  src={seller.imageUrl}
                  alt={seller.name}
                />
                <AvatarFallback>{seller.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="font-medium">{seller.name}</p>
                <p className="text-sm text-muted-foreground">{seller.email}</p>
                {seller.shopName ? (
                  <p className="text-sm text-muted-foreground">
                    {seller.shopName}
                  </p>
                ) : null}
                <Badge
                  variant="outline"
                  className="w-fit capitalize">
                  {seller.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  asChild>
                  <Link href={`/admin/sellers/${seller.id}`}>
                    <Eye className="me-1 size-4" />
                    {t("viewDetails")}
                  </Link>
                </Button>
                {actions(seller)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
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

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">{t("pendingTab")}</TabsTrigger>
          <TabsTrigger value="active">{t("activeTab")}</TabsTrigger>
          <TabsTrigger value="deactive">{t("deactiveTab")}</TabsTrigger>
        </TabsList>

        <TabsContent
          value="pending"
          className="mt-6">
          {renderSellerList(
            pendingSellers,
            isLoadingPending,
            t("noPending"),
            seller => (
              <>
                <Button
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => void handleStatusUpdate(seller.id, "active")}>
                  {t("approve")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isUpdating}
                  onClick={() => void handleStatusUpdate(seller.id, "deactive")}>
                  {t("reject")}
                </Button>
              </>
            ),
          )}
        </TabsContent>

        <TabsContent
          value="active"
          className="mt-6">
          {renderSellerList(
            activeSellers,
            isLoadingActive,
            t("noActive"),
            seller => (
              <Button
                size="sm"
                variant="outline"
                disabled={isUpdating}
                onClick={() => void handleStatusUpdate(seller.id, "deactive")}>
                {t("deactivate")}
              </Button>
            ),
          )}
        </TabsContent>

        <TabsContent
          value="deactive"
          className="mt-6">
          {renderSellerList(
            deactiveSellers,
            isLoadingDeactive,
            t("noDeactive"),
            seller => (
              <Button
                size="sm"
                disabled={isUpdating}
                onClick={() => void handleStatusUpdate(seller.id, "active")}>
                {t("reactivate")}
              </Button>
            ),
          )}
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
