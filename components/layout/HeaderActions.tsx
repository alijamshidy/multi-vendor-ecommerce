"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GetAfterUrl, GetLocale } from "@/utils/GetUrlParams";
import { IR, US } from "country-flag-icons/react/3x2";
import { Ellipsis, Heart, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "../ui/button";
import CardButton from "./CardButton";
import LanguageSwitcher from "./LanguageSwitcher";
import LinksDropdown from "./LinksDropdown";
import WishlistButton from "./WishlistButton";

type HeaderActionsProps = {
  compact?: boolean;
  mobile?: boolean;
};

export default function HeaderActions({
  compact = false,
  mobile = false,
}: HeaderActionsProps) {
  const t = useTranslations("common");
  const tNav = useTranslations("nav");
  const locale = GetLocale();
  const afterUrl = GetAfterUrl();

  if (mobile) {
    return (
      <>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label={t("moreOptions")}>
              <Ellipsis className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44"
            sideOffset={8}>
            <DropdownMenuItem asChild>
              <Link
                href={afterUrl ? `/en/${afterUrl}` : "/en"}
                className="flex items-center justify-between">
                {t("english")} <US className="h-3 w-4" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={afterUrl ? `/fa/${afterUrl}` : "/fa"}
                className="flex items-center justify-between">
                {t("persian")} <IR className="h-3 w-4" />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <LinksDropdown />
        <CardButton />
        <span className="mr-1" />
        <WishlistButton />
      </>
    );
  }

  if (compact) {
    return (
      <>
        <LinksDropdown />
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label={t("moreOptions")}>
              <Ellipsis className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44"
            sideOffset={8}>
            <DropdownMenuItem asChild>
              <Link
                href={afterUrl ? `/en/${afterUrl}` : "/en"}
                className="flex items-center justify-between">
                {t("english")} <US className="h-3 w-4" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={afterUrl ? `/fa/${afterUrl}` : "/fa"}
                className="flex items-center justify-between">
                {t("persian")} <IR className="h-3 w-4" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/${locale}/wishlist`}
                className="flex items-center gap-2">
                <Heart className="size-4" />
                {tNav("wishlist")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/${locale}/cart`}
                className="flex items-center gap-2">
                <ShoppingCart className="size-4" />
                {tNav("cart")}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  }

  return (
    <>
      <LanguageSwitcher />
      <LinksDropdown />
      <CardButton />
      <WishlistButton />
    </>
  );
}
