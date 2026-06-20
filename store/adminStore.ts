import type { ApiOrder, OrderQuery } from "@/lib/api-types";
import { getApiErrorMessage, serializeQueryParams, unwrapListCount } from "@/lib/api-utils";
import api from "@/lib/axios";
import { apiEndpoints } from "@/lib/endpoints";
import {
  mapManagementOrder,
  type ManagementOrderView,
  type SaleReviewView,
} from "@/lib/mappers";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

type AdminAction = "fetchTotals" | "fetchSales" | "fetchOrders";

const DEFAULT_ADMIN_ORDER_QUERY: OrderQuery = { page: 1, parPage: 10 };

function withDefaultOrderQuery(query: OrderQuery = {}): OrderQuery {
  return { ...DEFAULT_ADMIN_ORDER_QUERY, ...query };
}

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
  fetchDashboardTotals: () => Promise<void>;
  fetchSales: (page?: number) => Promise<void>;
  fetchManagementOrders: (query?: OrderQuery) => Promise<void>;
  clearError: () => void;
};

function buildCheckpointsFromOrders(
  orders: ManagementOrderView[],
): DashboardCheckpoint[] {
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pending = orders.filter(
    order => order.status.toLowerCase() === "pending",
  ).length;

  return [
    { index: 0, name: "Total Revenue", total: revenue },
    { index: 1, name: "Total Orders", total: orders.length },
    { index: 2, name: "Pending Orders", total: pending },
  ];
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

      fetchDashboardTotals: async () => {
        setStoreLoading(set, "fetchTotals", true, { errorMessage: "" });

        try {
          const { data } = await api.get<{ orders: ApiOrder[]; totalOrder?: number }>(
            apiEndpoints.orders.adminList,
            { params: serializeQueryParams(withDefaultOrderQuery()) },
          );
          const mapped = (data.orders ?? []).map(mapManagementOrder);
          set({
            checkpoints: buildCheckpointsFromOrders(mapped),
            orders: mapped,
            ordersCount: unwrapListCount(data, mapped.length),
            errorMessage: "",
            ordersError: "",
          });
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
          const { data } = await api.get<{
            sales?: Array<Record<string, unknown>>;
            totalSales?: number;
          }>(apiEndpoints.reports.adminSales, {
            params: serializeQueryParams({ page, parPage: 10 }),
          });
          const list = data.sales ?? [];
          set({
            sales: list.map(mapSaleReview),
            salesCount: data.totalSales ?? list.length,
            errorMessage: "",
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
          const { data } = await api.get<{ orders: ApiOrder[]; totalOrder?: number }>(
            apiEndpoints.orders.adminList,
            { params: serializeQueryParams(withDefaultOrderQuery(query)) },
          );
          const list = data.orders ?? [];
          const mapped = list.map(mapManagementOrder);
          set({
            orders: mapped,
            ordersCount: unwrapListCount(data, list.length, data.totalOrder),
            checkpoints: buildCheckpointsFromOrders(mapped),
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
