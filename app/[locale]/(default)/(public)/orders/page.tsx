import PageHeader from "@/components/commerce/PageHeader";
import SummaryCard from "@/components/commerce/SummaryCard";
import Container from "@/components/Global/Container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { Clock3, PackageCheck, ReceiptText } from "lucide-react";

const orders = [
  { id: "ORD-2401", status: "Processing", total: 218, items: 3 },
  { id: "ORD-2398", status: "Delivered", total: 126, items: 1 },
  { id: "ORD-2391", status: "Delivered", total: 342, items: 4 },
];

export default function OrdersPage() {
  return (
    <Container className="mt-8 space-y-8 md:mt-36">
      <PageHeader
        eyebrow="Orders"
        title="Order history"
        description="Track purchases, review order totals, and keep recent deliveries easy to scan."
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          label="Open orders"
          value="1"
          icon={Clock3}
        />
        <SummaryCard
          label="Delivered"
          value="2"
          icon={PackageCheck}
        />
        <SummaryCard
          label="Total spent"
          value={formatCurrency(686)}
          icon={ReceiptText}
        />
      </section>
      <section className="space-y-4">
        {orders.map(order => (
          <Card
            key={order.id}
            className="rounded-md">
            <CardContent className="grid gap-3 p-4 sm:grid-cols-4 sm:items-center">
              <p className="font-medium">{order.id}</p>
              <Badge
                variant={order.status === "Delivered" ? "secondary" : "default"}
                className="w-fit">
                {order.status}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {order.items} item{order.items > 1 ? "s" : ""}
              </p>
              <p className="font-semibold sm:text-right">
                {formatCurrency(order.total)}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </Container>
  );
}
