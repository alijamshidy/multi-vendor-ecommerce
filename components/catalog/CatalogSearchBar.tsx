"use client";

import { Input } from "@/components/ui/input";
import { useQueryParams } from "@/hooks/use-query-params";
import { LIST_PAGE_PARAM, LIST_SEARCH_PARAM } from "@/lib/list-query";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function CatalogSearchBar() {
  const t = useTranslations("catalog");
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParams();
  const searchValue = searchParams.get(LIST_SEARCH_PARAM) ?? "";

  const updateSearch = useDebouncedCallback((value: string) => {
    setQueryParams({
      [LIST_SEARCH_PARAM]: value.trim() || null,
      [LIST_PAGE_PARAM]: 1,
    });
  }, 400);

  return (
    <Input
      defaultValue={searchValue}
      placeholder={t("searchPlaceholder")}
      onChange={event => updateSearch(event.target.value)}
      className="max-w-md"
    />
  );
}
