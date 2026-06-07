"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  Heart,
  Home,
  Package,
  ShoppingCart,
  Star,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

type NavItem = {
  titleKey: "home" | "products" | "cart" | "wishlist" | "reviews";
  href: "/" | "/products" | "/cart" | "/wishlist" | "/reviews";
  icon: LucideIcon;
};

const shopItems: NavItem[] = [
  { titleKey: "home", href: "/", icon: Home },
  { titleKey: "products", href: "/products", icon: Package },
  { titleKey: "cart", href: "/cart", icon: ShoppingCart },
  { titleKey: "wishlist", href: "/wishlist", icon: Heart },
  { titleKey: "reviews", href: "/reviews", icon: Star },
];

function isNavItemActive(pathname: string, href: NavItem["href"]) {
  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  const normalizedHref = href.replace(/\/$/, "") || "/";

  if (normalizedHref === "/") {
    return normalizedPath === "/";
  }

  return (
    normalizedPath === normalizedHref ||
    normalizedPath.startsWith(`${normalizedHref}/`)
  );
}

function StoreNavItems({ items }: { items: NavItem[] }) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <>
      {items.map(item => {
        const isActive = isNavItemActive(pathname, item.href);

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={t(item.titleKey)}
              className={cn(
                isActive &&
                  "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
              )}>
              <Link href={item.href}>
                <item.icon />
                <span>{t(item.titleKey)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}

function NavGroup({
  label,
  items,
}: {
  label: string;
  items: NavItem[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        <StoreNavItems items={items} />
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function StoreNav() {
  const t = useTranslations("nav");

  return (
    <NavGroup
      label={t("shop")}
      items={shopItems}
    />
  );
}

export function StoreNavMenuItems() {
  return <StoreNavItems items={shopItems} />;
}
