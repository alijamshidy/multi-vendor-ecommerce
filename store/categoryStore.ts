import type { ApiCategory, ApiCategoryDetail, ApiProduct } from "@/lib/api-types";
import {
  createLoadingState,
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

type CategoryAction = "fetchCategories" | "fetchCategory" | "createCategory";

type CategoryState = {
  categories: category[];
  activeCategory: category | null;
  categoryProducts: productType[];
  errorMessage: string;
  successMessage: string;
  loading: Record<CategoryAction, boolean>;
  fetchCategories: () => Promise<void>;
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
      loading: createLoadingState([
        "fetchCategories",
        "fetchCategory",
        "createCategory",
      ] as const),

      clearError: () => set({ errorMessage: "" }),
      clearMessages: () => set({ errorMessage: "", successMessage: "" }),

      fetchCategories: async () => {
        set(state => ({
          loading: { ...state.loading, fetchCategories: true },
          errorMessage: "",
        }));

        try {
          const { data } = await api.get<
            ApiCategory[] | { results: ApiCategory[] }
          >("/categories/", { skipAuth: true });
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
          set(state => ({
            loading: { ...state.loading, fetchCategories: false },
          }));
        }
      },

      fetchCategoryBySlug: async slug => {
        set(state => ({
          loading: { ...state.loading, fetchCategory: true },
          errorMessage: "",
          activeCategory: null,
          categoryProducts: [],
        }));

        try {
          const { data } = await api.get(`/categories/${slug}/`, {
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
          set(state => ({
            loading: { ...state.loading, fetchCategory: false },
          }));
        }
      },

      createCategory: async payload => {
        set(state => ({
          loading: { ...state.loading, createCategory: true },
          errorMessage: "",
          successMessage: "",
        }));

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
          set(state => ({
            loading: { ...state.loading, createCategory: false },
          }));
        }
      },
    }),
    withStoreDevtools("category"),
  ),
);

export default useCategoryStore;
