import type { UserProfile } from "@/lib/api-types";
import { createLoadingState, getApiErrorMessage, resolveMediaUrl } from "@/lib/api-utils";
import api from "@/lib/axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";

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
  loading: createLoadingState(["fetchMe", "fetchProfile", "updateProfile"] as const),

  clearError: () => set({ errorMessage: "" }),

  fetchMe: async () => {
    set(state => ({
      loading: { ...state.loading, fetchMe: true },
      errorMessage: "",
    }));

    try {
      const { data } = await api.get<UserProfile>("/users/me/");
      set({ profile: data });
    } catch (error) {
      set({
        errorMessage: getApiErrorMessage(error, "Failed to load user"),
      });
    } finally {
      set(state => ({
        loading: { ...state.loading, fetchMe: false },
      }));
    }
  },

  fetchProfile: async () => {
    set(state => ({
      loading: { ...state.loading, fetchProfile: true },
      errorMessage: "",
    }));

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
      set(state => ({
        loading: { ...state.loading, fetchProfile: false },
      }));
    }
  },

  updateProfile: async payload => {
    set(state => ({
      loading: { ...state.loading, updateProfile: true },
      errorMessage: "",
    }));

    try {
      const { data } = await api.patch<UserProfile>("/users/me/profile/", payload);
      set({
        profile: {
          ...get().profile,
          ...data,
          image: data.image ? resolveMediaUrl(data.image) : get().profile?.image,
        },
      });
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to update profile");
      set({ errorMessage: message });
      throw new Error(message);
    } finally {
      set(state => ({
        loading: { ...state.loading, updateProfile: false },
      }));
    }
  },
    }),
    withStoreDevtools("user"),
  ),
);

export default useUserStore;
