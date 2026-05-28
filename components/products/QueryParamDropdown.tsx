"use client";

import { useQueryParams } from "@/hooks/use-query-params";
import { ArrowDownIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Label } from "../ui/label";

type QueryParamDropdownProps = {
  label: string;
  paramName: string;
  value: string | number;
  options: Array<string | number>;
  suffix?: string;
};

export default function QueryParamDropdown({
  label,
  paramName,
  value,
  options,
  suffix,
}: QueryParamDropdownProps) {
  const [selectedValue, setSelectedValue] = useState(value);
  const { setQueryParam } = useQueryParams();

  const handleChange = useDebouncedCallback((nextValue: string | number) => {
    setSelectedValue(nextValue);
    setQueryParam(paramName, nextValue);
  }, 500);

  return (
    <div className="flex justify-between lg:justify-center items-center w-full lg:w-auto gap-x-1.5">
      <Label>{label} : </Label>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <span className="group/button cursor-pointer shrink-0 items-center justify-center rounded-sm border bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 h-8 px-4 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 flex gap-4 max-w-[180px] [&_svg:not([class*='size-'])]:size-4">
            <span>{selectedValue}</span>
            {suffix ? suffix : <ArrowDownIcon />}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-6 rounded-sm"
          align="start"
          sideOffset={5}>
          {options.map((option, index) => (
            <Fragment key={option}>
              <DropdownMenuItem onClick={() => handleChange(option)}>
                <span>{option}</span>
              </DropdownMenuItem>
              {index < options.length - 1 && (
                <DropdownMenuSeparator key={`separator-${option}`} />
              )}
            </Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
