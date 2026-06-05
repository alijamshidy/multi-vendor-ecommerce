import type { ApiCategory } from "@/lib/api-types";
import {
  createLoadingState,
  getApiErrorMessage,
  unwrapList,
} from "@/lib/api-utils";
import api from "@/lib/axios";
import { mapCategory } from "@/lib/mappers";
import type { category } from "@/utils/Category";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";

type CategoryAction = "fetchCategories" | "fetchCategory" | "createCategory";

type CategoryState = {
  categories: category[];
  activeCategory: category | null;
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
        errorMessage: getApiErrorMessage(error, "Failed to load categories"),
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
    }));

    try {
      const { data } = await api.get<ApiCategory>(`/categories/${slug}/`);
      const mapped = mapCategory(data);
      set({ activeCategory: mapped });
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
      if (payload.description) formData.append("description", payload.description);
      if (payload.parent) formData.append("parent", payload.parent);
      if (payload.image) formData.append("image", payload.image);

      await api.post("/managements/categories/", formData);
      set({ successMessage: "Category created" });
      await get().fetchCategories();
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to create category");
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
