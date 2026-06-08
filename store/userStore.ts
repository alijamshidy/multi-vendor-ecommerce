import type { UserProfile } from "@/lib/api-types";
import { getApiErrorMessage, resolveMediaUrl } from "@/lib/api-utils";
import api from "@/lib/axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

type UserAction = "fetchMe" | "fetchProfile" | "updateProfile";

type UserState = {
  profile: UserProfile | null;
  errorMessage: string;
  loading: Record<UserAction, boolean>;
  fetchMe: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (payload: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
};

const useUserStore = create<UserState>()(
  devtools(
    (set, get) => ({
      profile: null,
      errorMessage: "",
      loading: createStoreLoadingState([
        "fetchMe",
        "fetchProfile",
        "updateProfile",
      ] as const),

      clearError: () => set({ errorMessage: "" }),

      fetchMe: async () => {
        setStoreLoading(set, "fetchMe", true, { errorMessage: "" });

        try {
          const { data } = await api.get<UserProfile>("/users/me/");
          set({ profile: data });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load user"),
          });
        } finally {
          setStoreLoading(set, "fetchMe", false);
        }
      },

      fetchProfile: async () => {
        setStoreLoading(set, "fetchProfile", true, { errorMessage: "" });

        try {
          const { data } = await api.get<UserProfile>("/users/me/profile/");
          set({
            profile: {
              ...get().profile,
              ...data,
              image: data.image ? resolveMediaUrl(data.image) : null,
            },
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load profile"),
          });
        } finally {
          setStoreLoading(set, "fetchProfile", false);
        }
      },

      updateProfile: async payload => {
        setStoreLoading(set, "updateProfile", true, { errorMessage: "" });

        try {
          const { data } = await api.patch<UserProfile>(
            "/users/me/profile/",
            payload,
          );
          set({
            profile: {
              ...get().profile,
              ...data,
              image: data.image
                ? resolveMediaUrl(data.image)
                : get().profile?.image,
            },
          });
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to update profile");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "updateProfile", false);
        }
      },
    }),
    withStoreDevtools("user"),
  ),
);

export default useUserStore;
