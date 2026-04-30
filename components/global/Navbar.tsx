"use client";
import { LuPhone } from "react-icons/lu";
import CategoryDropdown from "../layout/CategoryDropdown";
import { Label } from "../ui/label";
import { useSidebar } from "../ui/sidebar";
import Container from "./Container";

export default function Navbar() {
  const { open } = useSidebar();
  return (
    <Container
      className={`border rounded-md justify-between items-center md:flex p-4 hidden ${open ? "ml-[1.5%] mr-[4%] md:w-[95%]" : "ml-[3%] mr-[5%]"}`}>
      <CategoryDropdown />

      <Label className="flex">
        <div className="flex items-center gap-x-1 mr-3">
          <span>Phone</span> <LuPhone />
        </div>
        <div className="flex flex-col gap-y-3 items-start">
          <span>+98 918 123 4986</span>
          <span>+87 33 12 4986</span>
        </div>
      </Label>
    </Container>
  );
}
