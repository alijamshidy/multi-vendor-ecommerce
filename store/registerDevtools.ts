"use client";

import useAuthStore from "./authStore";
import useCartStore from "./cartStore";
import useCategoryStore from "./categoryStore";
import useManagementStore from "./managementStore";
import useOrderStore from "./orderStore";
import useProductStore from "./productStore";
import useReviewStore from "./reviewStore";
import useUserStore from "./userStore";

export const registeredStores = {
  auth: useAuthStore,
  cart: useCartStore,
  category: useCategoryStore,
  management: useManagementStore,
  order: useOrderStore,
  product: useProductStore,
  review: useReviewStore,
  user: useUserStore,
} as const;
