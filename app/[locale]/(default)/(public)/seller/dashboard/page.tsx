import PageHeader from "@/components/commerce/PageHeader";
import SummaryCard from "@/components/commerce/SummaryCard";
import Container from "@/components/Global/Container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, PackageSearch, ShoppingBag, Store } from "lucide-react";

export default function SellerDashboardPage() {
  return (
    <Container className="mt-8 space-y-8 md:mt-36">
      <PageHeader
        eyebrow="Seller"
        title="Seller workspace"
        description="Manage listings, fulfillment, and sales performance from one responsive surface."
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Active listings"
          value="24"
          icon={Store}
        />
        <SummaryCard
          label="Pending orders"
          value="8"
          icon={PackageSearch}
        />
        <SummaryCard
          label="Sales"
          value="$4.8k"
          icon={DollarSign}
        />
        <SummaryCard
          label="Stock alerts"
          value="3"
          icon={ShoppingBag}
        />
      </section>
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle>Fulfillment queue</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {["Pack order #2401", "Confirm stock for speakers", "Review return request"].map(
            task => (
              <div
                key={task}
                className="flex flex-col gap-2 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between">
                <span>{task}</span>
                <Badge className="w-fit">Today</Badge>
              </div>
            ),
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
