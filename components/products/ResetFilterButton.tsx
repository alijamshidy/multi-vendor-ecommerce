"use client";

import { useQueryParams } from "@/hooks/use-query-params";
import {
  AVAILABLE_PARAM,
  CATEGORIES_PARAM,
  CREATED_AFTER_PARAM,
  CREATED_BEFORE_PARAM,
  DISCOUNT_PARAM,
  PAGE_PARAM,
  RANGE_PARAM,
  SEARCH_PARAM,
  hasActiveProductFilters,
} from "@/lib/product-query";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

export default function ResetFilterButton() {
  const t = useTranslations("filters");
  const { searchParams, setQueryParams } = useQueryParams();
  const hasFilters = hasActiveProductFilters(searchParams);

  const resetFilter = () => {
    setQueryParams({
      [RANGE_PARAM]: null,
      [CATEGORIES_PARAM]: null,
      [SEARCH_PARAM]: null,
      [AVAILABLE_PARAM]: null,
      [DISCOUNT_PARAM]: null,
      [CREATED_AFTER_PARAM]: null,
      [CREATED_BEFORE_PARAM]: null,
      [PAGE_PARAM]: 1,
    });
  };

  return (
    <Button
      disabled={!hasFilters}
      onClick={resetFilter}
      variant="outline"
      className="cursor-pointer">
      {t("reset")}
    </Button>
  );
}
