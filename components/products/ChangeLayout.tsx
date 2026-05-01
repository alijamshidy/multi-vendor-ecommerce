"use client";
import {
  GetLocale,
  GetSearchParams,
  parseQueryString,
  RemoveLayoutParam,
} from "@/utils/GetUrlParams";
import Link from "next/link";
import { LuLayoutGrid, LuLayoutList } from "react-icons/lu";
import { Button } from "../ui/button";

export default function ChangeLayout() {
  const str = GetSearchParams();
  const searchParam = parseQueryString({ str: str.toString() });
  const layout =
    typeof searchParam.layout === "string" ? searchParam.layout : "";

  const locale = GetLocale();
  const searchTerm = RemoveLayoutParam();
  return (
    <div className="flex gap-x-4">
      <Button
        variant={layout === "grid" ? "default" : "ghost"}
        size={"icon"}>
        <Link
          href={`/${locale}/products?layout=grid${searchTerm}`}
          className="w-full h-full justify-center items-center flex">
          <LuLayoutGrid />
        </Link>
      </Button>
      <Button
        variant={layout !== "grid" ? "default" : "ghost"}
        size={"icon"}>
        <Link
          href={`/${locale}/products?layout=list${searchTerm}`}
          className="w-full h-full justify-center items-center flex">
          <LuLayoutList />
        </Link>
      </Button>
    </div>
  );
}
