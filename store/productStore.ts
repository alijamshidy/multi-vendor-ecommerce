import type { ApiProduct } from "@/lib/api-types";
import {
  createLoadingState,
  getApiErrorMessage,
  unwrapEntity,
  unwrapList,
} from "@/lib/api-utils";
import api from "@/lib/axios";
import { mapProduct } from "@/lib/mappers";
import type { productType } from "@/utils/products";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";

export type ProductQuery = {
  search?: string;
  categories?: string;
  price_min?: number;
  price_max?: number;
  page?: number;
  page_size?: number;
  ordering?: string;
};

type ProductAction =
  | "fetchProducts"
  | "fetchProduct"
  | "fetchSimilar"
  | "fetchFeatured";

type ProductState = {
  products: productType[];
  product: productType | null;
  similarProducts: productType[];
  featuredProducts: productType[];
  totalCount: number;
  errorMessage: string;
  loading: Record<ProductAction, boolean>;
  fetchProducts: (query?: ProductQuery) => Promise<void>;
  fetchProduct: (id: string) => Promise<productType | null>;
  fetchSimilarProducts: (id: string) => Promise<void>;
  fetchFeaturedProducts: (limit?: number) => Promise<void>;
  clearError: () => void;
};

const useProductStore = create<ProductState>()(
  devtools(
    set => ({
      products: [],
      product: null,
      similarProducts: [],
      featuredProducts: [],
      totalCount: 0,
      errorMessage: "",
      loading: createLoadingState([
        "fetchProducts",
        "fetchProduct",
        "fetchSimilar",
        "fetchFeatured",
      ] as const),

      clearError: () => set({ errorMessage: "" }),

      fetchProducts: async (query = {}) => {
        set(state => ({
          loading: { ...state.loading, fetchProducts: true },
          errorMessage: "",
        }));

        try {
          const { data } = await api.get<
            ApiProduct[] | { results: ApiProduct[]; count?: number }
          >("/products/", { params: query, skipAuth: true });
          const list = unwrapList(data);
          set({
            products: list.map((item: unknown) =>
              mapProduct(item as ApiProduct),
            ),
            totalCount: Array.isArray(data)
              ? list.length
              : (data.count ?? list.length),
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load products"),
          });
        } finally {
          set(state => ({
            loading: { ...state.loading, fetchProducts: false },
          }));
        }
      },

      fetchProduct: async id => {
        set(state => ({
          loading: { ...state.loading, fetchProduct: true },
          errorMessage: "",
          product: null,
        }));

        try {
          const { data } = await api.get(`/products/${id}/`);
          const item = unwrapEntity<ApiProduct>(data);
          if (!item) {
            set({ errorMessage: "Product not found" });
            return null;
          }
          const mapped = mapProduct(item);
          set({ product: mapped });
          return mapped;
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Product not found"),
          });
          return null;
        } finally {
          set(state => ({
            loading: { ...state.loading, fetchProduct: false },
          }));
        }
      },

      fetchSimilarProducts: async id => {
        set(state => ({
          loading: { ...state.loading, fetchSimilar: true },
          errorMessage: "",
        }));

        try {
          const { data } = await api.get<
            ApiProduct[] | { results: ApiProduct[] }
          >(`/products/${id}/similar/`);
          set({
            similarProducts: unwrapList(data).map((item: unknown) =>
              mapProduct(item as ApiProduct),
            ),
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(
              error,
              "Failed to load similar products",
            ),
          });
        } finally {
          set(state => ({
            loading: { ...state.loading, fetchSimilar: false },
          }));
        }
      },

      fetchFeaturedProducts: async (limit = 8) => {
        set(state => ({
          loading: { ...state.loading, fetchFeatured: true },
          errorMessage: "",
        }));

        try {
          const { data } = await api.get<
            ApiProduct[] | { results: ApiProduct[] }
          >("/products/", {
            params: { page: 1, page_size: limit },
            skipAuth: true,
          });
          set({
            featuredProducts: unwrapList(data).map((item: unknown) =>
              mapProduct(item as ApiProduct),
            ),
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(
              error,
              "Failed to load featured products",
            ),
          });
        } finally {
          set(state => ({
            loading: { ...state.loading, fetchFeatured: false },
          }));
        }
      },
    }),
    withStoreDevtools("product"),
  ),
);

export default useProductStore;
