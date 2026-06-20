"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQueryParams } from "@/hooks/use-query-params";
import { AVAILABLE_PARAM, PAGE_PARAM } from "@/lib/product-query";
import { useTranslations } from "next-intl";
import { useId } from "react";
import { useSearchParams } from "next/navigation";

type AvailabilityValue = "all" | "true" | "false";

export default function AvailabilityFilter() {
  const t = useTranslations("filters");
  const instanceId = useId();
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParams();
  const availability = searchParams.get(AVAILABLE_PARAM);
  const value: AvailabilityValue =
    availability === "true" || availability === "false"
      ? availability
      : "all";

  const setAvailability = (next: AvailabilityValue) => {
    setQueryParams({
      [AVAILABLE_PARAM]: next === "all" ? null : next,
      [PAGE_PARAM]: 1,
    });
  };

  return (
    <RadioGroup
      value={value}
      onValueChange={next => setAvailability(next as AvailabilityValue)}
      className="flex flex-col gap-3 px-2 py-1">
      <div className="flex items-center gap-2">
        <RadioGroupItem
          value="all"
          id={`${instanceId}-available-all`}
        />
        <Label
          htmlFor={`${instanceId}-available-all`}
          className="cursor-pointer text-sm font-normal">
          {t("allAvailability")}
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem
          value="true"
          id={`${instanceId}-available`}
        />
        <Label
          htmlFor={`${instanceId}-available`}
          className="cursor-pointer text-sm font-normal">
          {t("availableOnly")}
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem
          value="false"
          id={`${instanceId}-unavailable`}
        />
        <Label
          htmlFor={`${instanceId}-unavailable`}
          className="cursor-pointer text-sm font-normal">
          {t("unavailableOnly")}
        </Label>
      </div>
    </RadioGroup>
  );
}
