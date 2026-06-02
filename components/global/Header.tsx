import { cn } from "@/lib/utils";
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
  return (
    <>
      {/* Mobile header */}
      <section className="fixed top-5 w-full z-30  bg-background/95 backdrop-blur md:hidden">
        <header className="flex h-16 min-w-0  w-[90%] border rounded-md mx-auto items-center justify-between gap-2 px-3 shadow-sm">
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
                    aria-label="Search products">
                    <LuSearch className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[calc(80vw)] mr:10 sm:mr-20"
                  sideOffset={10}>
                  <NavSearch />
                </PopoverContent>
              </Popover>
            </Suspense>
            <HeaderActions mobile />
          </div>
        </header>
      </section>

      {/* Desktop header - sticky inside sidebar inset, adapts when sidebar opens */}
      <section className="sticky top-5 z-30 hidden min-w-0 md:block">
        <header
          className={cn(
            "flex h-20 shrink-0 items-center gap-2 rounded-md border bg-background shadow-sm transition-[width,margin] duration-200 ease-linear",
            open
              ? "ms-[1.5%] me-[4%] w-[calc(100%-5.5%)]"
              : "ms-[2.1%] me-[5%] w-[calc(100%-7.1%)]",
          )}>
          <SidebarTrigger className="ms-2 shrink-0" />
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
                      aria-label="Search products">
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
