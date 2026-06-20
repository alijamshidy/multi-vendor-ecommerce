import axios from "axios";
import { getStoredAccessToken } from "@/lib/auth-cookie";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

const SERVER_API_URL = (
  process.env.MARKETPLACE_API_URL ?? "http://localhost:5000"
).replace(/\/$/, "");

/** Browser calls same-origin `/api`. Server uses backend URL directly. */
export const API_BASE_URL =
  typeof window !== "undefined"
    ? "/api"
    : `${SERVER_API_URL}/api`;

const PUBLIC_AUTH_PATH =
  /^\/(admin-login|seller-register|seller-login|customer\/customer-register|customer\/customer-login|customer\/send-otp|customer\/verify-otp|customer\/reset-password-request|customer\/reset-password-confirm)\/?$/;

function isPublicAuthRequest(url: string | undefined): boolean {
  if (!url) return false;
  const path = url.split("?")[0]?.replace(/\/$/, "") ?? "";
  return PUBLIC_AUTH_PATH.test(path);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(config => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  if (config.skipAuth || isPublicAuthRequest(config.url)) {
    return config;
  }

  const token = getStoredAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
