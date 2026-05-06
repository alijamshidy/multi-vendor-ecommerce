import { ArrowDownIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DebouncedState, useDebouncedCallback } from "use-debounce";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Label } from "../ui/label";

export default function ChangeSorting() {
  const { replace } = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const sorting = searchParams.get("sortBy") || "highToLow";
  const [sortBy, setSortBy] = useState(sorting);
  const handleItems = useDebouncedCallback(value => {
    const params = new URLSearchParams(searchParams);
    setSortBy(value);
    params.set("sortBy", value);
    replace(`${path}/?${params.toString()}`);
  }, 500);
  return (
    <div className="flex justify-between lg:justify-center items-center w-full lg:w-auto gap-x-1.5">
      <Label>SortBy : </Label>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <span className="group/button cursor-pointer shrink-0 items-center justify-center rounded-sm border bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 h-8 px-4 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 flex gap-4 max-w-[180px] [&_svg:not([class*='size-'])]:size-4">
            <span>{sortBy}</span>
            <ArrowDownIcon />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-6 rounded-sm"
          align="start"
          sideOffset={5}>
          <Render
            handleItems={handleItems}
            items={["highToLow", "lowToHigh"]}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function Render({
  handleItems,
  items,
}: {
  handleItems: DebouncedState<(value: string | number) => void>;
  items: string[] | number[];
}) {
  const jsx = [];

  for (let i = 0; i < items.length; i++) {
    if (i === items.length - 1) {
      jsx.push(
        <DropdownMenuItem
          // onClick={() => handleItems(items[i])}
          onClick={() => handleItems(items[i])}
          key={items[i]}>
          <span>{items[i]}</span>
        </DropdownMenuItem>,
      );
    } else {
      jsx.push(
        <DropdownMenuItem
          onClick={() => handleItems(items[i])}
          key={items[i]}>
          <span>{items[i]}</span>
        </DropdownMenuItem>,
      );
      jsx.push(<DropdownMenuSeparator key={`separator-${i}`} />);
    }
  }
  return jsx;
}
