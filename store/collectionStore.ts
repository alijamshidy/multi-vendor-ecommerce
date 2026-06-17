import type { ListQuery } from "@/lib/list-query";
import type { collection } from "@/utils/Collection";
import type { productType } from "@/utils/products";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState } from "./store-utils";

type CollectionAction =
  | "fetchCollections"
  | "fetchCollection"
  | "createCollection"
  | "updateCollection"
  | "deleteCollection";

type CollectionState = {
  collections: collection[];
  activeCollection: collection | null;
  collectionProducts: productType[];
  errorMessage: string;
  successMessage: string;
  loading: Record<CollectionAction, boolean>;
  fetchCollections: (query?: ListQuery) => Promise<void>;
  fetchCollectionBySlug: (slug: string) => Promise<collection | null>;
  createCollection: (payload: {
    name: string;
    description?: string;
    image?: File;
    product?: string[];
  }) => Promise<void>;
  updateCollection: (
    slug: string,
    payload: {
      name?: string;
      description?: string;
      image?: File;
      product?: string[];
    },
  ) => Promise<void>;
  deleteCollection: (slug: string) => Promise<void>;
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
        "updateCollection",
        "deleteCollection",
      ] as const),

      clearError: () => set({ errorMessage: "" }),
      clearMessages: () => set({ errorMessage: "", successMessage: "" }),

      fetchCollections: async () => {
        set({ collections: [], errorMessage: "" });
      },

      fetchCollectionBySlug: async () => {
        set({ activeCollection: null, collectionProducts: [] });
        return null;
      },

      createCollection: async () => {
        throw new Error("Collections are not supported by the marketplace API");
      },

      updateCollection: async () => {
        throw new Error("Collections are not supported by the marketplace API");
      },

      deleteCollection: async () => {
        throw new Error("Collections are not supported by the marketplace API");
      },
    }),
    withStoreDevtools("collection"),
  ),
);

export default useCollectionStore;
