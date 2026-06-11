import type { ListQuery } from "@/lib/list-query";
import type {
  ApiCollection,
  ApiCollectionDetail,
  ApiProduct,
} from "@/lib/api-types";
import {
  getApiErrorMessage,
  unwrapEntity,
  unwrapList,
} from "@/lib/api-utils";
import api from "@/lib/axios";
import { mapCollection, mapProduct } from "@/lib/mappers";
import type { collection } from "@/utils/Collection";
import type { productType } from "@/utils/products";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

type CollectionAction =
  | "fetchCollections"
  | "fetchCollection"
  | "createCollection";

type CollectionState = {
  collections: collection[];
  activeCollection: collection | null;
  collectionProducts: productType[];
  errorMessage: string;
  successMessage: string;
  loading: Record<CollectionAction, boolean>;
  fetchCollections: (query?: ListQuery) => Promise<void>;
  fetchCollectionBySlug: (slug: string) => Promise<collection | null>;
  clearError: () => void;
  clearMessages: () => void;
};

const useCollectionStore = create<CollectionState>()(
  devtools(
    set => ({
      collections: [],
      activeCollection: null,
      collectionProducts: [],
      errorMessage: "",
      successMessage: "",
      loading: createStoreLoadingState([
        "fetchCollections",
        "fetchCollection",
        "createCollection",
      ] as const),

      clearError: () => set({ errorMessage: "" }),
      clearMessages: () => set({ errorMessage: "", successMessage: "" }),

      fetchCollections: async (query = {}) => {
        setStoreLoading(set, "fetchCollections", true, { errorMessage: "" });

        try {
          const { data } = await api.get<
            ApiCollection[] | { results: ApiCollection[] }
          >("/collections/", { params: query, skipAuth: true });
          set({
            collections: unwrapList(data).map((item: unknown) =>
              mapCollection(item as ApiCollection),
            ),
            errorMessage: "",
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(
              error,
              "Failed to load collections",
            ),
          });
        } finally {
          setStoreLoading(set, "fetchCollections", false);
        }
      },

      fetchCollectionBySlug: async slug => {
        setStoreLoading(set, "fetchCollection", true, {
          errorMessage: "",
          activeCollection: null,
          collectionProducts: [],
        });

        try {
          const encodedSlug = encodeURIComponent(
            decodeURIComponent(slug),
          );
          const { data } = await api.get(`/collections/${encodedSlug}/`, {
            skipAuth: true,
          });
          const item = unwrapEntity<ApiCollectionDetail>(data);
          if (!item) {
            set({ errorMessage: "Collection not found" });
            return null;
          }
          const mapped = mapCollection(item);
          const products = (item.products ?? []).map((product: ApiProduct) =>
            mapProduct(product),
          );
          set({ activeCollection: mapped, collectionProducts: products });
          return mapped;
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Collection not found"),
          });
          return null;
        } finally {
          setStoreLoading(set, "fetchCollection", false);
        }
      },
    }),
    withStoreDevtools("collection"),
  ),
);

export default useCollectionStore;
