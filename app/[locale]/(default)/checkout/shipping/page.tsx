import CheckoutShippingPageContent from "@/components/pages/CheckoutShippingPageContent";

export default async function CheckoutShippingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <CheckoutShippingPageContent locale={locale} />;
}
