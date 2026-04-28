"use client";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
export default function AuthorizeLinks() {
  const handleLogin = () => {
    toast.success("Login Successful");
  };
  const handleRegister = () => {
    toast.success("Register Successful");
  };
  return (
    <>
      <DropdownMenuSeparator />
      <Button className={"w-full"}>
        <Link
          href={``}
          className="w-full text-left"
          onClick={handleLogin}>
          Login
        </Link>
      </Button>

      <Button className={"w-full mt-1"}>
        <Link
          href={``}
          className="w-full text-left"
          onClick={handleRegister}>
          Register
        </Link>
      </Button>
    </>
  );
}
