import type {
  ApiHomeProductsResponse,
  ApiProduct,
  ApiProductDetailsResponse,
  ApiQueryProductsResponse,
  ProductQuery,
} from "@/lib/api-types";
import { getApiErrorMessage, serializeQueryParams } from "@/lib/api-utils";
import api from "@/lib/axios";
import { apiEndpoints } from "@/lib/endpoints";
import { mapProduct } from "@/lib/mappers";
import { BACKEND_PAGE_SIZE } from "@/lib/product-query";
import {
  DEFAULT_PRICE_BOUNDS,
  fetchProductPriceBounds,
  type PriceBounds,
} from "@/lib/product-price-bounds";
import type { productType } from "@/utils/products";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

export type { ProductQuery };

type ProductAction =
  | "fetchProducts"
  | "fetchProduct"
  | "fetchSimilar"
  | "fetchFeatured"
  | "fetchHomeSections"
  | "fetchPriceBounds";

type ProductState = {
  products: productType[];
  product: productType | null;
  similarProducts: productType[];
  shopProducts: productType[];
  featuredProducts: productType[];
  latestProducts: productType[];
  topRatedProducts: productType[];
  discountProducts: productType[];
  totalCount: number;
  priceBounds: PriceBounds;
  priceBoundsLoaded: boolean;
  errorMessage: string;
  loading: Record<ProductAction, boolean>;
  fetchProducts: (query?: ProductQuery) => Promise<void>;
  fetchPriceBounds: () => Promise<PriceBounds>;
  fetchProduct: (slug: string) => Promise<productType | null>;
  fetchSimilarProducts: (slug: string) => Promise<void>;
  fetchFeaturedProducts: (limit?: number) => Promise<void>;
  fetchHomeProductSections: () => Promise<void>;
  clearError: () => void;
};

const useProductStore = create<ProductState>()(
  devtools(
    (set, get) => ({
      products: [],
      product: null,
      similarProducts: [],
      shopProducts: [],
      featuredProducts: [],
      latestProducts: [],
      topRatedProducts: [],
      discountProducts: [],
      totalCount: 0,
      priceBounds: DEFAULT_PRICE_BOUNDS,
      priceBoundsLoaded: false,
      errorMessage: "",
      loading: createStoreLoadingState([
        "fetchProducts",
        "fetchProduct",
        "fetchSimilar",
        "fetchFeatured",
        "fetchHomeSections",
        "fetchPriceBounds",
      ] as const),

      clearError: () => set({ errorMessage: "" }),

      fetchPriceBounds: async () => {
        const current = get();
        if (current.priceBoundsLoaded) return current.priceBounds;

        setStoreLoading(set, "fetchPriceBounds", true);
        try {
          const bounds = await fetchProductPriceBounds();
          set({ priceBounds: bounds, priceBoundsLoaded: true });
          return bounds;
        } catch {
          set({ priceBounds: DEFAULT_PRICE_BOUNDS, priceBoundsLoaded: true });
          return DEFAULT_PRICE_BOUNDS;
        } finally {
          setStoreLoading(set, "fetchPriceBounds", false);
        }
      },

      fetchProducts: async (query = {}) => {
        setStoreLoading(set, "fetchProducts", true, { errorMessage: "" });

        try {
          const { data } = await api.get<ApiQueryProductsResponse>(
            apiEndpoints.storefront.queryProducts,
            {
              params: serializeQueryParams(query),
              skipAuth: true,
            },
          );

          set({
            products: (data.products ?? []).map(mapProduct),
            totalCount: data.totalProduct ?? data.products?.length ?? 0,
            errorMessage: "",
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load products"),
            products: [],
            totalCount: 0,
          });
        } finally {
          setStoreLoading(set, "fetchProducts", false);
        }
      },

      fetchProduct: async slug => {
        setStoreLoading(set, "fetchProduct", true, {
          errorMessage: "",
          product: null,
        });

        try {
          const { data } = await api.get<ApiProductDetailsResponse>(
            apiEndpoints.storefront.productDetails(slug),
            { skipAuth: true },
          );

          if (!data.product) {
            set({ errorMessage: "Product not found" });
            return null;
          }

          const mapped = mapProduct(data.product);
          set({
            product: mapped,
            similarProducts: (data.relatedProducts ?? []).map(mapProduct),
            shopProducts: (data.moreProducts ?? []).map(mapProduct),
          });
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

      fetchSimilarProducts: async slug => {
        setStoreLoading(set, "fetchSimilar", true, { errorMessage: "" });

        try {
          const { data } = await api.get<ApiProductDetailsResponse>(
            apiEndpoints.storefront.productDetails(slug),
            { skipAuth: true },
          );
          set({
            similarProducts: (data.relatedProducts ?? []).map(mapProduct),
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
          const { data } = await api.get<ApiHomeProductsResponse>(
            apiEndpoints.storefront.homeProducts,
            { skipAuth: true },
          );
          const products = (data.products ?? []).slice(0, limit);
          set({ featuredProducts: products.map(mapProduct) });
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

      fetchHomeProductSections: async () => {
        setStoreLoading(set, "fetchHomeSections", true, { errorMessage: "" });

        try {
          const { data } = await api.get<ApiHomeProductsResponse>(
            apiEndpoints.storefront.homeProducts,
            { skipAuth: true },
          );

          const latestNested = data.latest_product ?? [];
          const latestFlat = latestNested.flat();
          const topRatedNested =
            data.topRated_product ?? data.top_rated_product ?? [];
          const topRatedFlat = topRatedNested.flat();
          const discountNested = data.discount_product ?? [];
          const discountFlat = discountNested.flat();

          set({
            latestProducts: latestFlat.map(mapProduct),
            topRatedProducts: topRatedFlat.map(mapProduct),
            discountProducts: discountFlat.map(mapProduct),
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(
              error,
              "Failed to load home products",
            ),
          });
        } finally {
          setStoreLoading(set, "fetchHomeSections", false);
        }
      },
    }),
    withStoreDevtools("product"),
  ),
);

export default useProductStore;
