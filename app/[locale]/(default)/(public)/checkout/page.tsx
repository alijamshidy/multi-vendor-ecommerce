import OrderSummary from "@/components/commerce/OrderSummary";
import PageHeader from "@/components/commerce/PageHeader";
import Container from "@/components/Global/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <Container className="mt-8 space-y-8 md:mt-36">
      <PageHeader
        eyebrow="Checkout"
        title="Delivery and payment"
        description="This demo checkout keeps the flow ready for real payment and order APIs."
      />
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>Shipping details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Full name"
              name="name"
              placeholder="Alex Morgan"
            />
            <Field
              label="Phone"
              name="phone"
              placeholder="+1 555 0188"
            />
            <Field
              label="Email"
              name="email"
              placeholder="alex@example.com"
            />
            <Field
              label="City"
              name="city"
              placeholder="New York"
            />
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                className="min-h-28 resize-none"
                placeholder="Street, building, apartment"
              />
            </div>
            <Button className="sm:col-span-2">Place demo order</Button>
          </CardContent>
        </Card>
        <OrderSummary
          locale={locale}
          showCheckoutButton={false}
        />
      </section>
    </Container>
  );
}

function Field({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        placeholder={placeholder}
      />
    </div>
  );
}
