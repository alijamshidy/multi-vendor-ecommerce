import CheckoutPaymentPageContent from "@/components/pages/CheckoutPaymentPageContent";

export default async function CheckoutPaymentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <CheckoutPaymentPageContent locale={locale} />;
}
