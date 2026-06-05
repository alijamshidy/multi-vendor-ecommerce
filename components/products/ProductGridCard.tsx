import { formatCurrency } from "@/utils/format";
import { productType } from "@/utils/products";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import ProductButton from "./ProductButton";

type ProductGridCardProps = {
  product: productType;
  href: string;
  compact?: boolean;
};

export default function ProductGridCard({
  product,
  href,
  compact = false,
}: ProductGridCardProps) {
  const { label, price, images, id } = product;
  const dollarsAmount = formatCurrency(price);

  return (
    <article
      key={id}
      className="group relative">
      <Link
        href={href}
        className="absolute inset-0 z-10 md:hidden"
      />

      <Card
        size={compact ? "sm" : "default"}
        className={cn(
          "relative transform transition-shadow duration-500 group-hover:shadow-xl",
          compact && "gap-2 overflow-visible py-0",
        )}>
        <CardContent className={cn(compact ? "p-3" : "p-4")}>
          <div
            className={cn(
              "group/image relative overflow-hidden rounded",
              compact ? "h-44 sm:h-48" : "h-56 sm:h-48",
            )}>
            <Image
              src={images[0].url}
              alt={label}
              fill
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
              className="w-full rounded object-cover transition-transform duration-500 group-hover/image:scale-110"
            />
          </div>

          <div className={cn("text-center", compact ? "mt-2" : "mt-4")}>
            <h2 className={cn("capitalize", compact ? "text-base" : "text-lg")}>
              {label}
            </h2>
            <p className={cn("text-muted-foreground", compact ? "mt-1" : "mt-2")}>
              {dollarsAmount}
            </p>
          </div>

          <div
            className={cn(
              "mt-2 flex w-full justify-center gap-x-2",
              compact ? "mb-0" : "mb-1",
            )}>
            <ProductButton type="wishlist" />
            <Link href={href}>
              <ProductButton type="details" />
            </Link>
            <ProductButton type="addToCart" />
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
