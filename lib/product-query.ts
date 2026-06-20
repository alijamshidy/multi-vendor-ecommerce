import type { ProductQuery } from "@/lib/api-types";
import {
  DEFAULT_PRICE_BOUNDS,
  PRICE_MIN,
  PRICE_STEP,
  type PriceBounds,
} from "@/lib/product-price-bounds";

export const BACKEND_PAGE_SIZE = 12;
export const DEFAULT_PAGE_SIZE = BACKEND_PAGE_SIZE;
export const ITEMS_PER_PAGE_PARAM = "item";
export const PAGE_SIZE_OPTIONS = [12] as const;
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

export const PRICE_MAX = DEFAULT_PRICE_BOUNDS.max;
export { PRICE_MIN, PRICE_STEP };

export const SORT_OPTIONS = ["highToLow", "lowToHigh"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

const SORT_TO_API: Record<SortOption, ProductQuery["sortPrice"]> = {
  highToLow: "high-to-low",
  lowToHigh: "low-to-high",
};

const DEFAULT_SORT: SortOption = "highToLow";

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

export function parseCategorySlugs(searchParams: URLSearchParams): string[] {
  const raw = searchParams.get(CATEGORIES_PARAM);
  if (!raw) return [];
  return raw.split(",").map(slug => slug.trim()).filter(Boolean);
}

/** @deprecated Use parseCategorySlugs */
export const parseCategoryIds = parseCategorySlugs;

export function hasActiveProductFilters(
  searchParams: URLSearchParams,
): boolean {
  const filterParams = [
    RANGE_PARAM,
    CATEGORIES_PARAM,
    SEARCH_PARAM,
    AVAILABLE_PARAM,
    DISCOUNT_PARAM,
    CREATED_AFTER_PARAM,
    CREATED_BEFORE_PARAM,
  ];

  if (filterParams.some(param => searchParams.has(param))) {
    return true;
  }

  const sortBy = searchParams.get(SORT_PARAM);
  return Boolean(sortBy && sortBy !== DEFAULT_SORT);
}

export function getItemsPerPage(_searchParams: URLSearchParams): number {
  return BACKEND_PAGE_SIZE;
}

export const getPageSize = getItemsPerPage;
export const getPerPage = getItemsPerPage;

export function getCurrentPage(searchParams: URLSearchParams): number {
  const page = Number(searchParams.get(PAGE_PARAM));
  return page > 0 ? page : 1;
}

export function buildOrdering(
  searchParams: URLSearchParams,
): ProductQuery["sortPrice"] {
  const sortBy = (searchParams.get(SORT_PARAM) || DEFAULT_SORT) as SortOption;
  return SORT_TO_API[sortBy] ?? "high-to-low";
}

function applyCommonProductFilters(
  searchParams: URLSearchParams,
  query: ProductQuery,
): ProductQuery {
  const search = searchParams.get(SEARCH_PARAM)?.trim();
  const categorySlugs = parseCategorySlugs(searchParams);
  const availability = searchParams.get(AVAILABLE_PARAM);
  const hasDiscount = searchParams.get(DISCOUNT_PARAM);
  const createdAfter = searchParams.get(CREATED_AFTER_PARAM)?.trim();
  const createdBefore = searchParams.get(CREATED_BEFORE_PARAM)?.trim();

  if (search) query.searchValue = search;

  if (!query.category && categorySlugs.length > 0) {
    query.category = categorySlugs[0];
  }

  if (availability === "true") {
    query.isAvailable = true;
  } else if (availability === "false") {
    query.isAvailable = false;
  }

  if (hasDiscount === "true") {
    query.hasDiscount = true;
  }

  if (createdAfter) query.createdAfter = createdAfter;
  if (createdBefore) query.createdBefore = createdBefore;

  return query;
}

export function applyProductFiltersFromSearchParams(
  searchParams: URLSearchParams,
  base: ProductQuery = {},
  priceBounds: PriceBounds = DEFAULT_PRICE_BOUNDS,
): ProductQuery {
  const priceRange = parsePriceRange(searchParams.get(RANGE_PARAM));

  const query: ProductQuery = applyCommonProductFilters(searchParams, {
    ...base,
    pageNumber: getCurrentPage(searchParams),
    sortPrice: buildOrdering(searchParams),
  });

  if (priceRange && !isFullPriceRange(priceRange[0], priceRange[1], priceBounds)) {
    query.lowPrice = priceRange[0];
    query.highPrice = priceRange[1];
  } else {
    // Marketplace API returns no products unless a price range is provided.
    query.lowPrice = priceBounds.min;
    query.highPrice = priceBounds.max;
  }

  return query;
}

export function buildProductQueryFromSearchParams(
  searchParams: URLSearchParams,
  priceBounds: PriceBounds = DEFAULT_PRICE_BOUNDS,
): ProductQuery {
  return applyProductFiltersFromSearchParams(searchParams, {}, priceBounds);
}

export function buildManagementProductQueryFromSearchParams(
  searchParams: URLSearchParams,
): ProductQuery {
  return applyCommonProductFilters(searchParams, {
    pageNumber: getCurrentPage(searchParams),
  });
}

export function buildCategoryProductQuery(
  searchParams: URLSearchParams,
  categorySlug: string,
  priceBounds: PriceBounds = DEFAULT_PRICE_BOUNDS,
): ProductQuery {
  return applyProductFiltersFromSearchParams(
    searchParams,
    { category: categorySlug },
    priceBounds,
  );
}

export function buildCategorySearchQuery(
  searchParams: URLSearchParams,
  search: string,
  priceBounds: PriceBounds = DEFAULT_PRICE_BOUNDS,
): ProductQuery {
  return applyProductFiltersFromSearchParams(
    searchParams,
    { searchValue: search },
    priceBounds,
  );
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
  if (currentPage > 3) pages.push("ellipsis");

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let page = start; page <= end; page += 1) pages.push(page);

  if (currentPage < totalPages - 2) pages.push("ellipsis");
  if (!pages.includes(totalPages)) pages.push(totalPages);

  return pages;
}

export function getProductFilterResetParams(): Record<string, null | number> {
  return {
    [RANGE_PARAM]: null,
    [CATEGORIES_PARAM]: null,
    [SEARCH_PARAM]: null,
    [SORT_PARAM]: null,
    [AVAILABLE_PARAM]: null,
    [DISCOUNT_PARAM]: null,
    [CREATED_AFTER_PARAM]: null,
    [CREATED_BEFORE_PARAM]: null,
    [PAGE_PARAM]: 1,
  };
}
