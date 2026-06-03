import CategoryPageContent from "@/components/pages/CategoryPageContent";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;

  return (
    <CategoryPageContent
      locale={locale}
      categorySlug={category}
    />
  );
}
