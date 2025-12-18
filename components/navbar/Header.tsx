import { Suspense } from "react";
import Container from "../global/Container";
import CartButton from "./CartButton";
import DarkMode from "./DarkMode";
import LangsDropdown from "./LangsDropdown";
import LinksDropdown from "./LinksDropdown";
import NavSearch from "./NavSearch";

export default function Header() {
  return (
    <header>
      <Container className="flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap py-8 gap-4 bg-blue-300 max-w-full xl:max-w-full">
        <></>
        <Suspense>
          <NavSearch />
        </Suspense>
        <div className="flex gap-4 items-center">
          <CartButton />
          <DarkMode />
          <LangsDropdown />
          <LinksDropdown />
        </div>
      </Container>
    </header>
  );
}
