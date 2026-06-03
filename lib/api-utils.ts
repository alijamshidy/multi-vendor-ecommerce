import type { ApiErrorResponse, PaginatedResponse } from "@/lib/api-types";
import { AxiosError } from "axios";

const ACTION_MESSAGES: Record<string, string> = {
  invalid_credentials:
    "Invalid credentials. Check your email/phone and password, or create an account.",
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

    if (status === 401) {
      return ACTION_MESSAGES.invalid_credentials;
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

export function unwrapList<T>(
  data: T[] | PaginatedResponse<T> | null | undefined,
): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.results ?? [];
}

export function createLoadingState<T extends string>(
  keys: readonly T[],
): Record<T, boolean> {
  return Object.fromEntries(keys.map(key => [key, false])) as Record<T, boolean>;
}

export const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ??
  "http://localhost:8000";

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "/images/hero1.jpg";
  if (url.startsWith("http")) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}
