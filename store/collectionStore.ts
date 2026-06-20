import type { ApiProduct } from "@/lib/api-types";
import type { ListQuery } from "@/lib/list-query";
import { getApiErrorMessage, serializeQueryParams } from "@/lib/api-utils";
import api from "@/lib/axios";
import { apiEndpoints } from "@/lib/endpoints";
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

function mapCollectionRecord(item: Record<string, unknown>): collection {
  return mapCollection({
    id: String(item.id ?? item._id ?? ""),
    name: String(item.name ?? ""),
    slug: String(item.slug ?? ""),
    image: typeof item.image === "string" ? item.image : null,
    description:
      typeof item.description === "string" ? item.description : undefined,
  });
}

const useCollectionStore = create<CollectionState>()(
  devtools(
    (set, get) => ({
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

      fetchCollections: async (query = {}) => {
        setStoreLoading(set, "fetchCollections", true, { errorMessage: "" });

        try {
          const hasAdminQuery = Object.keys(query).length > 0;
          const endpoint = hasAdminQuery
            ? apiEndpoints.collections.list
            : apiEndpoints.collections.publicList;
          const { data } = await api.get<{
            collections?: Array<Record<string, unknown>>;
          }>(endpoint, {
            ...(hasAdminQuery
              ? { params: serializeQueryParams(query) }
              : { skipAuth: true }),
          });
          set({
            collections: (data.collections ?? []).map(mapCollectionRecord),
            errorMessage: "",
          });
        } catch (error) {
          set({
            collections: [],
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
          const { data } = await api.get<{
            collection?: Record<string, unknown>;
            products?: ApiProduct[];
          }>(apiEndpoints.collections.publicDetail(slug), { skipAuth: true });

          if (!data.collection) {
            set({ errorMessage: "Collection not found" });
            return null;
          }

          const mapped = mapCollectionRecord(data.collection);
          set({
            activeCollection: mapped,
            collectionProducts: (data.products ?? []).map(mapProduct),
          });
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

      createCollection: async payload => {
        setStoreLoading(set, "createCollection", true, {
          errorMessage: "",
          successMessage: "",
        });

        try {
          const formData = new FormData();
          formData.append("name", payload.name);
          if (payload.description) {
            formData.append("description", payload.description);
          }
          if (payload.image) formData.append("image", payload.image);
          payload.product?.forEach(id => formData.append("product", id));

          await api.post(apiEndpoints.collections.add, formData);
          set({ successMessage: "Collection created" });
          await get().fetchCollections();
        } catch (error) {
          const message = getApiErrorMessage(
            error,
            "Failed to create collection",
          );
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "createCollection", false);
        }
      },

      updateCollection: async (slug, payload) => {
        setStoreLoading(set, "updateCollection", true, {
          errorMessage: "",
          successMessage: "",
        });

        try {
          const formData = new FormData();
          formData.append("slug", slug);
          if (payload.name) formData.append("name", payload.name);
          if (payload.description) {
            formData.append("description", payload.description);
          }
          if (payload.image) formData.append("image", payload.image);
          payload.product?.forEach(id => formData.append("product", id));

          await api.post(apiEndpoints.collections.update, formData);
          set({ successMessage: "Collection updated" });
          await get().fetchCollections();
        } catch (error) {
          const message = getApiErrorMessage(
            error,
            "Failed to update collection",
          );
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "updateCollection", false);
        }
      },

      deleteCollection: async slug => {
        setStoreLoading(set, "deleteCollection", true, { errorMessage: "" });

        try {
          await get().fetchCollections();
          const match = get().collections.find(
            item => item.href === slug || item.id === slug,
          );
          if (!match) {
            throw new Error("Collection not found");
          }

          await api.delete(apiEndpoints.collections.delete(match.id));
          set({ successMessage: "Collection deleted" });
          await get().fetchCollections();
        } catch (error) {
          const message = getApiErrorMessage(
            error,
            "Failed to delete collection",
          );
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "deleteCollection", false);
        }
      },
    }),
    withStoreDevtools("collection"),
  ),
);

export default useCollectionStore;
