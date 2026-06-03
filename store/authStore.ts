import type {
  ApiSuccessResponse,
  AuthUser,
  LoginResponse,
  RegisterResponse,
} from "@/lib/api-types";
import {
  clearAuthCookies,
  deriveAuthRole,
  setAuthCookies,
} from "@/lib/auth-cookie";
import { normalizeAuthIdentifier } from "@/lib/auth-utils";
import {
  AuthRequestError,
  getApiErrorMessage,
  getApiErrorStatus,
} from "@/lib/api-utils";
import api from "@/lib/axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthAction =
  | "login"
  | "register"
  | "requestOtp"
  | "verifyOtp"
  | "resetPasswordRequest"
  | "resetPasswordConfirm";

type AuthLoading = Record<AuthAction, boolean>;

const initialLoading: AuthLoading = {
  login: false,
  register: false,
  requestOtp: false,
  verifyOtp: false,
  resetPasswordRequest: false,
  resetPasswordConfirm: false,
};

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
        set(state => ({
          loading: { ...state.loading, login: true },
          errorMessage: "",
          successMessage: "",
        }));
        try {
          const { data } = await api.post<ApiSuccessResponse<LoginResponse>>(
            "/auth/login-password/",
            {
              identifier: normalizeAuthIdentifier(payload.identifier),
              password: payload.password,
            },
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
          set(state => ({
            loading: { ...state.loading, login: false },
          }));
        }
      },

      register: async payload => {
        set(state => ({
          loading: { ...state.loading, register: true },
          errorMessage: "",
          successMessage: "",
        }));

        try {
          const { data } = await api.post<ApiSuccessResponse<RegisterResponse>>(
            "/auth/register/",
            payload,
          );
          set({ successMessage: data.message });
        } catch (error) {
          const message = getApiErrorMessage(error, "Registration failed");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          set(state => ({
            loading: { ...state.loading, register: false },
          }));
        }
      },

      requestOtp: async payload => {
        set(state => ({
          loading: { ...state.loading, requestOtp: true },
          errorMessage: "",
          successMessage: "",
        }));

        try {
          const { data } = await api.post<{ message: string }>(
            "/auth/request-otp/",
            payload,
          );
          set({ successMessage: data.message });
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to send OTP");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          set(state => ({
            loading: { ...state.loading, requestOtp: false },
          }));
        }
      },

      verifyOtp: async payload => {
        set(state => ({
          loading: { ...state.loading, verifyOtp: true },
          errorMessage: "",
          successMessage: "",
        }));

        try {
          const { data } = await api.post<ApiSuccessResponse<LoginResponse>>(
            "/auth/verify-otp/",
            payload,
          );

          if (!data?.data) {
            throw new Error("Invalid login response from server");
          }

          get().setSession(data.data);
        } catch (error) {
          const message = getApiErrorMessage(error, "OTP verification failed");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          set(state => ({
            loading: { ...state.loading, verifyOtp: false },
          }));
        }
      },

      resetPasswordRequest: async payload => {
        set(state => ({
          loading: { ...state.loading, resetPasswordRequest: true },
          errorMessage: "",
          successMessage: "",
        }));

        try {
          const { data } = await api.post<{ message: string }>(
            "/auth/reset-password-request/",
            payload,
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
          set(state => ({
            loading: { ...state.loading, resetPasswordRequest: false },
          }));
        }
      },

      resetPasswordConfirm: async payload => {
        set(state => ({
          loading: { ...state.loading, resetPasswordConfirm: true },
          errorMessage: "",
          successMessage: "",
        }));

        try {
          const { data } = await api.post<{ message: string }>(
            "/auth/reset-password-confirm/",
            payload,
          );
          set({ successMessage: data.message });
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to reset password");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          set(state => ({
            loading: { ...state.loading, resetPasswordConfirm: false },
          }));
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
        if (state?.accessToken) {
          setAuthHeader(state.accessToken);
          if (state.user) {
            setAuthCookies(state.accessToken, deriveAuthRole(state.user));
          }
        }
      },
    },
  ),
);

export default useAuthStore;
