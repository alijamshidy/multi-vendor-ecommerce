import type { productType } from "@/utils/products";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";

export type CheckoutShippingInfo = {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
};

export type BuyNowItem = {
  productId: string;
  product: productType;
  quantity: number;
};

export type PaymentMethod = "stripe" | "cod";

type CheckoutState = {
  buyNowItem: BuyNowItem | null;
  shippingInfo: CheckoutShippingInfo | null;
  paymentMethod: PaymentMethod;
  couponCode: string;
  setBuyNowItem: (item: BuyNowItem | null) => void;
  setShippingInfo: (info: CheckoutShippingInfo) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setCouponCode: (code: string) => void;
  clearCheckout: () => void;
};

const useCheckoutStore = create<CheckoutState>()(
  devtools(
    persist(
      set => ({
        buyNowItem: null,
        shippingInfo: null,
        paymentMethod: "cod",
        couponCode: "",
        setBuyNowItem: item => set({ buyNowItem: item }),
        setShippingInfo: info => set({ shippingInfo: info }),
        setPaymentMethod: method => set({ paymentMethod: method }),
        setCouponCode: code => set({ couponCode: code }),
        clearCheckout: () =>
          set({
            buyNowItem: null,
            shippingInfo: null,
            paymentMethod: "cod",
            couponCode: "",
          }),
      }),
      { name: "checkout-storage" },
    ),
    withStoreDevtools("checkout"),
  ),
);

export default useCheckoutStore;
