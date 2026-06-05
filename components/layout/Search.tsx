"use client";

import { useQueryParams } from "@/hooks/use-query-params";
import { GetLocale } from "@/utils/GetUrlParams";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "../ui/button";
import { Field } from "../ui/field";
import { Input } from "../ui/input";

export default function NavSearch() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const { searchParams, replaceQuery } = useQueryParams();
  const searchParam = searchParams.get("search")?.toString() || "";
  const [search, setSearch] = useState(
    searchParams.get("search")?.toString() || "",
  );
  const locale = GetLocale();
  const handleSearch = useDebouncedCallback(value => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    replaceQuery(`/${locale}/products?${params.toString()}`);
  }, 500);

  useEffect(() => {
    if (!searchParams.get("search")) {
      setTimeout(() => setSearch(""), 0);
    }
  }, [searchParams]);

  return (
    <Field orientation="horizontal">
      <Input
        type="search"
        placeholder={t("searchPlaceholder")}
        className="w-full min-w-0 max-w-full dark:bg-muted"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
        }}
      />
      <Button
        disabled={search === searchParam}
        onClick={() => handleSearch(search)}>
        {tCommon("search")}
      </Button>
    </Field>
  );
}
