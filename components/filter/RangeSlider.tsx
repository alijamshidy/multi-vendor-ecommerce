"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/utils/format";
import { GetLocale } from "@/utils/GetUrlParams";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function RangeSlider() {
  const searchParams = useSearchParams();
  const range = [0, 10000];
  const [value, setValue] = useState(range);
  const lowPrice = formatCurrency(value[0]);
  const highPrice = formatCurrency(value[1]);

  const { replace } = useRouter();
  const locale = GetLocale();
  const handleSearch = useDebouncedCallback(value => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("range", value);
    } else {
      params.delete("range");
    }
    params.set("page", "1");
    replace(`/${locale}/products?${params.toString()}`);
  }, 500);

  useEffect(() => {
    handleSearch(value);
  }, [handleSearch, value]);

  return (
    <div className="mx-auto flex flex-col items-start w-full max-w-xs gap-3 px-2 py-3">
      <Slider
        className="h-[3px] rounded-sm bg-black"
        id="slider-demo-temperature"
        value={value}
        onValueChange={setValue}
        min={0}
        max={100}
        step={0.00001}
      />

      <Label className="w-full flex justify-between">
        <span className="text-sm text-muted-foreground">{`${lowPrice}`}</span>
        <span className="text-sm text-muted-foreground">{`${highPrice}`}</span>
      </Label>
    </div>
  );
}
