/** Query params accepted by GET /api/v1/ordering/orders/ */
export type OrderQuery = {
  search?: string;
  status?: number;
  created_after?: string;
  created_before?: string;
  paid_after?: string;
  paid_before?: string;
  delivered_after?: string;
  delivered_before?: string;
  canceled_after?: string;
  canceled_before?: string;
  refunded_after?: string;
  refunded_before?: string;
  page?: number;
  ordering?: string;
};

export const ORDER_SEARCH_PARAM = "search";
export const ORDER_STATUS_PARAM = "status";
export const ORDER_CREATED_AFTER_PARAM = "createdAfter";
export const ORDER_CREATED_BEFORE_PARAM = "createdBefore";
export const ORDER_PAID_AFTER_PARAM = "paidAfter";
export const ORDER_PAID_BEFORE_PARAM = "paidBefore";
export const ORDER_DELIVERED_AFTER_PARAM = "deliveredAfter";
export const ORDER_DELIVERED_BEFORE_PARAM = "deliveredBefore";
export const ORDER_CANCELED_AFTER_PARAM = "canceledAfter";
export const ORDER_CANCELED_BEFORE_PARAM = "canceledBefore";
export const ORDER_REFUNDED_AFTER_PARAM = "refundedAfter";
export const ORDER_REFUNDED_BEFORE_PARAM = "refundedBefore";
export const ORDER_ORDERING_PARAM = "ordering";
export const ORDER_PAGE_PARAM = "page";

export const ORDER_STATUS_OPTIONS = [
  { value: 1, labelKey: "statusPending" },
  { value: 2, labelKey: "statusPaid" },
  { value: 3, labelKey: "statusProcessing" },
  { value: 4, labelKey: "statusDelivered" },
  { value: 5, labelKey: "statusRefunded" },
] as const;

const ORDER_FILTER_PARAMS = [
  ORDER_SEARCH_PARAM,
  ORDER_STATUS_PARAM,
  ORDER_CREATED_AFTER_PARAM,
  ORDER_CREATED_BEFORE_PARAM,
  ORDER_PAID_AFTER_PARAM,
  ORDER_PAID_BEFORE_PARAM,
  ORDER_DELIVERED_AFTER_PARAM,
  ORDER_DELIVERED_BEFORE_PARAM,
  ORDER_CANCELED_AFTER_PARAM,
  ORDER_CANCELED_BEFORE_PARAM,
  ORDER_REFUNDED_AFTER_PARAM,
  ORDER_REFUNDED_BEFORE_PARAM,
  ORDER_ORDERING_PARAM,
] as const;

type OrderDateQueryKey =
  | "created_after"
  | "created_before"
  | "paid_after"
  | "paid_before"
  | "delivered_after"
  | "delivered_before"
  | "canceled_after"
  | "canceled_before"
  | "refunded_after"
  | "refunded_before";

const ORDER_DATE_PARAM_MAP: Array<{
  urlParam: string;
  apiParam: OrderDateQueryKey;
}> = [
  { urlParam: ORDER_CREATED_AFTER_PARAM, apiParam: "created_after" },
  { urlParam: ORDER_CREATED_BEFORE_PARAM, apiParam: "created_before" },
  { urlParam: ORDER_PAID_AFTER_PARAM, apiParam: "paid_after" },
  { urlParam: ORDER_PAID_BEFORE_PARAM, apiParam: "paid_before" },
  { urlParam: ORDER_DELIVERED_AFTER_PARAM, apiParam: "delivered_after" },
  { urlParam: ORDER_DELIVERED_BEFORE_PARAM, apiParam: "delivered_before" },
  { urlParam: ORDER_CANCELED_AFTER_PARAM, apiParam: "canceled_after" },
  { urlParam: ORDER_CANCELED_BEFORE_PARAM, apiParam: "canceled_before" },
  { urlParam: ORDER_REFUNDED_AFTER_PARAM, apiParam: "refunded_after" },
  { urlParam: ORDER_REFUNDED_BEFORE_PARAM, apiParam: "refunded_before" },
];

function parseDateParam(value: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

export function hasActiveOrderFilters(searchParams: URLSearchParams): boolean {
  return ORDER_FILTER_PARAMS.some(param => searchParams.has(param));
}

export function buildOrderQueryFromSearchParams(
  searchParams: URLSearchParams,
): OrderQuery {
  const query: OrderQuery = {};

  const page = Number(searchParams.get(ORDER_PAGE_PARAM));
  if (page > 0) {
    query.page = page;
  }

  const search = searchParams.get(ORDER_SEARCH_PARAM)?.trim();
  if (search) {
    query.search = search;
  }

  const status = Number(searchParams.get(ORDER_STATUS_PARAM));
  if (status > 0) {
    query.status = status;
  }

  for (const { urlParam, apiParam } of ORDER_DATE_PARAM_MAP) {
    const value = parseDateParam(searchParams.get(urlParam));
    if (value) {
      query[apiParam] = value;
    }
  }

  const ordering = searchParams.get(ORDER_ORDERING_PARAM)?.trim();
  if (ordering) {
    query.ordering = ordering;
  }

  return query;
}
