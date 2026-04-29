"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "../ui/button";

export default function ResetFilterButton() {
  const { replace } = useRouter();
  const path = usePathname();
  const locale = path.split("/")[1];
  const searchParams = useSearchParams();
  const resetFilter = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("range");
    replace(`/${locale}/products?${params.toString()}`);
  }, 500);
  return (
    <Button
      onClick={() => {
        resetFilter();
      }}
      variant={"outline"}
      className={"cursor-pointer"}>
      Reset
    </Button>
  );
}
