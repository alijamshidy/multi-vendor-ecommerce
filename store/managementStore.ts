import type { ApiProduct } from "@/lib/api-types";
import {
  extractCreatedResourceId,
  getApiErrorMessage,
  unwrapEntity,
  unwrapList,
} from "@/lib/api-utils";
import api from "@/lib/axios";
import { mapProduct } from "@/lib/mappers";
import type { ProductQuery } from "@/store/productStore";
import type { productType } from "@/utils/products";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

type ManagementAction =
  | "fetchProducts"
  | "fetchProduct"
  | "createProduct"
  | "updateProduct"
  | "deleteProduct";

type ProductPayload = {
  name: string;
  price: string;
  stuck: string;
  description?: string;
  categories: string[];
  images?: File[];
  is_available?: boolean;
};

function appendProductFormData(formData: FormData, payload: ProductPayload) {
  formData.append("name", payload.name);
  formData.append("price", payload.price);
  formData.append("stuck", payload.stuck);
  if (payload.description) {
    formData.append("description", payload.description);
  }
  for (const categoryId of payload.categories) {
    formData.append("categories", categoryId);
  }
  if (payload.is_available != null) {
    formData.append("is_available", String(payload.is_available));
  }
  if (payload.images?.[0]) {
    formData.append("images", payload.images[0]);
  }
}

async function uploadExtraImages(productId: string, images: File[]) {
  if (images.length === 0) return;

  await Promise.all(
    images.map(file => {
      const imageForm = new FormData();
      imageForm.append("product", productId);
      imageForm.append("image", file);
      imageForm.append("is_primary", "false");
      return api.post("/managements/products/images/", imageForm);
    }),
  );
}

type ManagementState = {
  products: productType[];
  activeProduct: productType | null;
  errorMessage: string;
  successMessage: string;
  loading: Record<ManagementAction, boolean>;
  fetchProducts: (query?: ProductQuery) => Promise<void>;
  fetchProduct: (id: string) => Promise<productType | null>;
  createProduct: (payload: ProductPayload) => Promise<void>;
  updateProduct: (id: string, payload: ProductPayload) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearMessages: () => void;
};

const useManagementStore = create<ManagementState>()(
  devtools((set, get) => ({
    products: [],
    activeProduct: null,
    errorMessage: "",
    successMessage: "",
    loading: createStoreLoadingState([
      "fetchProducts",
      "fetchProduct",
      "createProduct",
      "updateProduct",
      "deleteProduct",
    ] as const),

    clearMessages: () => set({ errorMessage: "", successMessage: "" }),

    fetchProducts: async (query = {}) => {
      setStoreLoading(set, "fetchProducts", true, { errorMessage: "" });

      try {
        const { data } = await api.get<
          ApiProduct[] | { results: ApiProduct[] }
        >("/managements/products/", { params: query });
        set({
          products: unwrapList(data).map((item: unknown) =>
            mapProduct(item as ApiProduct),
          ),
        });
      } catch (error) {
        set({
          errorMessage: getApiErrorMessage(error, "Failed to load products"),
          products: [],
        });
      } finally {
        setStoreLoading(set, "fetchProducts", false);
      }
    },

    fetchProduct: async id => {
      setStoreLoading(set, "fetchProduct", true, {
        errorMessage: "",
        activeProduct: null,
      });

      try {
        const { data } = await api.get(`/managements/products/${id}/`);
        const item = unwrapEntity<ApiProduct>(data) ?? (data as ApiProduct);
        const mapped = mapProduct(item);
        set({ activeProduct: mapped });
        return mapped;
      } catch (error) {
        set({
          errorMessage: getApiErrorMessage(error, "Product not found"),
        });
        return null;
      } finally {
        setStoreLoading(set, "fetchProduct", false);
      }
    },

    createProduct: async payload => {
      setStoreLoading(set, "createProduct", true, {
        errorMessage: "",
        successMessage: "",
      });

      try {
        const formData = new FormData();
        appendProductFormData(formData, payload);

        const { data } = await api.post("/managements/products/", formData);
        const productId = extractCreatedResourceId(data);
        const remainingImages = payload.images?.slice(1) ?? [];

        if (productId && remainingImages.length > 0) {
          await uploadExtraImages(productId, remainingImages);
        }

        set({ successMessage: "Product created" });
        await get().fetchProducts();
      } catch (error) {
        const message = getApiErrorMessage(error, "Failed to create product");
        set({ errorMessage: message });
        throw new Error(message);
      } finally {
        setStoreLoading(set, "createProduct", false);
      }
    },

    updateProduct: async (id, payload) => {
      setStoreLoading(set, "updateProduct", true, {
        errorMessage: "",
        successMessage: "",
      });

      try {
        const formData = new FormData();
        appendProductFormData(formData, payload);

        await api.patch(`/managements/products/${id}/`, formData);
        const remainingImages = payload.images?.slice(1) ?? [];
        if (remainingImages.length > 0) {
          await uploadExtraImages(id, remainingImages);
        }

        set({ successMessage: "Product updated" });
        await get().fetchProducts();
      } catch (error) {
        const message = getApiErrorMessage(error, "Failed to update product");
        set({ errorMessage: message });
        throw new Error(message);
      } finally {
        setStoreLoading(set, "updateProduct", false);
      }
    },

    deleteProduct: async id => {
      setStoreLoading(set, "deleteProduct", true, {
        errorMessage: "",
        successMessage: "",
      });

      try {
        await api.delete(`/managements/products/${id}/`);
        set({ successMessage: "Product deleted" });
        await get().fetchProducts();
      } catch (error) {
        const message = getApiErrorMessage(error, "Failed to delete product");
        set({ errorMessage: message });
        throw new Error(message);
      } finally {
        setStoreLoading(set, "deleteProduct", false);
      }
    },
  }), withStoreDevtools("management")),
);

export default useManagementStore;
