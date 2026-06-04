"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { GetLocale } from "@/utils/GetUrlParams";
import Link from "next/link";

type AuthorizeLinksProps = {
  onNavigate?: () => void;
};

export default function AuthorizeLinks({ onNavigate }: AuthorizeLinksProps) {
  const locale = GetLocale();

  return (
    <>
      <DropdownMenuItem
        asChild
        className="cursor-pointer"
        onSelect={onNavigate}>
        <Link
          href={`/${locale}/login`}
          className="w-full capitalize">
          Login
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem
        asChild
        className="cursor-pointer"
        onSelect={onNavigate}>
        <Link
          href={`/${locale}/register`}
          className="w-full capitalize">
          Register
        </Link>
      </DropdownMenuItem>
    </>
  );
}
