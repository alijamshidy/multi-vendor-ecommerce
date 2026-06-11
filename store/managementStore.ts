import type { ApiProduct } from "@/lib/api-types";
import {
  extractCreatedResourceId,
  getApiErrorMessage,
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

type ManagementAction = "fetchProducts" | "createProduct";

type ManagementState = {
  products: productType[];
  errorMessage: string;
  successMessage: string;
  loading: Record<ManagementAction, boolean>;
  fetchProducts: (query?: ProductQuery) => Promise<void>;
  createProduct: (payload: {
    name: string;
    price: string;
    stuck: string;
    description?: string;
    categories: string[];
    images?: File[];
  }) => Promise<void>;
  clearMessages: () => void;
};

const useManagementStore = create<ManagementState>()(
  devtools((set, get) => ({
    products: [],
    errorMessage: "",
    successMessage: "",
    loading: createStoreLoadingState(["fetchProducts", "createProduct"] as const),

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

    createProduct: async payload => {
      setStoreLoading(set, "createProduct", true, {
        errorMessage: "",
        successMessage: "",
      });

      try {
        const formData = new FormData();
        formData.append("name", payload.name);
        formData.append("price", payload.price);
        formData.append("stuck", payload.stuck);
        if (payload.description) {
          formData.append("description", payload.description);
        }
        for (const categoryId of payload.categories) {
          formData.append("categories", categoryId);
        }
        if (payload.images?.[0]) {
          formData.append("images", payload.images[0]);
        }

        const { data } = await api.post("/managements/products/", formData);
        const productId = extractCreatedResourceId(data);
        const remainingImages = payload.images?.slice(1) ?? [];

        if (productId && remainingImages.length > 0) {
          await Promise.all(
            remainingImages.map(file => {
              const imageForm = new FormData();
              imageForm.append("product", productId);
              imageForm.append("image", file);
              imageForm.append("is_primary", "false");
              return api.post("/managements/products/images/", imageForm);
            }),
          );
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
  }), withStoreDevtools("management")),
);

export default useManagementStore;
