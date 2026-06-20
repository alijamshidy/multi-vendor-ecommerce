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

const ORDER_DATE_PARAMS = [
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
] as const;

function applyOrderDateParams(
  searchParams: URLSearchParams,
  query: OrderQuery,
): OrderQuery {
  for (const param of ORDER_DATE_PARAMS) {
    const value = searchParams.get(param)?.trim();
    if (!value) continue;

    switch (param) {
      case ORDER_CREATED_AFTER_PARAM:
        query.createdAfter = value;
        break;
      case ORDER_CREATED_BEFORE_PARAM:
        query.createdBefore = value;
        break;
      case ORDER_PAID_AFTER_PARAM:
        query.paidAfter = value;
        break;
      case ORDER_PAID_BEFORE_PARAM:
        query.paidBefore = value;
        break;
      case ORDER_DELIVERED_AFTER_PARAM:
        query.deliveredAfter = value;
        break;
      case ORDER_DELIVERED_BEFORE_PARAM:
        query.deliveredBefore = value;
        break;
      case ORDER_CANCELED_AFTER_PARAM:
        query.canceledAfter = value;
        break;
      case ORDER_CANCELED_BEFORE_PARAM:
        query.canceledBefore = value;
        break;
      case ORDER_REFUNDED_AFTER_PARAM:
        query.refundedAfter = value;
        break;
      case ORDER_REFUNDED_BEFORE_PARAM:
        query.refundedBefore = value;
        break;
    }
  }

  return query;
}

export function hasActiveOrderFilters(searchParams: URLSearchParams): boolean {
  return (
    searchParams.has(ORDER_SEARCH_PARAM) ||
    searchParams.has(ORDER_STATUS_PARAM) ||
    searchParams.has(ORDER_ORDERING_PARAM) ||
    ORDER_DATE_PARAMS.some(param => searchParams.has(param))
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

  const ordering = searchParams.get(ORDER_ORDERING_PARAM)?.trim();
  if (ordering) query.ordering = ordering;

  return applyOrderDateParams(searchParams, query);
}

export function getOrderFilterResetParams(): Record<string, null | number> {
  return {
    [ORDER_SEARCH_PARAM]: null,
    [ORDER_STATUS_PARAM]: null,
    [ORDER_ORDERING_PARAM]: null,
    [ORDER_CREATED_AFTER_PARAM]: null,
    [ORDER_CREATED_BEFORE_PARAM]: null,
    [ORDER_PAID_AFTER_PARAM]: null,
    [ORDER_PAID_BEFORE_PARAM]: null,
    [ORDER_DELIVERED_AFTER_PARAM]: null,
    [ORDER_DELIVERED_BEFORE_PARAM]: null,
    [ORDER_CANCELED_AFTER_PARAM]: null,
    [ORDER_CANCELED_BEFORE_PARAM]: null,
    [ORDER_REFUNDED_AFTER_PARAM]: null,
    [ORDER_REFUNDED_BEFORE_PARAM]: null,
    [ORDER_PAGE_PARAM]: 1,
  };
}
