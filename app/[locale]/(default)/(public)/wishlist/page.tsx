import PageHeader from "@/components/commerce/PageHeader";
import Container from "@/components/Global/Container";
import ProductGridCard from "@/components/products/ProductGridCard";
import { Products } from "@/utils/products";

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const wishlist = Products.slice(0, 4);

  return (
    <Container className="mt-8 space-y-8 md:mt-36">
      <PageHeader
        eyebrow="Wishlist"
        title="Saved products"
        description="Keep interesting products close while you compare sellers and prices."
      />
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {wishlist.map(product => (
          <ProductGridCard
            key={product.id}
            product={product}
            href={`/${locale}/products/${product.id}`}
          />
        ))}
      </section>
    </Container>
  );
}
