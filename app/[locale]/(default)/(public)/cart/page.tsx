import { mockCartItems } from "@/components/commerce/MockCart";
import OrderSummary from "@/components/commerce/OrderSummary";
import PageHeader from "@/components/commerce/PageHeader";
import Container from "@/components/Global/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/format";
import Image from "next/image";
import Link from "next/link";

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <Container className="mt-8 space-y-8 md:mt-36">
      <PageHeader
        eyebrow="Cart"
        title="Review your cart"
        description="Check quantities, seller availability, and order totals before checkout."
      />
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          {mockCartItems.map(({ product, quantity }) => (
            <Card
              key={product.id}
              className="rounded-md">
              <CardContent className="grid gap-4 p-4 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
                <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                  <Image
                    src={product.images[0].url}
                    alt={product.label}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/${locale}/products/${product.id}`}
                    className="font-medium capitalize hover:text-primary">
                    {product.label}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {product.category}
                  </p>
                  <p className="mt-3 text-sm">Qty: {quantity}</p>
                </div>
                <p className="text-lg font-semibold">
                  {formatCurrency(product.price * quantity)}
                </p>
              </CardContent>
            </Card>
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
    </Container>
  );
}
