import Link from "next/link";
import { Suspense } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import Container from "../global/Container";
import { Label } from "../ui/label";
import CartButton from "./CartButton";
import CategoriesDropdown from "./CategoriesDropdown";
import CustomerLinks from "./CustomerLinks";
import NavSearch from "./NavSearch";
import WhishlistButton from "./WhishlistButton";

export default function Nav() {
  return (
    <>
      <section>
        <Container className="flex justify-between sm:flex-row sm:justify-between sm:items-center flex-wrap py-5 gap-4">
          <Link href={"/"}>
            {/* <Image
              width={150}
              height={20}
              src={`/next.svg`}
              alt=""
              priority
            /> */}
            <Label className="text-4xl uppercase font-bold italic cursor-pointer">
              Easy Shop
            </Label>
          </Link>
          <CustomerLinks />
          <WhishlistButton />
          <CartButton />
        </Container>
      </section>
      <Container className="grid md:grid-cols-4 gap-x-16 items-center">
        <CategoriesDropdown />
        <Suspense>
          <NavSearch />
        </Suspense>
        <div className="col-span-1 flex items-center gap-x-3 justify-end">
          <FaPhoneAlt />
          <div className="grid gap-y-3">
            <Label>+1343-43555430</Label>
            <Label>Support 24/7</Label>
          </div>
        </div>
      </Container>
    </>
  );
}
