import type { ApiProduct } from "@/lib/api-types";
import { getApiErrorMessage, unwrapEntity, unwrapList } from "@/lib/api-utils";
import api from "@/lib/axios";
import { mapProduct } from "@/lib/mappers";
import {
  expandCategoryIds,
  parseCategoryFilterIds,
  productMatchesCategories,
} from "@/lib/product-category-filter";
import { BACKEND_PAGE_SIZE } from "@/lib/product-query";
import {
  DEFAULT_PRICE_BOUNDS,
  fetchProductPriceBounds,
  type PriceBounds,
} from "@/lib/product-price-bounds";
import type { productType } from "@/utils/products";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import useCategoryStore from "./categoryStore";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

/** Query params accepted by GET /api/v1/products/ (see OpenAPI at /api/v1/schema/). */
export type ProductQuery = {
  search?: string;
  category?: string;
  category__in?: string;
  collections?: string;
  price_min?: number;
  price_max?: number;
  is_available?: boolean;
  has_discount?: boolean;
  created_after?: string;
  created_before?: string;
  page?: number;
  ordering?: string;
};

type ProductListResponse =
  | ApiProduct[]
  | { data?: ApiProduct[]; results?: ApiProduct[]; count?: number; next?: string | null };

type ProductAction =
  | "fetchProducts"
  | "fetchProduct"
  | "fetchSimilar"
  | "fetchFeatured"
  | "fetchPriceBounds";

type ProductState = {
  products: productType[];
  product: productType | null;
  similarProducts: productType[];
  featuredProducts: productType[];
  totalCount: number;
  priceBounds: PriceBounds;
  priceBoundsLoaded: boolean;
  errorMessage: string;
  loading: Record<ProductAction, boolean>;
  fetchProducts: (query?: ProductQuery) => Promise<void>;
  fetchPriceBounds: () => Promise<PriceBounds>;
  fetchProduct: (id: string) => Promise<productType | null>;
  fetchSimilarProducts: (id: string) => Promise<void>;
  fetchFeaturedProducts: (limit?: number) => Promise<void>;
  clearError: () => void;
};

function hasProductDiscount(item: ApiProduct): boolean {
  if (item.discounts?.length) return true;

  const price = Number(item.price);
  const discountPrice = Number(item.discount_price ?? item.price);

  return (
    !Number.isNaN(price) &&
    !Number.isNaN(discountPrice) &&
    discountPrice < price
  );
}

function getResponseCount(data: ProductListResponse, fallback: number): number {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data.count ?? fallback;
  }

  return fallback;
}

function hasNextPage(data: ProductListResponse): boolean {
  return (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    Boolean(data.next)
  );
}

async function fetchAllProductPages(
  apiQuery: Omit<ProductQuery, "page" | "has_discount" | "category" | "category__in">,
): Promise<ApiProduct[]> {
  const items: ApiProduct[] = [];
  let page = 1;

  while (true) {
    const { data } = await api.get<ProductListResponse>("/products/", {
      params: { ...apiQuery, page },
      skipAuth: true,
    });
    const list = unwrapList<ApiProduct>(data);
    items.push(...list);

    if (!hasNextPage(data) || list.length === 0) {
      break;
    }

    page += 1;
  }

  return items;
}

async function ensureCategoryTreeLoaded() {
  const categoryState = useCategoryStore.getState();

  if (categoryState.categories.length > 0) {
    return categoryState.categories;
  }

  await categoryState.fetchCategories();
  return useCategoryStore.getState().categories;
}

function paginateProducts(items: ApiProduct[], page: number): ApiProduct[] {
  const start = (page - 1) * BACKEND_PAGE_SIZE;
  return items.slice(start, start + BACKEND_PAGE_SIZE);
}

const useProductStore = create<ProductState>()(
  devtools(
    (set, get) => ({
      products: [],
      product: null,
      similarProducts: [],
      featuredProducts: [],
      totalCount: 0,
      priceBounds: DEFAULT_PRICE_BOUNDS,
      priceBoundsLoaded: false,
      errorMessage: "",
      loading: createStoreLoadingState([
        "fetchProducts",
        "fetchProduct",
        "fetchSimilar",
        "fetchFeatured",
        "fetchPriceBounds",
      ] as const),

      clearError: () => set({ errorMessage: "" }),

      fetchPriceBounds: async () => {
        const current = get();
        if (current.priceBoundsLoaded) {
          return current.priceBounds;
        }

        setStoreLoading(set, "fetchPriceBounds", true);

        try {
          const bounds = await fetchProductPriceBounds();
          set({ priceBounds: bounds, priceBoundsLoaded: true });
          return bounds;
        } catch {
          set({
            priceBounds: DEFAULT_PRICE_BOUNDS,
            priceBoundsLoaded: true,
          });
          return DEFAULT_PRICE_BOUNDS;
        } finally {
          setStoreLoading(set, "fetchPriceBounds", false);
        }
      },

      fetchProducts: async (query = {}) => {
        setStoreLoading(set, "fetchProducts", true, { errorMessage: "" });

        const {
          has_discount,
          page = 1,
          category,
          category__in,
          ...apiQuery
        } = query;
        const selectedCategoryIds = parseCategoryFilterIds(
          category__in ?? category,
        );
        const needsClientSideFilter =
          has_discount === true || selectedCategoryIds.length > 0;

        try {
          if (needsClientSideFilter) {
            const allItems = await fetchAllProductPages(apiQuery);
            let filtered = allItems;

            if (selectedCategoryIds.length > 0) {
              const categories = await ensureCategoryTreeLoaded();
              const expandedIds = expandCategoryIds(
                selectedCategoryIds,
                categories,
              );
              filtered = filtered.filter(item =>
                productMatchesCategories(item, expandedIds),
              );
            }

            if (has_discount === true) {
              filtered = filtered.filter(hasProductDiscount);
            }

            const pageItems = paginateProducts(filtered, page);

            set({
              products: pageItems.map(item => mapProduct(item)),
              totalCount: filtered.length,
              errorMessage: "",
            });
            return;
          }

          const params: ProductQuery = { ...apiQuery, page };
          if (has_discount === false) {
            params.has_discount = false;
          }

          const { data } = await api.get<ProductListResponse>("/products/", {
            params,
            skipAuth: true,
          });
          const list = unwrapList<ApiProduct>(data);
          const totalCount = getResponseCount(data, list.length);

          set({
            products: list.map(item => mapProduct(item)),
            totalCount,
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
