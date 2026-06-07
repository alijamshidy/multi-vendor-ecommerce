"use client";

import {
  getItemsPerPage,
  ITEMS_PER_PAGE_PARAM,
  PAGE_SIZE_OPTIONS,
} from "@/lib/product-query";
import { useSearchParams } from "next/navigation";
import QueryParamDropdown from "./QueryParamDropdown";

export default function ChangeItemPerPage() {
  const searchParams = useSearchParams();
  const itemsPerPage = getItemsPerPage(searchParams);

  return (
    <QueryParamDropdown
      label="Items Per Page"
      paramName={ITEMS_PER_PAGE_PARAM}
      value={itemsPerPage}
      options={[...PAGE_SIZE_OPTIONS]}
      suffix="item"
    />
  );
}
