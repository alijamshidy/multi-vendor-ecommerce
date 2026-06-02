import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import ProductGrid from "@/components/products/ProductGrid";
import { Products } from "@/utils/products";

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const wishlist = Products.slice(0, 4);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Wishlist"
        title="Saved products"
        description="Keep interesting products close while you compare sellers and prices."
      />
      <ProductGrid
        products={wishlist}
        locale={locale}
      />
    </PageShell>
  );
}
