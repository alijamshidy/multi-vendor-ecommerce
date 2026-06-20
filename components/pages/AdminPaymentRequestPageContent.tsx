"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/utils/format";
import { useTranslations } from "next-intl";

const MOCK_WITHDRAWALS = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  amount: 500 + index * 120,
  status: index % 3 === 0 ? "confirmed" : "pending",
  date: `2024-0${(index % 9) + 1}-15`,
}));

export default function AdminPaymentRequestPageContent() {
  const t = useTranslations("paymentRequests");

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle>{t("withdrawalRequests")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 grid grid-cols-4 gap-2 text-xs font-medium uppercase text-muted-foreground">
            <span>{t("no")}</span>
            <span>{t("amount")}</span>
            <span>{t("status")}</span>
            <span>{t("date")}</span>
          </div>
          <ScrollArea className="h-[350px]">
            <div className="space-y-2">
              {MOCK_WITHDRAWALS.map(row => (
                <div
                  key={row.id}
                  className="grid grid-cols-4 items-center gap-2 rounded-md border p-2 text-sm">
                  <span>{row.id}</span>
                  <span>{formatCurrency(row.amount)}</span>
                  <Badge
                    variant="outline"
                    className="w-fit capitalize">
                    {row.status}
                  </Badge>
                  <div className="flex items-center justify-between gap-2">
                    <span>{row.date}</span>
                    {row.status === "pending" ? (
                      <Button
                        size="sm"
                        variant="outline">
                        {t("confirm")}
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </PageShell>
  );
}
