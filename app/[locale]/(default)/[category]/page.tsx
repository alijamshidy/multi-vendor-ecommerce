import CategoryPageContent from "@/components/pages/CategoryPageContent";
import { Suspense } from "react";

function CategoryPageFallback() {
  return (
    <div className="py-12 text-center text-muted-foreground">Loading...</div>
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;

  return (
    <Suspense fallback={<CategoryPageFallback />}>
      <CategoryPageContent
        locale={locale}
        categorySlug={category}
      />
    </Suspense>
  );
}
