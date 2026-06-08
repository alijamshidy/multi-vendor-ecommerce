import type {
  ApiSuccessResponse,
  AuthUser,
  LoginResponse,
  RegisterResponse,
} from "@/lib/api-types";
import {
  AuthRequestError,
  getApiErrorMessage,
  getApiErrorStatus,
} from "@/lib/api-utils";
import {
  clearAuthCookies,
  deriveAuthRole,
  getStoredAccessToken,
  setAuthCookies,
} from "@/lib/auth-cookie";
import { normalizeAuthIdentifier } from "@/lib/auth-utils";
import api from "@/lib/axios";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

type AuthAction =
  | "login"
  | "register"
  | "socialLogin"
  | "requestOtp"
  | "verifyOtp"
  | "resetPasswordRequest"
  | "resetPasswordConfirm";

type SocialProvider = "google";

type AuthLoading = Record<AuthAction, boolean>;

const initialLoading: AuthLoading = createStoreLoadingState([
  "login",
  "register",
  "socialLogin",
  "requestOtp",
  "verifyOtp",
  "resetPasswordRequest",
  "resetPasswordConfirm",
] as const);

function setAuthHeader(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

type AuthState = {
  errorMessage: string;
  successMessage: string;
  loading: AuthLoading;
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  clearMessages: () => void;
  setSession: (data: LoginResponse) => void;
  clearSession: () => void;
  login: (payload: { identifier: string; password: string }) => Promise<void>;
  socialLogin: (payload: {
    provider: SocialProvider;
    idToken: string;
  }) => Promise<void>;
  register: (payload: {
    identifier: string;
    password?: string;
    full_name?: string;
  }) => Promise<void>;
  requestOtp: (payload: { identifier: string }) => Promise<void>;
  verifyOtp: (payload: { identifier: string; code: string }) => Promise<void>;
  resetPasswordRequest: (payload: { identifier: string }) => Promise<void>;
  resetPasswordConfirm: (payload: {
    identifier: string;
    code: string;
    new_password: string;
  }) => Promise<void>;
  logout: () => void;
};

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        errorMessage: "",
        successMessage: "",
        loading: initialLoading,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,

        clearMessages: () => set({ errorMessage: "", successMessage: "" }),

        setSession: data => {
          if (!data?.tokens?.access_token) {
            throw new Error("Invalid login response from server");
          }

          localStorage.setItem("accessToken", data.tokens.access_token);
          setAuthHeader(data.tokens.access_token);
          setAuthCookies(data.tokens.access_token, deriveAuthRole(data.user));
          set({
            user: data.user,
            accessToken: data.tokens.access_token,
            refreshToken: data.tokens.refresh_token ?? null,
            isAuthenticated: true,
            successMessage: "Signed in successfully",
            errorMessage: "",
          });
        },

        clearSession: () => {
          localStorage.removeItem("accessToken");
          clearAuthCookies();
          setAuthHeader(null);
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            errorMessage: "",
            successMessage: "",
          });
        },

        logout: () => {
          get().clearSession();
        },

        login: async payload => {
          setStoreLoading(set, "login", true, {
            errorMessage: "",
            successMessage: "",
          });
          try {
            const { data } = await api.post<ApiSuccessResponse<LoginResponse>>(
              "/auth/login-password/",
              {
                identifier: normalizeAuthIdentifier(payload.identifier),
                password: payload.password,
              },
              { skipAuth: true },
            );

            if (!data?.data) {
              throw new Error("Invalid login response from server");
            }

            get().setSession(data.data);
          } catch (error) {
            const message = getApiErrorMessage(error, "Login failed");
            const status = getApiErrorStatus(error);
            set({ errorMessage: message });
            throw new AuthRequestError(message, status);
          } finally {
            setStoreLoading(set, "login", false);
          }
        },

        socialLogin: async payload => {
          setStoreLoading(set, "socialLogin", true, {
            errorMessage: "",
            successMessage: "",
          });

          try {
            const { data } = await api.post<ApiSuccessResponse<LoginResponse>>(
              `/auth/social/${payload.provider}/`,
              { id_token: payload.idToken },
              { skipAuth: true },
            );

            if (!data?.data) {
              throw new Error("Invalid social login response from server");
            }

            get().setSession(data.data);
          } catch (error) {
            const message = getApiErrorMessage(error, "Social login failed");
            const status = getApiErrorStatus(error);
            set({ errorMessage: message });
            throw new AuthRequestError(message, status);
          } finally {
            setStoreLoading(set, "socialLogin", false);
          }
        },

        register: async payload => {
          setStoreLoading(set, "register", true, {
            errorMessage: "",
            successMessage: "",
          });

          try {
            const { data } = await api.post<
              ApiSuccessResponse<RegisterResponse>
            >("/auth/register/", payload, { skipAuth: true });
            set({ successMessage: data.message });
          } catch (error) {
            const message = getApiErrorMessage(error, "Registration failed");
            set({ errorMessage: message });
            throw new Error(message);
          } finally {
            setStoreLoading(set, "register", false);
          }
        },

        requestOtp: async payload => {
          setStoreLoading(set, "requestOtp", true, {
            errorMessage: "",
            successMessage: "",
          });

          try {
            const { data } = await api.post<{ message: string }>(
              "/auth/request-otp/",
              { identifier: normalizeAuthIdentifier(payload.identifier) },
              { skipAuth: true },
            );
            set({ successMessage: data.message });
          } catch (error) {
            const message = getApiErrorMessage(error, "Failed to send OTP");
            set({ errorMessage: message });
            throw new Error(message);
          } finally {
            setStoreLoading(set, "requestOtp", false);
          }
        },

        verifyOtp: async payload => {
          setStoreLoading(set, "verifyOtp", true, {
            errorMessage: "",
            successMessage: "",
          });

          try {
            const { data } = await api.post<ApiSuccessResponse<LoginResponse>>(
              "/auth/verify-otp/",
              {
                identifier: normalizeAuthIdentifier(payload.identifier),
                code: payload.code,
              },
              { skipAuth: true },
            );

            if (!data?.data) {
              throw new Error("Invalid login response from server");
            }

            get().setSession(data.data);
          } catch (error) {
            const message = getApiErrorMessage(
              error,
              "OTP verification failed",
            );
            set({ errorMessage: message });
            throw new Error(message);
          } finally {
            setStoreLoading(set, "verifyOtp", false);
          }
        },

        resetPasswordRequest: async payload => {
          setStoreLoading(set, "resetPasswordRequest", true, {
            errorMessage: "",
            successMessage: "",
          });

          try {
            const { data } = await api.post<{ message: string }>(
              "/auth/reset-password-request/",
              payload,
              { skipAuth: true },
            );
            set({ successMessage: data.message });
          } catch (error) {
            const message = getApiErrorMessage(
              error,
              "Failed to send reset code",
            );
            set({ errorMessage: message });
            throw new Error(message);
          } finally {
            setStoreLoading(set, "resetPasswordRequest", false);
          }
        },

        resetPasswordConfirm: async payload => {
          setStoreLoading(set, "resetPasswordConfirm", true, {
            errorMessage: "",
            successMessage: "",
          });

          try {
            const { data } = await api.post<{ message: string }>(
              "/auth/reset-password-confirm/",
              payload,
              { skipAuth: true },
            );
            set({ successMessage: data.message });
          } catch (error) {
            const message = getApiErrorMessage(
              error,
              "Failed to reset password",
            );
            set({ errorMessage: message });
            throw new Error(message);
          } finally {
            setStoreLoading(set, "resetPasswordConfirm", false);
          }
        },
      }),
      {
        name: "auth-storage",
        partialize: state => ({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => state => {
          const token = getStoredAccessToken();
          if (token) {
            setAuthHeader(token);
            if (state?.user) {
              setAuthCookies(token, deriveAuthRole(state.user));
            }
          }
        },
      },
    ),
    withStoreDevtools("auth"),
  ),
);

export default useAuthStore;
