import type {
  ApiCategoriesResponse,
  ApiCategory,
  ApiPaginatedCategoriesResponse,
  ListQuery,
} from "@/lib/api-types";
import { getApiErrorMessage, serializeQueryParams } from "@/lib/api-utils";
import api from "@/lib/axios";
import { apiEndpoints } from "@/lib/endpoints";
import { mapCategory } from "@/lib/mappers";
import type { category } from "@/utils/category";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

type CategoryAction =
  | "fetchCategories"
  | "fetchCategory"
  | "createCategory"
  | "updateCategory"
  | "deleteCategory";

type CategoryState = {
  categories: category[];
  activeCategory: category | null;
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
  updateCategory: (
    slug: string,
    payload: {
      name?: string;
      description?: string;
      parent?: string;
      image?: File;
    },
  ) => Promise<void>;
  deleteCategory: (slug: string) => Promise<void>;
  clearError: () => void;
  clearMessages: () => void;
};

const useCategoryStore = create<CategoryState>()(
  devtools(
    (set, get) => ({
      categories: [],
      activeCategory: null,
      errorMessage: "",
      successMessage: "",
      loading: createStoreLoadingState([
        "fetchCategories",
        "fetchCategory",
        "createCategory",
        "updateCategory",
        "deleteCategory",
      ] as const),

      clearError: () => set({ errorMessage: "" }),
      clearMessages: () => set({ errorMessage: "", successMessage: "" }),

      fetchCategories: async (query = {}) => {
        setStoreLoading(set, "fetchCategories", true, { errorMessage: "" });

        try {
          if (Object.keys(query).length > 0) {
            const { data } = await api.get<ApiPaginatedCategoriesResponse>(
              apiEndpoints.categories.list,
              { params: serializeQueryParams(query) },
            );
            set({
              categories: (data.categorys ?? []).map(mapCategory),
              errorMessage: "",
            });
            return;
          }

          const { data } = await api.get<ApiCategoriesResponse>(
            apiEndpoints.storefront.categories,
            { skipAuth: true },
          );
          set({
            categories: (data.categories ?? []).map(mapCategory),
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
        });

        try {
          await get().fetchCategories();
          const match = get().categories.find(
            item => item.href === slug || item.id === slug,
          );
          if (!match) {
            set({ errorMessage: "Category not found" });
            return null;
          }
          set({ activeCategory: match });
          return match;
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
          if (payload.image) formData.append("image", payload.image);

          await api.post(apiEndpoints.categories.add, formData);
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

      updateCategory: async (slug, payload) => {
        setStoreLoading(set, "updateCategory", true, {
          errorMessage: "",
          successMessage: "",
        });

        try {
          const formData = new FormData();
          formData.append("slug", slug);
          if (payload.name) formData.append("name", payload.name);
          if (payload.image) formData.append("image", payload.image);

          await api.post(apiEndpoints.categories.update, formData);
          set({ successMessage: "Category updated" });
          await get().fetchCategories();
        } catch (error) {
          const message = getApiErrorMessage(
            error,
            "Failed to update category",
          );
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "updateCategory", false);
        }
      },

      deleteCategory: async slug => {
        setStoreLoading(set, "deleteCategory", true, { errorMessage: "" });

        try {
          await get().fetchCategories();
          const match = get().categories.find(
            item => item.href === slug || item.id === slug,
          );
          if (!match) {
            throw new Error("Category not found");
          }

          await api.delete(apiEndpoints.categories.delete(match.id));
          set({ successMessage: "Category deleted" });
          await get().fetchCategories();
        } catch (error) {
          const message = getApiErrorMessage(
            error,
            "Failed to delete category",
          );
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "deleteCategory", false);
        }
      },
    }),
    withStoreDevtools("category"),
  ),
);

export default useCategoryStore;
