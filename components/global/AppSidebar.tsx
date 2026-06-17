"use client";

import { StoreNav } from "@/components/sidebar/StoreNav";
import { NavUser } from "@/components/sidebar/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Store } from "lucide-react";

export function AppSidebar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const isRtl = locale === "fa";

  return (
    <Sidebar
      collapsible="icon"
      side={isRtl ? "right" : "left"}
      dir={isRtl ? "rtl" : "ltr"}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild>
              <Link href="/">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Store className="size-4" />
                </span>
                <div className="grid flex-1 text-start text-sm group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">{t("storeName")}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {t("storeTagline")}
                  </span>
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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
