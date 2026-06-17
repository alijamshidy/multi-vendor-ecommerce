import api from "@/lib/axios";
import { apiEndpoints } from "@/lib/endpoints";

export const PRICE_MIN = 0;
export const PRICE_STEP = 1;

export type PriceBounds = {
  min: number;
  max: number;
};

export const DEFAULT_PRICE_BOUNDS: PriceBounds = {
  min: PRICE_MIN,
  max: 10_000,
};

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

export async function fetchProductPriceBounds(): Promise<PriceBounds> {
  try {
    const { data } = await api.get<{
      priceRange?: { low?: number; high?: number };
    }>(apiEndpoints.storefront.priceRangeProducts, { skipAuth: true });

    const low = data.priceRange?.low;
    const high = data.priceRange?.high;

    if (low == null || high == null) {
      return DEFAULT_PRICE_BOUNDS;
    }

    const min = roundPriceDown(low);
    const max = Math.max(min + PRICE_STEP, roundPriceUp(high));
    return { min, max };
  } catch {
    return DEFAULT_PRICE_BOUNDS;
  }
}
