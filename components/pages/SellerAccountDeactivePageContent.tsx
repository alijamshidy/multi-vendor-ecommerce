"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Card, CardContent } from "@/components/ui/card";
import { Ban } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SellerAccountDeactivePageContent() {
  const t = useTranslations("sellerAccount");

  return (
    <PageShell>
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <Ban className="size-16 text-destructive" />
        <PageHeader
          eyebrow={t("deactiveEyebrow")}
          title={t("deactiveTitle")}
          description={t("deactiveDescription")}
        />
        <Card className="max-w-lg rounded-md">
          <CardContent className="p-6 text-sm text-muted-foreground">
            {t("deactiveHint")}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
