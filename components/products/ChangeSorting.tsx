"use client";

import {
  SORT_OPTIONS,
  SORT_PARAM,
  type SortOption,
} from "@/lib/product-query";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import QueryParamDropdown from "./QueryParamDropdown";

export default function ChangeSorting() {
  const t = useTranslations("filters");
  const searchParams = useSearchParams();
  const sorting = (searchParams.get(SORT_PARAM) || "highToLow") as SortOption;

  return (
    <QueryParamDropdown
      label={t("sortBy")}
      paramName={SORT_PARAM}
      value={t(`sort.${sorting}`)}
      options={SORT_OPTIONS.map(option => t(`sort.${option}`))}
      optionValues={[...SORT_OPTIONS]}
    />
  );
}
