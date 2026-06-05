import type { ApiCartItem } from "@/lib/api-types";
import {
  createLoadingState,
  getApiErrorMessage,
  getApiErrorStatus,
  unwrapList,
} from "@/lib/api-utils";
import api from "@/lib/axios";
import { mapCartItem } from "@/lib/mappers";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";

export type CartItemView = ReturnType<typeof mapCartItem>;

type CartAction =
  | "fetchItems"
  | "addItem"
  | "updateItem"
  | "removeItem"
  | "checkout";

type CartState = {
  items: CartItemView[];
  errorMessage: string;
  successMessage: string;
  loading: Record<CartAction, boolean>;
  subtotal: number;
  shipping: number;
  tax: number;
  orderTotal: number;
  itemCount: number;
  fetchItems: () => Promise<void>;
  addItem: (payload: { product: string; quantity?: number }) => Promise<void>;
  updateItem: (payload: { id: string; product: string; quantity: number }) => Promise<void>;
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
  errorMessage: "",
  successMessage: "",
  loading: createLoadingState([
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

  fetchItems: async () => {
    set(state => ({
      loading: { ...state.loading, fetchItems: true },
      errorMessage: "",
    }));

    try {
      const { data } = await api.get<
        ApiCartItem[] | { results: ApiCartItem[] }
      >("/ordering/cart/items/");
      const items = unwrapList(data).map((item: unknown) =>
        mapCartItem(item as ApiCartItem),
      );
      set({ items, ...computeTotals(items as CartItemView[]) });
    } catch (error) {
      if (getApiErrorStatus(error) === 401) {
        set({ items: [], errorMessage: "", ...computeTotals([]) });
        return;
      }

      set({
        errorMessage: getApiErrorMessage(error, "Failed to load cart"),
        items: [],
        ...computeTotals([]),
      });
    } finally {
      set(state => ({
        loading: { ...state.loading, fetchItems: false },
      }));
    }
  },

  addItem: async payload => {
    set(state => ({
      loading: { ...state.loading, addItem: true },
      errorMessage: "",
      successMessage: "",
    }));

    try {
      await api.post("/ordering/cart/items/", {
        product: payload.product,
        quantity: payload.quantity ?? 1,
      });
      set({ successMessage: "Added to cart" });
      await get().fetchItems();
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to add item");
      set({ errorMessage: message });
      throw new Error(message);
    } finally {
      set(state => ({
        loading: { ...state.loading, addItem: false },
      }));
    }
  },

  updateItem: async payload => {
    set(state => ({
      loading: { ...state.loading, updateItem: true },
      errorMessage: "",
    }));

    try {
      const productId = Number(payload.product);
      const patchBody = {
        product: productId,
        quantity: payload.quantity,
      };
      // #region agent log
      fetch("http://127.0.0.1:7673/ingest/3195856a-0976-4ff2-982f-62bf78f50b86", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "e997a5",
        },
        body: JSON.stringify({
          sessionId: "e997a5",
          runId: "cart-patch",
          hypothesisId: "D",
          location: "cartStore.ts:updateItem",
          message: "cart patch request",
          data: { id: payload.id, patchBody },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      // Django expects product id + quantity delta (e.g. +1 / -1), not absolute quantity.
      await api.patch(`/ordering/cart/items/${payload.id}/`, patchBody);
      await get().fetchItems();
    } catch (error) {
      // #region agent log
      fetch("http://127.0.0.1:7673/ingest/3195856a-0976-4ff2-982f-62bf78f50b86", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "e997a5",
        },
        body: JSON.stringify({
          sessionId: "e997a5",
          runId: "cart-patch",
          hypothesisId: "D",
          location: "cartStore.ts:updateItem:catch",
          message: "cart patch failed",
          data: {
            id: payload.id,
            status: getApiErrorStatus(error),
            apiError:
              error instanceof Error && "response" in error
                ? (error as { response?: { data?: unknown } }).response?.data
                : null,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      const message = getApiErrorMessage(error, "Failed to update cart item");
      set({ errorMessage: message });
      throw new Error(message);
    } finally {
      set(state => ({
        loading: { ...state.loading, updateItem: false },
      }));
    }
  },

  removeItem: async id => {
    set(state => ({
      loading: { ...state.loading, removeItem: true },
      errorMessage: "",
    }));

    try {
      await api.delete(`/ordering/cart/items/${id}/`);
      await get().fetchItems();
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to remove item");
      set({ errorMessage: message });
      throw new Error(message);
    } finally {
      set(state => ({
        loading: { ...state.loading, removeItem: false },
      }));
    }
  },

  checkout: async cartId => {
    set(state => ({
      loading: { ...state.loading, checkout: true },
      errorMessage: "",
      successMessage: "",
    }));

    try {
      const id = cartId ?? "primary";
      const { data } = await api.post<{ id?: string; data?: { id?: string } }>(
        `/ordering/carts/${id}/checkout/`,
      );
      const orderId = data?.id ?? data?.data?.id ?? null;
      set({ successMessage: "Order placed successfully" });
      await get().fetchItems();
      return orderId;
    } catch (error) {
      const message = getApiErrorMessage(error, "Checkout failed");
      set({ errorMessage: message });
      throw new Error(message);
    } finally {
      set(state => ({
        loading: { ...state.loading, checkout: false },
      }));
    }
  },
    }),
    withStoreDevtools("cart"),
  ),
);

export default useCartStore;
