"use client";

import { useIsAuthenticated } from "@/hooks/use-authenticated-user";
import { cn } from "@/lib/utils";
import useCartStore from "@/store/cartStore";
import { productType } from "@/utils/products";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import ProductButton from "./ProductButton";
import ProductPrice from "./ProductPrice";
import ProductWishlistButton from "./ProductWishlistButton";

type ProductGridCardProps = {
  product: productType;
  href: string;
  compact?: boolean;
  hoverActions?: boolean;
};

export default function ProductGridCard({
  product,
  href,
  compact = true,
  hoverActions = true,
}: ProductGridCardProps) {
  const { label, images, id } = product;
  const tCart = useTranslations("cart");
  const isLoggedIn = useIsAuthenticated();
  const addItem = useCartStore(state => state.addItem);
  const isAdding = useCartStore(state => state.loading.addItem);

  const handleAddToCart = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isLoggedIn) {
      toast.error(tCart("loginRequired"));
      return;
    }

    try {
      const result = await addItem({ product: id, quantity: 1 });
      toast.success(
        result === "already" ? tCart("alreadyInCart") : tCart("addedToCart"),
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : tCart("addToCartFailed"),
      );
    }
  };

  const addToCartButton = (
    <ProductButton
      type="addToCart"
      onClick={handleAddToCart}
      disabled={isAdding}
    />
  );

  return (
    <article
      key={id}
      className="group relative mx-1 h-full">
      <Card
        size={compact ? "sm" : "default"}
        className={cn(
          "relative flex h-full flex-col overflow-hidden transition-shadow duration-500 group-hover:shadow-xl",
          compact && "gap-2 py-0",
        )}>
        <CardContent
          className={cn("flex flex-1 flex-col", compact ? "p-3" : "p-4")}>
          <Link
            href={href}
            className="block shrink-0">
            <div className="group/image relative h-48 overflow-hidden rounded">
              <Image
                src={images[0].url}
                alt={label}
                fill
                sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                className="w-full rounded object-cover transition-transform duration-500 group-hover/image:scale-110"
              />
            </div>
          </Link>

          <div
            className={cn(
              "flex flex-1 flex-col text-center",
              compact ? "mt-2" : "mt-4",
            )}>
            <Link
              href={href}
              className="block">
              <h2
                title={label}
                className={cn(
                  "line-clamp-2 capitalize leading-snug transition-colors hover:text-primary",
                  compact ? "min-h-10 text-base" : "min-h-12 text-lg",
                )}>
                {label}
              </h2>
            </Link>

            <ProductPrice
              product={product}
              emphasis
              className={cn("mt-2 min-h-7 shrink-0", compact ? "" : "mt-3")}
            />
          </div>

          {hoverActions ? (
            <div className="relative z-10 mt-3 flex min-h-10 shrink-0 justify-center gap-x-2">
              <ProductWishlistButton product={product} />
              <Link href={href}>
                <ProductButton type="details" />
              </Link>
              {addToCartButton}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </article>
  );
}
