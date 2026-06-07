import type { ApiComment } from "@/lib/api-types";
import {
  createLoadingState,
  getApiErrorMessage,
  unwrapList,
} from "@/lib/api-utils";
import api from "@/lib/axios";
import { mapComment, type ReviewView } from "@/lib/mappers";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";

export type { ReviewView };

type ReviewAction =
  | "fetchReviews"
  | "createReview"
  | "replyToReview"
  | "updateReview"
  | "deleteReview";

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
  replyToReview: (payload: {
    productId: string;
    parentId: string;
    text: string;
  }) => Promise<void>;
  updateReview: (payload: {
    productId: string;
    commentId: string;
    text: string;
  }) => Promise<void>;
  deleteReview: (payload: {
    productId: string;
    commentId: string;
  }) => Promise<void>;
  clearMessages: () => void;
};

const useReviewStore = create<ReviewState>()(
  devtools(
    (set, get) => ({
      reviews: [],
      errorMessage: "",
      successMessage: "",
      loading: createLoadingState([
        "fetchReviews",
        "createReview",
        "replyToReview",
        "updateReview",
        "deleteReview",
      ] as const),

      clearMessages: () => set({ errorMessage: "", successMessage: "" }),

      fetchProductReviews: async productId => {
        set(state => ({
          loading: { ...state.loading, fetchReviews: true },
          errorMessage: "",
        }));

        try {
          const { data } = await api.get<
            ApiComment[] | { data: ApiComment[]; results?: ApiComment[] }
          >(`/products/${productId}/comments/`);
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
            text: payload.comment,
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

      replyToReview: async payload => {
        set(state => ({
          loading: { ...state.loading, replyToReview: true },
          errorMessage: "",
        }));

        try {
          await api.post(`/products/${payload.productId}/comments/`, {
            text: payload.text,
            reply_to: Number(payload.parentId) || payload.parentId,
          });
          await get().fetchProductReviews(payload.productId);
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to submit reply");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          set(state => ({
            loading: { ...state.loading, replyToReview: false },
          }));
        }
      },

      updateReview: async payload => {
        set(state => ({
          loading: { ...state.loading, updateReview: true },
          errorMessage: "",
        }));

        try {
          await api.patch(
            `/products/${payload.productId}/comments/${payload.commentId}/`,
            { text: payload.text },
          );
          await get().fetchProductReviews(payload.productId);
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to update review");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          set(state => ({
            loading: { ...state.loading, updateReview: false },
          }));
        }
      },

      deleteReview: async payload => {
        set(state => ({
          loading: { ...state.loading, deleteReview: true },
          errorMessage: "",
        }));

        try {
          await api.delete(
            `/products/${payload.productId}/comments/${payload.commentId}/`,
          );
          await get().fetchProductReviews(payload.productId);
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to delete review");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          set(state => ({
            loading: { ...state.loading, deleteReview: false },
          }));
        }
      },
    }),
    withStoreDevtools("review"),
  ),
);

export default useReviewStore;
