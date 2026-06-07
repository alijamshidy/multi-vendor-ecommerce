"use client";

import FilterPanel from "@/components/products/FilterPanel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MobileFilterDropdown() {
  const t = useTranslations("filters");

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between gap-2 md:hidden">
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="size-4" />
            {t("title")}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="max-h-[min(70vh,28rem)] w-(--radix-dropdown-menu-trigger-width) overflow-y-auto rounded-md p-0">
        <div className="p-4">
          <FilterPanel />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
