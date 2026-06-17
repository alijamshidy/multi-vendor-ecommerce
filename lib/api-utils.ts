import type { ApiErrorResponse } from "@/lib/api-types";
import { AxiosError } from "axios";

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

export function parseThrottleCooldownSeconds(message: string): number | null {
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
      return "API server unreachable — is the marketplace API running on port 5000?";
    }

    if (status === 409) {
      return data?.error ?? "Please log in first.";
    }

    if (status === 404) {
      return data?.error ?? data?.message ?? "Resource not found.";
    }

    if (status === 429) {
      return data?.error ?? data?.message ?? "Too many requests. Please wait.";
    }

    if (data?.error) return data.error;
    if (data?.message) return data.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function serializeQueryParams(
  params: Record<string, string | number | boolean | undefined | null>,
): Record<string, string | number> {
  const serialized: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (typeof value === "boolean") {
      serialized[key] = value ? "true" : "false";
      continue;
    }
    serialized[key] = value;
  }

  return serialized;
}

export const API_ORIGIN = (
  process.env.NEXT_PUBLIC_MARKETPLACE_API_URL ??
  process.env.MARKETPLACE_API_URL ??
  "http://localhost:5000"
).replace(/\/$/, "");

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "/images/hero1.jpg";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** @deprecated No wrapper in marketplace API */
export function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (Array.isArray(record.results)) return record.results as T[];
    if (Array.isArray(record.data)) return record.data as T[];
    if (Array.isArray(record.products)) return record.products as T[];
    if (Array.isArray(record.categories)) return record.categories as T[];
    if (Array.isArray(record.categorys)) return record.categorys as T[];
    if (Array.isArray(record.reviews)) return record.reviews as T[];
    if (Array.isArray(record.cardProducts)) return record.cardProducts as T[];
  }
  return [];
}

/** @deprecated No wrapper in marketplace API */
export function unwrapEntity<T>(data: unknown): T | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  if (record.data && typeof record.data === "object") {
    return record.data as T;
  }
  if (record.product && typeof record.product === "object") {
    return record.product as T;
  }
  return data as T;
}

export function unwrapListCount(data: unknown, fallback: number): number {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const record = data as Record<string, unknown>;
    if (typeof record.totalProduct === "number") return record.totalProduct;
    if (typeof record.totalCategory === "number") return record.totalCategory;
    if (typeof record.totalOrder === "number") return record.totalOrder;
    if (typeof record.count === "number") return record.count;
  }
  return fallback;
}

/** @deprecated Not used with marketplace API */
export function extractCreatedResourceId(_data: unknown): string | null {
  return null;
}
