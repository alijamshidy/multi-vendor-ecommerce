"use client";

import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { Suspense } from "react";
import { LuSearch } from "react-icons/lu";
import HeaderActions from "../layout/HeaderActions";
import Logo from "../layout/Logo";
import NavSearch from "../layout/Search";
import { ThemeSwitcher } from "../layout/ThemeSwitcher";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { SidebarTrigger } from "../ui/sidebar";

function SearchPopover({
  className,
  contentClassName,
}: {
  className?: string;
  contentClassName?: string;
}) {
  const t = useTranslations("nav");

  return (
    <Suspense>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={className}
            aria-label={t("searchProducts")}>
            <LuSearch className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="center"
          className={cn("w-80", contentClassName)}
          sideOffset={10}>
          <NavSearch />
        </PopoverContent>
      </Popover>
    </Suspense>
  );
}

export default function Header({ open }: { open: boolean }) {
  const locale = useLocale();
  const isRtl = locale === "fa";
  const sidebarOffset = open
    ? "var(--sidebar-width)"
    : "var(--sidebar-width-icon)";

  return (
    <>
      <section className="fixed top-5 z-30 w-full bg-background/95 backdrop-blur md:hidden">
        <header
          dir={isRtl ? "rtl" : "ltr"}
          className="mx-[2%] flex h-16 w-[calc(100%-4%)] min-w-0 items-center justify-between gap-2 rounded-md border px-3 shadow-sm">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger />
            <Logo />
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <SearchPopover contentClassName="w-[calc(80vw)] sm:mr-20" />
            <ThemeSwitcher open />
            <Suspense>
              <HeaderActions mobile />
            </Suspense>
          </div>
        </header>
      </section>

      <section
        className="fixed top-5 z-30 hidden min-w-0 transition-[left,right] duration-200 ease-linear md:block"
        style={
          isRtl
            ? { left: 0, right: sidebarOffset }
            : { left: sidebarOffset, right: 0 }
        }>
        <header
          dir={isRtl ? "rtl" : "ltr"}
          className={cn(
            "mx-[2%] flex w-[calc(100%-4%)] min-w-0 items-center gap-1.5 overflow-hidden rounded-md border bg-background/95 px-2 shadow-sm backdrop-blur transition-all duration-200 ease-linear sm:gap-2 sm:px-3",
            open ? "h-16 lg:h-20" : "h-20",
          )}>
          <SidebarTrigger className="shrink-0" />

          {open ? (
            <div className="flex min-w-0 flex-1 items-center justify-between gap-1.5 sm:gap-2">
              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <Logo />
                <ThemeSwitcher open />
              </div>

              <div className="hidden min-w-0 flex-1 px-2 lg:block lg:max-w-sm xl:max-w-md">
                <Suspense>
                  <NavSearch />
                </Suspense>
              </div>

              <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
                <SearchPopover className="lg:hidden" />
                <div className="hidden items-center gap-x-2 xl:flex">
                  <Suspense>
                    <HeaderActions />
                  </Suspense>
                </div>
                <div className="flex items-center xl:hidden">
                  <Suspense>
                    <HeaderActions compact />
                  </Suspense>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-w-0 flex-1 items-center justify-between gap-2 px-2 sm:px-4">
              <div className="flex shrink-0 items-center gap-x-3 sm:gap-x-4">
                <Logo />
                <ThemeSwitcher
                  className="hidden lg:block"
                  open={false}
                />
              </div>

              <div className="min-w-0 flex-1 px-2 max-w-md">
                <Suspense>
                  <NavSearch />
                </Suspense>
              </div>

              <div className="flex shrink-0 items-center gap-x-2 sm:gap-x-4">
                <Suspense>
                  <HeaderActions />
                </Suspense>
              </div>
            </div>
          )}
        </header>
      </section>
    </>
  );
}
