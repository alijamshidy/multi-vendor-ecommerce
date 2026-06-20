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
import { useRouter } from "@/i18n/navigation";
import useCartStore from "@/store/cartStore";
import useCheckoutStore from "@/store/checkoutStore";
import { FormEvent } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function CheckoutShippingPageContent({
  locale,
}: {
  locale: string;
}) {
  const t = useTranslations("checkout");
  const router = useRouter();
  const fetchItems = useCartStore(state => state.fetchItems);
  const itemCount = useCartStore(state => state.itemCount);
  const buyNowItem = useCheckoutStore(state => state.buyNowItem);
  const shippingInfo = useCheckoutStore(state => state.shippingInfo);
  const setShippingInfo = useCheckoutStore(state => state.setShippingInfo);

  useStoreInit(() => fetchItems());

  const hasItems = itemCount > 0 || Boolean(buyNowItem);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasItems) {
      toast.error(t("emptyCart"));
      return;
    }

    const formData = new FormData(event.currentTarget);
    const info = {
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
    };

    setShippingInfo(info);
    router.push("/checkout/payment");
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("shippingEyebrow")}
        title={t("shippingTitle")}
        description={t("shippingDescription")}
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
                defaultValue={shippingInfo?.name}
                required
              />
              <CheckoutField
                label={t("phone")}
                name="phone"
                placeholder={t("phonePlaceholder")}
                defaultValue={shippingInfo?.phone}
                required
              />
              <CheckoutField
                label={t("email")}
                name="email"
                placeholder={t("emailPlaceholder")}
                type="email"
                defaultValue={shippingInfo?.email}
                required
              />
              <CheckoutField
                label={t("city")}
                name="city"
                placeholder={t("cityPlaceholder")}
                defaultValue={shippingInfo?.city}
                required
              />
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">{t("address")}</Label>
                <Textarea
                  id="address"
                  name="address"
                  className="min-h-28 resize-none"
                  placeholder={t("addressPlaceholder")}
                  defaultValue={shippingInfo?.address}
                  required
                />
              </div>
              <Button
                className="sm:col-span-2"
                type="submit"
                disabled={!hasItems}>
                {t("continueToPayment")}
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
