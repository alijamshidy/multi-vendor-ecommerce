import type { AuthRole, AuthUser, LoginResponse } from "@/lib/api-types";
import {
  AuthRequestError,
  getApiErrorMessage,
  getApiErrorStatus,
} from "@/lib/api-utils";
import {
  clearAuthCookies,
  getStoredAccessToken,
  setAuthCookies,
} from "@/lib/auth-cookie";
import { decodeJwtPayload, getUserIdFromToken } from "@/lib/auth-utils";
import api from "@/lib/axios";
import { apiEndpoints } from "@/lib/endpoints";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

type AuthAction =
  | "login"
  | "loginStaff"
  | "register"
  | "registerSeller"
  | "requestOtp"
  | "verifyOtp"
  | "resetPasswordRequest"
  | "resetPasswordConfirm";

type AuthLoading = Record<AuthAction, boolean>;

const initialLoading: AuthLoading = createStoreLoadingState([
  "login",
  "loginStaff",
  "register",
  "registerSeller",
  "requestOtp",
  "verifyOtp",
  "resetPasswordRequest",
  "resetPasswordConfirm",
] as const);

function toEmail(identifier: string): string {
  return identifier.trim();
}

function deriveRoleFromUserInfo(
  info: Record<string, unknown>,
  fallback: AuthRole,
): AuthRole {
  if (info.role === "admin" || info.role === "seller" || info.role === "customer") {
    return info.role;
  }
  if (info.isAdmin === true || info.is_superuser === true || info.is_staff === true) {
    return "admin";
  }
  if (info.is_owner === true || info.isSeller === true) {
    return "seller";
  }
  return fallback;
}

function parseSellerStatus(
  value: unknown,
): AuthUser["status"] | undefined {
  if (value === "pending" || value === "active" || value === "deactive") {
    return value;
  }
  return undefined;
}

function mapUserInfo(info: Record<string, unknown>, role: AuthUser["role"]): AuthUser {
  return {
    id: String(info._id ?? info.id ?? ""),
    email: typeof info.email === "string" ? info.email : undefined,
    name: typeof info.name === "string" ? info.name : undefined,
    role: deriveRoleFromUserInfo(info, role),
    status: parseSellerStatus(info.status),
  };
}

function mapUserFromToken(token: string, role: AuthRole, email?: string): AuthUser {
  const payload = decodeJwtPayload(token);
  const resolvedRole =
    payload?.role === "admin" ||
    payload?.role === "seller" ||
    payload?.role === "customer"
      ? payload.role
      : role;

  return {
    id: getUserIdFromToken(token) ?? "",
    email:
      email ??
      (typeof payload?.email === "string" ? payload.email : undefined),
    name: typeof payload?.name === "string" ? payload.name : undefined,
    role: resolvedRole,
    status: parseSellerStatus(payload?.status),
  };
}

type AuthState = {
  errorMessage: string;
  successMessage: string;
  loading: AuthLoading;
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  clearMessages: () => void;
  setSession: (data: LoginResponse) => void;
  clearSession: () => void;
  login: (payload: { identifier: string; password: string }) => Promise<void>;
  loginStaff: (payload: {
    role: "admin" | "seller";
    identifier: string;
    password: string;
  }) => Promise<void>;
  register: (payload: {
    identifier: string;
    password?: string;
    full_name?: string;
  }) => Promise<void>;
  registerSeller: (payload: {
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
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
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
        isAuthenticated: false,

        clearMessages: () => set({ errorMessage: "", successMessage: "" }),

        setSession: data => {
          const token = data.token ?? getStoredAccessToken();
          if (!token) {
            throw new Error("Invalid login response from server");
          }

          localStorage.setItem("accessToken", token);
          setAuthCookies(token, data.user.role, data.user.status);
          set({
            user: data.user,
            accessToken: token,
            isAuthenticated: true,
            successMessage: "Signed in successfully",
            errorMessage: "",
          });
        },

        clearSession: () => {
          localStorage.removeItem("accessToken");
          clearAuthCookies();
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            errorMessage: "",
            successMessage: "",
          });
        },

        logout: async () => {
          try {
            if (get().user?.role === "customer") {
              await api.get(apiEndpoints.customerAuth.logout);
            } else if (get().isAuthenticated) {
              await api.get(apiEndpoints.auth.logout);
            }
          } catch {
            // ignore logout errors
          } finally {
            get().clearSession();
          }
        },

        login: async payload => {
          setStoreLoading(set, "login", true, {
            errorMessage: "",
            successMessage: "",
          });
          try {
            const email = toEmail(payload.identifier);
            const { data } = await api.post<{ token?: string; message?: string }>(
              apiEndpoints.customerAuth.login,
              { email, password: payload.password },
              { skipAuth: true },
            );

            const token = data.token ?? getStoredAccessToken();
            if (!token) {
              throw new Error("Invalid login response from server");
            }

            get().setSession({
              token,
              user: {
                ...mapUserFromToken(token, "customer", email),
                email,
              },
            });
          } catch (error) {
            const message = getApiErrorMessage(error, "Login failed");
            const status = getApiErrorStatus(error);
            set({ errorMessage: message });
            throw new AuthRequestError(message, status);
          } finally {
            setStoreLoading(set, "login", false);
          }
        },

        loginStaff: async payload => {
          setStoreLoading(set, "loginStaff", true, {
            errorMessage: "",
            successMessage: "",
          });

          try {
            const email = toEmail(payload.identifier);
            const endpoint =
              payload.role === "admin"
                ? apiEndpoints.auth.adminLogin
                : apiEndpoints.auth.sellerLogin;

            const { data } = await api.post<{ token?: string; message?: string }>(
              endpoint,
              { email, password: payload.password },
              { skipAuth: true },
            );

            const token = data.token ?? getStoredAccessToken();
            if (!token) {
              throw new Error("Invalid login response from server");
            }

            get().setSession({
              token,
              user: mapUserFromToken(token, payload.role, email),
            });

            try {
              const profile = await api.get<{ userInfo?: Record<string, unknown> }>(
                apiEndpoints.auth.getUser,
              );
              if (profile.data.userInfo) {
                set({
                  user: mapUserInfo(profile.data.userInfo, payload.role),
                });
              }
            } catch {
              // profile optional right after login
            }
          } catch (error) {
            const message = getApiErrorMessage(error, "Login failed");
            const status = getApiErrorStatus(error);
            set({ errorMessage: message });
            throw new AuthRequestError(message, status);
          } finally {
            setStoreLoading(set, "loginStaff", false);
          }
        },

        register: async payload => {
          setStoreLoading(set, "register", true, {
            errorMessage: "",
            successMessage: "",
          });

          try {
            const email = toEmail(payload.identifier);
            const { data } = await api.post<{ message?: string }>(
              apiEndpoints.customerAuth.register,
              {
                email,
                password: payload.password,
                name: payload.full_name ?? email.split("@")[0],
              },
              { skipAuth: true },
            );
            set({ successMessage: data.message ?? "Registration successful" });
          } catch (error) {
            const message = getApiErrorMessage(error, "Registration failed");
            set({ errorMessage: message });
            throw new Error(message);
          } finally {
            setStoreLoading(set, "register", false);
          }
        },

        registerSeller: async payload => {
          setStoreLoading(set, "registerSeller", true, {
            errorMessage: "",
            successMessage: "",
          });

          try {
            const email = toEmail(payload.identifier);
            const { data } = await api.post<{ token?: string; message?: string }>(
              apiEndpoints.auth.sellerRegister,
              {
                email,
                password: payload.password,
                name: payload.full_name ?? email.split("@")[0],
              },
              { skipAuth: true },
            );

            const token = data.token ?? getStoredAccessToken();
            if (token) {
              get().setSession({
                token,
                user: mapUserFromToken(token, "seller", email),
              });

              try {
                const profile = await api.get<{ userInfo?: Record<string, unknown> }>(
                  apiEndpoints.auth.getUser,
                );
                if (profile.data.userInfo) {
                  set({
                    user: mapUserInfo(profile.data.userInfo, "seller"),
                  });
                }
              } catch {
                // profile optional right after register
              }
            }

            set({ successMessage: data.message ?? "Registration successful" });
          } catch (error) {
            const message = getApiErrorMessage(error, "Registration failed");
            set({ errorMessage: message });
            throw new Error(message);
          } finally {
            setStoreLoading(set, "registerSeller", false);
          }
        },

        requestOtp: async payload => {
          setStoreLoading(set, "requestOtp", true, {
            errorMessage: "",
            successMessage: "",
          });

          try {
            const { data } = await api.post<{ message?: string }>(
              apiEndpoints.customerAuth.sendOtp,
              { email: toEmail(payload.identifier) },
              { skipAuth: true },
            );
            set({ successMessage: data.message ?? "OTP sent" });
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
            const email = toEmail(payload.identifier);
            const { data } = await api.post<{ token?: string; message?: string }>(
              apiEndpoints.customerAuth.verifyOtp,
              { email, otp: payload.code },
              { skipAuth: true },
            );

            const token = data.token ?? getStoredAccessToken();
            if (!token) {
              throw new Error("Invalid login response from server");
            }

            get().setSession({
              token,
              user: {
                ...mapUserFromToken(token, "customer", email),
                email,
              },
            });
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
            const { data } = await api.post<{ message?: string }>(
              apiEndpoints.customerAuth.resetPasswordRequest,
              { email: toEmail(payload.identifier) },
              { skipAuth: true },
            );
            set({ successMessage: data.message ?? "Reset code sent" });
          } catch (error) {
            const message = getApiErrorMessage(error, "Failed to send reset code");
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
            const { data } = await api.post<{ message?: string }>(
              apiEndpoints.customerAuth.resetPasswordConfirm,
              {
                email: toEmail(payload.identifier),
                otp: payload.code,
                password: payload.password,
              },
              { skipAuth: true },
            );
            set({ successMessage: data.message ?? "Password reset successfully" });
          } catch (error) {
            const message = getApiErrorMessage(error, "Failed to reset password");
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
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => state => {
          const token = getStoredAccessToken();
          if (token && state?.user) {
            setAuthCookies(token, state.user.role);
          }
        },
      },
    ),
    withStoreDevtools("auth"),
  ),
);

export default useAuthStore;
