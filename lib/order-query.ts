import type { OrderQuery } from "@/lib/api-types";

export const ORDER_SEARCH_PARAM = "search";
export const ORDER_STATUS_PARAM = "status";
export const ORDER_PAGE_PARAM = "page";
export const ORDER_ORDERING_PARAM = "ordering";
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

export const ORDER_STATUS_OPTIONS = [
  { value: "pending", labelKey: "statusPending" },
  { value: "processing", labelKey: "statusProcessing" },
  { value: "delivered", labelKey: "statusDelivered" },
  { value: "cancelled", labelKey: "statusCanceled" },
] as const;

export function hasActiveOrderFilters(searchParams: URLSearchParams): boolean {
  return (
    searchParams.has(ORDER_SEARCH_PARAM) ||
    searchParams.has(ORDER_STATUS_PARAM) ||
    searchParams.has(ORDER_CREATED_AFTER_PARAM) ||
    searchParams.has(ORDER_CREATED_BEFORE_PARAM)
  );
}

export function buildOrderQueryFromSearchParams(
  searchParams: URLSearchParams,
): OrderQuery {
  const query: OrderQuery = {};

  const page = Number(searchParams.get(ORDER_PAGE_PARAM));
  if (page > 0) query.page = page;

  const search = searchParams.get(ORDER_SEARCH_PARAM)?.trim();
  if (search) query.searchValue = search;

  const status = searchParams.get(ORDER_STATUS_PARAM)?.trim();
  if (status) query.status = status;

  return query;
}
