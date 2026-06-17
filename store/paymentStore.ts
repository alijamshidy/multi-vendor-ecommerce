import { getApiErrorMessage } from "@/lib/api-utils";
import api from "@/lib/axios";
import { apiEndpoints } from "@/lib/endpoints";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

type PaymentState = {
  onboardingUrl: string | null;
  errorMessage: string;
  loading: Record<"createStripeConnect", boolean>;
  createStripeConnect: () => Promise<string | null>;
  clearError: () => void;
};

const usePaymentStore = create<PaymentState>()(
  devtools(
    set => ({
      onboardingUrl: null,
      errorMessage: "",
      loading: createStoreLoadingState(["createStripeConnect"] as const),

      clearError: () => set({ errorMessage: "" }),

      createStripeConnect: async () => {
        setStoreLoading(set, "createStripeConnect", true, {
          errorMessage: "",
          onboardingUrl: null,
        });

        try {
          const { data } = await api.get<{ url?: string }>(
            apiEndpoints.payments.stripeConnect,
          );
          const url = data.url ?? null;
          set({ onboardingUrl: url });
          return url;
        } catch (error) {
          const message = getApiErrorMessage(
            error,
            "Failed to start Stripe onboarding",
          );
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "createStripeConnect", false);
        }
      },
    }),
    withStoreDevtools("payment"),
  ),
);

export default usePaymentStore;
