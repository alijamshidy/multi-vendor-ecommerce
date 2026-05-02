"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "../ui/button";

export default function ResetFilterButton() {
  const { replace } = useRouter();
  const path = usePathname();
  const locale = path.split("/")[1];
  const searchParams = useSearchParams();
  const layout = `layout=${searchParams.get("layout")}`;
  const resetFilter = useDebouncedCallback(() => {
    replace(`/${locale}/products?${layout}`);
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
