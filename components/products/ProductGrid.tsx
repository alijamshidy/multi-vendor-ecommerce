import { cn } from "@/lib/utils";
import { buildProductDetailHref } from "@/lib/mappers";
import { productType } from "@/utils/products";
import ProductGridCard from "./ProductGridCard";

type ProductGridProps = {
  products: productType[];
  locale: string;
  className?: string;
  compact?: boolean;
  hoverActions?: boolean;
};

export default function ProductGrid({
  products,
  locale,
  className,
  compact = true,
  hoverActions = true,
}: ProductGridProps) {
  return (
    <section
      className={cn(
        "grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
        className,
      )}>
      {products.map(product => (
        <ProductGridCard
          key={product.id}
          product={product}
          href={buildProductDetailHref(locale, product)}
          compact={compact}
          hoverActions={hoverActions}
        />
      ))}
    </section>
  );
}
