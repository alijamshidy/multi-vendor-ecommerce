"use client";

import { useIsMobileDevice } from "@/hooks/use-mobile-device";
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

type ProductGridCardProps = {
  product: productType;
  href: string;
  compact?: boolean;
  hoverActions?: boolean;
};

export default function ProductGridCard({
  product,
  href,
  compact = false,
  hoverActions = false,
}: ProductGridCardProps) {
  const isMobileDevice = useIsMobileDevice();
  const { label, images, id } = product;
  const tCart = useTranslations("cart");
  const addItem = useCartStore(state => state.addItem);
  const isAdding = useCartStore(state => state.loading.addItem);

  const handleAddToCart = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      await addItem({ product: id, quantity: 1 });
      toast.success(tCart("addedToCart"));
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
      className="group relative mx-1">
      <Link
        href={href}
        className={cn("absolute inset-0 z-10", !isMobileDevice && "hidden")}
      />

      <Card
        size={compact ? "sm" : "default"}
        className={cn(
          "relative transform transition-shadow duration-500 group-hover:shadow-xl",
          compact && "gap-2 py-0",
          compact && !hoverActions && "overflow-visible",
          hoverActions && "overflow-hidden",
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
            <ProductPrice
              product={product}
              className={compact ? "mt-1" : "mt-2"}
            />
          </div>

          <div
            className={cn(
              hoverActions && isMobileDevice
                ? "hidden overflow-hidden"
                : "block",
              hoverActions && !isMobileDevice && "overflow-hidden",
            )}>
            <div
              className={cn(
                "mt-2 flex w-full justify-center gap-x-2",
                compact ? "mb-0" : "mb-1",
                hoverActions &&
                  "relative z-20 translate-y-full opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100",
              )}>
              <>
                <ProductButton type="wishlist" />
                <Link href={href}>
                  <ProductButton type="details" />
                </Link>
                {addToCartButton}
              </>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
