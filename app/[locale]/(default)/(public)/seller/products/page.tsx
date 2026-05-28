import PageHeader from "@/components/commerce/PageHeader";
import Container from "@/components/Global/Container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Products } from "@/utils/products";

export default function SellerProductsPage() {
  return (
    <Container className="mt-8 space-y-8 md:mt-36">
      <PageHeader
        eyebrow="Seller"
        title="My products"
        description="A responsive listing management view for vendor inventory."
      />
      <section className="space-y-4">
        {Products.slice(0, 6).map(product => (
          <Card
            key={product.id}
            className="rounded-md">
            <CardContent className="grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
              <span className="font-medium capitalize">{product.label}</span>
              <Badge className="w-fit">Active</Badge>
              <span className="text-sm text-muted-foreground">
                {product.category}
              </span>
            </CardContent>
          </Card>
        ))}
      </section>
    </Container>
  );
}
