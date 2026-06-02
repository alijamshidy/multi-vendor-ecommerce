import { mockCartItems } from "@/components/commerce/MockCart";
import CartLineItem from "@/components/commerce/CartLineItem";
import OrderSummary from "@/components/commerce/OrderSummary";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Cart"
        title="Review your cart"
        description="Check quantities, seller availability, and order totals before checkout."
      />
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          {mockCartItems.map(({ product, quantity }) => (
            <CartLineItem
              key={product.id}
              product={product}
              quantity={quantity}
              locale={locale}
            />
          ))}
          <Separator />
          <Button
            variant="outline"
            asChild>
            <Link href={`/${locale}/products`}>Continue shopping</Link>
          </Button>
        </div>
        <OrderSummary locale={locale} />
      </section>
    </PageShell>
  );
}
