// import { fetchFeaturedProducts } from "@/utils/actions";
import { products } from "@/utils/products";
import EmptyList from "../global/EmptyList";
import SectionTitle from "../global/SectionTitle";
import ProductsGrid from "../products/ProductsGrid";

export default async function FeaturedProducts() {
  // const products = await fetchFeaturedProducts();
  if (products.length === 0) {
    return <EmptyList />;
  }
  return (
    <section className="pt-24">
      <SectionTitle text="featured products" />
      <ProductsGrid products={products} />
    </section>
  );
}
