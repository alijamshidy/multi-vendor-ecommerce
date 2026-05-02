"use client";
import { GetLocale } from "@/utils/GetUrlParams";
import { Products, productType } from "@/utils/products";
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
import { Separator } from "../ui/separator";
import ChangeLayout from "./ChangeLayout";
import Pagination from "./Pagination";
import ProductsGrid from "./ProductsGrid";
import ProductsList from "./ProductsList";

export default function ProductsContainer({
  layout,
  open,
}: {
  layout: string;
  open: boolean;
}) {
  const { replace } = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const locale = GetLocale();
  const range = Number(searchParams.get("item")) || 10;
  const sorting = searchParams.get("item") || "highToLow";
  const [itemPerPage, setItemPerPage] = useState(range);
  const [parPage, setParPage] = useState(1);
  const stringSearchParams = searchParams.toString();
  const [sortBy, setSortBy] = useState(sorting);
  // const searchParams = parseQueryString({ str: RemoveLayoutParam() });
  // const products = await fetchAllProducts({ search });
  const products: productType[] = Products;
  const totalProducts = products.length;
  const handleItems = useDebouncedCallback(value => {
    const params = new URLSearchParams(searchParams);

    params.set("item", value);
    replace(`${path}/?${params.toString()}`);
  }, 500);
  return (
    <div className="w-full md:w-[90%] ml-[2%]">
      <section>
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-lg">
            {totalProducts} product{totalProducts > 1 && "s"}
          </h4>
          <ChangeLayout />
        </div>
        <Separator className="mt-4" />
      </section>
      {/*  */}
      <section className="flex items-center justify-between">
        <div className="flex justify-between items-center w-full flex-col lg:flex-row gap-y-3 lg:gap-y-0">
          <div className="flex justify-between lg:justify-center items-center w-full lg:w-auto">
            <Label>Items Per Page : </Label>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <span className="group/button cursor-pointer shrink-0 items-center justify-center rounded-sm border bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 h-8 px-4 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 flex gap-4 max-w-[180px] [&_svg:not([class*='size-'])]:size-4">
                  <span>{itemPerPage}</span>
                  <ArrowDownIcon />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-6 rounded-sm"
                align="start"
                sideOffset={5}>
                <Render
                  handleItems={handleItems}
                  items={[10, 15, 20, 50, 100]}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex justify-between lg:justify-center items-center w-full lg:w-auto">
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
        </div>
        <Separator className="mt-4" />
      </section>
      {/* PRODUCTS */}
      <div>
        {totalProducts === 0 ? (
          <h5 className="text-2xl mt-16">
            Sorry, no products matched your search...
          </h5>
        ) : layout === "grid" ? (
          <>
            <ProductsGrid
              products={products}
              open={open}
            />
            <Pagination parPage={parPage} />
          </>
        ) : (
          <>
            <ProductsList products={products} />
            <Pagination parPage={parPage} />
          </>
        )}
      </div>
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
