import CheckoutPageContent from "@/components/pages/CheckoutPageContent";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <CheckoutPageContent locale={locale} />;
}
