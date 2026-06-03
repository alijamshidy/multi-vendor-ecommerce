"use client";

import CheckoutField from "@/components/commerce/CheckoutField";
import OrderSummary from "@/components/commerce/OrderSummary";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStoreInit } from "@/hooks/use-store-init";
import useCartStore from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { toast } from "sonner";

export default function CheckoutPageContent({ locale }: { locale: string }) {
  const router = useRouter();
  const fetchItems = useCartStore(state => state.fetchItems);
  const checkout = useCartStore(state => state.checkout);
  const isCheckingOut = useCartStore(state => state.loading.checkout);

  useStoreInit(() => fetchItems());

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await checkout();
      toast.success("Order placed successfully");
      router.push(`/${locale}/orders`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed");
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Checkout"
        title="Delivery and payment"
        description="Complete your shipping details and place the order."
      />
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>Shipping details</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={handleSubmit}>
              <CheckoutField
                label="Full name"
                name="name"
                placeholder="Alex Morgan"
              />
              <CheckoutField
                label="Phone"
                name="phone"
                placeholder="+1 555 0188"
              />
              <CheckoutField
                label="Email"
                name="email"
                placeholder="alex@example.com"
                type="email"
              />
              <CheckoutField
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
              <Button
                className="sm:col-span-2"
                type="submit"
                disabled={isCheckingOut}>
                {isCheckingOut ? "Placing order..." : "Place order"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <OrderSummary
          locale={locale}
          showCheckoutButton={false}
        />
      </section>
    </PageShell>
  );
}
