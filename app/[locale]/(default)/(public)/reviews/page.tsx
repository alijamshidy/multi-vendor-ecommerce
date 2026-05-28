import PageHeader from "@/components/commerce/PageHeader";
import Container from "@/components/Global/Container";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const reviews = [
  "Fast delivery and clear seller communication.",
  "Product pages are easy to scan on mobile.",
  "Checkout flow feels simple and direct.",
];

export default function ReviewsPage() {
  return (
    <Container className="mt-8 space-y-8 md:mt-36">
      <PageHeader
        eyebrow="Reviews"
        title="Customer feedback"
        description="Social proof and product reviews have a dedicated responsive destination."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {reviews.map(review => (
          <Card
            key={review}
            className="rounded-md">
            <CardContent className="space-y-4 p-5">
              <div className="flex gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="size-4 fill-current"
                  />
                ))}
              </div>
              <p className="leading-7 text-muted-foreground">{review}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </Container>
  );
}
