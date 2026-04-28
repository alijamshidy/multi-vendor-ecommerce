import { FaMobileAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import Container from "../global/Container";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

export default function ContactInfo() {
  return (
    <div className="flex flex-row items-center h-[20px] gap-x-1.5">
      <Container className="px-0 flex gap-2">
        <IoMdMail />
        <Label className="">support@gmail.com</Label>
      </Container>

      <Separator orientation="vertical" />

      <Container className="px-0 flex gap-2">
        <FaMobileAlt />
        <Label className="">+(123) 3243 343</Label>
      </Container>
    </div>
  );
}
