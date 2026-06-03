"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import ProductGrid from "@/components/products/ProductGrid";
import { useStoreInit } from "@/hooks/use-store-init";
import useCategoryStore from "@/store/categoryStore";
import useProductStore from "@/store/productStore";

export default function CategoryPageContent({
  locale,
  categorySlug,
}: {
  locale: string;
  categorySlug: string;
}) {
  const activeCategory = useCategoryStore(state => state.activeCategory);
  const fetchCategoryBySlug = useCategoryStore(
    state => state.fetchCategoryBySlug,
  );
  const products = useProductStore(state => state.products);
  const fetchProducts = useProductStore(state => state.fetchProducts);
  const isLoading =
    useCategoryStore(state => state.loading.fetchCategory) ||
    useProductStore(state => state.loading.fetchProducts);

  useStoreInit(async () => {
    const category = await fetchCategoryBySlug(categorySlug);
    await fetchProducts(category ? { category: category.id } : { search: categorySlug });
  }, [categorySlug]);

  const title = activeCategory?.label || categorySlug;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Category"
        title={title}
        description="Browse curated products from trusted sellers in this collection."
      />
      {isLoading && products.length === 0 ? (
        <p className="text-sm text-muted-foreground">Loading products...</p>
      ) : (
        <ProductGrid
          products={products}
          locale={locale}
        />
      )}
    </PageShell>
  );
}
