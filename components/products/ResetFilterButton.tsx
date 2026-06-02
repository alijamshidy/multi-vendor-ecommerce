"use client";
import { useQueryParams } from "@/hooks/use-query-params";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "../ui/button";

export default function ResetFilterButton() {
  const { pathname, searchParams, replaceQuery } = useQueryParams();
  const locale = pathname.split("/")[1];
  const layout = searchParams.get("layout")
    ? searchParams.get("layout")
    : "grid";
  console.log(locale, layout);
  const resetFilter = useDebouncedCallback(() => {
    replaceQuery(`/${locale}/products?layout=${layout}`);
  }, 500);
  return (
    <Button
      disabled={searchParams.toString() === `${layout}`}
      onClick={() => {
        resetFilter();
      }}
      variant={"outline"}
      className={"cursor-pointer"}>
      Reset
    </Button>
  );
}
