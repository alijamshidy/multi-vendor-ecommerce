import OrderSummary from "@/components/commerce/OrderSummary";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import ProductFeatureList from "@/components/commerce/ProductFeatureList";
import ProductButton from "@/components/products/ProductButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/format";
import { Products } from "@/utils/products";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const product = Products.find(item => item.id === id);

  if (!product) {
    notFound();
  }

  const features = [
    { icon: Truck, text: "Estimated delivery in 3-5 business days" },
    { icon: ShieldCheck, text: "Buyer protection included" },
    { icon: CheckCircle2, text: "Quality checked before shipping" },
  ];

  return (
    <PageShell>
      <PageHeader
        eyebrow={product.category}
        title={product.label}
        description={product.description}
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="rounded-md">
          <CardContent className="grid gap-6 p-4 md:grid-cols-2 md:p-6">
            <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
              <Image
                src={product.images[0].url}
                alt={product.label}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <Badge className="w-fit">Verified seller</Badge>
                <p className="text-3xl font-semibold">
                  {formatCurrency(product.price)}
                </p>
                <p className="leading-7 text-muted-foreground">
                  Reliable marketplace item with protected checkout, fast
                  dispatch, and support from the vendor team.
                </p>
                <ProductFeatureList features={features} />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  className="flex-1"
                  asChild>
                  <Link href={`/${locale}/cart`}>Add to cart</Link>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  asChild>
                  <Link href={`/${locale}/wishlist`}>Save item</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <OrderSummary locale={locale} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">More actions</h2>
          <Separator className="hidden flex-1 sm:block" />
        </div>
        <div className="flex flex-wrap gap-2">
          <ProductButton type="wishlist" />
          <ProductButton type="details" />
          <ProductButton type="addToCart" />
        </div>
      </section>
    </PageShell>
  );
}
