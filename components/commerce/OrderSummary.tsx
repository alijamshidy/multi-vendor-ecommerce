"use client";

import { formatCurrency } from "@/utils/format";
import Link from "next/link";
import useCartStore from "@/store/cartStore";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { useTranslations } from "next-intl";

type OrderSummaryProps = {
  locale: string;
  showCheckoutButton?: boolean;
};

export default function OrderSummary({
  locale,
  showCheckoutButton = true,
}: OrderSummaryProps) {
  const t = useTranslations("cart");
  const subtotal = useCartStore(state => state.subtotal);
  const shipping = useCartStore(state => state.shipping);
  const tax = useCartStore(state => state.tax);
  const orderTotal = useCartStore(state => state.orderTotal);

  return (
    <Card className="rounded-md">
      <CardHeader>
        <CardTitle>{t("orderSummary")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SummaryRow
          label={t("subtotal")}
          value={formatCurrency(subtotal)}
        />
        <SummaryRow
          label={t("shipping")}
          value={formatCurrency(shipping)}
        />
        <SummaryRow
          label={t("tax")}
          value={formatCurrency(tax)}
        />
        <Separator />
        <SummaryRow
          label={t("total")}
          value={formatCurrency(orderTotal)}
          strong
        />
        {showCheckoutButton ? (
          <Button
            className="w-full"
            asChild>
            <Link href={`/${locale}/checkout/shipping`}>{t("checkout")}</Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

function SummaryRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <p className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={strong ? "text-base font-semibold" : "font-medium"}>
        {value}
      </span>
    </p>
  );
}
