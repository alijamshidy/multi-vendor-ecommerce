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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <span className="group/button flex h-8 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm border border-border bg-background px-2 text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:border-input dark:bg-input/30 dark:hover:bg-input/50 sm:gap-3 sm:px-4 [&_svg:not([class*='size-'])]:size-4">
          <span className="hidden sm:inline">{locale}</span>
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
                href={afterUrl ? `/${link.href}/${afterUrl}` : `/${link.href}`}
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
