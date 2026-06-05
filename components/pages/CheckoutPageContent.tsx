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
import { useTranslations } from "next-intl";

export default function CheckoutPageContent({ locale }: { locale: string }) {
  const t = useTranslations("checkout");
  const router = useRouter();
  const fetchItems = useCartStore(state => state.fetchItems);
  const checkout = useCartStore(state => state.checkout);
  const isCheckingOut = useCartStore(state => state.loading.checkout);

  useStoreInit(() => fetchItems());

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await checkout();
      toast.success(t("orderPlaced"));
      router.push(`/${locale}/orders`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("checkoutFailed"),
      );
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>{t("shippingDetails")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={handleSubmit}>
              <CheckoutField
                label={t("fullName")}
                name="name"
                placeholder={t("fullNamePlaceholder")}
              />
              <CheckoutField
                label={t("phone")}
                name="phone"
                placeholder={t("phonePlaceholder")}
              />
              <CheckoutField
                label={t("email")}
                name="email"
                placeholder={t("emailPlaceholder")}
                type="email"
              />
              <CheckoutField
                label={t("city")}
                name="city"
                placeholder={t("cityPlaceholder")}
              />
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">{t("address")}</Label>
                <Textarea
                  id="address"
                  name="address"
                  className="min-h-28 resize-none"
                  placeholder={t("addressPlaceholder")}
                />
              </div>
              <Button
                className="sm:col-span-2"
                type="submit"
                disabled={isCheckingOut}>
                {isCheckingOut ? t("placingOrder") : t("placeOrder")}
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
