"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryParams } from "@/hooks/use-query-params";
import {
  ORDER_CANCELED_AFTER_PARAM,
  ORDER_CANCELED_BEFORE_PARAM,
  ORDER_CREATED_AFTER_PARAM,
  ORDER_CREATED_BEFORE_PARAM,
  ORDER_DELIVERED_AFTER_PARAM,
  ORDER_DELIVERED_BEFORE_PARAM,
  ORDER_ORDERING_PARAM,
  ORDER_PAGE_PARAM,
  ORDER_PAID_AFTER_PARAM,
  ORDER_PAID_BEFORE_PARAM,
  ORDER_REFUNDED_AFTER_PARAM,
  ORDER_REFUNDED_BEFORE_PARAM,
  ORDER_SEARCH_PARAM,
  ORDER_STATUS_OPTIONS,
  ORDER_STATUS_PARAM,
  hasActiveOrderFilters,
} from "@/lib/order-query";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

type DateField = {
  id: string;
  labelKey: string;
  param: string;
};

const DATE_FIELDS: DateField[] = [
  {
    id: "created-after",
    labelKey: "createdAfter",
    param: ORDER_CREATED_AFTER_PARAM,
  },
  {
    id: "created-before",
    labelKey: "createdBefore",
    param: ORDER_CREATED_BEFORE_PARAM,
  },
  { id: "paid-after", labelKey: "paidAfter", param: ORDER_PAID_AFTER_PARAM },
  { id: "paid-before", labelKey: "paidBefore", param: ORDER_PAID_BEFORE_PARAM },
  {
    id: "delivered-after",
    labelKey: "deliveredAfter",
    param: ORDER_DELIVERED_AFTER_PARAM,
  },
  {
    id: "delivered-before",
    labelKey: "deliveredBefore",
    param: ORDER_DELIVERED_BEFORE_PARAM,
  },
  {
    id: "canceled-after",
    labelKey: "canceledAfter",
    param: ORDER_CANCELED_AFTER_PARAM,
  },
  {
    id: "canceled-before",
    labelKey: "canceledBefore",
    param: ORDER_CANCELED_BEFORE_PARAM,
  },
  {
    id: "refunded-after",
    labelKey: "refundedAfter",
    param: ORDER_REFUNDED_AFTER_PARAM,
  },
  {
    id: "refunded-before",
    labelKey: "refundedBefore",
    param: ORDER_REFUNDED_BEFORE_PARAM,
  },
];

export default function OrderFilterPanel() {
  const t = useTranslations("orders");
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParams();

  const searchValue = searchParams.get(ORDER_SEARCH_PARAM) ?? "";
  const statusValue = searchParams.get(ORDER_STATUS_PARAM) ?? "";
  const orderingValue = searchParams.get(ORDER_ORDERING_PARAM) ?? "";

  const updateSearch = useDebouncedCallback((value: string) => {
    setQueryParams({
      [ORDER_SEARCH_PARAM]: value.trim() || null,
      [ORDER_PAGE_PARAM]: 1,
    });
  }, 400);

  const resetFilters = () => {
    setQueryParams({
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
    });
  };

  return (
    <section className="space-y-4 rounded-md border p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-[220px] flex-1 space-y-1.5">
          <Label htmlFor="order-search">{t("searchOrders")}</Label>
          <Input
            id="order-search"
            defaultValue={searchValue}
            placeholder={t("searchOrdersPlaceholder")}
            onChange={event => updateSearch(event.target.value)}
          />
        </div>

        <div className="min-w-[180px] space-y-1.5">
          <Label>{t("statusFilter")}</Label>
          <Select
            value={statusValue || "all"}
            onValueChange={value =>
              setQueryParams({
                [ORDER_STATUS_PARAM]: value === "all" ? null : value,
                [ORDER_PAGE_PARAM]: 1,
              })
            }>
            <SelectTrigger>
              <SelectValue placeholder={t("statusFilter")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStatuses")}</SelectItem>
              {ORDER_STATUS_OPTIONS.map(option => (
                <SelectItem
                  key={option.value}
                  value={String(option.value)}>
                  {t(option.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[180px] space-y-1.5">
          <Label>{t("ordering")}</Label>
          <Select
            value={orderingValue || "default"}
            onValueChange={value =>
              setQueryParams({
                [ORDER_ORDERING_PARAM]: value === "default" ? null : value,
                [ORDER_PAGE_PARAM]: 1,
              })
            }>
            <SelectTrigger>
              <SelectValue placeholder={t("ordering")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">{t("orderingDefault")}</SelectItem>
              <SelectItem value="-created_at">{t("orderingNewest")}</SelectItem>
              <SelectItem value="created_at">{t("orderingOldest")}</SelectItem>
              <SelectItem value="-total_price">{t("orderingHighest")}</SelectItem>
              <SelectItem value="total_price">{t("orderingLowest")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={!hasActiveOrderFilters(searchParams)}
          onClick={resetFilters}>
          {t("resetFilters")}
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {DATE_FIELDS.map(field => (
          <div
            key={field.id}
            className="space-y-1.5">
            <Label htmlFor={field.id}>{t(field.labelKey)}</Label>
            <Input
              id={field.id}
              type="date"
              value={searchParams.get(field.param) ?? ""}
              onChange={event =>
                setQueryParams({
                  [field.param]: event.target.value || null,
                  [ORDER_PAGE_PARAM]: 1,
                })
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
}
