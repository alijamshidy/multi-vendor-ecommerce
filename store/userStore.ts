import type { UserProfile } from "@/lib/api-types";
import { getApiErrorMessage } from "@/lib/api-utils";
import api from "@/lib/axios";
import { apiEndpoints } from "@/lib/endpoints";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

type UserAction = "fetchMe" | "fetchProfile" | "updateProfile" | "uploadImage";

type UserState = {
  profile: UserProfile | null;
  errorMessage: string;
  loading: Record<UserAction, boolean>;
  fetchMe: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (payload: Partial<UserProfile>) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<void>;
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
        "uploadImage",
      ] as const),

      clearError: () => set({ errorMessage: "" }),

      fetchMe: async () => {
        setStoreLoading(set, "fetchMe", true, { errorMessage: "" });

        try {
          const { data } = await api.get<{ userInfo?: Record<string, unknown> }>(
            apiEndpoints.auth.getUser,
          );
          const info = data.userInfo ?? {};
          set({
            profile: {
              id: String(info._id ?? info.id ?? ""),
              email: typeof info.email === "string" ? info.email : undefined,
              name: typeof info.name === "string" ? info.name : undefined,
              full_name: typeof info.name === "string" ? info.name : undefined,
              shopName:
                typeof info.shopName === "string" ? info.shopName : undefined,
              image:
                typeof info.image === "string" ? info.image : undefined,
            },
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load user"),
          });
        } finally {
          setStoreLoading(set, "fetchMe", false);
        }
      },

      fetchProfile: async () => {
        await get().fetchMe();
      },

      updateProfile: async payload => {
        setStoreLoading(set, "updateProfile", true, { errorMessage: "" });

        try {
          await api.post(apiEndpoints.auth.profileInfoAdd, {
            shopName: payload.shopName,
          });
          set({
            profile: { ...get().profile, ...payload },
          });
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to update profile");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "updateProfile", false);
        }
      },

      uploadProfileImage: async file => {
        setStoreLoading(set, "uploadImage", true, { errorMessage: "" });

        try {
          const formData = new FormData();
          formData.append("image", file);
          await api.post(apiEndpoints.auth.profileImageUpload, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          await get().fetchMe();
        } catch (error) {
          const message = getApiErrorMessage(
            error,
            "Failed to upload profile image",
          );
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "uploadImage", false);
        }
      },
    }),
    withStoreDevtools("user"),
  ),
);

export default useUserStore;
