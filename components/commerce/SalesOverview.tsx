"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import SummaryCard from "@/components/commerce/SummaryCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { DollarSign, ReceiptText, TrendingUp, Users } from "lucide-react";
import { useTranslations } from "next-intl";

type SalesOverviewProps = {
  role: "admin" | "seller";
};

const salesRows = [
  { id: "S-2401", customer: "Ali R.", total: 218, status: "Completed" as const },
  { id: "S-2398", customer: "Sara M.", total: 126, status: "Completed" as const },
  { id: "S-2391", customer: "Reza K.", total: 342, status: "Pending" as const },
];

export default function SalesOverview({ role }: SalesOverviewProps) {
  const t = useTranslations("admin");
  const isAdmin = role === "admin";

  return (
    <PageShell>
      <PageHeader
        eyebrow={isAdmin ? t("adminRole") : t("seller")}
        title={isAdmin ? t("platformSales") : t("yourSales")}
        description={
          isAdmin ? t("platformDescription") : t("sellerDescription")
        }
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label={t("revenue")}
          value={formatCurrency(isAdmin ? 24800 : 4800)}
          icon={DollarSign}
        />
        <SummaryCard
          label={t("orders")}
          value={isAdmin ? "186" : "42"}
          icon={ReceiptText}
        />
        <SummaryCard
          label={t("growth")}
          value={isAdmin ? "+12%" : "+8%"}
          icon={TrendingUp}
        />
        <SummaryCard
          label={isAdmin ? t("activeSellers") : t("customers")}
          value={isAdmin ? "34" : "28"}
          icon={Users}
        />
      </section>
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle>{t("recentTransactions")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {salesRows.map(row => (
            <div
              key={row.id}
              className="grid gap-2 rounded-md border p-4 sm:grid-cols-4 sm:items-center">
              <p className="font-medium">{row.id}</p>
              <p className="text-sm text-muted-foreground">{row.customer}</p>
              <Badge
                variant={row.status === "Completed" ? "secondary" : "default"}
                className="w-fit">
                {row.status === "Completed"
                  ? t("completed")
                  : t("pending")}
              </Badge>
              <p className="font-semibold sm:text-end">
                {formatCurrency(row.total)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
