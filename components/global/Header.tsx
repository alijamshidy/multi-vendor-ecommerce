import { cn } from "@/lib/utils";
import { Suspense } from "react";
import CardButton from "../layout/CardButton";
import LanguageSwitcher from "../layout/LanguageSwitcher";
import LinksDropdown from "../layout/LinksDropdown";
import Logo from "../layout/Logo";
import NavSearch from "../layout/Search";
import { ThemeSwitcher } from "../layout/ThemeSwitcher";
import WishlistButton from "../layout/WishlistButton";
import Container from "./Container";

export default function Header({ className = "" }: { className?: string }) {
  return (
    <section
      className={cn(className, "fixed top-5 w-full z-30 hidden md:block")}>
      <header
        className={`w-[90%] mx-auto border rounded-md py-4 bg-background`}>
        <Container className="pl-4 xl:pl-0 flex justify-between items-center gap-x-4">
          <div className="flex items-center gap-x-4">
            <Logo />
            <ThemeSwitcher />
          </div>
          <Suspense>
            <NavSearch />
          </Suspense>
          <div className="flex items-center gap-x-4">
            <LanguageSwitcher />
            <LinksDropdown />
            <CardButton />
            <WishlistButton />
          </div>
        </Container>
      </header>
    </section>
  );
}
