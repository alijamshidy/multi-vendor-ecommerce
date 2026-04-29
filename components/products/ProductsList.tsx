import { productType } from "@/utils/products";
import FavoriteToggleButton from "./FavoriteToggleButton";
import ProductList from "./ProductList";
export default async function ProductsList({
  products,
}: {
  products: productType[];
}) {
  return (
    <div className="mt-12 grid gap-y-8">
      {products.map(product => {
        const { id } = product;
        return (
          <article
            key={id}
            className="group relative">
            <ProductList product={product} />
            <div className="absolute bottom-8 right-8 z-5">
              <FavoriteToggleButton productId={id} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
