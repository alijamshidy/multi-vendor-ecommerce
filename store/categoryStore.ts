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

type CategoryAction = "fetchCategories" | "fetchCategory";

type CategoryState = {
  categories: category[];
  activeCategory: category | null;
  errorMessage: string;
  loading: Record<CategoryAction, boolean>;
  fetchCategories: () => Promise<void>;
  fetchCategoryBySlug: (slug: string) => Promise<category | null>;
  clearError: () => void;
};

const useCategoryStore = create<CategoryState>(set => ({
  categories: [],
  activeCategory: null,
  errorMessage: "",
  loading: createLoadingState(["fetchCategories", "fetchCategory"] as const),

  clearError: () => set({ errorMessage: "" }),

  fetchCategories: async () => {
    set(state => ({
      loading: { ...state.loading, fetchCategories: true },
      errorMessage: "",
    }));

    try {
      const { data } = await api.get<
        ApiCategory[] | { results: ApiCategory[] }
      >("/categories/");
      set({
        categories: unwrapList(data).map((item: unknown) =>
          mapCategory(item as ApiCategory),
        ),
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
}));

export default useCategoryStore;
