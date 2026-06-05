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
  Package,
  ShoppingCart,
  Star,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

type NavItem = {
  titleKey: "home" | "products" | "cart" | "wishlist" | "reviews";
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
  const t = useTranslations("nav");
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
                  <span>{t(item.titleKey)}</span>
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
  const t = useTranslations("nav");
  const locale = GetLocale();
  const prefix = `/${locale}`;

  const shopItems: NavItem[] = [
    { titleKey: "home", href: prefix, icon: Home },
    { titleKey: "products", href: `${prefix}/products`, icon: Package },
    { titleKey: "cart", href: `${prefix}/cart`, icon: ShoppingCart },
    { titleKey: "wishlist", href: `${prefix}/wishlist`, icon: Heart },
    { titleKey: "reviews", href: `${prefix}/reviews`, icon: Star },
  ];

  return (
    <NavGroup
      label={t("shop")}
      items={shopItems}
      prefix={prefix}
    />
  );
}
