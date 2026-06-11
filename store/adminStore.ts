import type { ApiCheckpointItem, ApiManagementOrder, ApiSaleReview } from "@/lib/api-types";
import { getApiErrorMessage, unwrapEntity, unwrapList, unwrapListCount } from "@/lib/api-utils";
import api from "@/lib/axios";
import {
  mapManagementOrder,
  mapSaleReview,
  type ManagementOrderView,
  type SaleReviewView,
} from "@/lib/mappers";
import type { OrderQuery } from "@/lib/order-query";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

type AdminAction = "fetchTotals" | "fetchSales" | "fetchOrders";

export type DashboardCheckpoint = {
  index: number;
  name: string;
  total: number;
};

type AdminState = {
  checkpoints: DashboardCheckpoint[];
  sales: SaleReviewView[];
  salesCount: number;
  orders: ManagementOrderView[];
  ordersCount: number;
  errorMessage: string;
  ordersError: string;
  loading: Record<AdminAction, boolean>;
  fetchDashboardTotals: (includeCancelled?: boolean) => Promise<void>;
  fetchSales: (page?: number) => Promise<void>;
  fetchManagementOrders: (query?: OrderQuery) => Promise<void>;
  clearError: () => void;
};

function mapCheckpoints(data: unknown): DashboardCheckpoint[] {
  const entity = unwrapEntity<{ data?: ApiCheckpointItem[] }>(data);
  const list = entity?.data ?? unwrapList<ApiCheckpointItem>(data);

  return list
    .filter(
      (item): item is ApiCheckpointItem =>
        Boolean(item) && typeof item === "object",
    )
    .map(item => ({
      index: item.checkpoint_index ?? 0,
      name: item.checkpoint_name ?? "—",
      total: Number(item.total ?? 0),
    }));
}

async function fetchOrdersList(query: OrderQuery = {}) {
  const params = { page: 1, ...query };

  try {
    return await api.get<
      ApiManagementOrder[] | {
        results?: ApiManagementOrder[];
        count?: number;
      }
    >("/managements/orders/", { params });
  } catch (error) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status !== 500) throw error;

    return api.get<
      ApiManagementOrder[] | {
        results?: ApiManagementOrder[];
        count?: number;
      }
    >("/ordering/orders/", { params });
  }
}

const useAdminStore = create<AdminState>()(
  devtools(
    set => ({
      checkpoints: [],
      sales: [],
      salesCount: 0,
      orders: [],
      ordersCount: 0,
      errorMessage: "",
      ordersError: "",
      loading: createStoreLoadingState([
        "fetchTotals",
        "fetchSales",
        "fetchOrders",
      ] as const),

      clearError: () => set({ errorMessage: "" }),

      fetchDashboardTotals: async (includeCancelled = false) => {
        setStoreLoading(set, "fetchTotals", true, { errorMessage: "" });

        try {
          const { data } = await api.get("/managements/reports/totals/", {
            params: { "include-cancelled": includeCancelled },
          });
          set({ checkpoints: mapCheckpoints(data) });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(
              error,
              "Failed to load dashboard totals",
            ),
            checkpoints: [],
          });
        } finally {
          setStoreLoading(set, "fetchTotals", false);
        }
      },

      fetchSales: async (page = 1) => {
        setStoreLoading(set, "fetchSales", true, { errorMessage: "" });

        try {
          const { data } = await api.get<
            ApiSaleReview[] | { results?: ApiSaleReview[]; count?: number }
          >("/managements/sales/", { params: { page } });
          const list = unwrapList(data);
          const salesCount = unwrapListCount(data, list.length);

          set({
            sales: list.map((item: unknown) =>
              mapSaleReview(item as ApiSaleReview),
            ),
            salesCount,
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load sales"),
            sales: [],
            salesCount: 0,
          });
        } finally {
          setStoreLoading(set, "fetchSales", false);
        }
      },

      fetchManagementOrders: async (query = {}) => {
        setStoreLoading(set, "fetchOrders", true, { ordersError: "" });

        try {
          const { data } = await fetchOrdersList(query);
          const list = unwrapList(data);
          const ordersCount = unwrapListCount(data, list.length);

          set({
            orders: list.map((item: unknown) =>
              mapManagementOrder(item as ApiManagementOrder),
            ),
            ordersCount,
            ordersError: "",
          });
        } catch (error) {
          set({
            ordersError: getApiErrorMessage(error, "Failed to load orders"),
            orders: [],
            ordersCount: 0,
          });
        } finally {
          setStoreLoading(set, "fetchOrders", false);
        }
      },
    }),
    withStoreDevtools("admin"),
  ),
);

export default useAdminStore;
