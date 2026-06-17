"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthRole, useIsAuthenticated } from "@/hooks/use-authenticated-user";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  getSidebarNav,
  isSidebarNavItemActive,
  type NavLink,
} from "@/utils/links";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

function SidebarNavItems({ items }: { items: NavLink[] }) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <>
      {items.map(item => {
        const isActive = isSidebarNavItemActive(pathname, item.href, items);

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={t(item.labelKey)}
              className={cn(
                isActive &&
                  "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
              )}>
              <Link href={item.href}>
                <item.icon />
                <span>{t(item.labelKey)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}

function NavGroup({ label, items }: { label: string; items: NavLink[] }) {
  if (items.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarNavItems items={items} />
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function StoreNav() {
  const t = useTranslations("nav");
  const isAuthenticated = useIsAuthenticated();
  const role = useAuthRole();

  const { shop, account, accountGroupKey } = useMemo(
    () => getSidebarNav(role, isAuthenticated),
    [role, isAuthenticated],
  );

  return (
    <>
      <NavGroup
        label={t("shop")}
        items={shop}
      />
      {account.length > 0 ? (
        <NavGroup
          label={t(accountGroupKey)}
          items={account}
        />
      ) : null}
    </>
  );
}

export function StoreNavMenuItems() {
  const isAuthenticated = useIsAuthenticated();
  const role = useAuthRole();
  const { shop } = useMemo(
    () => getSidebarNav(role, isAuthenticated),
    [role, isAuthenticated],
  );

  return <SidebarNavItems items={shop} />;
}
