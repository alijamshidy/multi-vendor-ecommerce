"use client";

import { useQueryParams } from "@/hooks/use-query-params";
import {
  getProductFilterResetParams,
  hasActiveProductFilters,
} from "@/lib/product-query";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

export default function ResetFilterButton() {
  const t = useTranslations("filters");
  const { searchParams, setQueryParams } = useQueryParams();
  const hasFilters = hasActiveProductFilters(searchParams);

  const resetFilter = () => {
    setQueryParams(getProductFilterResetParams());
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
