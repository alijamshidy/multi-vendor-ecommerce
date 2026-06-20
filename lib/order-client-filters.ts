import type { OrderQuery } from "@/lib/api-types";
import type { OrderView } from "@/store/orderStore";

function parseDate(value: string | undefined): number | null {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

function matchesDateRange(
  dateValue: string | undefined,
  after?: string,
  before?: string,
): boolean {
  if (!after && !before) return true;
  if (!dateValue) return false;

  const time = parseDate(dateValue);
  if (time === null) return false;

  const afterTime = parseDate(after);
  const beforeTime = parseDate(before);

  if (afterTime !== null && time < afterTime) return false;
  if (beforeTime !== null && time > beforeTime) return false;

  return true;
}

function sortOrders(orders: OrderView[], ordering: string): OrderView[] {
  const sorted = [...orders];

  switch (ordering) {
    case "-created_at":
      return sorted.sort((a, b) =>
        (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
      );
    case "created_at":
      return sorted.sort((a, b) =>
        (a.createdAt ?? "").localeCompare(b.createdAt ?? ""),
      );
    case "-total_price":
      return sorted.sort((a, b) => b.total - a.total);
    case "total_price":
      return sorted.sort((a, b) => a.total - b.total);
    default:
      return sorted;
  }
}

export function applyClientOrderFilters(
  orders: OrderView[],
  query: OrderQuery,
): OrderView[] {
  let result = [...orders];

  const search = query.searchValue?.trim().toLowerCase();
  if (search) {
    result = result.filter(order =>
      [order.id, order.fullId, order.status]
        .some(value => value.toLowerCase().includes(search)),
    );
  }

  if (query.createdAfter || query.createdBefore) {
    result = result.filter(order =>
      matchesDateRange(order.createdAt, query.createdAfter, query.createdBefore),
    );
  }

  if (query.ordering) {
    result = sortOrders(result, query.ordering);
  }

  return result;
}

export function needsClientOrderFiltering(query: OrderQuery): boolean {
  return Boolean(
    query.searchValue?.trim() ||
      query.ordering ||
      query.createdAfter ||
      query.createdBefore ||
      query.paidAfter ||
      query.paidBefore ||
      query.deliveredAfter ||
      query.deliveredBefore ||
      query.canceledAfter ||
      query.canceledBefore ||
      query.refundedAfter ||
      query.refundedBefore,
  );
}
