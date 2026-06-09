import type { ProductQuery } from "@/store/productStore";

export const DEFAULT_PAGE_SIZE = 10;
export const ITEMS_PER_PAGE_PARAM = "item";
export const PAGE_SIZE_OPTIONS = [10, 15, 20, 50, 100] as const;

export function getPageSize(searchParams: URLSearchParams): number {
  const pageSize = Number(searchParams.get(ITEMS_PER_PAGE_PARAM));
  return pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE;
}

export function getItemsPerPage(searchParams: URLSearchParams): number {
  return getPageSize(searchParams);
}

export const getPerPage = getItemsPerPage;

export function getCurrentPage(searchParams: URLSearchParams): number {
  const page = Number(searchParams.get("page"));
  return page > 0 ? page : 1;
}

export function buildProductQueryFromSearchParams(
  searchParams: URLSearchParams,
): ProductQuery {
  const page = getCurrentPage(searchParams);
  const pageSize = getPageSize(searchParams);
  const sortBy = searchParams.get("sortBy") || "highToLow";
  const search = searchParams.get("search")?.trim();
  const range = searchParams.get("range");

  const query: ProductQuery = {
    page,
    page_size: pageSize,
    ordering: sortBy === "lowToHigh" ? "price" : "-price",
  };

  if (search) {
    query.search = search;
  }

  if (range) {
    const [minRaw, maxRaw] = range.split(",");
    const min = Number(minRaw);
    const max = Number(maxRaw);

    if (!Number.isNaN(min)) query.price_min = min;
    if (!Number.isNaN(max)) query.price_max = max;
  }

  return query;
}

export function buildCategoryProductQuery(
  searchParams: URLSearchParams,
  categoryId: string,
): ProductQuery {
  return {
    categories: categoryId,
    page: getCurrentPage(searchParams),
    page_size: getPageSize(searchParams),
  };
}

export function buildCategorySearchQuery(
  searchParams: URLSearchParams,
  search: string,
): ProductQuery {
  return {
    search,
    page: getCurrentPage(searchParams),
    page_size: getPageSize(searchParams),
  };
}

export function buildCollectionProductQuery(
  searchParams: URLSearchParams,
  collectionId: string,
): ProductQuery {
  return {
    collections: collectionId,
    page: getCurrentPage(searchParams),
    page_size: getPageSize(searchParams),
  };
}

export function buildCollectionSearchQuery(
  searchParams: URLSearchParams,
  search: string,
): ProductQuery {
  return {
    search,
    page: getCurrentPage(searchParams),
    page_size: getPageSize(searchParams),
  };
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
    return Array.from({ length: totalPages - 2 }, (_, index) => index + 1);
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
