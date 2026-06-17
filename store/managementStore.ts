import type { ApiProduct, ListQuery } from "@/lib/api-types";
import { getApiErrorMessage, serializeQueryParams, unwrapEntity } from "@/lib/api-utils";
import api from "@/lib/axios";
import { apiEndpoints } from "@/lib/endpoints";
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
  brand?: string;
  shopName?: string;
  discount?: string;
};

type ManagementState = {
  products: productType[];
  activeProduct: productType | null;
  errorMessage: string;
  successMessage: string;
  loading: Record<ManagementAction, boolean>;
  fetchProducts: (query?: ProductQuery | ListQuery) => Promise<void>;
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
        const { data } = await api.get<{ products: ApiProduct[] }>(
          apiEndpoints.products.list,
          { params: serializeQueryParams(query as ListQuery) },
        );
        set({
          products: (data.products ?? []).map(mapProduct),
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
        const { data } = await api.get(apiEndpoints.products.get(id));
        const product = unwrapEntity<ApiProduct>(data);
        if (!product?._id) {
          set({ errorMessage: "Product not found", activeProduct: null });
          return null;
        }
        const mapped = mapProduct(product);
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
        formData.append("name", payload.name);
        formData.append("price", payload.price);
        formData.append("stock", payload.stuck);
        if (payload.description) formData.append("description", payload.description);
        if (payload.categories[0]) formData.append("category", payload.categories[0]);
        if (payload.brand) formData.append("brand", payload.brand);
        if (payload.shopName) formData.append("shopName", payload.shopName);
        if (payload.discount) formData.append("discount", payload.discount);
        for (const image of payload.images ?? []) {
          formData.append("images", image);
        }

        await api.post(apiEndpoints.products.add, formData);
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
        await api.post(apiEndpoints.products.update, {
          productId: id,
          name: payload.name,
          description: payload.description,
          stock: Number(payload.stuck),
          price: Number(payload.price),
          discount: Number(payload.discount ?? 0),
        });

        if (payload.images?.length) {
          const formData = new FormData();
          formData.append("productId", id);
          for (const image of payload.images) {
            formData.append("images", image);
          }
          await api.post(apiEndpoints.products.imageUpdate, formData);
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
      setStoreLoading(set, "deleteProduct", true, { errorMessage: "" });

      try {
        await api.delete(apiEndpoints.products.delete(id));
        set(state => ({
          products: state.products.filter(product => product.id !== id),
          activeProduct:
            state.activeProduct?.id === id ? null : state.activeProduct,
          successMessage: "Product deleted",
        }));
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
