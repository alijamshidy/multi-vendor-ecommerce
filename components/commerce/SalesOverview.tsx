import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import SummaryCard from "@/components/commerce/SummaryCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { DollarSign, ReceiptText, TrendingUp, Users } from "lucide-react";

type SalesOverviewProps = {
  role: "admin" | "seller";
};

const salesRows = [
  { id: "S-2401", customer: "Ali R.", total: 218, status: "Completed" },
  { id: "S-2398", customer: "Sara M.", total: 126, status: "Completed" },
  { id: "S-2391", customer: "Reza K.", total: 342, status: "Pending" },
];

export default function SalesOverview({ role }: SalesOverviewProps) {
  const isAdmin = role === "admin";

  return (
    <PageShell>
      <PageHeader
        eyebrow={isAdmin ? "Admin" : "Seller"}
        title={isAdmin ? "Platform sales" : "Your sales"}
        description={
          isAdmin
            ? "Monitor marketplace revenue, order volume, and seller performance."
            : "Track revenue, recent orders, and fulfillment status from one view."
        }
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Revenue"
          value={formatCurrency(isAdmin ? 24800 : 4800)}
          icon={DollarSign}
        />
        <SummaryCard
          label="Orders"
          value={isAdmin ? "186" : "42"}
          icon={ReceiptText}
        />
        <SummaryCard
          label="Growth"
          value={isAdmin ? "+12%" : "+8%"}
          icon={TrendingUp}
        />
        <SummaryCard
          label={isAdmin ? "Active sellers" : "Customers"}
          value={isAdmin ? "34" : "28"}
          icon={Users}
        />
      </section>
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle>Recent transactions</CardTitle>
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
                {row.status}
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
