"use client";

import { useIsAuthenticated } from "@/hooks/use-authenticated-user";
import useWishlistStore from "@/store/wishlistStore";
import { useEffect } from "react";

export function useWishlistProduct(productId: string) {
  const isLoggedIn = useIsAuthenticated();
  const fetchItems = useWishlistStore(state => state.fetchItems);
  const entry = useWishlistStore(state =>
    state.items.find(item => item.id === productId),
  );

  useEffect(() => {
    if (isLoggedIn) {
      void fetchItems();
    }
  }, [fetchItems, isLoggedIn]);

  return {
    isSaved: Boolean(entry),
    wishlistId: entry?.wishlistId ?? null,
  };
}
