"use client";

import { Button } from "@/components/ui/button";
import { useIsAuthenticated } from "@/hooks/use-authenticated-user";
import { useWishlistProduct } from "@/hooks/use-wishlist-product";
import { cn } from "@/lib/utils";
import useWishlistStore from "@/store/wishlistStore";
import type { productType } from "@/utils/products";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type ProductWishlistButtonProps = {
  product: productType;
  variant?: "icon" | "button";
  className?: string;
};

export default function ProductWishlistButton({
  product,
  variant = "icon",
  className,
}: ProductWishlistButtonProps) {
  const t = useTranslations("wishlist");
  const tProduct = useTranslations("product");
  const isLoggedIn = useIsAuthenticated();
  const { isSaved } = useWishlistProduct(product.id);
  const toggleWishlist = useWishlistStore(state => state.toggleProduct);
  const isAdding = useWishlistStore(state => state.loading.addItem);
  const isRemoving = useWishlistStore(state => state.loading.removeItem);
  const isBusy = isAdding || isRemoving;

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isLoggedIn) {
      toast.error(t("loginRequired"));
      return;
    }

    try {
      const result = await toggleWishlist(product);
      toast.success(result === "removed" ? t("removed") : t("added"));
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : isSaved
            ? t("removeFailed")
            : t("addFailed"),
      );
    }
  };

  const label = isBusy
    ? isSaved
      ? t("removing")
      : t("adding")
    : isSaved
      ? t("removeFromWishlist")
      : tProduct("saveItem");

  if (variant === "button") {
    return (
      <Button
        type="button"
        variant={isSaved ? "default" : "outline"}
        className={cn(
          "flex-1 cursor-pointer gap-2 py-5 shadow-md transition-all hover:shadow-lg sm:min-w-40",
          isSaved &&
            "border-rose-500 bg-rose-500 text-white hover:bg-rose-600 hover:border-rose-600",
          className,
        )}
        disabled={isBusy}
        onClick={handleClick}
        aria-pressed={isSaved}
        aria-label={label}>
        <Heart
          className={cn("size-4 shrink-0", isSaved && "fill-current")}
          aria-hidden
        />
        {label}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={isSaved ? "default" : "outline"}
      size="icon"
      className={cn(
        "size-10 cursor-pointer transition-all",
        isSaved
          ? "rounded-lg border-rose-500 bg-rose-500 text-white shadow-sm hover:bg-rose-600 hover:border-rose-600"
          : "rounded-full",
        className,
      )}
      disabled={isBusy}
      onClick={handleClick}
      aria-pressed={isSaved}
      aria-label={label}
      title={label}>
      <Heart
        className={cn("size-4", isSaved && "fill-current")}
        aria-hidden
      />
    </Button>
  );
}
