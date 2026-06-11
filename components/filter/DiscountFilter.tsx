"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useQueryParams } from "@/hooks/use-query-params";
import { DISCOUNT_PARAM, PAGE_PARAM } from "@/lib/product-query";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function DiscountFilter() {
  const t = useTranslations("filters");
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParams();
  const hasDiscount = searchParams.get(DISCOUNT_PARAM) === "true";

  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <Checkbox
        id="filter-discount"
        checked={hasDiscount}
        onCheckedChange={checked =>
          setQueryParams({
            [DISCOUNT_PARAM]: checked === true ? "true" : null,
            [PAGE_PARAM]: 1,
          })
        }
      />
      <Label
        htmlFor="filter-discount"
        className="cursor-pointer text-sm font-normal">
        {t("discountOnly")}
      </Label>
    </div>
  );
}
