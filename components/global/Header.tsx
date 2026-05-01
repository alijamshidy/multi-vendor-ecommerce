import { Suspense } from "react";
import { LuSearch } from "react-icons/lu";
import CardButton from "../layout/CardButton";
import LanguageSwitcher from "../layout/LanguageSwitcher";
import LinksDropdown from "../layout/LinksDropdown";
import Logo from "../layout/Logo";
import NavSearch from "../layout/Search";
import { ThemeSwitcher } from "../layout/ThemeSwitcher";
import WishlistButton from "../layout/WishlistButton";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { SidebarTrigger } from "../ui/sidebar";

export default function Header({ open }: { open: boolean }) {
  console.log(open);
  return (
    <section className="fixed top-5 w-full z-30 hidden md:flex h-20 ">
      <header
        className={`flex shrink-0 items-center gap-2 transition-[width,height] ease-linear mr-[5%] max-w-[90%]
              group-has-data-[collapsible=icon]/sidebar-wrapper:h-20 bg-background border rounded-md  ${open ? "w-[calc(95%-16rem)]  ml-[1.5%]" : "w-[90%] ml-[2.1%]"}`}>
        <SidebarTrigger className="ml-2" />
        <div
          className={`flex items-center gap-2 w-full  ${open ? "pr-2 justify-around" : "px-4 justify-between"}`}>
          <div className="flex items-center gap-x-4">
            <Logo />
            <ThemeSwitcher
              className="hidden lg:block"
              open={open}
            />
          </div>

          <div
            className={`flex-1 max-w-md ${open ? "hidden lg:block" : "block"}`}>
            <Suspense>
              <NavSearch />
            </Suspense>
          </div>
          <div
            className={` max-w-md ${open ? "block lg:hidden" : "hidden"} items-center justify-center`}>
            <Suspense>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <LuSearch className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={10}>
                  <NavSearch />
                </PopoverContent>
              </Popover>
            </Suspense>
          </div>

          <div className="flex items-center gap-x-4">
            <LanguageSwitcher />
            <LinksDropdown />
            <CardButton />
            <WishlistButton />
          </div>
        </div>
      </header>
    </section>
  );
}
