"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Categorys, category } from "@/utils/Category";
import { GetLocale } from "@/utils/GetUrlParams";
import { ArrowDownIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CategoryDropdown() {
  const locale = GetLocale();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <span className="group/button cursor-pointer shrink-0 items-center justify-center rounded-sm border bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 h-8 px-4 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 flex gap-4 max-w-[180px] [&_svg:not([class*='size-'])]:size-4">
          <span>Categories</span>
          <ArrowDownIcon />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-52 rounded-sm"
        align="start"
        sideOffset={5}>
        <RenderCategories
          locale={locale}
          categorys={Categorys}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
function RenderCategories({
  locale,
  categorys,
}: {
  locale: string;
  categorys: category[];
}) {
  const jsx = [];
  for (let i = 0; i < categorys.length; i++) {
    if (i === categorys.length - 1) {
      jsx.push(
        <DropdownMenuItem key={categorys[i].href}>
          <Link
            href={`/${locale}/${categorys[i].href}`}
            className="capitalize w-full flex justify-between items-center">
            <span>{categorys[i].label}</span>
            <Image
              src={categorys[i].image}
              alt={categorys[i].label}
              width={100}
              height={100}
              className="h-[32px] w-[32px] rounded-full"
            />
          </Link>
        </DropdownMenuItem>,
      );
    } else {
      jsx.push(
        <DropdownMenuItem key={categorys[i].label}>
          <Link
            href={`/${locale}/${categorys[i].href}`}
            className="capitalize w-full flex justify-between items-center">
            <span>{categorys[i].label}</span>
            <Image
              src={categorys[i].image}
              alt={categorys[i].label}
              width={100}
              height={100}
              className="h-[32px] w-[32px] rounded-full"
            />
          </Link>
        </DropdownMenuItem>,
      );
      jsx.push(<DropdownMenuSeparator key={`separator-${i}`} />);
    }
  }
  return jsx;
}
