"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { GetLocale } from "@/utils/GetUrlParams";
import {
  Heart,
  Home,
  Info,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

function NavGroup({
  label,
  items,
  prefix,
}: {
  label: string;
  items: NavItem[];
  prefix: string;
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => {
          const isHome = item.href === prefix;
          const isActive =
            pathname === item.href ||
            (isHome && (pathname === `${prefix}/` || pathname === prefix));

          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive}>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function StoreNav() {
  const locale = GetLocale();
  const prefix = `/${locale}`;

  const shopItems: NavItem[] = [
    { title: "Home", href: prefix, icon: Home },
    { title: "Products", href: `${prefix}/products`, icon: Package },
    { title: "Cart", href: `${prefix}/cart`, icon: ShoppingCart },
    { title: "Wishlist", href: `${prefix}/wishlist`, icon: Heart },
    { title: "Reviews", href: `${prefix}/reviews`, icon: Star },
    { title: "About", href: `${prefix}/about`, icon: Info },
  ];

  const accountItems: NavItem[] = [
    {
      title: "Dashboard",
      href: `${prefix}/customer/dashboard`,
      icon: LayoutDashboard,
    },
  ];

  return (
    <>
      <NavGroup
        label="Shop"
        items={shopItems}
        prefix={prefix}
      />
      <NavGroup
        label="Account"
        items={accountItems}
        prefix={prefix}
      />
    </>
  );
}
