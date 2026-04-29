"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Container from "../Global/Container";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export default function Filter() {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category")?.toString() || "";
  const range = searchParams.get("range")?.toString() || "";
  const resetFilter = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("range");

    replace(`/en/products?${params.toString()}`);
  }, 500);
  console.log(range, category);
  return (
    <Container className="hidden md:inline-block md:w-[30%] xl:w-[20%] min-h-full mt-10">
      <div className="flex justify-between items-center">
        <Label>Filter</Label>
        <Button
          onClick={() => {
            resetFilter();
          }}
          variant={"outline"}
          className={"cursor-pointer"}>
          Reset
        </Button>
      </div>
    </Container>
  );
}
