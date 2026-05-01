import { Suspense } from "react";
import CardButton from "../layout/CardButton";
import LanguageSwitcher from "../layout/LanguageSwitcher";
import LinksDropdown from "../layout/LinksDropdown";
import Logo from "../layout/Logo";
import NavSearch from "../layout/Search";
import { ThemeSwitcher } from "../layout/ThemeSwitcher";
import WishlistButton from "../layout/WishlistButton";
import { SidebarTrigger } from "../ui/sidebar";

export default function Header({ open }: { open: boolean }) {
  return (
    <section className="fixed top-5 w-full z-30 hidden md:flex h-20 ">
      <header
        className={`flex shrink-0 items-center gap-2 transition-[width,height] ease-linear mr-[5%] max-w-[90%]
              group-has-data-[collapsible=icon]/sidebar-wrapper:h-20 bg-background border rounded-md  ${open ? "w-[calc(95%-16rem)]  ml-[1.5%]" : "w-[90%] ml-[2.1%]"}`}>
        <SidebarTrigger className="ml-2" />
        <div className="flex items-center gap-2 px-4 w-full justify-between">
          <div className="flex items-center gap-x-4">
            <Logo />
            <ThemeSwitcher />
          </div>

          <div className="flex-1 max-w-md">
            <Suspense>
              <NavSearch />
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
