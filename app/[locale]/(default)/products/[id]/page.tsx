import ProductDetailContent from "@/components/pages/ProductDetailContent";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  return (
    <ProductDetailContent
      locale={locale}
      id={id}
    />
  );
}
