"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryParams } from "@/hooks/use-query-params";
import {
  CREATED_AFTER_PARAM,
  CREATED_BEFORE_PARAM,
  PAGE_PARAM,
} from "@/lib/product-query";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function CreatedDateFilter() {
  const t = useTranslations("filters");
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParams();

  const createdAfter = searchParams.get(CREATED_AFTER_PARAM) ?? "";
  const createdBefore = searchParams.get(CREATED_BEFORE_PARAM) ?? "";

  const updateDate = (param: string, value: string) => {
    setQueryParams({
      [param]: value || null,
      [PAGE_PARAM]: 1,
    });
  };

  return (
    <div className="flex flex-col gap-3 px-2 py-1">
      <div className="space-y-1.5">
        <Label
          htmlFor="filter-created-after"
          className="text-sm font-normal text-muted-foreground">
          {t("createdAfter")}
        </Label>
        <Input
          id="filter-created-after"
          type="date"
          value={createdAfter}
          onChange={event =>
            updateDate(CREATED_AFTER_PARAM, event.target.value)
          }
        />
      </div>
      <div className="space-y-1.5">
        <Label
          htmlFor="filter-created-before"
          className="text-sm font-normal text-muted-foreground">
          {t("createdBefore")}
        </Label>
        <Input
          id="filter-created-before"
          type="date"
          value={createdBefore}
          onChange={event =>
            updateDate(CREATED_BEFORE_PARAM, event.target.value)
          }
        />
      </div>
    </div>
  );
}
