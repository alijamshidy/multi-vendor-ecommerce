import type { ApiProduct } from "@/lib/api-types";
import { unwrapList } from "@/lib/api-utils";
import api from "@/lib/axios";

export const PRICE_MIN = 0;
export const PRICE_STEP = 5_000;

export type PriceBounds = {
  min: number;
  max: number;
};

/** Fallback before catalog bounds are loaded from the API. */
export const DEFAULT_PRICE_BOUNDS: PriceBounds = {
  min: PRICE_MIN,
  max: 1_000_000,
};

function getProductPrice(item: ApiProduct): number {
  return Number(item.discount_price ?? item.price) || 0;
}

export function roundPriceDown(value: number, step: number = PRICE_STEP): number {
  return Math.floor(value / step) * step;
}

export function roundPriceUp(value: number, step: number = PRICE_STEP): number {
  return Math.ceil(value / step) * step;
}

export function clampPriceRange(
  range: [number, number],
  bounds: PriceBounds,
): [number, number] {
  const min = Math.max(bounds.min, Math.min(range[0], bounds.max));
  const max = Math.max(min, Math.min(range[1], bounds.max));
  return [min, max];
}

/** Loads cheapest/highest priced products to derive slider bounds. */
export async function fetchProductPriceBounds(): Promise<PriceBounds> {
  const [lowRes, highRes] = await Promise.all([
    api.get("/products/", {
      params: { ordering: "price", page: 1 },
      skipAuth: true,
    }),
    api.get("/products/", {
      params: { ordering: "-price", page: 1 },
      skipAuth: true,
    }),
  ]);

  const lowList = unwrapList<ApiProduct>(lowRes.data);
  const highList = unwrapList<ApiProduct>(highRes.data);

  const rawMin =
    lowList.length > 0
      ? Math.min(...lowList.map(getProductPrice))
      : DEFAULT_PRICE_BOUNDS.min;
  const rawMax =
    highList.length > 0
      ? Math.max(...highList.map(getProductPrice))
      : DEFAULT_PRICE_BOUNDS.max;

  const min = roundPriceDown(rawMin);
  const max = Math.max(min + PRICE_STEP, roundPriceUp(rawMax));

  return { min, max };
}
