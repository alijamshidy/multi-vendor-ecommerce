import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  adminLinks,
  customerLinks,
  sellerLinks,
  visitorLinks,
} from "@/utils/links";
import Link from "next/link";
import { LuAlignLeft } from "react-icons/lu";
import AuthorizeLinks from "./AuthorizeLinks";
import SignOutLink from "./SignOutLink";
import UserIcon from "./UserIcon";
enum User {
  Admin = "admin",
  Visitor = "visitor",
  Seller = "Seller",
  Customer = "Customer",
}
export default async function LinksDropdown() {
  const getUser = async () => {
    return User.Visitor;
  };
  const user = await getUser();
  const getLinks = async () => {
    if (user === User.Admin) {
      return adminLinks;
    } else if (user === User.Seller) {
      return sellerLinks;
    } else if (user === User.Customer) {
      return customerLinks;
    } else {
      return visitorLinks;
    }
  };
  const Links = await getLinks();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="group/button shrink-0 items-center justify-center rounded-lg border bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 h-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 flex gap-4 max-w-[100px] [&_svg:not([class*='size-'])]:size-6">
          <LuAlignLeft className="w-6 h-6" />
          <UserIcon />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-40"
        align="center"
        sideOffset={10}>
        {Links.map(link => {
          return (
            <DropdownMenuItem key={link.href}>
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
