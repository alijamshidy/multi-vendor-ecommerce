import type { ApiProduct } from "@/lib/api-types";
import {
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
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

export type ProductQuery = {
  search?: string;
  categories?: string;
  collections?: string;
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
      loading: createStoreLoadingState([
        "fetchProducts",
        "fetchProduct",
        "fetchSimilar",
        "fetchFeatured",
      ] as const),

      clearError: () => set({ errorMessage: "" }),

      fetchProducts: async (query = {}) => {
        setStoreLoading(set, "fetchProducts", true, { errorMessage: "" });

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
          setStoreLoading(set, "fetchProducts", false);
        }
      },

      fetchProduct: async id => {
        setStoreLoading(set, "fetchProduct", true, {
          errorMessage: "",
          product: null,
        });

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
          setStoreLoading(set, "fetchProduct", false);
        }
      },

      fetchSimilarProducts: async id => {
        setStoreLoading(set, "fetchSimilar", true, { errorMessage: "" });

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
          setStoreLoading(set, "fetchSimilar", false);
        }
      },

      fetchFeaturedProducts: async (limit = 8) => {
        setStoreLoading(set, "fetchFeatured", true, { errorMessage: "" });

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
          setStoreLoading(set, "fetchFeatured", false);
        }
      },
    }),
    withStoreDevtools("product"),
  ),
);

export default useProductStore;
