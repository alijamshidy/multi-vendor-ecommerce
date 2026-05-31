import { cn } from "@/lib/utils";
import { productType } from "@/utils/products";
import ProductGridCard from "./ProductGridCard";

type ProductGridProps = {
  products: productType[];
  locale: string;
  className?: string;
};

export default function ProductGrid({
  products,
  locale,
  className,
}: ProductGridProps) {
  return (
    <section
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
        className,
      )}>
      {products.map(product => (
        <ProductGridCard
          key={product.id}
          product={product}
          href={`/${locale}/products/${product.id}`}
        />
      ))}
    </section>
  );
}
