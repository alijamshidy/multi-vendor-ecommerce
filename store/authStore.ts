import type { AuthUser, LoginResponse } from "@/lib/auth-types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  loader: boolean;
  errorMessage: string;
  successMessage: string;
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
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
};

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data as T;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      loader: false,
      errorMessage: "",
      successMessage: "",
      user: null,
      accessToken: null,
      refreshToken: null,

      clearMessages: () => set({ errorMessage: "", successMessage: "" }),

      setSession: data => {
        localStorage.setItem("accessToken", data.tokens.access_token);
        set({
          user: data.user,
          accessToken: data.tokens.access_token,
          refreshToken: data.tokens.refresh_token,
          successMessage: "Signed in successfully",
          errorMessage: "",
        });
      },

      clearSession: () => {
        localStorage.removeItem("accessToken");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          errorMessage: "",
          successMessage: "",
        });
      },

      login: async payload => {
        set({ loader: true, errorMessage: "", successMessage: "" });
        try {
          const result = await postJson<{ data: LoginResponse; message: string }>(
            "/api/auth/login",
            payload,
          );
          get().setSession(result.data);
        } catch (error) {
          set({
            errorMessage:
              error instanceof Error ? error.message : "Login failed",
          });
          throw error;
        } finally {
          set({ loader: false });
        }
      },

      register: async payload => {
        set({ loader: true, errorMessage: "", successMessage: "" });
        try {
          const result = await postJson<{ message: string }>(
            "/api/auth/register",
            payload,
          );
          set({ successMessage: result.message });
        } catch (error) {
          set({
            errorMessage:
              error instanceof Error ? error.message : "Registration failed",
          });
          throw error;
        } finally {
          set({ loader: false });
        }
      },

      requestOtp: async payload => {
        set({ loader: true, errorMessage: "", successMessage: "" });
        try {
          const result = await postJson<{ message: string }>(
            "/api/auth/request-otp",
            payload,
          );
          set({ successMessage: result.message });
        } catch (error) {
          set({
            errorMessage:
              error instanceof Error ? error.message : "Failed to send OTP",
          });
          throw error;
        } finally {
          set({ loader: false });
        }
      },

      verifyOtp: async payload => {
        set({ loader: true, errorMessage: "", successMessage: "" });
        try {
          const result = await postJson<{ data: LoginResponse; message: string }>(
            "/api/auth/verify-otp",
            payload,
          );
          get().setSession(result.data);
        } catch (error) {
          set({
            errorMessage:
              error instanceof Error ? error.message : "OTP verification failed",
          });
          throw error;
        } finally {
          set({ loader: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: state => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);

export default useAuthStore;
