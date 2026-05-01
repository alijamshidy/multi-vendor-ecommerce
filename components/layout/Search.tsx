"use client";
import { GetLocale } from "@/utils/GetUrlParams";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "../ui-rtl/button";
import { Field } from "../ui/field";
import { Input } from "../ui/input";

export default function NavSearch() {
  const searchParams = useSearchParams();
  const searchParam = searchParams.get("search")?.toString() || "";
  const { replace } = useRouter();
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
    replace(`/${locale}/products?${params.toString()}`);
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
        placeholder="search product..."
        className="max-w-md dark:bg-muted"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
        }}
      />
      <Button
        disabled={search === searchParam}
        onClick={() => handleSearch(search)}>
        Search
      </Button>
    </Field>
  );
}
