"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GetAfterUrl, GetLocale } from "@/utils/GetUrlParams";
import { IR, US } from "country-flag-icons/react/3x2";
import Link from "next/link";

export default function LanguageSwitcher() {
  const locale = GetLocale();
  const afterUrl = GetAfterUrl();
  const Languages = [
    { label: "En", icon: <US />, href: "en" },
    { label: "Fa", icon: <IR />, href: "fa" },
  ];
  const icon = Languages.map(language => {
    if (language.label.toLowerCase() === locale) {
      return language.icon;
    }
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="group/button cursor-pointer shrink-0 items-center justify-center rounded-sm border bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 h-8 px-4 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 flex gap-4 max-w-[180px] [&_svg:not([class*='size-'])]:size-4">
          <span>{locale}</span>
          <span>{icon}</span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-24 rounded-sm"
        align="start"
        sideOffset={5}>
        {Languages.map(link => {
          return (
            <DropdownMenuItem key={link.label}>
              <Link
                href={`/${link.href}/${afterUrl}`}
                className="capitalize w-full flex justify-between items-center">
                <span>{link.label}</span>
                {link.icon}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
