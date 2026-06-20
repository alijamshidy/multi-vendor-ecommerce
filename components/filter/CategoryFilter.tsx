"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useQueryParams } from "@/hooks/use-query-params";
import { useStoreInitOnce } from "@/hooks/use-store-init";
import { sortCategoriesForFilter } from "@/lib/product-category-filter";
import {
  CATEGORIES_PARAM,
  PAGE_PARAM,
  parseCategorySlugs,
} from "@/lib/product-query";
import { cn } from "@/lib/utils";
import useCategoryStore from "@/store/categoryStore";
import { useTranslations } from "next-intl";
import { useId } from "react";
import { useSearchParams } from "next/navigation";

export default function CategoryFilter() {
  const t = useTranslations("filters");
  const instanceId = useId();
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParams();

  const categories = useCategoryStore(state => state.categories);
  const fetchCategories = useCategoryStore(state => state.fetchCategories);
  const isLoading = useCategoryStore(state => state.loading.fetchCategories);
  const categoryError = useCategoryStore(state => state.errorMessage);

  useStoreInitOnce(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const selectedSlugs = parseCategorySlugs(searchParams);
  const selectedSlug = selectedSlugs[0] ?? null;
  const categoryList = sortCategoriesForFilter(categories);

  const selectCategory = (slug: string, checked: boolean) => {
    setQueryParams({
      [CATEGORIES_PARAM]: checked ? slug : null,
      [PAGE_PARAM]: 1,
    });
  };

  if (isLoading && categories.length === 0) {
    return (
      <p className="px-2 py-1 text-sm text-muted-foreground">
        {t("loadingCategories")}
      </p>
    );
  }

  if (categoryError && categories.length === 0) {
    return (
      <p className="px-2 py-1 text-sm text-destructive">{categoryError}</p>
    );
  }

  if (categories.length === 0) {
    return (
      <p className="px-2 py-1 text-sm text-muted-foreground">
        {t("noCategories")}
      </p>
    );
  }

  return (
    <div className="flex max-h-48 flex-col gap-3 overflow-y-auto px-2 py-1">
      <p className="text-xs text-muted-foreground">{t("categorySingleSelect")}</p>
      {categoryList.map(item => {
        const checked = selectedSlug === item.href;
        const inputId = `${instanceId}-category-${item.href}`;
        const depth = item.depth ?? 0;

        return (
          <div
            key={item.id}
            className={cn("flex items-center gap-2", depth > 0 && "ps-4")}>
            <Checkbox
              id={inputId}
              checked={checked}
              onCheckedChange={next =>
                selectCategory(item.href, next === true)
              }
            />
            <Label
              htmlFor={inputId}
              className="cursor-pointer text-sm font-normal">
              {item.label}
            </Label>
          </div>
        );
      })}
    </div>
  );
}
