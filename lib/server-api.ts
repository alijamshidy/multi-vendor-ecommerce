import type {
  ApiCategoriesResponse,
  ApiProduct,
  ApiProductDetailsResponse,
} from "@/lib/api-types";
import { unwrapEntity, unwrapList } from "@/lib/api-utils";
import { apiEndpoints } from "@/lib/endpoints";

const SERVER_ORIGIN = (
  process.env.MARKETPLACE_API_URL ?? "http://localhost:5000"
).replace(/\/$/, "");

const API_BASE = `${SERVER_ORIGIN}/api`;

async function serverFetch<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchProduct(slug: string): Promise<ApiProduct | null> {
  const data = await serverFetch<ApiProductDetailsResponse>(
    apiEndpoints.storefront.productDetails(slug),
  );
  return data?.product ?? unwrapEntity<ApiProduct>(data);
}

export async function fetchProductsForSitemap(): Promise<ApiProduct[]> {
  const data = await serverFetch<{ products: ApiProduct[] }>(
    apiEndpoints.storefront.homeProducts,
  );
  return data?.products ?? [];
}

export async function fetchCategoriesForSitemap() {
  const data = await serverFetch<ApiCategoriesResponse>(
    apiEndpoints.storefront.categories,
  );
  return data?.categories ?? [];
}

/** @deprecated CMS not available */
export async function fetchShopFaqs() {
  return [];
}

/** @deprecated CMS not available */
export async function fetchShopHeaders(_locale: string) {
  return [];
}

/** @deprecated CMS not available */
export async function fetchShopSliders(_locale: string) {
  return [];
}

/** @deprecated CMS not available */
export async function fetchShopContact() {
  return { phones: [] };
}

/** @deprecated CMS not available */
export async function fetchShopRecommendations(_locale: string) {
  return [];
}
