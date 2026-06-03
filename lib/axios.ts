import axios from "axios";

const SERVER_API_URL =
  // process.env.API_URL?.replace(/\/$/, "") ??
  // process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:8000/api/v1";

/** Browser calls same-origin `/api/v1` (rewritten to Django). Server uses backend URL directly. */
export const API_BASE_URL =
  typeof window !== "undefined"
    ? "/api/v1"
    : `${SERVER_API_URL.replace(/\/api\/v1\/?$/, "")}/api/v1`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(config => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
