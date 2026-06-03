import type { ApiComment } from "@/lib/api-types";
import {
  createLoadingState,
  getApiErrorMessage,
  unwrapList,
} from "@/lib/api-utils";
import api from "@/lib/axios";
import { mapComment } from "@/lib/mappers";
import { create } from "zustand";

export type ReviewView = ReturnType<typeof mapComment>;

type ReviewAction = "fetchReviews" | "createReview";

type ReviewState = {
  reviews: ReviewView[];
  errorMessage: string;
  successMessage: string;
  loading: Record<ReviewAction, boolean>;
  fetchProductReviews: (productId: string) => Promise<void>;
  createReview: (payload: {
    productId: string;
    comment: string;
    rating?: number;
  }) => Promise<void>;
  clearMessages: () => void;
};

const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  errorMessage: "",
  successMessage: "",
  loading: createLoadingState(["fetchReviews", "createReview"] as const),

  clearMessages: () => set({ errorMessage: "", successMessage: "" }),

  fetchProductReviews: async productId => {
    set(state => ({
      loading: { ...state.loading, fetchReviews: true },
      errorMessage: "",
    }));

    try {
      const { data } = await api.get<ApiComment[] | { results: ApiComment[] }>(
        `/products/${productId}/comments/`,
      );
      set({
        reviews: unwrapList(data).map((item: unknown) =>
          mapComment(item as ApiComment),
        ),
      });
    } catch (error) {
      set({
        errorMessage: getApiErrorMessage(error, "Failed to load reviews"),
        reviews: [],
      });
    } finally {
      set(state => ({
        loading: { ...state.loading, fetchReviews: false },
      }));
    }
  },

  createReview: async payload => {
    set(state => ({
      loading: { ...state.loading, createReview: true },
      errorMessage: "",
      successMessage: "",
    }));

    try {
      await api.post(`/products/${payload.productId}/comments/`, {
        comment: payload.comment,
      });
      if (payload.rating) {
        await api.post(`/products/${payload.productId}/rating/`, {
          rating: payload.rating,
        });
      }
      set({ successMessage: "Review submitted" });
      await get().fetchProductReviews(payload.productId);
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to submit review");
      set({ errorMessage: message });
      throw new Error(message);
    } finally {
      set(state => ({
        loading: { ...state.loading, createReview: false },
      }));
    }
  },
}));

export default useReviewStore;
