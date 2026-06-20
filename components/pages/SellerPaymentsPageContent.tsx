"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import SummaryCard from "@/components/commerce/SummaryCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/utils/format";
import { DollarSign, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

const MOCK_HISTORY = Array.from({ length: 15 }, (_, index) => ({
  id: index + 1,
  amount: 200 + index * 50,
  status: index % 2 === 0 ? "pending" : "paid",
  date: `2024-0${(index % 9) + 1}-20`,
}));

export default function SellerPaymentsPageContent() {
  const t = useTranslations("sellerPayments");
  const [amount, setAmount] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success(t("requestSubmitted"));
    setAmount("");
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label={t("totalSales")}
          value={formatCurrency(3434)}
          icon={DollarSign}
        />
        <SummaryCard
          label={t("availableAmount")}
          value={formatCurrency(150)}
          icon={Wallet}
        />
        <SummaryCard
          label={t("withdrawalAmount")}
          value={formatCurrency(100)}
          icon={Wallet}
        />
        <SummaryCard
          label={t("pendingAmount")}
          value={formatCurrency(0)}
          icon={Wallet}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>{t("sendRequest")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="withdrawAmount">{t("amount")}</Label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  min={0}
                  value={amount}
                  onChange={event => setAmount(event.target.value)}
                  placeholder={t("amountPlaceholder")}
                  required
                />
              </div>
              <Button type="submit">{t("submitRequest")}</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>{t("paymentHistory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px]">
              <div className="space-y-2">
                {MOCK_HISTORY.map(row => (
                  <div
                    key={row.id}
                    className="flex items-center justify-between rounded-md border p-3 text-sm">
                    <div>
                      <p className="font-medium">{formatCurrency(row.amount)}</p>
                      <p className="text-muted-foreground">{row.date}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="capitalize">
                      {row.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
