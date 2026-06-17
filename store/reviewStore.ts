import type { ApiReview } from "@/lib/api-types";
import { getApiErrorMessage } from "@/lib/api-utils";
import api from "@/lib/axios";
import { apiEndpoints } from "@/lib/endpoints";
import { mapComment, type ReviewView } from "@/lib/mappers";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

export type { ReviewView };

type ReviewAction = "fetchReviews" | "createReview" | "replyToReview" | "updateReview" | "deleteReview";

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
    name?: string;
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
      loading: createStoreLoadingState([
        "fetchReviews",
        "createReview",
        "replyToReview",
        "updateReview",
        "deleteReview",
      ] as const),

      clearMessages: () => set({ errorMessage: "", successMessage: "" }),

      fetchProductReviews: async productId => {
        setStoreLoading(set, "fetchReviews", true, { errorMessage: "" });

        try {
          const { data } = await api.get<{ reviews: ApiReview[] }>(
            apiEndpoints.storefront.getReviews(productId),
            { skipAuth: true },
          );
          set({
            reviews: (data.reviews ?? []).map(mapComment),
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load reviews"),
            reviews: [],
          });
        } finally {
          setStoreLoading(set, "fetchReviews", false);
        }
      },

      createReview: async payload => {
        setStoreLoading(set, "createReview", true, {
          errorMessage: "",
          successMessage: "",
        });

        try {
          await api.post(
            apiEndpoints.storefront.submitReview,
            {
              productId: payload.productId,
              name: payload.name ?? "Customer",
              rating: payload.rating ?? 5,
              review: payload.comment,
            },
            { skipAuth: true },
          );
          set({ successMessage: "Review submitted" });
          await get().fetchProductReviews(payload.productId);
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to submit review");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "createReview", false);
        }
      },

      replyToReview: async () => {
        throw new Error("Replying to reviews is not supported by the API");
      },

      updateReview: async () => {
        throw new Error("Updating reviews is not supported by the API");
      },

      deleteReview: async () => {
        throw new Error("Deleting reviews is not supported by the API");
      },
    }),
    withStoreDevtools("review"),
  ),
);

export default useReviewStore;
