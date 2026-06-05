import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Store, Truck } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function About() {
  const t = await getTranslations("home");

  const values = [
    {
      title: t("verifiedSellers"),
      text: t("verifiedSellersText"),
      icon: Store,
    },
    {
      title: t("protectedCheckout"),
      text: t("protectedCheckoutText"),
      icon: ShieldCheck,
    },
    {
      title: t("deliveryFocused"),
      text: t("deliveryFocusedText"),
      icon: Truck,
    },
  ];

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("whyUs")}
        title={t("aboutTitle")}
        description={t("aboutDescription")}
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
    </PageShell>
  );
}
