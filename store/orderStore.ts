import type {
  ApiOrder,
  CustomerDashboardData,
  OrderQuery,
} from "@/lib/api-types";
import {
  getApiErrorMessage,
  serializeQueryParams,
  unwrapListCount,
} from "@/lib/api-utils";
import api from "@/lib/axios";
import { apiEndpoints } from "@/lib/endpoints";
import { mapManagementOrder, mapOrder, unwrapOrderResponse } from "@/lib/mappers";
import {
  applyClientOrderFilters,
  needsClientOrderFiltering,
} from "@/lib/order-client-filters";
import useAuthStore from "@/store/authStore";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

export type OrderView = ReturnType<typeof mapOrder>;
export type ManagementOrderView = ReturnType<typeof mapManagementOrder>;

type OrderAction =
  | "fetchOrders"
  | "fetchOrder"
  | "fetchDashboard"
  | "fetchSellerOrders"
  | "fetchSellerOrder"
  | "fetchAdminOrder"
  | "updateStatus";

type OrderState = {
  orders: OrderView[];
  totalCount: number;
  activeOrder: OrderView | null;
  dashboard: CustomerDashboardData | null;
  sellerOrders: ManagementOrderView[];
  sellerOrdersCount: number;
  errorMessage: string;
  loading: Record<OrderAction, boolean>;
  fetchOrders: (query?: OrderQuery) => Promise<void>;
  fetchOrder: (id: string) => Promise<OrderView | null>;
  fetchCustomerDashboard: (userId?: string) => Promise<void>;
  fetchSellerOrders: (query?: OrderQuery & { sellerId?: string }) => Promise<void>;
  fetchSellerOrder: (id: string) => Promise<ManagementOrderView | null>;
  fetchAdminOrder: (id: string) => Promise<ManagementOrderView | null>;
  updateOrderStatus: (payload: {
    orderId: string;
    status: string;
    role: "admin" | "seller";
  }) => Promise<void>;
  clearError: () => void;
};

const useOrderStore = create<OrderState>()(
  devtools(
    (set, get) => ({
      orders: [],
      totalCount: 0,
      activeOrder: null,
      dashboard: null,
      sellerOrders: [],
      sellerOrdersCount: 0,
      errorMessage: "",
      loading: createStoreLoadingState([
        "fetchOrders",
        "fetchOrder",
        "fetchDashboard",
        "fetchSellerOrders",
        "fetchSellerOrder",
        "fetchAdminOrder",
        "updateStatus",
      ] as const),

      clearError: () => set({ errorMessage: "" }),

      fetchOrders: async (query = {}) => {
        setStoreLoading(set, "fetchOrders", true, { errorMessage: "" });

        const user = useAuthStore.getState().user;
        const customerId = user?.id;
        const status = query.status ?? "all";

        try {
          if (customerId) {
            const { data } = await api.get<{ orders: ApiOrder[] }>(
              apiEndpoints.orders.customerByStatus(customerId, status),
            );
            const list = data.orders ?? [];
            const mapped = list.map(mapOrder);
            const filtered = needsClientOrderFiltering(query)
              ? applyClientOrderFilters(mapped, query)
              : mapped;

            set({
              orders: filtered,
              totalCount: filtered.length,
            });
            return;
          }

          const { data } = await api.get<{ orders: ApiOrder[] }>(
            apiEndpoints.orders.adminList,
            {
              params: serializeQueryParams({
                page: query.page ?? 1,
                parPage: query.parPage ?? 10,
                searchValue: query.searchValue,
                status: query.status,
                ordering: query.ordering,
                createdAfter: query.createdAfter,
                createdBefore: query.createdBefore,
                paidAfter: query.paidAfter,
                paidBefore: query.paidBefore,
                deliveredAfter: query.deliveredAfter,
                deliveredBefore: query.deliveredBefore,
                canceledAfter: query.canceledAfter,
                canceledBefore: query.canceledBefore,
                refundedAfter: query.refundedAfter,
                refundedBefore: query.refundedBefore,
              }),
            },
          );
          const list = data.orders ?? [];
          set({
            orders: list.map(mapOrder),
            totalCount: unwrapListCount(data, list.length),
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
          const { data } = await api.get(
            apiEndpoints.orders.customerDetails(id),
          );
          const raw = unwrapOrderResponse(data);
          if (!raw) {
            set({ errorMessage: "Order not found", activeOrder: null });
            return null;
          }
          const mapped = mapOrder(raw);
          set({ activeOrder: mapped });
          return mapped;
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Order not found"),
            activeOrder: null,
          });
          return null;
        } finally {
          setStoreLoading(set, "fetchOrder", false);
        }
      },

      fetchCustomerDashboard: async userId => {
        setStoreLoading(set, "fetchDashboard", true, { errorMessage: "" });

        const resolvedUserId =
          userId ?? useAuthStore.getState().user?.id ?? null;
        if (!resolvedUserId) {
          set({ dashboard: null });
          setStoreLoading(set, "fetchDashboard", false);
          return;
        }

        try {
          const { data } = await api.get<CustomerDashboardData>(
            apiEndpoints.orders.customerDashboard(resolvedUserId),
          );
          set({ dashboard: data });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(
              error,
              "Failed to load dashboard",
            ),
            dashboard: null,
          });
        } finally {
          setStoreLoading(set, "fetchDashboard", false);
        }
      },

      fetchSellerOrders: async (query = {}) => {
        setStoreLoading(set, "fetchSellerOrders", true, { errorMessage: "" });

        const sellerId =
          query.sellerId ?? useAuthStore.getState().user?.id ?? null;
        if (!sellerId) {
          set({ sellerOrders: [], sellerOrdersCount: 0 });
          setStoreLoading(set, "fetchSellerOrders", false);
          return;
        }

        try {
          const { status, ...rest } = query;
          const { data } = await api.get<{ orders: ApiOrder[] }>(
            apiEndpoints.orders.sellerList(sellerId),
            {
              params: serializeQueryParams({
                page: query.page ?? 1,
                parPage: query.parPage ?? 10,
                ...rest,
                ...(status && status !== "all" ? { status } : {}),
              }),
            },
          );
          const list = data.orders ?? [];
          set({
            sellerOrders: list.map(mapManagementOrder),
            sellerOrdersCount: unwrapListCount(data, list.length),
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(
              error,
              "Failed to load seller orders",
            ),
            sellerOrders: [],
            sellerOrdersCount: 0,
          });
        } finally {
          setStoreLoading(set, "fetchSellerOrders", false);
        }
      },

      fetchSellerOrder: async id => {
        setStoreLoading(set, "fetchSellerOrder", true, { errorMessage: "" });

        try {
          const { data } = await api.get(apiEndpoints.orders.sellerDetails(id));
          const raw = unwrapOrderResponse(data);
          if (!raw) {
            set({ errorMessage: "Order not found", activeOrder: null });
            return null;
          }
          const mapped = mapManagementOrder(raw);
          set({ activeOrder: mapped });
          return mapped;
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Order not found"),
            activeOrder: null,
          });
          return null;
        } finally {
          setStoreLoading(set, "fetchSellerOrder", false);
        }
      },

      fetchAdminOrder: async id => {
        setStoreLoading(set, "fetchAdminOrder", true, { errorMessage: "" });

        try {
          const { data } = await api.get(apiEndpoints.orders.adminDetails(id));
          const raw = unwrapOrderResponse(data);
          if (!raw) {
            set({ errorMessage: "Order not found", activeOrder: null });
            return null;
          }
          const mapped = mapManagementOrder(raw);
          set({ activeOrder: mapped });
          return mapped;
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Order not found"),
            activeOrder: null,
          });
          return null;
        } finally {
          setStoreLoading(set, "fetchAdminOrder", false);
        }
      },

      updateOrderStatus: async payload => {
        setStoreLoading(set, "updateStatus", true, { errorMessage: "" });

        try {
          const endpoint =
            payload.role === "admin"
              ? apiEndpoints.orders.adminStatusUpdate(payload.orderId)
              : apiEndpoints.orders.sellerStatusUpdate(payload.orderId);

          await api.put(endpoint, { status: payload.status });

          if (payload.role === "seller") {
            await get().fetchSellerOrders();
          } else {
            await get().fetchOrders();
          }
        } catch (error) {
          const message = getApiErrorMessage(
            error,
            "Failed to update order status",
          );
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "updateStatus", false);
        }
      },
    }),
    withStoreDevtools("order"),
  ),
);

export default useOrderStore;
