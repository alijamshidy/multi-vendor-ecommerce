import type { ProductQuery } from "@/store/productStore";
import {
  DEFAULT_PRICE_BOUNDS,
  PRICE_MIN,
  PRICE_STEP,
  type PriceBounds,
} from "@/lib/product-price-bounds";

/** Fixed page size returned by GET /api/v1/products/ (no page_size query param). */
export const BACKEND_PAGE_SIZE = 20;

export const DEFAULT_PAGE_SIZE = BACKEND_PAGE_SIZE;
export const ITEMS_PER_PAGE_PARAM = "item";
export const PAGE_SIZE_OPTIONS = [10, 15, 20, 50, 100] as const;
export const PAGE_PARAM = "page";
export const SORT_PARAM = "sortBy";
export const SEARCH_PARAM = "search";
export const RANGE_PARAM = "range";
export const CATEGORIES_PARAM = "categories";
export const LAYOUT_PARAM = "layout";
export const AVAILABLE_PARAM = "available";
export const DISCOUNT_PARAM = "discount";
export const CREATED_AFTER_PARAM = "createdAfter";
export const CREATED_BEFORE_PARAM = "createdBefore";

/** Used only as a fallback until catalog bounds are loaded. */
export const PRICE_MAX = DEFAULT_PRICE_BOUNDS.max;

export { PRICE_MIN, PRICE_STEP };

const PRODUCT_FILTER_PARAMS = [
  RANGE_PARAM,
  CATEGORIES_PARAM,
  SEARCH_PARAM,
  AVAILABLE_PARAM,
  DISCOUNT_PARAM,
  CREATED_AFTER_PARAM,
  CREATED_BEFORE_PARAM,
] as const;

export const SORT_OPTIONS = [
  "highToLow",
  "lowToHigh",
  "newest",
  "oldest",
  "updatedNewest",
  "updatedOldest",
  "nameAsc",
  "nameDesc",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

const SORT_TO_ORDERING: Record<SortOption, ProductQuery["ordering"]> = {
  highToLow: "-price",
  lowToHigh: "price",
  newest: "-created_at",
  oldest: "created_at",
  updatedNewest: "-updated_at",
  updatedOldest: "updated_at",
  nameAsc: "name",
  nameDesc: "-name",
};

export function parsePriceRange(
  range: string | null,
): [number, number] | null {
  if (!range) return null;

  const [minRaw, maxRaw] = range.split(",");
  const min = Number(minRaw);
  const max = Number(maxRaw);

  if (Number.isNaN(min) || Number.isNaN(max)) return null;

  return [min, max];
}

export function isFullPriceRange(
  min: number,
  max: number,
  bounds: PriceBounds = DEFAULT_PRICE_BOUNDS,
): boolean {
  return min <= bounds.min && max >= bounds.max;
}

export function hasActiveProductFilters(
  searchParams: URLSearchParams,
): boolean {
  return PRODUCT_FILTER_PARAMS.some(param => searchParams.has(param));
}

export function parseCategoryIds(searchParams: URLSearchParams): string[] {
  const raw = searchParams.get(CATEGORIES_PARAM);
  if (!raw) return [];
  return raw.split(",").map(id => id.trim()).filter(Boolean);
}

export function getItemsPerPage(searchParams: URLSearchParams): number {
  void searchParams;
  return BACKEND_PAGE_SIZE;
}

export const getPageSize = getItemsPerPage;

export const getPerPage = getItemsPerPage;

export function getCurrentPage(searchParams: URLSearchParams): number {
  const page = Number(searchParams.get(PAGE_PARAM));
  return page > 0 ? page : 1;
}

function parseBooleanParam(value: string | null): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function parseDateParam(value: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

export function buildOrdering(searchParams: URLSearchParams): ProductQuery["ordering"] {
  const sortBy = searchParams.get(SORT_PARAM) || "highToLow";
  return SORT_TO_ORDERING[sortBy as SortOption] ?? "-price";
}

function applyCategoryFilter(
  query: ProductQuery,
  categoryIds: string[],
): void {
  if (categoryIds.length === 0) return;

  // Backend accepts integer IDs via category__in; single `category` expects UUID.
  query.category__in = categoryIds.join(",");
}

/** Applies shared product list filters from URL search params onto a query object. */
export function applyProductFiltersFromSearchParams(
  searchParams: URLSearchParams,
  base: ProductQuery = {},
  priceBounds: PriceBounds = DEFAULT_PRICE_BOUNDS,
): ProductQuery {
  const search = searchParams.get(SEARCH_PARAM)?.trim();
  const categoryIds = parseCategoryIds(searchParams);
  const priceRange = parsePriceRange(searchParams.get(RANGE_PARAM));
  const isAvailable = parseBooleanParam(searchParams.get(AVAILABLE_PARAM));
  const hasDiscount = parseBooleanParam(searchParams.get(DISCOUNT_PARAM));
  const createdAfter = parseDateParam(searchParams.get(CREATED_AFTER_PARAM));
  const createdBefore = parseDateParam(searchParams.get(CREATED_BEFORE_PARAM));

  const query: ProductQuery = {
    ...base,
    page: getCurrentPage(searchParams),
    ordering: buildOrdering(searchParams),
  };

  if (search) {
    query.search = search;
  }

  if (!query.category && !query.category__in) {
    applyCategoryFilter(query, categoryIds);
  }

  if (priceRange && !isFullPriceRange(priceRange[0], priceRange[1], priceBounds)) {
    query.price_min = priceRange[0];
    query.price_max = priceRange[1];
  }

  if (isAvailable !== undefined) {
    query.is_available = isAvailable;
  }

  if (hasDiscount === true) {
    query.has_discount = true;
  }

  if (createdAfter) {
    query.created_after = createdAfter;
  }

  if (createdBefore) {
    query.created_before = createdBefore;
  }

  return query;
}

export function buildProductQueryFromSearchParams(
  searchParams: URLSearchParams,
  priceBounds: PriceBounds = DEFAULT_PRICE_BOUNDS,
): ProductQuery {
  return applyProductFiltersFromSearchParams(searchParams, {}, priceBounds);
}

export function buildCategoryProductQuery(
  searchParams: URLSearchParams,
  categoryId: string,
): ProductQuery {
  return applyProductFiltersFromSearchParams(searchParams, {
    category__in: categoryId,
  });
}

export function buildCategorySearchQuery(
  searchParams: URLSearchParams,
  search: string,
): ProductQuery {
  return applyProductFiltersFromSearchParams(searchParams, { search });
}

export function buildCollectionProductQuery(
  searchParams: URLSearchParams,
  collectionId: string,
): ProductQuery {
  return applyProductFiltersFromSearchParams(searchParams, {
    collections: collectionId,
  });
}

export function buildCollectionSearchQuery(
  searchParams: URLSearchParams,
  search: string,
): ProductQuery {
  return applyProductFiltersFromSearchParams(searchParams, { search });
}

export function getTotalPages(totalCount: number, pageSize: number): number {
  if (totalCount <= 0) return 0;
  return Math.ceil(totalCount / pageSize);
}

export function getPaginationRange(
  currentPage: number,
  totalPages: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 0) return [];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | "ellipsis"> = [1];

  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis");
  }

  if (!pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
}
