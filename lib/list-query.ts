export type ListQuery = {
  page?: number;
  search?: string;
  ordering?: string;
};

export const LIST_PAGE_PARAM = "page";
export const LIST_SEARCH_PARAM = "search";
export const LIST_ORDERING_PARAM = "ordering";

export function buildListQueryFromSearchParams(
  searchParams: URLSearchParams,
  overrides: Partial<ListQuery> = {},
): ListQuery {
  const query: ListQuery = { ...overrides };

  const page = Number(searchParams.get(LIST_PAGE_PARAM));
  if (page > 0) {
    query.page = page;
  }

  const search = searchParams.get(LIST_SEARCH_PARAM)?.trim();
  if (search) {
    query.search = search;
  }

  const ordering = searchParams.get(LIST_ORDERING_PARAM)?.trim();
  if (ordering) {
    query.ordering = ordering;
  }

  return query;
}

export function hasActiveListFilters(searchParams: URLSearchParams): boolean {
  return (
    searchParams.has(LIST_SEARCH_PARAM) ||
    searchParams.has(LIST_ORDERING_PARAM)
  );
}
