"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useQueryParams } from "@/hooks/use-query-params";
import { useStoreInitOnce } from "@/hooks/use-store-init";
import {
  clampPriceRange,
} from "@/lib/product-price-bounds";
import {
  isFullPriceRange,
  PAGE_PARAM,
  PRICE_STEP,
  RANGE_PARAM,
  parsePriceRange,
} from "@/lib/product-query";
import useProductStore from "@/store/productStore";
import { formatCurrency } from "@/utils/format";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function RangeSlider() {
  const t = useTranslations("filters");
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParams();
  const rangeParam = searchParams.get(RANGE_PARAM);

  const priceBounds = useProductStore(state => state.priceBounds);
  const fetchPriceBounds = useProductStore(state => state.fetchPriceBounds);
  const priceBoundsLoaded = useProductStore(state => state.priceBoundsLoaded);
  const isLoadingBounds = useProductStore(
    state => state.loading.fetchPriceBounds,
  );

  useStoreInitOnce(() => {
    void fetchPriceBounds();
  }, [fetchPriceBounds]);

  const bounds = priceBounds;

  const urlRange = useMemo(() => {
    const parsed = parsePriceRange(rangeParam);
    if (!parsed) {
      return [bounds.min, bounds.max] as [number, number];
    }
    return clampPriceRange(parsed, bounds);
  }, [bounds, rangeParam]);

  const [value, setValue] = useState<[number, number]>(urlRange);

  useEffect(() => {
    setValue(urlRange);
  }, [urlRange]);

  const syncRangeToQuery = useDebouncedCallback((next: [number, number]) => {
    const clamped = clampPriceRange(next, bounds);
    setQueryParams({
      [RANGE_PARAM]: isFullPriceRange(clamped[0], clamped[1], bounds)
        ? null
        : `${clamped[0]},${clamped[1]}`,
      [PAGE_PARAM]: 1,
    });
  }, 400);

  const handleValueChange = (next: number[]) => {
    const range = clampPriceRange(
      [next[0] ?? bounds.min, next[1] ?? bounds.max],
      bounds,
    );
    setValue(range);
    syncRangeToQuery(range);
  };

  if (!priceBoundsLoaded && isLoadingBounds) {
    return (
      <p className="px-2 py-3 text-sm text-muted-foreground">
        {t("loadingPriceRange")}
      </p>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-start gap-3 px-2 py-3">
      <Slider
        className="h-[3px] rounded-sm bg-black"
        value={value}
        onValueChange={handleValueChange}
        min={bounds.min}
        max={bounds.max}
        step={PRICE_STEP}
      />

      <Label className="flex w-full justify-between">
        <span className="text-sm text-muted-foreground">
          {formatCurrency(value[0])}
        </span>
        <span className="text-sm text-muted-foreground">
          {formatCurrency(value[1])}
        </span>
      </Label>
    </div>
  );
}
