import PageHeader from "@/components/commerce/PageHeader";
import Container from "@/components/Global/Container";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Store, Truck } from "lucide-react";

const values = [
  {
    title: "Verified sellers",
    text: "Sellers can be reviewed, organized, and promoted from the marketplace dashboard.",
    icon: Store,
  },
  {
    title: "Protected checkout",
    text: "The UI is ready for payment, shipping, and order APIs without changing the buying flow.",
    icon: ShieldCheck,
  },
  {
    title: "Delivery focused",
    text: "Product and order pages keep fulfillment status visible on every screen size.",
    icon: Truck,
  },
];

export default function AboutPage() {
  return (
    <Container className="mt-8 space-y-8 md:mt-36">
      <PageHeader
        eyebrow="About"
        title="A marketplace foundation for buyers and sellers"
        description="This storefront is structured around product discovery, checkout, seller operations, and marketplace administration."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {values.map(value => (
          <Card
            key={value.title}
            className="rounded-md">
            <CardContent className="space-y-4 p-5">
              <value.icon className="size-6 text-primary" />
              <h2 className="text-lg font-semibold">{value.title}</h2>
              <p className="leading-7 text-muted-foreground">{value.text}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </Container>
  );
}
