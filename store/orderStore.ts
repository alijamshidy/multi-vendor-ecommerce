import type { ApiOrder } from "@/lib/api-types";
import type { OrderQuery } from "@/lib/order-query";
import { getApiErrorMessage, unwrapList } from "@/lib/api-utils";
import api from "@/lib/axios";
import { mapOrder } from "@/lib/mappers";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

export type OrderView = ReturnType<typeof mapOrder>;

type OrderAction = "fetchOrders" | "fetchOrder";

type OrderState = {
  orders: OrderView[];
  totalCount: number;
  activeOrder: OrderView | null;
  errorMessage: string;
  loading: Record<OrderAction, boolean>;
  fetchOrders: (query?: OrderQuery) => Promise<void>;
  fetchOrder: (id: string) => Promise<OrderView | null>;
  clearError: () => void;
};

const useOrderStore = create<OrderState>()(
  devtools(
    set => ({
      orders: [],
      totalCount: 0,
      activeOrder: null,
      errorMessage: "",
      loading: createStoreLoadingState(["fetchOrders", "fetchOrder"] as const),

      clearError: () => set({ errorMessage: "" }),

      fetchOrders: async (query = {}) => {
        setStoreLoading(set, "fetchOrders", true, { errorMessage: "" });

        try {
          const { data } = await api.get<
            | ApiOrder[]
            | { results?: ApiOrder[]; count?: number }
          >("/ordering/orders/", { params: query });
          const list = unwrapList(data);
          const totalCount =
            data && typeof data === "object" && !Array.isArray(data)
              ? (data.count ?? list.length)
              : list.length;
          set({
            orders: list.map((item: unknown) =>
              mapOrder(item as ApiOrder),
            ),
            totalCount,
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load orders"),
            orders: [],
            totalCount: 0,
          });
        } finally {
          setStoreLoading(set, "fetchOrders", false);
        }
      },

      fetchOrder: async id => {
        setStoreLoading(set, "fetchOrder", true, { errorMessage: "" });

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
          setStoreLoading(set, "fetchOrder", false);
        }
      },
    }),
    withStoreDevtools("order"),
  ),
);

export default useOrderStore;
