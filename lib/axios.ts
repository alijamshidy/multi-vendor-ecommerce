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
  /^\/auth\/(login-password|register|request-otp|verify-otp|reset-password-request|reset-password-confirm)\/?$/;

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
      // #region agent log
      fetch("http://127.0.0.1:7673/ingest/3195856a-0976-4ff2-982f-62bf78f50b86", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "e997a5",
        },
        body: JSON.stringify({
          sessionId: "e997a5",
          runId: "post-fix",
          hypothesisId: "A",
          location: "axios.ts:cart-401",
          message: "cart 401 ignored for session (no clear)",
          data: { url, hadAuth, pathname: window.location.pathname },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
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
      // #region agent log
      fetch("http://127.0.0.1:7673/ingest/3195856a-0976-4ff2-982f-62bf78f50b86", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "e997a5",
        },
        body: JSON.stringify({
          sessionId: "e997a5",
          runId: "token-clear",
          hypothesisId: "B",
          location: "axios.ts:global-401",
          message: "clearing session due to global 401 redirect",
          data: { url, hadAuth, pathname: window.location.pathname },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
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
