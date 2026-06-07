"use client";

import { StoreNav } from "@/components/sidebar/StoreNav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { GetLocale } from "@/utils/GetUrlParams";
import { Store } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { NavUser } from "../sidebar/NavUser";

export function AppSidebar() {
  const t = useTranslations("nav");
  const locale = GetLocale();

  const user = {
    name: t("guest"),
    email: "guest@storefront.demo",
    avatar: "/avatars/shadcn.jpg",
  };

  return (
    <Sidebar
      collapsible="icon"
      side="left"
      dir="ltr"
      className="[&_[data-slot=sidebar-inner]]:bg-transparent [&_[data-sidebar=menu-button]]:bg-transparent [&_[data-sidebar=menu-button]:hover]:bg-transparent [&_[data-sidebar=menu-button]:active]:bg-transparent [&_[data-sidebar=menu-button][data-active=true]]:bg-transparent [&_[data-sidebar=menu-button][data-state=open]]:bg-transparent">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size={"lg"}
              asChild>
              <Link href={`/${locale}`}>
                <span className="flex size-8 items-center justify-center">
                  <Store className="size-4" />
                </span>
                <div className="grid flex-1 text-start text-sm group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">
                    {t("storeName")}
                  </span>
                  <span className="truncate text-xs">{t("storeTagline")}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <StoreNav />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
