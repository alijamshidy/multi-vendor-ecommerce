import type { ListQuery } from "@/lib/list-query";
import type { ApiCategory, ApiCategoryDetail, ApiProduct } from "@/lib/api-types";
import {
  getApiErrorMessage,
  unwrapEntity,
  unwrapList,
} from "@/lib/api-utils";
import api from "@/lib/axios";
import { mapCategory, mapProduct } from "@/lib/mappers";
import type { category } from "@/utils/Category";
import type { productType } from "@/utils/products";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

type CategoryAction = "fetchCategories" | "fetchCategory" | "createCategory";

type CategoryState = {
  categories: category[];
  activeCategory: category | null;
  categoryProducts: productType[];
  errorMessage: string;
  successMessage: string;
  loading: Record<CategoryAction, boolean>;
  fetchCategories: (query?: ListQuery) => Promise<void>;
  fetchCategoryBySlug: (slug: string) => Promise<category | null>;
  createCategory: (payload: {
    name: string;
    slug?: string;
    description?: string;
    parent?: string;
    image?: File;
  }) => Promise<void>;
  clearError: () => void;
  clearMessages: () => void;
};

const useCategoryStore = create<CategoryState>()(
  devtools(
    (set, get) => ({
      categories: [],
      activeCategory: null,
      categoryProducts: [],
      errorMessage: "",
      successMessage: "",
      loading: createStoreLoadingState([
        "fetchCategories",
        "fetchCategory",
        "createCategory",
      ] as const),

      clearError: () => set({ errorMessage: "" }),
      clearMessages: () => set({ errorMessage: "", successMessage: "" }),

      fetchCategories: async (query = {}) => {
        setStoreLoading(set, "fetchCategories", true, { errorMessage: "" });

        try {
          const { data } = await api.get<
            ApiCategory[] | { results: ApiCategory[] }
          >("/categories/", { params: query, skipAuth: true });
          set({
            categories: unwrapList(data).map((item: unknown) =>
              mapCategory(item as ApiCategory),
            ),
            errorMessage: "",
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(
              error,
              "Failed to load categories",
            ),
          });
        } finally {
          setStoreLoading(set, "fetchCategories", false);
        }
      },

      fetchCategoryBySlug: async slug => {
        setStoreLoading(set, "fetchCategory", true, {
          errorMessage: "",
          activeCategory: null,
          categoryProducts: [],
        });

        try {
          const encodedSlug = encodeURIComponent(
            decodeURIComponent(slug),
          );
          const { data } = await api.get(`/categories/${encodedSlug}/`, {
            skipAuth: true,
          });
          const item = unwrapEntity<ApiCategoryDetail>(data);
          if (!item) {
            set({ errorMessage: "Category not found" });
            return null;
          }
          const mapped = mapCategory(item);
          const products = (item.products ?? []).map((product: ApiProduct) =>
            mapProduct(product),
          );
          set({ activeCategory: mapped, categoryProducts: products });
          return mapped;
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Category not found"),
          });
          return null;
        } finally {
          setStoreLoading(set, "fetchCategory", false);
        }
      },

      createCategory: async payload => {
        setStoreLoading(set, "createCategory", true, {
          errorMessage: "",
          successMessage: "",
        });

        try {
          const formData = new FormData();
          formData.append("name", payload.name);
          if (payload.slug) formData.append("slug", payload.slug);
          if (payload.description)
            formData.append("description", payload.description);
          if (payload.parent) formData.append("parent", payload.parent);
          if (payload.image) formData.append("image", payload.image);

          await api.post("/managements/categories/", formData);
          set({ successMessage: "Category created" });
          await get().fetchCategories();
        } catch (error) {
          const message = getApiErrorMessage(
            error,
            "Failed to create category",
          );
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "createCategory", false);
        }
      },
    }),
    withStoreDevtools("category"),
  ),
);

export default useCategoryStore;
