"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deriveAuthRole } from "@/lib/auth-cookie";
import useAuthStore from "@/store/authStore";
import { GetLocale } from "@/utils/GetUrlParams";
import {
  adminLinks,
  customerLinks,
  sellerLinks,
  visitorLinks,
} from "@/utils/links";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { LuAlignLeft } from "react-icons/lu";
import { Button } from "../ui/button";
import AuthorizeLinks from "./AuthorizeLinks";
import SignOutLink from "./SignOutLink";
import UserIcon from "./UserIcon";

export default function LinksDropdown() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const locale = GetLocale();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const authUser = useAuthStore(state => state.user);

  const closeMenu = () => setOpen(false);

  const links = useMemo(() => {
    if (!isAuthenticated || !authUser) return visitorLinks;

    const role = deriveAuthRole(authUser);
    if (role === "admin") return adminLinks;
    if (role === "seller") return sellerLinks;
    return customerLinks;
  }, [isAuthenticated, authUser]);

  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
      modal={false}>
      <DropdownMenuTrigger
        className="cursor-pointer"
        asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 shrink-0 gap-1.5 px-2 [&_svg:not([class*='size-'])]:size-6">
          <LuAlignLeft className="size-6" />
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-44"
        align="start"
        sideOffset={10}>
        {links.map(link => (
          <DropdownMenuItem
            key={link.href}
            asChild
            className="cursor-pointer"
            onSelect={closeMenu}>
            <Link
              href={`/${locale}${link.href === "/" ? "" : link.href}`}
              className="w-full">
              {t(link.labelKey)}
            </Link>
          </DropdownMenuItem>
        ))}
        {!isAuthenticated ? <AuthorizeLinks onNavigate={closeMenu} /> : null}
        {isAuthenticated ? (
          <DropdownMenuItem
            className="cursor-pointer p-0"
            onSelect={closeMenu}>
            <SignOutLink onNavigate={closeMenu} />
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
