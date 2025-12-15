import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { links } from "@/utils/links";

import Link from "next/link";
import { LuAlignLeft } from "react-icons/lu";
import { Button } from "../ui/button";
import SignOutLink from "./SignOutLink";
import UserIcon from "./UserIcon";

export default async function LinksDropdown() {
  // const userId = (await auth()).userId;
  // const isAdminUser = userId === process.env.ADMIN_USER_ID;
  const isAdminUser = true;
  const signedIn = true;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-4 max-w-[100px] [&_svg:not([class*='size-'])]:size-6">
          <LuAlignLeft className="w-6 h-6" />
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-40"
        align="center"
        sideOffset={10}>
        {!signedIn && (
          <>
            <DropdownMenuItem>
              <span>
                <button className="w-full text-left">Login</button>
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <span>
                <button className="w-full text-left">Register</button>
              </span>
            </DropdownMenuItem>
          </>
        )}

        {signedIn && (
          <>
            {links.map(link => {
              if (link.label === "dashboard" && !isAdminUser) {
                return null;
              }
              return (
                <DropdownMenuItem key={link.href}>
                  <Link
                    href={link.href}
                    className="capitalize w-full">
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOutLink />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
