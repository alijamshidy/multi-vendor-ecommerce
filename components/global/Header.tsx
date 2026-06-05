"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { LuSearch } from "react-icons/lu";
import HeaderActions from "../layout/HeaderActions";
import Logo from "../layout/Logo";
import NavSearch from "../layout/Search";
import { ThemeSwitcher } from "../layout/ThemeSwitcher";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { SidebarTrigger } from "../ui/sidebar";

export default function Header({ open }: { open: boolean }) {
  const t = useTranslations("nav");

  return (
    <>
      <section className="fixed top-5 z-30 w-full bg-background/95 backdrop-blur md:hidden">
        <header className="mx-[2%] flex h-16 w-[calc(100%-4%)] min-w-0 items-center justify-between gap-2 rounded-md border px-3 shadow-sm">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger />
            <Logo />
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Suspense>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={t("searchProducts")}>
                    <LuSearch className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="mr:10 w-[calc(80vw)] sm:mr-20"
                  sideOffset={10}>
                  <NavSearch />
                </PopoverContent>
              </Popover>
            </Suspense>
            <HeaderActions mobile />
          </div>
        </header>
      </section>

      <section className="sticky top-5 z-30 mx-[2%] hidden min-w-0 w-[calc(100%-4%)] md:block">
        <header className="flex h-20 w-full shrink-0 items-center gap-2 rounded-md border bg-background px-2 shadow-sm transition-all duration-200 ease-linear sm:px-4">
          <SidebarTrigger className="shrink-0" />
          <div
            className={cn(
              "flex min-w-0 flex-1 items-center gap-2",
              open ? "justify-around pe-2" : "justify-between px-4",
            )}>
            <div className="flex shrink-0 items-center gap-x-4">
              <Logo />
              <ThemeSwitcher
                className="hidden lg:block"
                open={open}
              />
            </div>

            <div
              className={cn(
                "min-w-0 flex-1 px-2 max-w-md",
                open ? "hidden lg:block" : "block ",
              )}>
              <Suspense>
                <NavSearch />
              </Suspense>
            </div>

            <div
              className={cn(
                "shrink-0 items-center justify-center",
                open ? "flex lg:hidden" : "hidden",
              )}>
              <Suspense>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={t("searchProducts")}>
                      <LuSearch className="size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-80"
                    sideOffset={10}>
                    <NavSearch />
                  </PopoverContent>
                </Popover>
              </Suspense>
            </div>
            <div
              className={cn(
                "shrink-0 items-center gap-x-2 sm:gap-x-4",
                open ? "hidden xl:flex" : "flex",
              )}>
              <HeaderActions />
            </div>
            <div
              className={cn(
                "shrink-0 items-center",
                open ? "flex xl:hidden" : "hidden",
              )}>
              <HeaderActions compact />
            </div>
          </div>
        </header>
      </section>
    </>
  );
}
