"use client";

import { Input } from "@/components/ui/input";
import { useQueryParams } from "@/hooks/use-query-params";
import { PAGE_PARAM, SEARCH_PARAM } from "@/lib/product-query";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function ManagementSearchFilter() {
  const t = useTranslations("filters");
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParams();
  const searchValue = searchParams.get(SEARCH_PARAM) ?? "";

  const updateSearch = useDebouncedCallback((value: string) => {
    setQueryParams({
      [SEARCH_PARAM]: value.trim() || null,
      [PAGE_PARAM]: 1,
    });
  }, 400);

  return (
    <div className="px-2 py-1">
      <Input
        id="management-product-search"
        defaultValue={searchValue}
        placeholder={t("searchPlaceholder")}
        onChange={event => updateSearch(event.target.value)}
      />
    </div>
  );
}
