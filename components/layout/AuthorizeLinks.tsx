"use client";
import { GetLocale } from "@/utils/GetUrlParams";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function AuthorizeLinks() {
  const locale = GetLocale();

  const handleLogin = () => {
    toast.success("Login Successful");
  };
  const handleRegister = () => {
    toast.success("Register Successful");
  };

  return (
    <>
      <Button className="w-full">
        <Link
          href={`/${locale}/login`}
          className="w-full text-start">
          Login
        </Link>
      </Button>

      <Button className="mt-1 w-full">
        <Link
          href={`/${locale}/register`}
          className="w-full text-start">
          Register
        </Link>
      </Button>
    </>
  );
}
