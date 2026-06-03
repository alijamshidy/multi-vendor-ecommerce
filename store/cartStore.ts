import type { ApiCartItem } from "@/lib/api-types";
import {
  createLoadingState,
  getApiErrorMessage,
  unwrapList,
} from "@/lib/api-utils";
import api from "@/lib/axios";
import { mapCartItem } from "@/lib/mappers";
import { create } from "zustand";

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
  updateItem: (payload: { id: string; quantity: number }) => Promise<void>;
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

const useCartStore = create<CartState>((set, get) => ({
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
      await api.patch(`/ordering/cart/items/${payload.id}/`, {
        quantity: payload.quantity,
      });
      await get().fetchItems();
    } catch (error) {
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
}));

export default useCartStore;
