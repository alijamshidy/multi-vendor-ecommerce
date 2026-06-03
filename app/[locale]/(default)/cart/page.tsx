import CartPageContent from "@/components/pages/CartPageContent";

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <CartPageContent locale={locale} />;
}
