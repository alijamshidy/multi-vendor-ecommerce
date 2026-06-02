"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import FilterPanel from "./FilterPanel";

export default function MobileFilterSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="w-full md:hidden">
          <SlidersHorizontal className="size-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="w-[min(100vw)] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <FilterPanel />
        </div>
      </SheetContent>
    </Sheet>
  );
}
