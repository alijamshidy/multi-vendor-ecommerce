import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import SummaryCard from "@/components/commerce/SummaryCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Package, ShoppingCart, UserRound } from "lucide-react";
import Link from "next/link";

export default async function CustomerDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Customer"
        title="Your dashboard"
        description="A compact overview of your marketplace activity."
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Cart items"
          value="6"
          icon={ShoppingCart}
        />
        <SummaryCard
          label="Wishlist"
          value="4"
          icon={Heart}
        />
        <SummaryCard
          label="Orders"
          value="3"
          icon={Package}
        />
        <SummaryCard
          label="Profile"
          value="Ready"
          icon={UserRound}
        />
      </section>
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild>
            <Link href={`/${locale}/products`}>Browse products</Link>
          </Button>
          <Button
            variant="outline"
            asChild>
            <Link href={`/${locale}/orders`}>View orders</Link>
          </Button>
          <Button
            variant="outline"
            asChild>
            <Link href={`/${locale}/wishlist`}>Open wishlist</Link>
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}
