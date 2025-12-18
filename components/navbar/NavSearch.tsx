"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SelectCategory } from "./SelectCategory";

export default function NavSearch() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [search, setSearch] = useState(
    searchParams.get("search")?.toString() || ""
  );
  const handleSearch = useDebouncedCallback(value => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    replace(`/?${params.toString()}`);
  }, 500);
  useEffect(() => {
    if (!searchParams.get("search")) {
      setTimeout(() => setSearch(""), 0);
    }
  }, [searchParams]);
  return (
    <div className="col-span-1 md:col-span-2 flex items-center">
      <SelectCategory />
      <Input
        type="search"
        placeholder="search product..."
        className="dark:bg-muted rounded-none h-[42px] focus-visible:ring-0 focus-visible:border-gray-400"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      <Button
        variant={"default"}
        size={"lg"}
        className="bg-[#059473] hover:bg-[#059473] focus-visible:border-ring focus-visible:ring-[#059473]/50 -ml-px rounded-none h-[41px]">
        Search
      </Button>
    </div>
  );
}
