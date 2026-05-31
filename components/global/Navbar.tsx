"use client";

import { LuPhone } from "react-icons/lu";
import CategoryDropdown from "../layout/CategoryDropdown";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

export default function Navbar() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between">
      <CategoryDropdown />

      {/* Phone — full on sm+, icon popover on mobile */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="sm:hidden"
            aria-label="Phone numbers">
            <LuPhone className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-56"
          sideOffset={8}>
          <div className="space-y-2 text-sm">
            <p className="font-medium">Phone</p>
            <p dir="ltr">+98 918 123 4986</p>
            <p dir="ltr">+87 33 12 4986</p>
          </div>
        </PopoverContent>
      </Popover>

      <Label className="hidden flex-col gap-2 sm:flex sm:flex-row sm:items-center">
        <div className="flex items-center gap-x-1 sm:me-3">
          <span>Phone</span>
          <LuPhone className="size-4 shrink-0" />
        </div>
        <div className="flex flex-col items-start gap-y-1 text-sm sm:flex-row sm:gap-x-4 sm:gap-y-0">
          <span dir="ltr">+98 918 123 4986</span>
          <span dir="ltr">+87 33 12 4986</span>
        </div>
      </Label>
    </div>
  );
}
