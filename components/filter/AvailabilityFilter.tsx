"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useQueryParams } from "@/hooks/use-query-params";
import { AVAILABLE_PARAM, PAGE_PARAM } from "@/lib/product-query";
import { useTranslations } from "next-intl";
import { useId } from "react";
import { useSearchParams } from "next/navigation";

export default function AvailabilityFilter() {
  const t = useTranslations("filters");
  const instanceId = useId();
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParams();
  const availability = searchParams.get(AVAILABLE_PARAM);
  const isAvailable = availability === "true";
  const isUnavailable = availability === "false";

  const setAvailability = (value: boolean | null) => {
    setQueryParams({
      [AVAILABLE_PARAM]:
        value === null ? null : value ? "true" : "false",
      [PAGE_PARAM]: 1,
    });
  };

  return (
    <div className="flex flex-col gap-3 px-2 py-1">
      <div className="flex items-center gap-2">
        <Checkbox
          id={`${instanceId}-available`}
          checked={isAvailable}
          onCheckedChange={checked => {
            setAvailability(checked === true ? true : null);
          }}
        />
        <Label
          htmlFor={`${instanceId}-available`}
          className="cursor-pointer text-sm font-normal">
          {t("availableOnly")}
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id={`${instanceId}-unavailable`}
          checked={isUnavailable}
          onCheckedChange={checked => {
            setAvailability(checked === true ? false : null);
          }}
        />
        <Label
          htmlFor={`${instanceId}-unavailable`}
          className="cursor-pointer text-sm font-normal">
          {t("unavailableOnly")}
        </Label>
      </div>
    </div>
  );
}
