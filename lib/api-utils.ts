import type { ApiErrorResponse, PaginatedResponse } from "@/lib/api-types";
import { AxiosError } from "axios";

const ACTION_MESSAGES: Record<string, string> = {
  invalid_credentials:
    "Invalid credentials. Check your email/phone and password, or create an account.",
  cart_item_quantity_exceed:
    "Not enough stock to update this item.",
  cart_item_max_no_exceed:
    "You reached the maximum order quantity for this product.",
};

export class AuthRequestError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "AuthRequestError";
    this.status = status;
  }
}

export function getApiErrorStatus(error: unknown): number | undefined {
  if (error instanceof AxiosError) return error.response?.status;
  if (error instanceof AuthRequestError) return error.status;
  return undefined;
}

/** Parses throttle cooldown from Django Persian/English detail messages. */
export function parseThrottleCooldownSeconds(message: string): number | null {
  const persianMatch = message.match(/(\d+)\s*ثانیه/);
  if (persianMatch) return parseInt(persianMatch[1], 10);

  const englishMatch = message.match(/(\d+)\s*seconds?/i);
  if (englishMatch) return parseInt(englishMatch[1], 10);

  return null;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    if (!error.response) {
      return "Unable to reach the server. Check your connection and try again.";
    }

    const status = error.response.status;
    const data = error.response.data as ApiErrorResponse | undefined;

    if (status === 502) {
      if (data?.message && data.message !== "error") return data.message;
      return "API server unreachable — is Django running on port 8000?";
    }

    if (status === 429) {
      const detail = data?.errors?.[0]?.detail;
      if (detail) return detail;
      return "Too many login attempts. Please wait before trying again.";
    }

    if (status === 403) {
      const detail = data?.errors?.[0]?.detail;
      if (detail) return detail;
      return "You don't have permission to perform this action.";
    }

    if (status === 400) {
      const code = data?.errors?.[0]?.code;
      if (code && ACTION_MESSAGES[code]) return ACTION_MESSAGES[code];
      const detail = data?.errors?.[0]?.detail;
      if (typeof detail === "string" && detail) return detail;
    }

    if (status === 401) {
      const action = data?.action ?? data?.errors?.[0]?.action;
      const codeFromErrors = data?.errors?.find(
        entry => entry.attr === "code" || entry.code,
      );
      const code =
        (typeof codeFromErrors?.detail === "string"
          ? codeFromErrors.detail
          : codeFromErrors?.code) ?? data?.errors?.[0]?.code;

      if (
        action === "invalid_credentials" ||
        action?.includes("invalid_credentials")
      ) {
        return ACTION_MESSAGES.invalid_credentials;
      }

      if (
        code === "not_authenticated" ||
        code === "token_not_valid" ||
        action?.includes("token_not_valid")
      ) {
        return "Your session has expired. Please log in again.";
      }

      const detail =
        data?.errors?.find(entry => entry.attr === "detail")?.detail ??
        data?.errors?.[0]?.detail;
      if (typeof detail === "string" && detail) return detail;

      return "Authentication required. Please log in again.";
    }

    const detail = data?.errors?.[0]?.detail;
    if (detail) return detail;

    if (data?.message && data.message !== "error") return data.message;

    const action = data?.errors?.[0]?.action;
    if (action && ACTION_MESSAGES[action]) return ACTION_MESSAGES[action];
    if (action) return action;
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function unwrapList<T>(data: unknown): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;

  if (typeof data === "object" && data !== null) {
    const record = data as PaginatedResponse<T> & {
      data?: T[] | PaginatedResponse<T> | { data?: T[]; results?: T[] };
    };

    if (Array.isArray(record.data)) return record.data;
    if (Array.isArray(record.results)) return record.results;

    if (record.data && typeof record.data === "object" && !Array.isArray(record.data)) {
      const inner = record.data as PaginatedResponse<T> & { data?: T[] };
      if (Array.isArray(inner.results)) return inner.results;
      if (Array.isArray(inner.data)) return inner.data;
    }
  }

  return [];
}

export function unwrapListCount(data: unknown, fallback: number): number {
  if (!data || typeof data !== "object") return fallback;

  const record = data as PaginatedResponse<unknown> & {
    data?: PaginatedResponse<unknown> | unknown[];
  };

  if (typeof record.count === "number") return record.count;

  if (record.data && typeof record.data === "object" && !Array.isArray(record.data)) {
    const inner = record.data as PaginatedResponse<unknown>;
    if (typeof inner.count === "number") return inner.count;
  }

  return fallback;
}

export function unwrapEntity<T>(data: unknown): T | null {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  if (
    record.data &&
    typeof record.data === "object" &&
    !Array.isArray(record.data)
  ) {
    return record.data as T;
  }

  return data as T;
}

/** Reads a created resource id from common Django API response shapes. */
export function extractCreatedResourceId(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  const candidates = [
    record.id,
    record.code,
    (record.data as Record<string, unknown> | undefined)?.id,
    (record.data as Record<string, unknown> | undefined)?.code,
  ];

  for (const candidate of candidates) {
    if (candidate != null && candidate !== "") {
      return String(candidate);
    }
  }

  return null;
}

export const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ??
  "http://localhost:8000";

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "/images/hero1.jpg";
  if (url.startsWith("http")) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}
