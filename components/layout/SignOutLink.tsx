"use client";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "../ui/button";
export default function SignOutLink() {
  const handleLogout = () => {
    toast("Logout Successful");
  };
  return (
    <Button className={"w-full"}>
      <Link
        href={``}
        className="w-full text-left"
        onClick={handleLogout}>
        Logout
      </Link>
    </Button>
  );
}
