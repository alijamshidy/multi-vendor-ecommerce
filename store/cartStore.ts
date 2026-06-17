import { getAuthenticatedUserId } from "@/lib/auth-session";
import type { ApiCartListResponse } from "@/lib/api-types";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/api-utils";
import api from "@/lib/axios";
import { apiEndpoints } from "@/lib/endpoints";
import { flattenCartResponse, mapCartItem } from "@/lib/mappers";
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
  addItem: (payload: {
    product: string;
    quantity?: number;
  }) => Promise<"added" | "already">;
  updateItem: (payload: {
    id: string;
    product: string;
    quantity: number;
  }) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  checkout: (shippingInfo?: Record<string, unknown>) => Promise<string | null>;
  clearMessages: () => void;
};

function getUserId(): string | null {
  return getAuthenticatedUserId();
}

function isProductInCart(items: CartItemView[], productId: string): boolean {
  return items.some(item => item.product.id === productId);
}

function computeTotals(items: CartItemView[], shippingFee?: number) {
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const shipping =
    shippingFee ?? (subtotal > 0 ? 18 : 0);
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

        const userId = getUserId();
        if (!userId) {
          set({
            items: [],
            itemsFetched: true,
            ...computeTotals([]),
          });
          return;
        }

        setStoreLoading(set, "fetchItems", true, { errorMessage: "" });

        try {
          const { data } = await api.get<ApiCartListResponse>(
            apiEndpoints.cart.list(userId),
          );
          const items = flattenCartResponse(data).map(mapCartItem);
          set({
            items,
            itemsFetched: true,
            ...computeTotals(items, data.shipping_fee),
          });
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
        const userId = getUserId();
        if (!userId) throw new Error("Please log in to add items to cart");

        setStoreLoading(set, "addItem", true, {
          errorMessage: "",
          successMessage: "",
        });

        try {
          const state = get();
          if (!state.itemsFetched) {
            await get().fetchItems({ force: true });
          }

          if (isProductInCart(get().items, payload.product)) {
            set({ successMessage: "Already in cart" });
            return "already" as const;
          }

          await api.post(apiEndpoints.cart.add, {
            userId,
            productId: payload.product,
            quantity: payload.quantity ?? 1,
          });
          set({ successMessage: "Added to cart" });
          await get().fetchItems({ force: true });
          return "added" as const;
        } catch (error) {
          const status = getApiErrorStatus(error);
          const message = getApiErrorMessage(error, "Failed to add item");

          if (
            status === 404 &&
            message.toLowerCase().includes("already")
          ) {
            set({ successMessage: "Already in cart" });
            await get().fetchItems({ force: true });
            return "already" as const;
          }

          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "addItem", false);
        }
      },

      updateItem: async payload => {
        setStoreLoading(set, "updateItem", true, { errorMessage: "" });

        try {
          const current = get().items.find(item => item.id === payload.id);
          if (!current) throw new Error("Cart item not found");

          if (payload.quantity > current.quantity) {
            await api.put(apiEndpoints.cart.increment(payload.id));
          } else if (payload.quantity < current.quantity) {
            await api.put(apiEndpoints.cart.decrement(payload.id));
          }

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
          await api.delete(apiEndpoints.cart.remove(id));
          await get().fetchItems({ force: true });
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to remove item");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "removeItem", false);
        }
      },

      checkout: async (shippingInfo = {}) => {
        const userId = getUserId();
        if (!userId) throw new Error("Please log in to checkout");

        setStoreLoading(set, "checkout", true, {
          errorMessage: "",
          successMessage: "",
        });

        try {
          const items = get().items;
          const totals = computeTotals(items);
          const { data } = await api.post<{ orderId?: string; _id?: string }>(
            apiEndpoints.orders.place,
            {
              userId,
              price: totals.orderTotal,
              shipping_fee: totals.shipping,
              shippingInfo,
              products: items.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.price,
              })),
            },
          );
          const orderId = data.orderId ?? data._id ?? null;
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
