"use client";

import useAuthStore from "./authStore";
import useCartStore from "./cartStore";
import useCategoryStore from "./categoryStore";
import useContentStore from "./contentStore";
import useContentManagementStore from "./contentManagementStore";
import useManagementStore from "./managementStore";
import useOrderStore from "./orderStore";
import useProductStore from "./productStore";
import useReviewStore from "./reviewStore";
import useUserStore from "./userStore";

export const registeredStores = {
  auth: useAuthStore,
  cart: useCartStore,
  category: useCategoryStore,
  content: useContentStore,
  contentManagement: useContentManagementStore,
  management: useManagementStore,
  order: useOrderStore,
  product: useProductStore,
  review: useReviewStore,
  user: useUserStore,
} as const;
