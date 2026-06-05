"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { GetLocale } from "@/utils/GetUrlParams";
import Link from "next/link";
import { useTranslations } from "next-intl";

type AuthorizeLinksProps = {
  onNavigate?: () => void;
};

export default function AuthorizeLinks({ onNavigate }: AuthorizeLinksProps) {
  const t = useTranslations("nav");
  const locale = GetLocale();

  return (
    <>
      <DropdownMenuItem
        asChild
        className="cursor-pointer"
        onSelect={onNavigate}>
        <Link
          href={`/${locale}/login`}
          className="w-full">
          {t("login")}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem
        asChild
        className="cursor-pointer"
        onSelect={onNavigate}>
        <Link
          href={`/${locale}/register`}
          className="w-full">
          {t("register")}
        </Link>
      </DropdownMenuItem>
    </>
  );
}
