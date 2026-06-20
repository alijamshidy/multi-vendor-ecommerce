"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStoreInit } from "@/hooks/use-store-init";
import { Link } from "@/i18n/navigation";
import useSellerStore from "@/store/sellerStore";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function AdminSellerDetailPageContent({
  sellerId,
}: {
  sellerId: string;
}) {
  const t = useTranslations("sellers");
  const seller = useSellerStore(state => state.activeSeller);
  const fetchSeller = useSellerStore(state => state.fetchSeller);
  const updateSellerStatus = useSellerStore(state => state.updateSellerStatus);
  const errorMessage = useSellerStore(state => state.errorMessage);
  const isLoading = useSellerStore(state => state.loading.fetchSeller);
  const isUpdating = useSellerStore(state => state.loading.updateStatus);

  useStoreInit(() => fetchSeller(sellerId), [sellerId]);

  const handleStatusUpdate = async (status: "active" | "deactive") => {
    try {
      await updateSellerStatus({ sellerId, status });
      await fetchSeller(sellerId);
      toast.success(
        status === "active" ? t("approvedSuccess") : t("deactivatedSuccess"),
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("statusUpdateFailed"),
      );
    }
  };

  return (
    <PageShell>
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 w-fit"
        asChild>
        <Link href="/admin/sellers">
          <ArrowLeft className="me-2 size-4" />
          {t("backToSellers")}
        </Link>
      </Button>

      <PageHeader
        eyebrow={t("detailEyebrow")}
        title={seller?.name ?? t("sellerDetail")}
        description={seller?.shopName ?? t("description")}
      />

      {errorMessage ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : null}

      {isLoading && !seller ? (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      ) : seller ? (
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>{t("sellerInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-[auto_1fr]">
            <Avatar className="size-20">
              <AvatarImage
                src={seller.imageUrl}
                alt={seller.name}
              />
              <AvatarFallback>{seller.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="space-y-3">
              <p className="font-medium">{seller.name}</p>
              <p className="text-sm text-muted-foreground">{seller.email}</p>
              {seller.shopName ? (
                <p className="text-sm text-muted-foreground">{seller.shopName}</p>
              ) : null}
              <Badge
                variant="outline"
                className="w-fit capitalize">
                {seller.status}
              </Badge>
              <div className="flex flex-wrap gap-2 pt-2">
                {seller.status !== "active" ? (
                  <Button
                    size="sm"
                    disabled={isUpdating}
                    onClick={() => void handleStatusUpdate("active")}>
                    {t("approve")}
                  </Button>
                ) : null}
                {seller.status !== "deactive" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isUpdating}
                    onClick={() => void handleStatusUpdate("deactive")}>
                    {t("deactivate")}
                  </Button>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">{t("notFound")}</p>
      )}
    </PageShell>
  );
}
