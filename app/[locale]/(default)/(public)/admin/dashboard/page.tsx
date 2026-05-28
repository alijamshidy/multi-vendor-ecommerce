import PageHeader from "@/components/commerce/PageHeader";
import SummaryCard from "@/components/commerce/SummaryCard";
import Container from "@/components/Global/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, CircleDollarSign, UsersRound, Warehouse } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <Container className="mt-8 space-y-8 md:mt-36">
      <PageHeader
        eyebrow="Admin"
        title="Marketplace overview"
        description="Operational metrics for sellers, listings, orders, and platform health."
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Sellers"
          value="128"
          icon={UsersRound}
        />
        <SummaryCard
          label="Listings"
          value="2.4k"
          icon={Warehouse}
        />
        <SummaryCard
          label="GMV"
          value="$82k"
          icon={CircleDollarSign}
        />
        <SummaryCard
          label="Verified"
          value="94%"
          icon={BadgeCheck}
        />
      </section>
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle>Platform checks</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {["Seller onboarding", "Payment reviews", "Catalog moderation"].map(
            item => (
              <div
                key={item}
                className="rounded-md border p-4">
                <p className="font-medium">{item}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Queue is healthy and ready for real data integration.
                </p>
              </div>
            ),
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
