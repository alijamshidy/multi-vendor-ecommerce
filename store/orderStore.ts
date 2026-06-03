import type { ApiOrder } from "@/lib/api-types";
import {
  createLoadingState,
  getApiErrorMessage,
  unwrapList,
} from "@/lib/api-utils";
import api from "@/lib/axios";
import { mapOrder } from "@/lib/mappers";
import { create } from "zustand";

export type OrderView = ReturnType<typeof mapOrder>;

type OrderAction = "fetchOrders" | "fetchOrder";

type OrderState = {
  orders: OrderView[];
  activeOrder: OrderView | null;
  errorMessage: string;
  loading: Record<OrderAction, boolean>;
  fetchOrders: () => Promise<void>;
  fetchOrder: (id: string) => Promise<OrderView | null>;
  clearError: () => void;
};

const useOrderStore = create<OrderState>(set => ({
  orders: [],
  activeOrder: null,
  errorMessage: "",
  loading: createLoadingState(["fetchOrders", "fetchOrder"] as const),

  clearError: () => set({ errorMessage: "" }),

  fetchOrders: async () => {
    set(state => ({
      loading: { ...state.loading, fetchOrders: true },
      errorMessage: "",
    }));

    try {
      const { data } = await api.get<ApiOrder[] | { results: ApiOrder[] }>(
        "/ordering/orders/",
      );
      set({
        orders: unwrapList(data).map((item: unknown) =>
          mapOrder(item as ApiOrder),
        ),
      });
    } catch (error) {
      set({
        errorMessage: getApiErrorMessage(error, "Failed to load orders"),
        orders: [],
      });
    } finally {
      set(state => ({
        loading: { ...state.loading, fetchOrders: false },
      }));
    }
  },

  fetchOrder: async id => {
    set(state => ({
      loading: { ...state.loading, fetchOrder: true },
      errorMessage: "",
    }));

    try {
      const { data } = await api.get<ApiOrder>(`/ordering/orders/${id}/`);
      const mapped = mapOrder(data);
      set({ activeOrder: mapped });
      return mapped;
    } catch (error) {
      set({
        errorMessage: getApiErrorMessage(error, "Order not found"),
      });
      return null;
    } finally {
      set(state => ({
        loading: { ...state.loading, fetchOrder: false },
      }));
    }
  },
}));

export default useOrderStore;
