import { getAuthenticatedUserId } from "@/lib/auth-session";
import type { ApiWishlistResponse } from "@/lib/api-types";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api-utils";
import api from "@/lib/axios";
import { apiEndpoints } from "@/lib/endpoints";
import {
  buildWishlistPayload,
  mapWishlistItem,
  parseWishlistResponse,
  type WishlistItemView,
} from "@/lib/mappers";
import type { productType } from "@/utils/products";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

type WishlistAction = "fetchItems" | "addItem" | "removeItem";

type FetchItemsOptions = {
  force?: boolean;
};

type WishlistAddPayload = ReturnType<typeof buildWishlistPayload>;

type WishlistState = {
  items: WishlistItemView[];
  itemCount: number;
  itemsFetched: boolean;
  errorMessage: string;
  loading: Record<WishlistAction, boolean>;
  fetchItems: (options?: FetchItemsOptions) => Promise<void>;
  addItem: (payload: WishlistAddPayload) => Promise<"added" | "already">;
  addProduct: (product: productType) => Promise<"added" | "already">;
  removeProduct: (productId: string) => Promise<void>;
  toggleProduct: (product: productType) => Promise<"added" | "removed">;
  removeItem: (wishlistId: string) => Promise<void>;
  clearError: () => void;
};

function getUserId(): string | null {
  return getAuthenticatedUserId();
}

function isProductInWishlist(
  items: WishlistItemView[],
  productId: string,
): boolean {
  return items.some(item => item.id === productId);
}

function findWishlistEntry(items: WishlistItemView[], productId: string) {
  return items.find(item => item.id === productId) ?? null;
}

const useWishlistStore = create<WishlistState>()(
  devtools(
    (set, get) => ({
      items: [],
      itemCount: 0,
      itemsFetched: false,
      errorMessage: "",
      loading: createStoreLoadingState([
        "fetchItems",
        "addItem",
        "removeItem",
      ] as const),

      clearError: () => set({ errorMessage: "" }),

      fetchItems: async (options = {}) => {
        const state = get();
        if (!options.force) {
          if (state.loading.fetchItems) return;
          if (state.itemsFetched) return;
        }

        const userId = getUserId();
        if (!userId) {
          set({ items: [], itemCount: 0, itemsFetched: true });
          return;
        }
        setStoreLoading(set, "fetchItems", true, { errorMessage: "" });

        try {
          const { data } = await api.get<ApiWishlistResponse>(
            apiEndpoints.wishlist.list(userId),
          );
          const parsed = parseWishlistResponse(data);
          const items = parsed.items.map(mapWishlistItem);
          set({
            items,
            itemCount: parsed.count,
            itemsFetched: true,
          });
        } catch (error) {
          if (getApiErrorStatus(error) === 401) {
            set({
              items: [],
              itemCount: 0,
              itemsFetched: true,
              errorMessage: "",
            });
            return;
          }

          set({
            errorMessage: getApiErrorMessage(error, "Failed to load wishlist"),
            items: [],
            itemCount: 0,
            itemsFetched: true,
          });
        } finally {
          setStoreLoading(set, "fetchItems", false);
        }
      },

      addItem: async payload => {
        const userId = getUserId();
        if (!userId) throw new Error("Please log in to save items");

        setStoreLoading(set, "addItem", true, { errorMessage: "" });

        try {
          await get().fetchItems({ force: true });

          if (isProductInWishlist(get().items, payload.productId)) {
            return "already" as const;
          }

          await api.post(apiEndpoints.wishlist.add, {
            userId,
            ...payload,
          });
          await get().fetchItems({ force: true });
          return "added" as const;
        } catch (error) {
          const status = getApiErrorStatus(error);
          const message = getApiErrorMessage(error, "Failed to add to wishlist");

          if (
            status === 404 &&
            message.toLowerCase().includes("already")
          ) {
            await get().fetchItems({ force: true });
            if (isProductInWishlist(get().items, payload.productId)) {
              return "already" as const;
            }
          }

          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "addItem", false);
        }
      },

      addProduct: async product => {
        return get().addItem(buildWishlistPayload(product));
      },

      removeProduct: async productId => {
        const entry = findWishlistEntry(get().items, productId);
        if (!entry) return;
        await get().removeItem(entry.wishlistId);
      },

      toggleProduct: async product => {
        const userId = getUserId();
        if (!userId) throw new Error("Please log in to save items");

        await get().fetchItems({ force: true });

        const entry = findWishlistEntry(get().items, product.id);
        if (entry) {
          await get().removeItem(entry.wishlistId);
          return "removed" as const;
        }

        await get().addItem(buildWishlistPayload(product));
        return "added" as const;
      },

      removeItem: async wishlistId => {
        setStoreLoading(set, "removeItem", true, { errorMessage: "" });

        try {
          await api.delete(apiEndpoints.wishlist.remove(wishlistId));
          await get().fetchItems({ force: true });
        } catch (error) {
          const message = getApiErrorMessage(
            error,
            "Failed to remove from wishlist",
          );
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "removeItem", false);
        }
      },
    }),
    withStoreDevtools("wishlist"),
  ),
);

export default useWishlistStore;
