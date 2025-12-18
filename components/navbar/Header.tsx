import Link from "next/link";
import { FaLock } from "react-icons/fa";
import Container from "../global/Container";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import ContactInfo from "./ContactInfo";
import DarkMode from "./DarkMode";
import LangsDropdown from "./LangsDropdown";

export default function Header() {
  return (
    <header>
      <Container className="flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap py-1 gap-4 bg-blue-300 max-w-full xl:max-w-full">
        <ContactInfo />

        <div className="flex gap-1 items-center h-[30px] py-1">
          <DarkMode />
          <Separator orientation="vertical" />
          <LangsDropdown />
          <Separator orientation="vertical" />

          <Link
            href={`/login`}
            className="flex gap-2 ml-2 cursor-pointer">
            {" "}
            <FaLock />
            <Label className="cursor-pointer">Login</Label>
          </Link>

          {/* <LinksDropdown /> */}
        </div>
      </Container>
    </header>
  );
}
