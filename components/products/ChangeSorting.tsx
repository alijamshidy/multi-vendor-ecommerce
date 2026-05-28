"use client";

import { useSearchParams } from "next/navigation";
import QueryParamDropdown from "./QueryParamDropdown";

export default function ChangeSorting() {
  const searchParams = useSearchParams();
  const sorting = searchParams.get("sortBy") || "highToLow";
  return (
    <QueryParamDropdown
      label="SortBy"
      paramName="sortBy"
      value={sorting}
      options={["highToLow", "lowToHigh"]}
    />
  );
}
