"use client";

import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import ProductGridSkeleton from "@/components/products/ProductGridSkeleton";
import ProductGrid from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { isAuthenticatedSession } from "@/lib/auth-session";
import useWishlistStore from "@/store/wishlistStore";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function WishlistPageContent({ locale }: { locale: string }) {
  const t = useTranslations("wishlist");
  const [sessionReady, setSessionReady] = useState(false);
  const isLoggedIn = isAuthenticatedSession();
  const items = useWishlistStore(state => state.items);
  const fetchItems = useWishlistStore(state => state.fetchItems);
  const itemsFetched = useWishlistStore(state => state.itemsFetched);
  const errorMessage = useWishlistStore(state => state.errorMessage);
  const removeItem = useWishlistStore(state => state.removeItem);
  const isLoading = useWishlistStore(state => state.loading.fetchItems);
  const isRemoving = useWishlistStore(state => state.loading.removeItem);

  useEffect(() => {
    setSessionReady(true);
    void fetchItems({ force: true });
  }, [fetchItems]);

  const showSkeleton =
    !sessionReady || ((isLoading || !itemsFetched) && items.length === 0);

  const products = items.map(item => ({
    id: item.id,
    href: item.href,
    label: item.label,
    images: item.images,
    price: item.price,
    originalPrice: item.originalPrice,
    category: item.category,
    description: item.description,
  }));

  const handleRemove = async (wishlistId: string) => {
    try {
      await removeItem(wishlistId);
      toast.success(t("removed"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("removeFailed"),
      );
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      {showSkeleton ? (
        <ProductGridSkeleton count={4} />
      ) : items.length === 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
          {errorMessage ? (
            <p className="text-sm text-destructive">{errorMessage}</p>
          ) : null}
          {!isLoggedIn ? (
            <p className="text-sm text-muted-foreground">{t("loginRequired")}</p>
          ) : null}
        </div>
      ) : (
        <div className="space-y-6">
          <ProductGrid
            products={products}
            locale={locale}
          />
          <div className="flex flex-wrap gap-2">
            {items.map(item => (
              <Button
                key={item.wishlistId}
                type="button"
                variant="outline"
                size="sm"
                disabled={isRemoving}
                onClick={() => void handleRemove(item.wishlistId)}>
                {t("removeItem", { name: item.label })}
              </Button>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
