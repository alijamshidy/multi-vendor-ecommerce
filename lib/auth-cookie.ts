import type { AuthUser } from "@/lib/api-types";

export type AuthRole = "admin" | "seller" | "customer";

const ACCESS_TOKEN_COOKIE = "accessToken";
const AUTH_ROLE_COOKIE = "authRole";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function deriveAuthRole(user: AuthUser): AuthRole {
  if (user.is_superuser || user.is_staff) return "admin";
  if (user.is_owner) return "seller";
  return "customer";
}

export function setAuthCookies(accessToken: string, role: AuthRole) {
  if (typeof document === "undefined") return;

  const encodedToken = encodeURIComponent(accessToken);
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodedToken}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
  document.cookie = `${AUTH_ROLE_COOKIE}=${role}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearAuthCookies() {
  if (typeof document === "undefined") return;

  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${AUTH_ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function getAccessTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

/** Reads access token from localStorage or cookie and keeps both in sync. */
export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  const fromStorage = localStorage.getItem("accessToken");
  const fromCookie = getAccessTokenFromCookie();

  if (fromCookie && fromCookie !== fromStorage) {
    localStorage.setItem("accessToken", fromCookie);
    return fromCookie;
  }

  return fromStorage ?? fromCookie;
}

export function isSafeCallbackUrl(url: string | null): url is string {
  return !!url && url.startsWith("/") && !url.startsWith("//");
}

/** Full page navigation so proxy/middleware receives freshly set auth cookies. */
export function redirectAfterAuth(destination: string) {
  if (typeof window === "undefined") return;
  window.location.assign(destination);
}
