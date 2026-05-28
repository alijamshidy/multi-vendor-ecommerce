import { formatCurrency } from "@/utils/format";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { cartSubtotal, orderTotal, shipping, tax } from "./MockCart";

type OrderSummaryProps = {
  locale: string;
  showCheckoutButton?: boolean;
};

export default function OrderSummary({
  locale,
  showCheckoutButton = true,
}: OrderSummaryProps) {
  return (
    <Card className="rounded-md">
      <CardHeader>
        <CardTitle>Order summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SummaryRow
          label="Subtotal"
          value={formatCurrency(cartSubtotal)}
        />
        <SummaryRow
          label="Shipping"
          value={formatCurrency(shipping)}
        />
        <SummaryRow
          label="Tax"
          value={formatCurrency(tax)}
        />
        <Separator />
        <SummaryRow
          label="Total"
          value={formatCurrency(orderTotal)}
          strong
        />
        {showCheckoutButton ? (
          <Button
            className="w-full"
            asChild>
            <Link href={`/${locale}/checkout`}>Checkout</Link>
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
