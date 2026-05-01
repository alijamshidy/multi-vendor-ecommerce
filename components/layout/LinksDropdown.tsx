"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  adminLinks,
  customerLinks,
  sellerLinks,
  visitorLinks,
} from "@/utils/links";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LuAlignLeft } from "react-icons/lu";
import { Button } from "../ui/button";
import AuthorizeLinks from "./AuthorizeLinks";
import SignOutLink from "./SignOutLink";
import UserIcon from "./UserIcon";

enum User {
  Admin = "admin",
  Visitor = "visitor",
  Seller = "Seller",
  Customer = "Customer",
}

export default function LinksDropdown() {
  const [user, setUser] = useState<User>(User.Visitor);

  useEffect(() => {
    const fetchUser = async () => {
      // Replace with actual API call
      // const res = await fetch('/api/current-user');
      // const data = await res.json();
      const mockUser = User.Visitor; // change to actual role logic
      setUser(mockUser);
    };
    fetchUser();
  }, []);

  const links =
    user === User.Admin
      ? adminLinks
      : user === User.Seller
        ? sellerLinks
        : user === User.Customer
          ? customerLinks
          : visitorLinks;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className={"cursor-pointer"}
        asChild>
        <Button
          variant={"outline"}
          className="flex gap-4 max-w-[100px] [&_svg:not([class*='size-'])]:size-6 p-4">
          <LuAlignLeft className="w-6 h-6" />
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-40"
        align="start"
        sideOffset={10}>
        {links.map(link => {
          return (
            <DropdownMenuItem
              key={link.href}
              className={"md:hidden"}>
              <Link
                href={""}
                className="capitalize w-full">
                {link.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
        {user === User.Visitor && <AuthorizeLinks />}
        {user !== User.Visitor && (
          <>
            <DropdownMenuItem>
              <SignOutLink />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
