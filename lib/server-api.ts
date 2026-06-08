import type {
  ApiCategory,
  ApiProduct,
  ApiShopFaq,
  ApiShopHeader,
  ApiShopRecommendation,
  ApiShopSlider,
} from "@/lib/api-types";
import { unwrapEntity, unwrapList } from "@/lib/api-utils";
import {
  mapContact,
  mapFaq,
  mapHeader,
  mapRecommendation,
  mapSliderSlides,
} from "@/lib/mappers";
const SERVER_ORIGIN =
  process.env.API_URL?.replace(/\/$/, "").replace(/\/api\/v1\/?$/, "") ??
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ??
  "http://localhost:8000";

const API_BASE = `${SERVER_ORIGIN}/api/v1`;

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

export async function fetchProduct(id: string): Promise<ApiProduct | null> {
  const data = await serverFetch<unknown>(`/products/${id}/`);
  return unwrapEntity<ApiProduct>(data);
}

export async function fetchProductsForSitemap(): Promise<ApiProduct[]> {
  const data = await serverFetch<unknown>("/products/?page_size=100");
  return unwrapList<ApiProduct>(data);
}

export async function fetchCategoriesForSitemap(): Promise<ApiCategory[]> {
  const data = await serverFetch<unknown>("/categories/");
  return unwrapList<ApiCategory>(data);
}

export async function fetchShopFaqs() {
  const data = await serverFetch<unknown>("/faq/");
  return unwrapList<ApiShopFaq>(data).map(mapFaq);
}

export async function fetchShopHeaders(locale: string) {
  const data = await serverFetch<unknown>("/header/");
  return unwrapList<ApiShopHeader>(data).map(item => mapHeader(item, locale));
}

export async function fetchShopSliders(locale: string) {
  const data = await serverFetch<unknown>("/slider/");
  return mapSliderSlides(unwrapList<ApiShopSlider>(data), locale);
}

export async function fetchShopContact() {
  const data = await serverFetch<unknown>("/contact/");
  return mapContact(data);
}

export async function fetchShopRecommendations(locale: string) {
  const data = await serverFetch<unknown>("/recommendations/");
  return unwrapList<ApiShopRecommendation>(data).map(item =>
    mapRecommendation(item, locale),
  );
}
