import type { AuthRole, AuthUser, SellerAccountStatus } from "@/lib/api-types";

const ACCESS_TOKEN_COOKIE = "accessToken";
const CUSTOMER_TOKEN_COOKIE = "customerToken";
const AUTH_ROLE_COOKIE = "authRole";
const SELLER_STATUS_COOKIE = "sellerStatus";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type { AuthRole };

export function deriveAuthRole(user: AuthUser): AuthRole {
  return user.role;
}

export function setAuthCookies(
  token: string,
  role: AuthRole,
  sellerStatus?: SellerAccountStatus,
) {
  if (typeof document === "undefined") return;

  const cookieName =
    role === "customer" ? CUSTOMER_TOKEN_COOKIE : ACCESS_TOKEN_COOKIE;
  const encodedToken = encodeURIComponent(token);
  document.cookie = `${cookieName}=${encodedToken}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
  document.cookie = `${AUTH_ROLE_COOKIE}=${role}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;

  if (role === "seller" && sellerStatus) {
    document.cookie = `${SELLER_STATUS_COOKIE}=${sellerStatus}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
  } else {
    document.cookie = `${SELLER_STATUS_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  }
}

export function clearAuthCookies() {
  if (typeof document === "undefined") return;

  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${CUSTOMER_TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${AUTH_ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${SELLER_STATUS_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function getSellerStatusFromCookie(): SellerAccountStatus | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(?:^|;\s*)sellerStatus=([^;]*)/);
  const value = match?.[1]?.trim();
  if (value === "pending" || value === "active" || value === "deactive") {
    return value;
  }
  return null;
}

export function getAuthRoleFromCookie(): AuthRole | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(?:^|;\s*)authRole=([^;]*)/);
  const value = match?.[1]?.trim();
  if (value === "admin" || value === "seller" || value === "customer") {
    return value;
  }
  return null;
}

export function getAccessTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const accessMatch = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
  if (accessMatch?.[1]) return decodeURIComponent(accessMatch[1]);

  const customerMatch = document.cookie.match(/(?:^|;\s*)customerToken=([^;]*)/);
  return customerMatch?.[1] ? decodeURIComponent(customerMatch[1]) : null;
}

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

export function redirectAfterAuth(destination: string) {
  if (typeof window === "undefined") return;
  window.location.assign(destination);
}
