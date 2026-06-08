import type { ApiCartItem } from "@/lib/api-types";
import {
  getApiErrorMessage,
  getApiErrorStatus,
  unwrapList,
} from "@/lib/api-utils";
import api from "@/lib/axios";
import { mapCartItem } from "@/lib/mappers";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

export type CartItemView = ReturnType<typeof mapCartItem>;

type CartAction =
  | "fetchItems"
  | "addItem"
  | "updateItem"
  | "removeItem"
  | "checkout";

type FetchItemsOptions = {
  force?: boolean;
};

type CartState = {
  items: CartItemView[];
  itemsFetched: boolean;
  errorMessage: string;
  successMessage: string;
  loading: Record<CartAction, boolean>;
  subtotal: number;
  shipping: number;
  tax: number;
  orderTotal: number;
  itemCount: number;
  fetchItems: (options?: FetchItemsOptions) => Promise<void>;
  addItem: (payload: { product: string; quantity?: number }) => Promise<void>;
  updateItem: (payload: {
    id: string;
    product: string;
    quantity: number;
  }) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  checkout: (cartId?: string) => Promise<string | null>;
  clearMessages: () => void;
};

function computeTotals(items: CartItemView[]) {
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? 18 : 0;
  const tax = Math.round(subtotal * 0.08);
  return {
    subtotal,
    shipping,
    tax,
    orderTotal: subtotal + shipping + tax,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
  };
}

const useCartStore = create<CartState>()(
  devtools(
    (set, get) => ({
      items: [],
      itemsFetched: false,
      errorMessage: "",
      successMessage: "",
      loading: createStoreLoadingState([
        "fetchItems",
        "addItem",
        "updateItem",
        "removeItem",
        "checkout",
      ] as const),
      subtotal: 0,
      shipping: 0,
      tax: 0,
      orderTotal: 0,
      itemCount: 0,

      clearMessages: () => set({ errorMessage: "", successMessage: "" }),

      fetchItems: async (options = {}) => {
        const state = get();
        if (!options.force) {
          if (state.loading.fetchItems) return;
          if (state.itemsFetched) return;
        }

        setStoreLoading(set, "fetchItems", true, { errorMessage: "" });

        try {
          const { data } = await api.get<
            ApiCartItem[] | { results: ApiCartItem[] }
          >("/ordering/cart/items/");
          const items = unwrapList(data).map((item: unknown) =>
            mapCartItem(item as ApiCartItem),
          );
          set({ items, itemsFetched: true, ...computeTotals(items) });
        } catch (error) {
          if (getApiErrorStatus(error) === 401) {
            set({
              items: [],
              itemsFetched: true,
              errorMessage: "",
              ...computeTotals([]),
            });
            return;
          }

          set({
            errorMessage: getApiErrorMessage(error, "Failed to load cart"),
            items: [],
            itemsFetched: true,
            ...computeTotals([]),
          });
        } finally {
          setStoreLoading(set, "fetchItems", false);
        }
      },

      addItem: async payload => {
        setStoreLoading(set, "addItem", true, {
          errorMessage: "",
          successMessage: "",
        });

        try {
          await api.post("/ordering/cart/items/", {
            product: payload.product,
            quantity: payload.quantity ?? 1,
          });
          set({ successMessage: "Added to cart" });
          await get().fetchItems({ force: true });
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to add item");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "addItem", false);
        }
      },

      updateItem: async payload => {
        setStoreLoading(set, "updateItem", true, { errorMessage: "" });

        try {
          const productId = Number(payload.product);
          const patchBody = {
            product: productId,
            quantity: payload.quantity,
          };
          // Django expects product id + quantity delta (e.g. +1 / -1), not absolute quantity.
          await api.patch(`/ordering/cart/items/${payload.id}/`, patchBody);
          await get().fetchItems({ force: true });
        } catch (error) {
          const message = getApiErrorMessage(
            error,
            "Failed to update cart item",
          );
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "updateItem", false);
        }
      },

      removeItem: async id => {
        setStoreLoading(set, "removeItem", true, { errorMessage: "" });

        try {
          await api.delete(`/ordering/cart/items/${id}/`);
          await get().fetchItems({ force: true });
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to remove item");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "removeItem", false);
        }
      },

      checkout: async cartId => {
        setStoreLoading(set, "checkout", true, {
          errorMessage: "",
          successMessage: "",
        });

        try {
          const id = cartId ?? "primary";
          const { data } = await api.post<{
            id?: string;
            data?: { id?: string };
          }>(`/ordering/carts/${id}/checkout/`);
          const orderId = data?.id ?? data?.data?.id ?? null;
          set({ successMessage: "Order placed successfully" });
          await get().fetchItems({ force: true });
          return orderId;
        } catch (error) {
          const message = getApiErrorMessage(error, "Checkout failed");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "checkout", false);
        }
      },
    }),
    withStoreDevtools("cart"),
  ),
);

export default useCartStore;
