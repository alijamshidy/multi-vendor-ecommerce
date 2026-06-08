import { clearAuthCookies, getStoredAccessToken } from "@/lib/auth-cookie";
import axios from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

const SERVER_API_URL =
  process.env.API_URL?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ??
  "http://localhost:8000";

/** Browser calls same-origin `/api/v1` (rewritten to Django). Server uses backend URL directly. */
export const API_BASE_URL =
  typeof window !== "undefined"
    ? "/api/v1"
    : `${SERVER_API_URL.replace(/\/api\/v1\/?$/, "")}/api/v1`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/** Auth endpoints that must not receive a stale Bearer token. */
const PUBLIC_AUTH_PATH =
  /^\/auth\/(login-password|register|request-otp|verify-otp|reset-password-request|reset-password-confirm|social\/[\w-]+)\/?$/;

function isPublicAuthRequest(url: string | undefined): boolean {
  if (!url) return false;
  const path = url.split("?")[0]?.replace(/\/$/, "") ?? "";
  return PUBLIC_AUTH_PATH.test(path);
}

api.interceptors.request.use(config => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  if (config.skipAuth || isPublicAuthRequest(config.url)) {
    delete config.headers.Authorization;
    return config;
  }

  if (typeof window !== "undefined") {
    const token = getStoredAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

let handlingUnauthorized = false;

api.interceptors.response.use(
  response => response,
  async error => {
    const status = error.response?.status;
    const url = String(error.config?.url ?? "");
    const skipAuth = error.config?.skipAuth;
    const isAuthEndpoint = url.includes("/auth/");
    const hadAuth = Boolean(
      error.config?.headers?.Authorization ??
      error.config?.headers?.authorization,
    );
    const isGuestOptionalEndpoint = url.includes("/ordering/cart/");

    // Cart works for guests; 401 here must not wipe the login session.
    if (
      status === 401 &&
      isGuestOptionalEndpoint &&
      typeof window !== "undefined"
    ) {
      return Promise.reject(error);
    }

    if (
      status === 401 &&
      hadAuth &&
      !skipAuth &&
      !isAuthEndpoint &&
      !isGuestOptionalEndpoint &&
      typeof window !== "undefined" &&
      !handlingUnauthorized &&
      !window.location.pathname.includes("/login")
    ) {
      handlingUnauthorized = true;
      clearAuthCookies();
      localStorage.removeItem("accessToken");

      const { default: useAuthStore } = await import("@/store/authStore");
      useAuthStore.getState().clearSession();

      const pathname = window.location.pathname;
      const locale = pathname.split("/")[1] || "en";
      const callbackUrl = encodeURIComponent(pathname + window.location.search);
      window.location.assign(`/${locale}/login?callbackUrl=${callbackUrl}`);
    }

    return Promise.reject(error);
  },
);

export default api;
