import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";
import type { productType } from "@/utils/products";

type ProductPriceProps = {
  product: Pick<productType, "price" | "originalPrice">;
  className?: string;
  discountedClassName?: string;
  originalClassName?: string;
};

export function hasProductDiscount(
  product: Pick<productType, "price" | "originalPrice">,
): boolean {
  return product.originalPrice > product.price;
}

export default function ProductPrice({
  product,
  className,
  discountedClassName,
  originalClassName,
}: ProductPriceProps) {
  const discounted = hasProductDiscount(product);

  if (!discounted) {
    return (
      <span className={cn("text-muted-foreground", className)}>
        {formatCurrency(product.price)}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-2 gap-y-1",
        className,
      )}>
      <span
        className={cn(
          "text-sm text-muted-foreground line-through",
          originalClassName,
        )}>
        {formatCurrency(product.originalPrice)}
      </span>
      <span
        className={cn("font-medium text-primary", discountedClassName)}>
        {formatCurrency(product.price)}
      </span>
    </div>
  );
}
