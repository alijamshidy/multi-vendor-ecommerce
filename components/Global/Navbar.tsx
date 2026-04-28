import { LuPhone } from "react-icons/lu";
import CategoryDropdown from "../layout/CategoryDropdown";
import { Label } from "../ui/label";
import Container from "./Container";

export default function Navbar() {
  return (
    <Container className="border rounded-md justify-between items-center md:flex p-4 hidden">
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
