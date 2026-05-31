import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import ProductGrid from "@/components/products/ProductGrid";
import { Categorys } from "@/utils/Category";
import { Products } from "@/utils/products";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const activeCategory = Categorys.find(item => item.href === category);
  const title = activeCategory?.label || category;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Category"
        title={title}
        description="Browse curated products from trusted sellers in this collection."
      />
      <ProductGrid
        products={Products.slice(0, 8).map(product => ({
          ...product,
          category: title,
        }))}
        locale={locale}
      />
    </PageShell>
  );
}
