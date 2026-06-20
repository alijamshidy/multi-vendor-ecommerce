"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SellerAccountPendingPageContent() {
  const t = useTranslations("sellerAccount");

  return (
    <PageShell>
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <Clock className="size-16 text-amber-500" />
        <PageHeader
          eyebrow={t("pendingEyebrow")}
          title={t("pendingTitle")}
          description={t("pendingDescription")}
        />
        <Card className="max-w-lg rounded-md">
          <CardContent className="p-6 text-sm text-muted-foreground">
            {t("pendingHint")}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
