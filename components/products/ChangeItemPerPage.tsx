"use client";
import { useSearchParams } from "next/navigation";
import QueryParamDropdown from "./QueryParamDropdown";

export default function ChangeItemPerPage() {
  const searchParams = useSearchParams();
  const item = Number(searchParams.get("item")) || 10;
  return (
    <QueryParamDropdown
      label="Items Per Page"
      paramName="item"
      value={item}
      options={[10, 15, 20, 50, 100]}
      suffix="item"
    />
  );
}
