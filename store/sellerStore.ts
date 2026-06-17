import type { ApiSeller, ApiSellersResponse, ListQuery } from "@/lib/api-types";
import {
  getApiErrorMessage,
  resolveMediaUrl,
  serializeQueryParams,
  unwrapListCount,
} from "@/lib/api-utils";
import api from "@/lib/axios";
import { apiEndpoints } from "@/lib/endpoints";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

export type SellerView = {
  id: string;
  name: string;
  email: string;
  shopName: string;
  status: string;
  imageUrl: string;
};

type SellerAction =
  | "fetchPending"
  | "fetchActive"
  | "fetchDeactive"
  | "fetchSeller"
  | "updateStatus";

function mapSeller(item: ApiSeller): SellerView {
  return {
    id: item._id,
    name: item.name ?? "Seller",
    email: item.email ?? "",
    shopName: item.shopName ?? "",
    status: item.status ?? "pending",
    imageUrl: resolveMediaUrl(item.image) || "/images/hero1.jpg",
  };
}

function unwrapSellers(data: ApiSellersResponse): ApiSeller[] {
  return data.sellers ?? data.requestSellers ?? [];
}

type SellerState = {
  pendingSellers: SellerView[];
  activeSellers: SellerView[];
  deactiveSellers: SellerView[];
  activeSeller: SellerView | null;
  pendingCount: number;
  activeCount: number;
  deactiveCount: number;
  errorMessage: string;
  loading: Record<SellerAction, boolean>;
  fetchPendingSellers: (query?: ListQuery) => Promise<void>;
  fetchActiveSellers: (query?: ListQuery) => Promise<void>;
  fetchDeactiveSellers: (query?: ListQuery) => Promise<void>;
  fetchSeller: (sellerId: string) => Promise<SellerView | null>;
  updateSellerStatus: (payload: {
    sellerId: string;
    status: "active" | "deactive";
  }) => Promise<void>;
  clearError: () => void;
};

const useSellerStore = create<SellerState>()(
  devtools(
    (set, get) => ({
      pendingSellers: [],
      activeSellers: [],
      deactiveSellers: [],
      activeSeller: null,
      pendingCount: 0,
      activeCount: 0,
      deactiveCount: 0,
      errorMessage: "",
      loading: createStoreLoadingState([
        "fetchPending",
        "fetchActive",
        "fetchDeactive",
        "fetchSeller",
        "updateStatus",
      ] as const),

      clearError: () => set({ errorMessage: "" }),

      fetchPendingSellers: async (query = {}) => {
        setStoreLoading(set, "fetchPending", true, { errorMessage: "" });

        try {
          const { data } = await api.get<ApiSellersResponse>(
            apiEndpoints.sellers.pending,
            { params: serializeQueryParams(query) },
          );
          const list = unwrapSellers(data);
          set({
            pendingSellers: list.map(mapSeller),
            pendingCount: unwrapListCount(data, list.length),
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(
              error,
              "Failed to load pending sellers",
            ),
            pendingSellers: [],
            pendingCount: 0,
          });
        } finally {
          setStoreLoading(set, "fetchPending", false);
        }
      },

      fetchActiveSellers: async (query = {}) => {
        setStoreLoading(set, "fetchActive", true, { errorMessage: "" });

        try {
          const { data } = await api.get<ApiSellersResponse>(
            apiEndpoints.sellers.active,
            { params: serializeQueryParams(query) },
          );
          const list = unwrapSellers(data);
          set({
            activeSellers: list.map(mapSeller),
            activeCount: unwrapListCount(data, list.length),
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(
              error,
              "Failed to load active sellers",
            ),
            activeSellers: [],
            activeCount: 0,
          });
        } finally {
          setStoreLoading(set, "fetchActive", false);
        }
      },

      fetchDeactiveSellers: async (query = {}) => {
        setStoreLoading(set, "fetchDeactive", true, { errorMessage: "" });

        try {
          const { data } = await api.get<ApiSellersResponse>(
            apiEndpoints.sellers.deactive,
            { params: serializeQueryParams(query) },
          );
          const list = unwrapSellers(data);
          set({
            deactiveSellers: list.map(mapSeller),
            deactiveCount: unwrapListCount(data, list.length),
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(
              error,
              "Failed to load deactivated sellers",
            ),
            deactiveSellers: [],
            deactiveCount: 0,
          });
        } finally {
          setStoreLoading(set, "fetchDeactive", false);
        }
      },

      fetchSeller: async sellerId => {
        setStoreLoading(set, "fetchSeller", true, { errorMessage: "" });

        try {
          const { data } = await api.get<{ seller?: ApiSeller } & ApiSeller>(
            apiEndpoints.sellers.get(sellerId),
          );
          const raw = data.seller ?? data;
          const mapped = mapSeller(raw);
          set({ activeSeller: mapped });
          return mapped;
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Seller not found"),
            activeSeller: null,
          });
          return null;
        } finally {
          setStoreLoading(set, "fetchSeller", false);
        }
      },

      updateSellerStatus: async payload => {
        setStoreLoading(set, "updateStatus", true, { errorMessage: "" });

        try {
          await api.post(apiEndpoints.sellers.statusUpdate, payload);
          await Promise.all([
            get().fetchPendingSellers(),
            get().fetchActiveSellers(),
            get().fetchDeactiveSellers(),
          ]);
        } catch (error) {
          const message = getApiErrorMessage(
            error,
            "Failed to update seller status",
          );
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "updateStatus", false);
        }
      },
    }),
    withStoreDevtools("seller"),
  ),
);

export default useSellerStore;
